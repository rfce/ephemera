import "./css/Table.css";

const TrackTable = ({ rows = [] }) => {
  return (
    <div className="track-table-wrapper">
      <table className="track-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>IP Address</th>
            <th>User Agent</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={3} className="empty">
                No tracking data yet
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={index}>
                <td>{new Date(row.date).toLocaleString()}</td>
                <td className="mono">{row.ip}</td>
                <td className="ua">{row.ua}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TrackTable;
