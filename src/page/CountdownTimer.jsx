import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CountdownTimer = () => {
  const [time, setTime] = useState(600);
  const navigate = useNavigate();
  useEffect(() => {
    if (time > 0) {
      const timer = setInterval(() => {
        setTime(time - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      alert("Hết thời gian chuyển khoản !");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  }, [time]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };
  return (
    <div className="countdown-container">
      <div className="countdown-timer">{formatTime(time)}</div>
    </div>
  );
};

export default CountdownTimer;
