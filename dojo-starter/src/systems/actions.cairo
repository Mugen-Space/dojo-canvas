// define the interface
use dojo::world::IWorldDispatcher;
use starknet::{ContractAddress, get_caller_address, get_execution_info};

#[starknet::interface]
trait IActions<TContractState> {
    fn spawn(self: @TContractState);
    fn move(self: @TContractState, direction: dojo_starter::models::moves::Direction);
    fn create(self: @TContractState, world: IWorldDispatcher) -> u32;
    fn draw(
        self: @TContractState, world: IWorldDispatcher, game_id: u32, tile_id: u32, colour: felt252
    );
    fn add_player(
        self: @TContractState, world: IWorldDispatcher, player_ip: felt252, name: felt252
    );
}

// dojo decorator
#[dojo::contract]
mod actions {
    use super::IActions;

    use starknet::{ContractAddress, get_caller_address, get_execution_info};
    use dojo_starter::models::{position::{Position, Vec2}, moves::{Moves, Direction}};
    // use dojo::world::IWorldDispatcher;
    use dojo_starter::store::{Store, StoreTrait};
    use dojo_starter::models::game::{Game, GameTrait};
    use dojo_starter::models::tile::{Tile, TileTrait};
    use dojo_starter::models::lock::{Lock, LockTrait, LockAssert};

    use dojo_starter::models::player::{Player, PlayerTrait};

    // declaring custom event struct
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Moved: Moved,
    }

    // declaring custom event struct
    #[derive(Drop, starknet::Event)]
    struct Moved {
        player: ContractAddress,
        direction: Direction
    }

    fn next_position(mut position: Position, direction: Direction) -> Position {
        match direction {
            Direction::None => { return position; },
            Direction::Left => { position.vec.x -= 1; },
            Direction::Right => { position.vec.x += 1; },
            Direction::Up => { position.vec.y -= 1; },
            Direction::Down => { position.vec.y += 1; },
        };
        position
    }


    // impl: implement functions specified in trait
    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        // ContractState is defined by system decorator expansion
        fn spawn(self: @ContractState) {
            // Access the world dispatcher for reading.
            let world = self.world_dispatcher.read();

            // Get the address of the current caller, possibly the player's address.
            let player = get_caller_address();

            // Retrieve the player's current position from the world.
            let position = get!(world, player, (Position));

            // Retrieve the player's move data, e.g., how many moves they have left.
            let moves = get!(world, player, (Moves));

            // Update the world state with the new data.
            // 1. Set players moves to 10
            // 2. Move the player's position 100 units in both the x and y direction.
            set!(
                world,
                (
                    Moves { player, remaining: 100, last_direction: Direction::None },
                    Position { player, vec: Vec2 { x: 10, y: 10 } },
                )
            );
        }

        // Implementation of the move function for the ContractState struct.
        fn move(self: @ContractState, direction: Direction) {
            // Access the world dispatcher for reading.
            let world = self.world_dispatcher.read();

            // Get the address of the current caller, possibly the player's address.
            let player = get_caller_address();

            // Retrieve the player's current position and moves data from the world.
            let (mut position, mut moves) = get!(world, player, (Position, Moves));

            // Deduct one from the player's remaining moves.
            moves.remaining -= 1;

            // Update the last direction the player moved in.
            moves.last_direction = direction;

            // Calculate the player's next position based on the provided direction.
            let next = next_position(position, direction);

            // Update the world state with the new moves data and position.
            set!(world, (moves, next));

            // Emit an event to the world to notify about the player's move.
            emit!(world, Moved { player, direction });
        }

        fn create(self: @ContractState, world: IWorldDispatcher) -> u32 {
            let mut store: Store = StoreTrait::new(world);
            let caller = get_caller_address();
            let game_id = world.uuid();
            let mut game = GameTrait::new(game_id: game_id, host: caller);
            store.set_game(game);
            let mut index: u32 = 100;
            loop {
                if (index == 0) {
                    break;
                }
                let mut tile: Tile = TileTrait::new(game_id, tile_id: index);
                store.set_tile(tile);
                index -= 1;
            };

            game_id
        }
        fn draw(
            self: @ContractState,
            world: IWorldDispatcher,
            game_id: u32,
            tile_id: u32,
            colour: felt252
        ) {
            let mut store: Store = StoreTrait::new(world);
            let mut tile = store.get_tile(game_id, tile_id);
            let caller = get_caller_address();
            let block_info = get_execution_info().unbox().block_info;
            let block_timestamp: u32 = block_info.unbox().block_timestamp.try_into().unwrap();
            let mut lock: Lock = store.get_lock(game_id, caller);
            if (lock.unlock_time == 0) {
                lock = LockTrait::new(game_id, caller, 10 + block_timestamp);
            } else {
                LockAssert::assert_can_paint(lock, block_timestamp);
                lock.unlock_time = 10 + block_timestamp;
            }

            tile.colour = colour;
            store.set_tile(tile);
            store.set_lock(lock);
        }
        fn add_player(
            self: @ContractState, world: IWorldDispatcher, player_ip: felt252, name: felt252
        ) {
            let mut store: Store = StoreTrait::new(world);
            let caller = get_caller_address();
            let mut player = store.get_player(player_ip, player: caller);
            if (player.player.is_zero()) {
                player = PlayerTrait::new(player_ip, player: caller, name: name);
            }
        }
    }
}

