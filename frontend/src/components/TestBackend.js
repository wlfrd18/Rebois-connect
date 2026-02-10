import React, { useEffect, useState } from "react";

const TestBackend = () => {
  const [dbStatus, setDbStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL;

    fetch(`${API_URL}/health/db`)
      .then((res) => res.json())
      .then((data) => setDbStatus(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Test Backend Render</h1>
      {dbStatus && (
        <pre style={{ background: "#f0f0f0", padding: "1rem" }}>
          {JSON.stringify(dbStatus, null, 2)}
        </pre>
      )}
      {error && <p style={{ color: "red" }}>Erreur : {error}</p>}
    </div>
  );
};

export default TestBackend;
