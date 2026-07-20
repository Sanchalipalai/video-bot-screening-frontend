import React, { useEffect, useState } from "react";
import { getScreening } from "../api";

function ScreeningModal({ candidate, close }) {
  const [answers, setAnswers] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getScreening(candidate.id).then((data) => {
      setAnswers(data.answers || []);
    });
  }, [candidate]);

  // Loading State
  if (answers.length === 0) {
    return (
      <div style={overlay}>
        <div style={{ ...modal, justifyContent: "center", alignItems: "center", gap: "20px" }}>
          <h2>Loading recording...</h2>
          <button onClick={close} style={primaryBtn}>
            Close
          </button>
        </div>
      </div>
    );
  }

  const answer = answers[index];

  return (
    <div style={overlay}>
      <div style={modal}>
        {/* Header Section */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px"
        }}>
          <div>
            <h2 style={{ margin: "0 0 4px 0", color: "#0f172a" }}>{candidate.name}</h2>
            <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>AI Video Screening Review</p>
          </div>
          <button onClick={close} style={closeBtn}>✕</button>
        </div>

        <hr style={{ border: "0", borderTop: "1px solid #e2e8f0", margin: "0 0 20px 0" }} />

        {/* Scrollable Container Content fits elegantly within the 90vh constraint */}
        <div style={{ flex: 1, overflowY: "auto", paddingRight: "8px", marginBottom: "20px" }}>
          
          {/* Question Tabs Selector */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
            {answers.map((a, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                style={{
                  background: i === index ? "#182b5c" : "#f1f5f9",
                  color: i === index ? "white" : "#475569",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Q{i + 1}
              </button>
            ))}
          </div>

          {/* Current Question Display */}
          <div style={card}>
            <h4 style={{ margin: "0 0 6px 0", color: "#64748b", textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.5px" }}>
              Question {index + 1}
            </h4>
            <p style={{ margin: 0, fontSize: "16px", color: "#1e293b", fontWeight: "500", lineHeight: "1.5" }}>
              {answer.question}
            </p>
          </div>

          {/* Video & AI Details Grid split */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
            gap: "20px"
          }}>
            {/* Video response card */}
            <div style={{ ...card, margin: 0 }}>
              <h3 style={{ margin: "0 0 15px 0", fontSize: "16px", color: "#0f172a" }}>Candidate Response</h3>
              <video
                key={answer.video}
                controls
                src={answer.video}
                style={{
                  width: "100%",
                  height: "320px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  background: "#000"
                }}
              />
            </div>

            {/* Evaluation data card */}
            <div style={{ ...card, margin: 0, display: "flex", flexDirection: "column", gap: "15px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}>AI Analysis</h3>

              <div>
                <span style={labelStyle}>Transcript</span>
                <div style={textBoxStyle}>{answer.transcript}</div>
              </div>

              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <div>
                  <span style={labelStyle}>AI Score</span>
                  <div style={{ fontSize: "36px", fontWeight: "800", color: "#7c3aed", lineHeight: "1" }}>
                    {answer.score}%
                  </div>
                </div>
              </div>

              <div>
                <span style={labelStyle}>Feedback</span>
                <div style={{ ...textBoxStyle, minHeight: "80px", height: "auto" }}>{answer.feedback}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions fixed positioning */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "15px",
          borderTop: "1px solid #e2e8f0"
        }}>
          <button
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
            style={index === 0 ? disabledBtn : secondaryBtn}
          >
            ← Previous
          </button>

          <span style={{ color: "#64748b", fontSize: "14px", fontWeight: "500" }}>
            {index + 1} of {answers.length}
          </span>

          <button
            disabled={index === answers.length - 1}
            onClick={() => setIndex(index + 1)}
            style={index === answers.length - 1 ? disabledBtn : secondaryBtn}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

// Layout Styles
const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(15, 23, 42, 0.6)",
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "20px"
};

const modal = {
  background: "white",
  width: "100%",
  maxWidth: "1200px",
  height: "90vh",
  maxHeight: "850px",
  overflow: "hidden",
  borderRadius: "16px",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
};

const card = {
  background: "#f8fafc",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #f1f5f9",
  marginBottom: "20px"
};

// UI Reusable Blocks
const textBoxStyle = {
  background: "#fff",
  padding: "12px",
  borderRadius: "8px",
  height: "100px",
  overflowY: "auto",
  border: "1px solid #e2e8f0",
  fontSize: "14px",
  color: "#334155",
  lineHeight: "1.5"
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: "600",
  color: "#64748b",
  marginBottom: "6px"
};

// Button Stylings
const closeBtn = {
  border: "none",
  background: "#f1f5f9",
  color: "#64748b",
  fontSize: "16px",
  cursor: "pointer",
  borderRadius: "50%",
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s"
};

const primaryBtn = {
  background: "#182b5c",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "500"
};

const secondaryBtn = {
  background: "#fff",
  color: "#334155",
  border: "1px solid #cbd5e1",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "500",
  transition: "all 0.2s"
};

const disabledBtn = {
  ...secondaryBtn,
  color: "#cbd5e1",
  borderColor: "#e2e8f0",
  cursor: "not-allowed",
  background: "#f8fafc"
};

export default ScreeningModal;