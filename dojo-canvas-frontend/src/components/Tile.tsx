import React, { useState } from "react";
import { useDojo } from "../dojo/useDojo";
import { tile } from "@latticexyz/utils";

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
  async function handleClick() {
    if (canvasType === "paint") {
      await draw(account.account, gameId, tileId, currentColor);
    }
  }
  return (
    <div
      onClick={handleClick}
      className={`w-10 h-10  text-black border-black`}
      style={{
        backgroundColor: color,
      }}
    >
      {}
    </div>
  );
};

export default TileFront;
