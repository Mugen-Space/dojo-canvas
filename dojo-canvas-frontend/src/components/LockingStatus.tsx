import { useState, useEffect, useMemo } from "react";
import React from "react";
import { useDojo } from "../dojo/useDojo";
import { HasValue, getComponentValue } from "@dojoengine/recs";
import { useComponentValue, useEntityQuery } from "@dojoengine/react";

interface LockData {
  game_id: number; // Assuming unlock_time is a Unix timestamp in milliseconds
}

const CurrentLockStatus = ({ game_id }: { game_id: number }) => {
  const {
    setup: {
      systemCalls: { spawn, move, create },
      clientComponents: { Position, Moves, Game, Tile, Lock },
      toriiClient,
    },
    account,
  } = useDojo();
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000)); // Get current Unix timestamp

  const lockEntities: any = useEntityQuery([
    HasValue(Lock, {
      game_id: game_id,
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

  useEffect(() => {
    // const intervalId = setInterval(() => {
    //   console.log("called");
    //   setCurrentTime(Math.floor(Date.now() / 1000));
    // }, 1000); // Update current time every second
    setCurrentTime(Math.floor(Date.now() / 1000));
    console.log(locks[0]?.unlock_time);
    // return () => clearInterval(intervalId); // Cleanup on unmount
  }, [locks]);

  const firstLock = locks; // Assuming locks[0] contains the relevant unlock time

  if (!firstLock) {
    return <p>No lock information available.</p>;
  }

  const timeRemaining = firstLock[0]?.unlock_time - currentTime;

  if (timeRemaining > 0) {
    const days = Math.floor(timeRemaining / (60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (60 * 60)) / (60 * 60));
    const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
    const seconds = Math.floor(timeRemaining % 60);

    const formattedTime =
      (days > 0 ? `${days} day${days > 1 ? "s" : ""}` : "") +
      (hours > 0 ? ` ${hours} hr${hours > 1 ? "s" : ""}` : "") +
      (minutes > 0 ? ` ${minutes} min${minutes > 1 ? "s" : ""}` : "") +
      (seconds > 0 ? ` ${seconds} sec${seconds > 1 ? "s" : ""}` : "");

    return <p>You can paint in {formattedTime}.</p>;
  } else {
    return <p>You can paint now!</p>;
  }
};

export default CurrentLockStatus;
