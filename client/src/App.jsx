import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("Connecting...");

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("⚠️ Backend se connect nahi ho paya"));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50">
      <h1 className="text-4xl font-bold text-orange-700 mb-4">🎓 VidyaMarg</h1>
      <p className="text-lg text-gray-700">{message}</p>
      <p className="text-sm text-gray-400 mt-6">Day 1 — Setup Complete ✅</p>
    </div>
  );
}

export default App;
