import React, { useContext } from "react";
import { FeedbackContext } from "../hooks/useFeedback";
const FeedbackModal: React.FC = () => {
  const { feedback, clearFeedback } = useContext(FeedbackContext);
  console.log("here in the modal");
  if (!feedback) return null; // Early return if no feedback

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-opacity-50 backdrop-blur-sm z-51 flex justify-center items-center`}
      onClick={clearFeedback} // Dismiss on modal click
    >
      <div
        className={`bg-white rounded-md shadow-md p-4 flex flex-col items-center space-y-2`}
      >
        <div
          className={`text-xl font-bold ${
            feedback.type === "success"
              ? "text-green-500"
              : feedback.type === "error"
              ? "text-red-500"
              : feedback.type === "info"
              ? "text-blue-500"
              : feedback.type === "loading"
              ? "text-yellow-500"
              : "text-gray-200"
          }`}
        >
          {feedback.message}
          {feedback.type === "loading" && (
            <div className="animate-spin mr-2">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24">
                <path
                  fill="none"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                />
                <path
                  className="fill-current"
                  d="M15.55 5.55L11 10.01L6.45 5.55A.75.75 0 015 6.76v6.48a.75.75 0 010 1.5L11 17.49l4.55-4.55a.75.75 0 011.5-1.5z"
                />
              </svg>
            </div>
          )}
        </div>
        <button
          className="text-sm text-blue-500 hover:underline"
          onClick={clearFeedback}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default FeedbackModal;
