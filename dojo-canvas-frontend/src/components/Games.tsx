import { useComponentValue, useEntityQuery } from "@dojoengine/react";
import { HasValue, getComponentValue } from "@dojoengine/recs";

import { useEffect, useState, useMemo, useContext } from "react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "../dojo/useDojo";
import CanvasCard from "./CanvasCard";
const Games: React.FC = () => {
  const {
    setup: {
      systemCalls: { spawn, move, create, addPlayer },
      clientComponents: { Position, Moves, Game, Tile, Player },
      toriiClient,
    },
    account,
  } = useDojo();

  const gameEntities: any = useEntityQuery([HasValue(Game, { seed: 1 })]);
  // const tileEntities: any = useEntityQuery([HasValue(Tile, { game_id: 0 })]);

  const games = useMemo(
    () =>
      gameEntities
        .map((id: any) => getComponentValue(Game, id))
        .sort((a: any, b: any) => b.id - a.id)
        .filter((game: any) => game.host !== 0n),
    [gameEntities, Game]
  );

  return (
    <>
      {games.length > 0 && (
        <div className="canvas-grid grid grid-cols-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {games.map((game: any) => (
            <div key={game.game_id}>
              <CanvasCard id={game.game_id} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Games;
