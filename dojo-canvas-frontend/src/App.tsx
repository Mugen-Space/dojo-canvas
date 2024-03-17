import { useComponentValue, useEntityQuery } from "@dojoengine/react";
import { Entity, Has } from "@dojoengine/recs";
import { HasValue, getComponentValue } from "@dojoengine/recs";

import { useEffect, useState, useMemo } from "react";
import "./App.css";
import { Direction } from "./utils";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";
import CanvasCard from "./components/CanvasCard";
import { shortString } from "starknet";
import Canvas from "./components/Canvas";

function App() {
  const {
    setup: {
      systemCalls: { spawn, move, create },
      clientComponents: { Position, Moves, Game, Tile },
      toriiClient,
    },
    account,
  } = useDojo();

  const [clipboardStatus, setClipboardStatus] = useState({
    message: "",
    isError: false,
  });

  // entity id we are syncing
  const entityId = getEntityIdFromKeys([
    BigInt(account?.account.address),
  ]) as Entity;

  // get current component values
  const position = useComponentValue(Position, entityId);
  const moves = useComponentValue(Moves, entityId);

  const changeToAddress = (address: String) => {
    return "0x" + address.toString(16).padStart(2, "0");
  };

  //   const decodeColor = (encodedNumber: BigInt) => {
  //     const encodedBytes = new Uint16Array(BigInt(encodedNumber).toString(16)); // Convert to a Uint16Array for 16-bit representation (little-endian by default)
  //     const decoder = new TextDecoder("utf-16le"); // Specify little-endian UTF-16 encoding
  //     const decodedString = decoder.decode(encodedBytes);
  //     console.log(decodedString); // Should output "white"
  //   };

  const handleRestoreBurners = async () => {
    try {
      await account?.applyFromClipboard();
      setClipboardStatus({
        message: "Burners restored successfully!",
        isError: false,
      });
    } catch (error) {
      setClipboardStatus({
        message: `Failed to restore burners from clipboard`,
        isError: true,
      });
    }
  };
  const gameEntities: any = useEntityQuery([HasValue(Game, { seed: 1 })]);
  const tileEntities: any = useEntityQuery([HasValue(Tile, { game_id: 0 })]);
  const tiles = useMemo(
    () =>
      tileEntities
        .map((id: any) => getComponentValue(Tile, id))
        .sort((a: any, b: any) => b.id - a.id)
        .filter((game: any) => game.host !== 0n),
    [tileEntities, Tile]
  );
  const games = useMemo(
    () =>
      gameEntities
        .map((id: any) => getComponentValue(Game, id))
        .sort((a: any, b: any) => b.id - a.id)
        .filter((game: any) => game.host !== 0n),
    [gameEntities, Game]
  );

  useEffect(() => {
    if (clipboardStatus.message) {
      const timer = setTimeout(() => {
        setClipboardStatus({ message: "", isError: false });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [clipboardStatus.message]);

  return (
    <>
      <button onClick={account?.create}>
        {account?.isDeploying ? "deploying burner" : "create burner"}
      </button>
      {account && account?.list().length > 0 && (
        <button onClick={async () => await account?.copyToClipboard()}>
          Save Burners to Clipboard
        </button>
      )}
      <button onClick={handleRestoreBurners}>
        Restore Burners from Clipboard
      </button>
      {clipboardStatus.message && (
        <div className={clipboardStatus.isError ? "error" : "success"}>
          {clipboardStatus.message}
        </div>
      )}

      <div className="card">
        select signer:{" "}
        <select
          value={account ? account.account.address : ""}
          onChange={(e) => account.select(e.target.value)}
        >
          {account?.list().map((account, index) => {
            return (
              <option value={account.address} key={index}>
                {account.address}
              </option>
            );
          })}
        </select>
        <div>
          <button onClick={() => account.clear()}>Clear burners</button>
          <p>
            You will need to Authorise the contracts before you can use a
            burner. See readme. or basically just run the sh scripts/default.sh
            it's present in the smart contract folder.
          </p>
        </div>
      </div>

      <div className="card">
        <button onClick={() => create(account.account)}>Create Game</button>
      </div>
      {games.length > 0 && (
        <>
          {games.map((game: any) => (
            <div key={game.game_id}>
              <CanvasCard
                id={game.game_id}
                owner_id={changeToAddress(game.host)}
              />
            </div>
          ))}
        </>
      )}
      {/* {tiles.length > 0 && (
        <>
          {tiles.map((tile: any) => (
            <>
              <div className="text-3xl font-bold underline text-red-600">
                {tile.game_id}
              </div>
              <div>{tile.tile_id}</div>
              <div>{shortString.decodeShortString(tile.colour)}</div>
            </>
          ))}
        </>
      )} */}
    </>
  );
}

export default App;
