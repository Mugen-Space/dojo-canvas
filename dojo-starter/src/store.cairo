use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use dojo_starter::models::game::{Game};
use dojo_starter::models::tile::{Tile};
use dojo_starter::models::lock::{Lock};

#[derive(Drop)]
struct Store {
    world: IWorldDispatcher
}

#[generate_trait]
impl StoreImpl of StoreTrait {
    fn new(world: IWorldDispatcher) -> Store {
        Store { world: world }
    }
    fn game(ref self: Store, id: u32) -> Game {
        get!(self.world, id, (Game))
    }
    fn set_game(ref self: Store, game: Game) {
        set!(self.world, (game));
    }
    fn get_tile(ref self: Store, game_id: u32, tile_id: u32) -> Tile {
        get!(self.world, (game_id, tile_id), (Tile))
    }
    fn set_tile(ref self: Store, tile: Tile) {
        set!(self.world, (tile));
    }
    fn get_lock(ref self: Store, game_id: u32, player: ContractAddress) -> Lock {
        get!(self.world, (game_id, player), (Lock))
    }
    fn set_lock(ref self: Store, lock: Lock) {
        set!(self.world, (lock));
    }
}
