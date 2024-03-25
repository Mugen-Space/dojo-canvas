import React, { useContext, useState } from "react";
import { useDojo } from "../dojo/useDojo";
import { tile } from "@latticexyz/utils";
import { FeedbackContext, Feedback } from "../hooks/useFeedback";
import FeedbackModal from "./FeedbackModal";

interface TileProps {
  size: number; // Size of the tile in pixels
  color: string; // Tailwind color class (e.g., 'bg-red-500')
  tileId: number;
  gameId: number;
  currentColor: string;
  canvasType: string;
}

const TileFront = ({
  size,
  color,
  tileId,
  gameId,
  currentColor,
  canvasType,
}: TileProps) => {
  const {
    setup: {
      systemCalls: { spawn, move, create, draw },
      clientComponents: { Position, Moves, Game, Tile },
      toriiClient,
    },
    account,
  } = useDojo();
  const { showFeedback, clearFeedback } = useContext(FeedbackContext);
  async function handleClick() {
    if (canvasType === "paint") {
      var feedback: Feedback = {
        message: "Adding paint to your pixel!!!!",
        type: "loading",
        duration: 10000,
      };
      showFeedback(feedback);
      await draw(account.account, gameId, tileId, currentColor);
      clearFeedback();
      var feedback: Feedback = {
        message: "Paint added successfully!!!",
        type: "success",
        duration: 5000,
      };
      showFeedback(feedback);
    }
  }
  return (
    <>
      {" "}
      <div
        onClick={handleClick}
        className={`h-6 sm:h-10 md:h-7 lg:h-7 xl:h-8 2xl:h-10 aspect-square  text-black border-black`}
        style={{
          backgroundColor: color,
        }}
      >
        {}
      </div>
    </>
  );
};

export default TileFront;
