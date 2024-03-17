use starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde)]
struct Tile {
    #[key]
    game_id: u32,
    #[key]
    tile_id: u32,
    seed: u8,
    colour: felt252
}


#[generate_trait]
impl TileImpl of TileTrait {
    #[inline(always)]
    fn new(game_id: u32, tile_id: u32) -> Tile {
        // [Check] Host is valid
        // assert(!host.is_zero(), errors::Tile_INVALID_HOST);

        Tile { game_id, tile_id, seed: 1, colour: 'white' }
    }
}
