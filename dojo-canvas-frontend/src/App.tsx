import { useComponentValue, useEntityQuery } from "@dojoengine/react";
import { Entity, Has } from "@dojoengine/recs";
import { HasValue, getComponentValue } from "@dojoengine/recs";

import { useEffect, useState, useMemo } from "react";
import { Direction } from "./utils";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";
import CanvasCard from "./components/CanvasCard";
import { shortString } from "starknet";
import Canvas from "./components/Canvas";
import useIP from "./hooks/useIP";

function App() {
  const {
    setup: {
      systemCalls: { spawn, move, create, addPlayer },
      clientComponents: { Position, Moves, Game, Tile, Player },
      toriiClient,
    },
    account,
  } = useDojo();
  const { ip, loading } = useIP();
  useEffect(() => {
    if (!loading && ip) {
      console.log(ip);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ip, loading]);

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

  const changeToAddress = (address: string) => {
    return shortString.decodeShortString(address);
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
    <div className="flex items-center justify-center flex-col h-screen w-screen bg-slate-500 text-white">
      <button onClick={account?.create}>
        {account?.isDeploying ? "deploying burner" : "create burner"}
      </button>

      <button onClick={handleRestoreBurners}>
        Restore Burners from Clipboard
      </button>

      <div className="">
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
      </div>

      <div>
        <button onClick={() => create(account.account)}>Create Game</button>
      </div>
      {games.length > 0 && (
        <>
          {games.map((game: any) => (
            <div key={game.game_id}>
              <CanvasCard id={game.game_id} />
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;
