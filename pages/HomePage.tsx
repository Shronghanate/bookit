import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Experience } from "../types";
import Spinner from "../components/Spinner";

/* --- Card Positions --- */
const cardPositions = [
  { top: 135, left: 124 },
  { top: 135, left: 428 },
  { top: 135, left: 732 },
  { top: 135, left: 1036 },
  { top: 479, left: 124 },
  { top: 479, left: 428 },
  { top: 479, left: 732 },
  { top: 479, left: 1036 },
];

const ExperienceCard: React.FC<{
  experience: Experience;
  onClick: () => void;
  style?: React.CSSProperties;
}> = ({ experience, onClick, style }) => (
  <div
    onClick={onClick}
    style={{
      position: "absolute",
      width: 280,
      height: 312,
      borderRadius: 12,
      background: "#FFFFFF",
      border: "1px solid #E5E5E5",
      boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
      cursor: "pointer",
      transition: "0.3s",
      ...style,
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
        width: 280,
        height: 170,
        objectFit: "cover",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      }}
    />

    {/* Content Below Image */}
    <div
      style={{
        width: 280,
        height: 142,
        padding: "12px 16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 20,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: 248,
          height: 68,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* Title + Location */}
        <div
          style={{
            width: 248,
            height: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              width: 70,
              height: 20,
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: 16,
              lineHeight: "20px",
              color: "#161616",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={experience.title}
          >
            {experience.title}
          </span>

          {/* Location Box */}
          <div
            style={{
              width: 48,
              height: 24,
              borderRadius: 4,
              background: "#161616",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px 8px",
              boxSizing: "border-box",
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: 11,
                lineHeight: "16px",
                color: "#FFFFFF",
              }}
            >
              {experience.location}
            </span>
          </div>
        </div>

        {/* Description */}
        <div
          style={{
            width: 248,
            height: 32,
            background: "#6C6C6C",
            borderRadius: 4,
            padding: "6px 8px",
            display: "flex",
            alignItems: "center",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "16px",
              color: "#FFFFFF",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {experience.description}
          </span>
        </div>
      </div>

      {/* Price + View Details */}
      <div
        style={{
          width: 248,
          height: 30,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          paddingTop: 8,
        }}
      >
        <p
          style={{
            color: "#222",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "Inter, sans-serif",
          }}
        >
          <span
            style={{
              color: "#6C6C6C",
              fontSize: 12,
              fontWeight: 400,
            }}
          >
            From{" "}
          </span>
          ₹{experience.price}
        </p>
        <button
          style={{
            background: "#FFD643",
            padding: "6px 12px",
            borderRadius: 4,
            border: "none",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          View Details
        </button>
      </div>
    </div>
  </div>
);

const HomePage: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.fetchExperiences();
        setExperiences(data.slice(0, 8));
      } catch {
        setError("Failed to load experiences.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: "#FFFFFF",
        display: "flex",
        justifyContent: "center",
        paddingTop: "50px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "1200px",
          height: "900px",
        }}
      >
        {experiences.map((exp, idx) => (
          <ExperienceCard
            key={exp._id || exp.id || idx}
            experience={exp}
            onClick={() => navigate(`/details/${exp._id || exp.id}`)}
            style={{
              position: "absolute",
              top: cardPositions[idx]?.top || 0,
              left: cardPositions[idx]?.left || 0,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
