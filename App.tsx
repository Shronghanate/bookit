import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Spinner from "./components/Spinner";
import { api } from "./services/api";
import { Experience, Booking, BookingResult } from "./types";
import DetailsPage from "./pages/DetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import ResultPage from "./pages/ResultPage";

const CARD_WIDTH = 280;
const CARD_HEIGHT = 312;
const CARD_GAP_X = 32;
const CARD_GAP_Y = 32;
const CARD_COLUMNS = 4;
const TOP_OFFSET = 135;

const ExperienceCard: React.FC<{
  experience: Experience;
  onClick: () => void;
  top: number;
  left: number;
}> = ({ experience, onClick, top, left }) => (
  <div
    onClick={onClick}
    style={{
      position: "absolute",
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      top,
      left,
      borderRadius: 12,
      background: "#FFFFFF",
      border: "1px solid #E5E5E5",
      boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
      cursor: "pointer",
      overflow: "hidden",
      transition: "all 0.25s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-6px)";
      e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.15)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0px 4px 12px rgba(0,0,0,0.08)";
    }}
  >
    {/* Image */}
    <img
      src={experience.image || (experience as any).images?.[0]}
      alt={experience.title}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src =
          "https://via.placeholder.com/280x170?text=No+Image";
      }}
      style={{
        width: CARD_WIDTH,
        height: 170,
        objectFit: "cover",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      }}
    />

    {/* Outer Box (Below Image) */}
    <div
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT - 170,
        background: "#F0F0F0",
        padding: "12px 16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 20,
        boxSizing: "border-box",
      }}
    >
      {/* Inner Box (Name + Description) */}
      <div
        style={{
          width: CARD_WIDTH - 32,
          height: 68,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* Name + Location Row */}
        <div
          style={{
            width: CARD_WIDTH - 32,
            height: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Experience Name */}
          <span
            style={{
              flexGrow: 1,
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: 16,
              lineHeight: "20px",
              color: "#161616",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {experience.title}
          </span>

          {/* Location Box */}
          <div
            style={{
              width: 48,
              height: 24,
              borderRadius: 4,
              background: "#D6D6D6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px 8px",
              boxSizing: "border-box",
              marginLeft: 8,
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: 11,
                lineHeight: "16px",
                color: "#161616",
                whiteSpace: "nowrap",
              }}
            >
              {experience.location}
            </span>
          </div>
        </div>

        {/* Description — wraps to 2 lines */}
        <div
          style={{
            width: CARD_WIDTH - 32,
            height: 32,
            background: "transparent",
            display: "flex",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "16px",
              color: "#6C6C6C",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {experience.description}
          </span>
        </div>
      </div>

      {/* Price + View Details Section */}
      <div
        style={{
          width: CARD_WIDTH - 32,
          height: 30,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 0,
        }}
      >
        {/* Price box */}
        <div
          style={{
            width: 85,
            height: 24,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              width: 29,
              height: 16,
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "16px",
              color: "#161616",
            }}
          >
            From
          </span>
          <span
            style={{
              width: 50,
              height: 24,
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: 20,
              lineHeight: "24px",
              color: "#161616",
            }}
          >
            ₹{experience.price}
          </span>
        </div>

        {/* View Details Button */}
        <button
          style={{
            background: "#FFD643",
            borderRadius: 4,
            border: "none",
            padding: "6px 12px",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#ffcd00")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#FFD643")}
        >
          View Details
        </button>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [page, setPage] = useState<"home" | "details" | "checkout" | "result">(
    "home"
  );
  const [selectedExperience, setSelectedExperience] = useState<
    Experience | null
  >(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.fetchExperiences();
        setExperiences(data.slice(0, 8));
      } catch (err) {
        console.error("Failed to load experiences", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  const totalWidth =
    CARD_COLUMNS * CARD_WIDTH + (CARD_COLUMNS - 1) * CARD_GAP_X;
  const centerOffset = `calc(50% - ${totalWidth / 2}px)`;

  return (
    <div
      style={{ background: "#FFFFFF", minHeight: "100vh", position: "relative" }}
    >
      <Header />

      {page === "home" && (
        <div
          style={{
            position: "absolute",
            top: TOP_OFFSET,
            left: centerOffset,
            width: totalWidth,
            height: CARD_HEIGHT * 2 + CARD_GAP_Y,
          }}
        >
          {experiences.map((exp, idx) => {
            const row = Math.floor(idx / CARD_COLUMNS);
            const col = idx % CARD_COLUMNS;
            const top = row * (CARD_HEIGHT + CARD_GAP_Y);
            const left = col * (CARD_WIDTH + CARD_GAP_X);
            return (
              <ExperienceCard
                key={exp._id || exp.id || idx}
                experience={exp}
                onClick={() => {
                  setSelectedExperience(exp);
                  setPage("details");
                }}
                top={top}
                left={left}
              />
            );
          })}
        </div>
      )}

      {page === "details" && selectedExperience && (
        <div style={{ padding: "80px 124px" }}>
          <DetailsPage
            experienceId={selectedExperience._id || selectedExperience.id}
            onNavigateToCheckout={(booking) => {
              setBooking(booking);
              setPage("checkout");
            }}
            onBack={() => setPage("home")}
          />
        </div>
      )}

      {page === "checkout" && booking && (
        <div style={{ padding: "80px 124px" }}>
          <CheckoutPage
            booking={booking}
            onBack={() => setPage("details")}
            onNavigateToResult={(result) => {
              setBookingResult(result);
              setPage("result");
            }}
          />
        </div>
      )}

      {page === "result" && bookingResult && (
        <div style={{ padding: "80px 124px" }}>
          <ResultPage
            result={bookingResult}
            onNavigateToHome={() => {
              setPage("home");
              setBooking(null);
              setBookingResult(null);
              setSelectedExperience(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default App;
