import { useComponentValue, useEntityQuery } from "@dojoengine/react";
import { Entity, Has } from "@dojoengine/recs";
import { HasValue, getComponentValue } from "@dojoengine/recs";

import { useEffect, useState, useMemo, useContext } from "react";
import { Direction } from "./utils";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";
import CanvasCard from "./components/CanvasCard";
import { shortString } from "starknet";
import Canvas from "./components/Canvas";
import useIP from "./hooks/useIP";
import { Navbar } from "./components/navbar";
import { FeedbackContext, Feedback } from "./hooks/useFeedback";
import FeedbackModal from "./components/FeedbackModal";
import { clear } from "console";
import Games from "./components/Games";
const App: React.FC = () => {
  const {
    setup: {
      systemCalls: { spawn, move, create, addPlayer },
      clientComponents: { Position, Moves, Game, Tile, Player },
      toriiClient,
    },
    account,
  } = useDojo();
  const [ipHere, setIpHere] = useState("");
  const { ip, loading } = useIP();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalShow, setModalShow] = useState(true);
  const { showFeedback, clearFeedback } = useContext(FeedbackContext);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  useEffect(() => {}, []);
  const handleAddContact = async () => {
    setIsLoading(true);
    // Replace with your actual function call to add contact with username
    try {
      // const response = await fetch(/* Your API endpoint */);
      await account?.create();
      await addPlayer(account?.account, ipHere, username);
      setModalShow(false);
      // const data = await response.json();
    } catch (error) {
      console.error("Error adding contact:", error); // Handle errors
    } finally {
      setIsLoading(false);
    }
  };
  const handleCreateGame = async () => {
    var feedback: Feedback = {
      message: "Creating your game hold tighttt!",
      type: "loading",
      duration: 10000,
    };
    showFeedback(feedback);

    await create(account.account);
    clearFeedback();
    var feedback: Feedback = {
      message: "Your action was successful!",
      type: "success",
      duration: 10000,
    };
    showFeedback(feedback);
  };
  useEffect(() => {
    if (!loading && ip) {
      setIpHere(String(ip));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ip, loading]);
  const [clipboardStatus, setClipboardStatus] = useState({
    message: "",
    isError: false,
  });

  // entity id we are syncing

  const playerEntities: any = useEntityQuery([
    HasValue(Player, { player_ip: BigInt(ipHere) }),
  ]);

  const players = useMemo(
    () =>
      playerEntities
        .map((id: any) => getComponentValue(Player, id))
        .sort((a: any, b: any) => b.id - a.id)
        .filter((game: any) => game.player !== 0n),
    [playerEntities, Player]
  );
  useEffect(() => {
    if (clipboardStatus.message) {
      const timer = setTimeout(() => {
        setClipboardStatus({ message: "", isError: false });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [clipboardStatus.message]);

  useEffect(() => {
    if (players.length) {
      setUsername(shortString.decodeShortString(players[0]?.name));
      setModalShow(false);
      clearFeedback();
    } else {
      var feedback: Feedback = {
        message: "Loading player information!!!",
        type: "loading",
        duration: 10000,
      };
      showFeedback(feedback);
    }
  }, [players]);
  return (
    <div className="w-screen min-h-screen">
      <Navbar username={username} />
      <div className="flex justify-center pt-16 w-full min-h-screen bg-[#f6f6f6]">
        <div className="px-6 py-3 w-full">
          <div>
            <button
              className="create-game-button w-full py-2 px-4  bg-[#bc6c25] text-white font-bold rounded-md hover:bg-[#9a5213]"
              onClick={handleCreateGame}
            >
              Create New Canvas
            </button>
          </div>
          <Games />
        </div>
        <div
          className={`fixed z-50 inset-0 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50 transition-opacity duration-300 ease-in-out ${
            modalShow
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-red-200 rounded-lg shadow-lg w-full max-w-3xl h-11/12 p-6 text-black">
            <h2 className="text-xl font-medium mb-4">Add Account Details</h2>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-2"
              >
                Username:
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button
              type="button"
              onClick={handleAddContact}
              className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-opacity-50 focus:outline-none rounded-lg px-5 py-2 text-center mt-4 transform transition duration-150 ease-in-out ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Adding Username ..." : "Add Username"}
            </button>
          </div>
        </div>
      </div>
      <FeedbackModal />
    </div>
  );
};

export default App;
