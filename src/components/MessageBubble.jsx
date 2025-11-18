// file: src/components/MessageBubble.jsx
import React from "react";
import ChartPanel from "./ChartPanel";
import TablePanel from "./TablePanel";

export default function MessageBubble({ role, content, time, table, chart }) {
  const isAssistant = role === "assistant";

  return (
    <div className={`msg-row ${isAssistant ? "is-assistant" : "is-user"}`}>
      {isAssistant && <div className="msg-avatar assistant">🤖</div>}

      <div className={`msg-bubble ${role}`}>
        {/* Main text (streamed content) */}
        <p style={{ whiteSpace: "pre-wrap" }}>{content}</p>

        {/* Table (optional) */}
        {table && table.rows && table.rows.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <TablePanel columns={table.columns} rows={table.rows} />
          </div>
        )}

        {/* Chart (optional) */}
        {chart && chart.data && (
          <div style={{ marginTop: 8 }}>
            <ChartPanel
              data={chart.data}
              meta={{
                xKey: chart.xKey,
                yKey: chart.yKey,
                chartType: chart.chartType,
              }}
            />
          </div>
        )}

        <span className="msg-time">{time}</span>
      </div>

      {!isAssistant && <div className="msg-avatar user">🧑</div>}
    </div>
  );
}
