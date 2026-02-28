function StatusCard({ status, threatCount }) {
  return (
    <div className="card">
      <h3>System Status: {status}</h3>
      <p>Threats Detected: {threatCount}</p>
      <button onClick={() => alert('Starting Scan...')}>Start Deep Scan</button>
    </div>
  );
}

export default StatusCard;