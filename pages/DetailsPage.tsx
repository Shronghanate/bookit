import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { ExperienceDetails, Slot, Booking } from "../types";
import { api } from "../services/api";
import Spinner from "../components/Spinner";

interface DetailsPageProps {
  experienceId: string;
  onNavigateToCheckout: (booking: Booking) => void;
  onBack: () => void;
}

const HEADER_HEIGHT = 80;

const DetailsPage: React.FC<DetailsPageProps> = ({
  experienceId,
  onNavigateToCheckout,
  onBack,
}) => {
  const [experience, setExperience] = useState<ExperienceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taxes, setTaxes] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.fetchExperienceDetails(experienceId);
        const taxData = await api.getTaxes();
        if (!data) {
          setError("Experience not found.");
          return;
        }
        setExperience(data);
        setTaxes(taxData || 0);

        const todayStr = new Date().toISOString().split("T")[0];
        const availableDates = Object.keys(data.availability || {});
        if (availableDates.includes(todayStr)) {
          setSelectedDate(new Date(todayStr));
        } else if (availableDates.length > 0) {
          setSelectedDate(new Date(availableDates[0]));
        }
      } catch (err) {
        setError("Failed to load experience details.");
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [experienceId]);

  const selectedDateString = useMemo(
    () => selectedDate.toISOString().split("T")[0],
    [selectedDate]
  );
  const availableDates = useMemo(
    () => Object.keys(experience?.availability || {}).slice(0, 5),
    [experience]
  );
  const availableSlots = useMemo(
    () => experience?.availability?.[selectedDateString]?.slice(0, 4) || [],
    [experience, selectedDateString]
  );

  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedDateString]);

  const subtotal = (experience?.price || 0) * quantity;
  const total = subtotal + taxes;

  const handleConfirm = useCallback(() => {
    if (!experience || !selectedSlot) return;
    const booking: Booking = {
      experience,
      date: selectedDate,
      slot: selectedSlot,
      guests: quantity,
      subtotal,
      taxes,
      totalPrice: total,
      discount: 0,
    };
    onNavigateToCheckout(booking);
  }, [
    experience,
    selectedSlot,
    quantity,
    taxes,
    selectedDate,
    subtotal,
    total,
    onNavigateToCheckout,
  ]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!experience) return null;

  return (
    <div
      style={{
        paddingTop: 0,
        background: "#fff",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 60,
      }}
    >
      {/* LEFT SECTION */}
      <div
        style={{
          width: 765,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <button
          onClick={onBack}
          style={{
            width: 160,
            height: 24,
            background: "transparent",
            border: "none",
            color: "#161616",
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            cursor: "pointer",
            marginBottom: 32,
          }}
        >
          ← Details
        </button>

        <img
          src={experience.images?.[0] || experience.image || "/placeholder.jpg"}
          alt={experience.title}
          style={{
            width: "100%",
            height: 381,
            borderRadius: 12,
            objectFit: "cover",
            marginBottom: 40,
          }}
        />

        <h1
          style={{
            width: "100%",
            height: 32,
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: 24,
            lineHeight: "32px",
            color: "#161616",
            marginTop: 0,
            marginBottom: 16,
          }}
        >
          {experience.title}
        </h1>

        <p
          style={{
            width: "100%",
            height: 48,
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: 16,
            lineHeight: "24px",
            color: "#6C6C6C",
            marginBottom: 38,
            marginTop: 0,
          }}
        >
          {experience.longDescription || experience.description}
        </p>

        {/* Date Selection */}
        <div style={{ marginBottom: 38, width: "100%" }}>
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: 20,
              lineHeight: "27px",
              color: "#161616",
              marginBottom: 12,
            }}
          >
            Choose date
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {availableDates.map((dateStr) => {
              const isSelected = selectedDateString === dateStr;
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(new Date(dateStr))}
                  style={{
                    width: 69,
                    height: 34,
                    borderRadius: 4,
                    padding: "8px 12px",
                    background: isSelected ? "#FFD643" : "#fff",
                    border: isSelected ? "none" : "1px solid #DADADA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: isSelected
                      ? "0 2px 8px rgba(255,214,67,0.17)"
                      : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      fontSize: 14,
                      lineHeight: "18px",
                      color: isSelected ? "#161616" : "#838383",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {new Date(dateStr).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                    })}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Selection */}
        <div style={{ marginBottom: 30, width: "100%" }}>
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: 20,
              lineHeight: "27px",
              color: "#161616",
              marginBottom: 12,
            }}
          >
            Choose time
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {availableSlots.map((slot) => {
              const isSelected = selectedSlot?.time === slot.time;
              const isDisabled = !slot.available;
              const startTime = slot.time.split("-")[0]?.trim() || slot.time;
              const remaining = slot.spotsLeft ?? slot.left ?? 0;
              return (
                <button
                  key={slot.time}
                  onClick={() => !isDisabled && setSelectedSlot(slot)}
                  disabled={isDisabled}
                  style={{
                    width: 117,
                    height: 34,
                    borderRadius: 4,
                    padding: "8px 12px",
                    border: isSelected ? "none" : "0.6px solid #BDBDBD",
                    background: isSelected ? "#FFD643" : "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 6,
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    opacity: isDisabled ? 0.6 : 1,
                    boxShadow: isSelected
                      ? "0 2px 8px rgba(255,214,67,0.17)"
                      : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      fontSize: 14,
                      lineHeight: "18px",
                      color: isSelected ? "#161616" : "#838383",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {startTime}
                  </span>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: 10,
                      lineHeight: "12px",
                      color: "#FF4C0A",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {remaining} left
                  </span>
                </button>
              );
            })}
          </div>

          <div
            style={{
              color: "#8F8F8F",
              fontSize: 15,
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              marginTop: 10,
            }}
          >
            All times are in IST (GMT +5:30)
          </div>
        </div>

        {/* About Section */}
        <div style={{ width: "100%" }}>
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: 20,
              lineHeight: "27px",
              color: "#161616",
              marginBottom: 10,
            }}
          >
            About
          </div>
          <div
            style={{
              width: "100%",
              minHeight: 48,
              borderRadius: 8,
              background: "#F5F5F5",
              padding: "12px 18px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: 16,
              lineHeight: "22px",
              color: "#7D7D7D",
            }}
          >
            {experience.about || experience.longDescription || experience.description}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div
        style={{
          width: 387,
          minHeight: 303,
          borderRadius: 12,
          background: "#EFEFEF",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: 339,
            display: "grid",
            gridTemplateRows: "repeat(4, 1fr)",
            gridTemplateColumns: "65px 1fr",
            rowGap: 20,
            columnGap: 174,
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: 16,
            lineHeight: "20px",
            color: "#656565",
            alignItems: "center",
          }}
        >
          <span>Starts at</span>
          <span style={{ textAlign: "right" }}>₹{experience.price}</span>

          <span>Quantity</span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: 56,
              height: 16,
              gap: 9,
              justifyContent: "center",
              marginLeft: 12, // Added to shift quantity selector slightly right
            }}
          >
            <button
              style={{
                border: "none",
                width: 16,
                height: 16,
                borderRadius: 4,
                background: "#DDD",
                color: "#656565",
                fontSize: 11,
                cursor: quantity > 1 ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <FaMinus />
            </button>
            <span
              style={{
                display: "inline-flex",
                minWidth: 18,
                height: 16,
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 500,
                color: "#161616",
                fontSize: 14,
                background: "transparent",
              }}
            >
              {quantity}
            </span>
            <button
              style={{
                border: "none",
                width: 16,
                height: 16,
                borderRadius: 4,
                background: "#DDD",
                color: "#656565",
                fontSize: 11,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => setQuantity((q) => q + 1)}
            >
              <FaPlus />
            </button>
          </div>

          <span>Subtotal</span>
          <span style={{ textAlign: "right" }}>₹{subtotal}</span>

          <span>Taxes</span>
          <span style={{ textAlign: "right" }}>₹{taxes}</span>
        </div>

        <div style={{ width: 339, height: 1, background: "#D9D9D9" }} />

        <div
          style={{
            marginTop: 10,
            marginBottom: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: 339,
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: 20,
              color: "#161616",
            }}
          >
            Total
          </span>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: 20,
              color: "#161616",
            }}
          >
            ₹{total}
          </span>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selectedSlot}
          style={{
            width: "100%",
            height: 44,
            background: selectedSlot ? "#FFD643" : "#D9D9D9",
            border: "none",
            borderRadius: 8,
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: selectedSlot ? "pointer" : "not-allowed",
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: 16,
            color: "#161616",
            boxSizing: "border-box",
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default DetailsPage;
