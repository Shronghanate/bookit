import React, { useState, useMemo } from "react";
import { Booking, BookingResult, UserInfo } from "../types";
import { api } from "../services/api";
import { BackArrowIcon } from "../components/Icons";

interface CheckoutPageProps {
  booking: Booking;
  onNavigateToResult: (result: BookingResult) => void;
  onBack: () => void;
}

const Row = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      width: "100%",
      minHeight: 29,
    }}
  >
    <span
      style={{
        width: 84,
        height: 20,
        fontFamily: "Inter, sans-serif",
        fontWeight: 400,
        fontSize: 16,
        color: "#656565",
        lineHeight: "20px",
        letterSpacing: 0,
        fontStyle: "normal",
        opacity: 1,
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {label}
    </span>
    <span
      style={{
        marginLeft: 12,
        fontFamily: "Inter, sans-serif",
        fontWeight: 400,
        fontSize: 16,
        color: "#161616",
        lineHeight: "20px",
        letterSpacing: 0,
        fontStyle: "normal",
        opacity: 1,
        textAlign: "right",
        flex: 1,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
      title={String(value)}
    >
      {value}
    </span>
  </div>
);

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  booking,
  onNavigateToResult,
  onBack,
}) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: "", email: "" });
  const [formErrors, setFormErrors] = useState<Partial<UserInfo>>({});
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState<
    { type: "success" | "error"; text: string } | null
  >(null);
  const [discount, setDiscount] = useState<number>(booking.discount || 0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { experience, date, slot, guests, subtotal, taxes } = booking ?? {};
  const total = useMemo(() => {
    const totalAfterDiscount = (subtotal || 0) - (discount || 0) + (taxes || 0);
    return Math.max(0, totalAfterDiscount);
  }, [subtotal, taxes, discount]);

  const formatDate = (d: Date | string | undefined) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof UserInfo]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    try {
      const result = await api.validatePromoCode(promoCode);
      if (result.discount <= 1) {
        setDiscount(subtotal * result.discount);
      } else {
        setDiscount(result.discount);
      }
      setPromoMessage({ type: "success", text: result.message });
    } catch (err: any) {
      setDiscount(0);
      setPromoMessage({
        type: "error",
        text: err?.message || "Invalid promo code.",
      });
    }
  };

  const validateForm = () => {
    const errors: Partial<UserInfo> = {};
    if (!userInfo.name.trim()) errors.name = "Name is required";
    if (!userInfo.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(userInfo.email))
      errors.email = "Email is invalid";
    setFormErrors(errors);

    if (!agreedToTerms) {
      setTermsError("You must agree to the terms and policy.");
    } else {
      setTermsError("");
    }

    return Object.keys(errors).length === 0 && agreedToTerms;
  };

  const handleConfirmAndPay = async () => {
    if (!validateForm()) return;
    setIsProcessing(true);
    try {
      const finalBooking = {
        ...booking,
        userInfo,
        totalPrice: total,
        discount,
        promoCode,
      };
      const result = await api.createBooking(finalBooking);
      onNavigateToResult({ ...result, bookingDetails: finalBooking });
    } catch (error: any) {
      alert(error?.message || "Booking failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 42,
        paddingTop: 0,
        paddingLeft: 150,
      }}
    >
      {/* LEFT SECTION */}
      <div
        style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
      >
        {/* Back Button */}
        <div
          style={{
            width: 93,
            height: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
            marginTop: 0,
          }}
        >
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              color: "#161616",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: 0,
              fontWeight: 700, // Made bold here without changing font size or position
              fontSize: 15,
              fontFamily: "Inter, sans-serif",
            }}
            aria-label="Back"
          >
            <BackArrowIcon style={{ width: 18, height: 18 }} />
            <span>Checkout</span>
          </button>
        </div>
        {/* Input Card */}
        <div
          style={{
            width: 739,
            height: 250,
            background: "#EFEFEF",
            borderRadius: 12,
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            boxSizing: "border-box",
            marginTop: 0,
          }}
        >
          <div style={{ display: "flex", gap: 22 }}>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 400,
                  fontSize: 16,
                  color: "#656565",
                  fontFamily: "Inter",
                  marginBottom: 6,
                }}
              >
                Full name
              </div>
              <input
                type="text"
                autoComplete="name"
                name="name"
                placeholder="Your name"
                value={userInfo.name}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 7,
                  border: "none",
                  background: "#E9E9E9",
                  fontSize: 16,
                  fontFamily: "Inter",
                  color: "#444",
                  outline: "none",
                  marginBottom: 2,
                }}
              />
              {formErrors.name && (
                <div style={{ color: "#e53935", fontSize: 12, marginTop: 2 }}>
                  {formErrors.name}
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 400,
                  fontSize: 16,
                  color: "#656565",
                  fontFamily: "Inter",
                  marginBottom: 6,
                }}
              >
                Email
              </div>
              <input
                type="email"
                autoComplete="email"
                name="email"
                placeholder="Your email"
                value={userInfo.email}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 7,
                  border: "none",
                  background: "#E9E9E9",
                  fontSize: 16,
                  fontFamily: "Inter",
                  color: "#444",
                  outline: "none",
                  marginBottom: 2,
                }}
              />
              {formErrors.email && (
                <div style={{ color: "#e53935", fontSize: 12, marginTop: 2 }}>
                  {formErrors.email}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <input
              type="text"
              placeholder="Promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: 8,
                border: "none",
                background: "#E9E9E9",
                fontSize: 16,
                fontFamily: "Inter",
                color: "#444",
              }}
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              style={{
                background: "#161616",
                color: "#fff",
                border: "none",
                borderRadius: 7,
                padding: "0 18px",
                fontWeight: 500,
                fontSize: 15,
                height: 42,
                cursor: "pointer",
              }}
            >
              Apply
            </button>
          </div>
          {promoMessage && (
            <div
              style={{
                color: promoMessage.type === "success" ? "#2e7d32" : "#e53935",
                fontSize: 14,
                marginTop: 2,
              }}
            >
              {promoMessage.text}
            </div>
          )}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: 400,
              fontSize: 16,
              color: "#656565",
              fontFamily: "Inter",
              marginTop: 6,
            }}
          >
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              style={{
                marginRight: 8,
                accentColor: "#FFD643",
                width: 18,
                height: 18,
                borderRadius: 5,
              }}
            />
            I agree to the terms and safety policy
          </label>
          {termsError && (
            <div style={{ color: "#e53935", fontSize: 12, marginTop: 2 }}>
              {termsError}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div
        style={{
          width: 387,
          height: 349,
          borderRadius: 16,
          background: "#EFEFEF",
          padding: 24,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
        }}
      >
        <Row label="Experience" value={experience?.title || "N/A"} />
        <Row label="Date" value={formatDate(date as any)} />
        <Row label="Time" value={slot?.time || "N/A"} />
        <Row label="Qty" value={guests?.toString() ?? "0"} />
        <Row label="Subtotal" value={`₹${(subtotal || 0).toFixed(0)}`} />
        <Row label="Taxes" value={`₹${(taxes || 0).toFixed(0)}`} />
        <div
          style={{
            width: "100%",
            height: 1,
            background: "#E0E0E0",
            margin: "18px 0 16px 0",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: 24,
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: 24,
              color: "#222",
              lineHeight: "29px",
            }}
          >
            Total
          </span>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: 24,
              color: "#222",
              lineHeight: "29px",
              textAlign: "right",
            }}
          >
            ₹{total.toFixed(0)}
          </span>
        </div>
        <button
          onClick={handleConfirmAndPay}
          disabled={isProcessing || !agreedToTerms}
          style={{
            width: "100%",
            height: 56,
            background: "#FFD643",
            color: "#161616",
            border: "none",
            borderRadius: 12,
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: 20,
            lineHeight: "24px",
            cursor: isProcessing ? "not-allowed" : "pointer",
            marginTop: "auto",
            marginBottom: 2,
            display: "block",
          }}
        >
          {isProcessing ? "Processing..." : "Pay and Confirm"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
