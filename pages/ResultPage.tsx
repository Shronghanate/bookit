import React from "react";
import { BookingResult } from "../types";

interface ResultPageProps {
  result: BookingResult;
  onNavigateToHome: () => void;
}

const ResultPage: React.FC<ResultPageProps> = ({ result, onNavigateToHome }) => {
  const { success = false, bookingId = "" } = result || {};

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        position: "relative",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "#22c55e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: 167,
          left: 680,
          opacity: 1,
        }}
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 7L10.5 17L4 10.5"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Booking Confirmed */}
      <div
        style={{
          position: "absolute",
          top: 279,
          left: 573,
          width: 294,
          height: 40,
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          fontStyle: "medium",
          fontSize: 32,
          lineHeight: "40px",
          color: "#161616",
          letterSpacing: "0%",
          opacity: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Booking Confirmed
      </div>

      {/* Reference ID - centered */}
      <div
        style={{
          position: "absolute",
          top: 335,
          left: "50%",
          transform: "translateX(-50%)",
          height: 24,
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontStyle: "regular",
          fontSize: 20,
          lineHeight: "24px",
          color: "#656565",
          letterSpacing: "0%",
          opacity: 1,
          whiteSpace: "nowrap",
          overflow: "visible",
          textOverflow: "clip",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Ref ID: {bookingId}
      </div>

      {/* Back to Home Button */}
      <button
        onClick={onNavigateToHome}
        style={{
          position: "absolute",
          top: 399,
          left: 652,
          width: 138,
          height: 36,
          background: "#E3E3E3",
          border: "none",
          borderRadius: 4,
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 16,
          paddingRight: 16,
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          fontSize: 16,
          lineHeight: "20px",
          color: "#222",
          cursor: "pointer",
          opacity: 1,
          gap: 10,
        }}
      >
        Back to Home
      </button>
    </div>
  );
};

export default ResultPage;
