// file: src/components/MessageBubble.jsx
import React from "react";
import ChartPanel from "./ChartPanel";
import TablePanel from "./TablePanel";

export default function MessageBubble({ message }) {
  const isAssistant = message.role === "assistant";
  const bubbleStyle = {
    background: isAssistant ? "#f1f1f8" : "#e6fff0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    maxWidth: "100%",
    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isAssistant ? "flex-start" : "flex-end",
      }}
    >
      <div style={bubbleStyle}>
        {/* Main text (streamed content) */}
        <div style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
          {message.content ?? message.text ?? ""}
        </div>

        {/* Render table (if provided) */}
        {message.table && (
          <div style={{ marginTop: 12 }}>
            <TablePanel
              columns={message.table.columns}
              rows={message.table.rows}
            />
          </div>
        )}

        {/* Render chart (if provided) */}
        {message.chart && (
          <div style={{ marginTop: 12 }}>
            <ChartPanel
              data={message.chart.data}
              meta={{
                xKey: message.chart.xKey,
                yKey: message.chart.yKey,
                chartType: message.chart.chartType,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
