import React, { useState, useEffect, useMemo } from "react";
import TileFront from "./Tile"; // Adjust import path for Tile component
import { HasValue, getComponentValue } from "@dojoengine/recs";
import { useDojo } from "../dojo/useDojo";
import { useComponentValue, useEntityQuery } from "@dojoengine/react";
import { shortString } from "starknet";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";

interface TileData {
  color: string; // Tile color (Tailwind color class)
}

interface CanvasProps {
  gameId: number; // ID of the game to fetch tile data
  n: number; // Number of rows and columns for the grid
}

const Canvas = ({ gameId, n }: CanvasProps) => {
  const {
    setup: {
      systemCalls: { spawn, move, create },
      clientComponents: { Position, Moves, Game, Tile, Lock },
      toriiClient,
    },
    account,
  } = useDojo();
  // const [tiles, setTiles] = useState<TileData[]>([]); // Array to store tile data
  const [isLoading, setIsLoading] = useState(false); // Flag to indicate data fetching
  const [color, setColor] = useColor("#561ecb");

  // useEffect(() => {
  //   const fetchTileData = async () => {
  //     setIsLoading(true);
  //     // Replace with your actual API call to fetch tile data based on gameId
  //     const response = await fetch(/* Your API endpoint */ +gameId);
  //     const data = await response.json();
  //     setTiles(data.tiles || []); // Assuming data.tiles holds tile information
  //     setIsLoading(false);
  //   };

  //   fetchTileData();
  // }, [gameId]); // Re-fetch data on gameId change

  const tileEntities: any = useEntityQuery([
    HasValue(Tile, { game_id: gameId }),
  ]);

  const tiles = useMemo(
    () =>
      tileEntities
        .map((id: any) => getComponentValue(Tile, id))
        .sort((a: any, b: any) => a.tile_id - b.tile_id),
    [tileEntities, Tile]
  );

  if (isLoading) {
    return <p>Loading tiles...</p>;
  }

  const tileSize = Math.floor(window.innerWidth / n); // Dynamic tile size

  return (
    <>
      <div className="flex justify-center">
        <div className={`grid grid-cols-10 border-black border-2 p-1`}>
          {tiles.map((tile: any, index: any) => (
            <TileFront
              key={index}
              size={tileSize}
              color={shortString.decodeShortString(tile.colour)}
              tileId={tile.tile_id}
              gameId={gameId}
              currentColor={color.hex}
            />
          ))}
        </div>
      </div>
      <div className="mt-2 border-2 border-black rounded-xl">
        <ColorPicker
          hideInput={["rgb", "hsv", "hex"]}
          height={100}
          color={color}
          onChange={setColor}
        />
      </div>
    </>
  );
};

export default Canvas;
