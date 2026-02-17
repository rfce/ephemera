import { useState, useMemo } from "react";
import "./css/Table.css";

const ROWS_PER_PAGE = 5;

const renderFormattedDate = (isoString, istime) => {
  const date = new Date(isoString);
  if (isNaN(date)) return "---";

  const datePart = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date).replace(/\//g, '-');

  const timePart = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return (
    <span>
      {istime ? timePart : datePart}
    </span>
  );
};

const TrackTable = ({ rows = [] }) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(rows.length / ROWS_PER_PAGE);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return rows.slice(start, start + ROWS_PER_PAGE);
  }, [rows, page]);

  const goPrev = () => setPage((p) => Math.max(p - 1, 1));
  const goNext = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="track-table-wrapper">
      <table className="track-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>IP Address</th>
            <th>User Agent</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows.length === 0 ? (
            <tr>
              <td colSpan={4} className="empty">
                No tracking data yet
              </td>
            </tr>
          ) : (
            paginatedRows.map((row, index) => (
              <tr key={index} className={index === 0 ? "highlight-row" : ""}>
                <td>{renderFormattedDate(row.timestamp)}</td>
                <td>{renderFormattedDate(row.timestamp, true)}</td>
                <td className="mono">{row.ip}</td>
                <td className="ua">{row.ua}</td>
              </tr>
            ))
          )}
        </tbody>

      </table>

      {/* Pagination Controls */}
      {rows.length > ROWS_PER_PAGE && (
        <div className="pagination">
          <button onClick={goPrev} disabled={page === 1}>
            ← Prev
          </button>

          <span className="page-info">
            Page {page} of {totalPages}
          </span>

          <button onClick={goNext} disabled={page === totalPages}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default TrackTable;
