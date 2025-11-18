// file: src/components/TablePanel.jsx
import React, { useState } from "react";

export default function TablePanel({ columns = [], rows = [] }) {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  if (!rows || rows.length === 0) {
    return (
      <div style={{ fontSize: 13, color: "#666" }}>
        No table data
      </div>
    );
  }

  const totalPages = Math.ceil(rows.length / pageSize);
  const startIndex = page * pageSize;
  const endIndex = Math.min(startIndex + pageSize, rows.length);
  const pageRows = rows.slice(startIndex, endIndex);

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  return (
    <div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 13,
        }}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                style={{
                  textAlign: "left",
                  padding: "6px 8px",
                  borderBottom: "1px solid #eee",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageRows.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td
                  key={col}
                  style={{
                    padding: "6px 8px",
                    borderBottom: "1px solid #fafafa",
                  }}
                >
                  {row[col] !== undefined ? String(row[col]) : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div
        style={{
          marginTop: 8,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 12,
        }}
      >
        <span>
          Showing {startIndex + 1}-{endIndex} of {rows.length}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => canPrev && setPage((p) => p - 1)}
            disabled={!canPrev}
            style={{
              padding: "2px 6px",
              fontSize: 12,
              opacity: canPrev ? 1 : 0.5,
              cursor: canPrev ? "pointer" : "default",
            }}
          >
            ◀
          </button>
          <span>
            Page {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => canNext && setPage((p) => p + 1)}
            disabled={!canNext}
            style={{
              padding: "2px 6px",
              fontSize: 12,
              opacity: canNext ? 1 : 0.5,
              cursor: canNext ? "pointer" : "default",
            }}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}
