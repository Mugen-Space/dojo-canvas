import React, { createContext, useState, useContext } from "react";

interface FeedbackType {
  message: string;
  type: "success" | "error" | "info" | "warning" | "loading"; // Add more types as needed
  duration?: number; // Optional duration for auto-dismissal (milliseconds)
}
export type Feedback = FeedbackType;
interface FeedbackContextProps {
  showFeedback: (feedback: Feedback) => void;
  clearFeedback: () => void;
  feedback: Feedback | null;
}

const FeedbackContext = createContext<FeedbackContextProps>({
  showFeedback: () => {},
  clearFeedback: () => {},
  feedback: null,
});

interface FeedbackProviderProps {
  children: React.ReactNode; // Or a more specific type if needed
}

const FeedbackProvider: React.FC<FeedbackProviderProps> = ({ children }) => {
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const showFeedback = (newFeedback: Feedback) => {
    setFeedback(newFeedback);
    if (newFeedback.duration) {
      setTimeout(() => {
        clearFeedback();
      }, newFeedback.duration);
    }
  };

  const clearFeedback = () => {
    setFeedback(null);
  };

  return (
    <FeedbackContext.Provider value={{ showFeedback, clearFeedback, feedback }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export { FeedbackContext, FeedbackProvider };
