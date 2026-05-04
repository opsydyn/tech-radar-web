import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
  maxWidth: "1000px",
  margin: "0 auto",
  fontFamily: "IBM Plex Mono, monospace",
  color: "#b5e853",
});

export const description = style({
  marginBottom: "1rem",
});

export const systemsContainer = style({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: "2rem",
  justifyContent: "center",
});

export const systemContainer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "1rem",
  border: "1px solid #333",
  borderRadius: "8px",
  backgroundColor: "#1a1a1a",
});

export const systemTitle = style({
  marginBottom: "1rem",
  color: "#b5e853",
  fontSize: "1.2rem",
  fontWeight: "bold",
});

export const legend = style({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: "2rem",
  justifyContent: "space-around",
  padding: "1rem",
  border: "1px solid #333",
  borderRadius: "8px",
  backgroundColor: "#1a1a1a",
});

export const legendSection = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

export const legendItem = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

export const legendColor = style({
  width: "16px",
  height: "16px",
  borderRadius: "50%",
  border: "1px solid #333",
});

export const legendLine = style({
  width: "24px",
  height: "3px",
  borderRadius: "2px",
});

export const insights = style({
  padding: "1rem",
  border: "1px solid #333",
  borderRadius: "8px",
  backgroundColor: "#1a1a1a",
});