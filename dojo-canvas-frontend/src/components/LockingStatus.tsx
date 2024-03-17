import { useState, useEffect } from "react";
import React from "react";

interface LockData {
  unlock_time: number; // Assuming unlock_time is a Unix timestamp in milliseconds
}

const CurrentLockStatus = ({ locks }: { locks: LockData }) => {
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000)); // Get current Unix timestamp

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 1000); // Update current time every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [locks]);

  const firstLock = locks; // Assuming locks[0] contains the relevant unlock time

  if (!firstLock) {
    return <p>No lock information available.</p>;
  }

  const timeRemaining = firstLock.unlock_time - currentTime;

  if (timeRemaining > 0) {
    const days = Math.floor(timeRemaining / (60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (60 * 60)) / (60 * 60));
    const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
    const seconds = Math.floor(timeRemaining % 60);

    const formattedTime =
      (days > 0 ? `${days} day${days > 1 ? "s" : ""}` : "") +
      (hours > 0 ? ` ${hours} hr${hours > 1 ? "s" : ""}` : "") +
      (minutes > 0 ? ` ${minutes} min${minutes > 1 ? "s" : ""}` : "") +
      (seconds > 0 ? ` ${seconds} sec${seconds > 1 ? "s" : ""}` : "");

    return <p>You can paint in {formattedTime}.</p>;
  } else {
    return <p>You can paint now!</p>;
  }
};

export default CurrentLockStatus;
