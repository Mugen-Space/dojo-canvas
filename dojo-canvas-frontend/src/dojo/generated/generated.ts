/* Autogenerated file. Do not edit manually. */

import { Account, AccountInterface } from "starknet";
import { DojoProvider } from "@dojoengine/core";
import { Direction } from "../../utils";
import { tile } from "@latticexyz/utils";

export type IWorld = Awaited<ReturnType<typeof setupWorld>>;

export interface MoveProps {
  account: any;
  direction: Direction;
}

export interface DrawProps {
  account: any;
  game_id: number;
  tile_id: number;
  colour: string;
}

export async function setupWorld(provider: DojoProvider) {
  function actions() {
    const contract_name = "actions";

    const spawn = async ({ account }: { account: any }) => {
      try {
        return await provider.execute(account, contract_name, "spawn", []);
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    const move = async ({ account, direction }: MoveProps) => {
      try {
        return await provider.execute(account, contract_name, "move", [
          direction,
        ]);
      } catch (error) {
        console.error("Error executing move:", error);
        throw error;
      }
    };

    const create = async ({ account }: { account: any }) => {
      try {
        return await provider.execute(account, contract_name, "create", [
          provider.getWorldAddress(),
        ]);
      } catch (error) {
        console.error("Error executing create:", error);
        throw error;
      }
    };

    const draw = async ({ account, game_id, tile_id, colour }: DrawProps) => {
      try {
        return await provider.execute(account, contract_name, "draw", [
          provider.getWorldAddress(),
          game_id,
          tile_id,
          colour,
        ]);
      } catch (error) {
        console.error("Error executing create:", error);
        throw error;
      }
    };
    return { spawn, move, create, draw };
  }
  return {
    actions: actions(),
  };
}
