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

  const [currentPage, setCurrentPage] = useState(1);
  const [gamesPerPage, setGamesPerPage] = useState(8); // 2 per row * 2 rows

  const gameEntities: any = useEntityQuery([HasValue(Game, { seed: 1 })]);

  const games = useMemo(
    () =>
      gameEntities
        .map((id: any) => getComponentValue(Game, id))
        .sort((a: any, b: any) => a.id - b.id)
        .filter((game: any) => game.host !== 0n),
    [gameEntities, Game]
  );

  const paginatedGames = useMemo(() => {
    const startIndex = (currentPage - 1) * gamesPerPage;
    const endIndex = startIndex + gamesPerPage;
    return games.slice(startIndex, endIndex);
  }, [currentPage, gamesPerPage, games]);

  const handleNextPage = () => {
    const maxPage = Math.ceil(games.length / gamesPerPage);
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      {paginatedGames.length > 0 && (
        <div className="canvas-grid py-4 grid grid-cols-auto sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {paginatedGames.map((game: any) => (
            <div className="aspect-square bg-red-400" key={game.game_id}>
              <CanvasCard id={game.game_id} />
            </div>
          ))}
        </div>
      )}

      {games.length > gamesPerPage && (
        <div className=" h-16 flex items-center justify-between">
          <button
            className="disabled:opacity-50 disabled:cursor-not-allowed bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
          >
            Previous
          </button>
          <button
            className="bg-[#606c38] text-white px-3 py-1 rounded hover:bg-[#283618] focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleNextPage}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default Games;
