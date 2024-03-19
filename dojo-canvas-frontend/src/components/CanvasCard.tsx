import React, { useState, useMemo } from "react"; // Adjust import path based on your framework
import Canvas from "./Canvas";
import { useDojo } from "../dojo/useDojo";
import { HasValue, getComponentValue } from "@dojoengine/recs";
import { useComponentValue, useEntityQuery } from "@dojoengine/react";
import CurrentLockStatus from "./LockingStatus";

interface CanvasCardProps {
  id: number;
}

const CanvasCard = ({ id }: CanvasCardProps) => {
  const {
    setup: {
      systemCalls: { spawn, move, create },
      clientComponents: { Position, Moves, Game, Tile, Lock },
      toriiClient,
    },
    account,
  } = useDojo();
  const [canvasModal, setCanvasModal] = useState(false);
  function handleProjectClick() {
    setCanvasModal(true);
  }
  function handleProjectClickClose() {
    setCanvasModal(false);
  }
  const lockEntities: any = useEntityQuery([
    HasValue(Lock, {
      game_id: id,
      player: BigInt(account.account.address),
    }),
  ]);

  const locks = useMemo(
    () =>
      lockEntities
        .map((id: any) => getComponentValue(Lock, id))
        .sort((a: any, b: any) => a.game_id - b.game_id),
    [lockEntities, Lock]
  );
  return (
    <>
      <div className="bg-white shadow-md rounded-lg overflow-hidden text-black my-2">
        <div onClick={handleProjectClick} className="p-4">
          <p>Canvas ID: {id}</p>
        </div>
      </div>
      <div
        className={`fixed z-50 inset-0 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50 transition-opacity duration-300 ease-in-out ${
          canvasModal
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl h-11/12 p-6 text-black">
          <h2 className="text-xl font-medium mb-4">Canvas Details</h2>
          <p>
            <b>Canvas ID:</b> {id}
          </p>

          <CurrentLockStatus game_id={id} />
          <hr className="my-4" />
          <Canvas gameId={id} n={10} />
          <button
            type="button"
            onClick={handleProjectClickClose}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-opacity-50 focus:outline-none rounded-lg px-5 py-2 text-center mt-4 transform transition duration-150 ease-in-out"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default CanvasCard;
