import { style } from "@vanilla-extract/css";

export const toggleButton = style({
  position: "fixed",
  bottom: "20px",
  left: "20px",
  padding: "12px 20px",
  borderRadius: "8px",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  zIndex: 1000,
  fontFamily: "inherit",
  fontSize: "14px",
  transition: "all 0.2s ease",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",

  selectors: {
    '[data-theme="dark"] &': {
      background: "#2f2f2f",
      color: "#fff",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    '[data-theme="light"] &': {
      background: "#e8e8e8",
      color: "#333",
      border: "1px solid rgba(0, 0, 0, 0.1)",
    },
    '[data-theme="machine"] &': {
      background: "#2f2f2f",
      color: "#fff",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    '&:hover': {
      boxShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
    },
  }
});

export const icon = style({
  fontSize: "18px",
});
