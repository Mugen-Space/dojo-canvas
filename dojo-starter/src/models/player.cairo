use starknet::ContractAddress;


#[derive(Model, Copy, Drop, Serde)]
struct Player {
    #[key]
    player_ip: felt252,
    #[key]
    player: ContractAddress,
    name: felt252
}
mod errors {
    const GAME_NOT_HOST: felt252 = 'Game: user is not the host';
    const GAME_IS_HOST: felt252 = 'Game: user is the host';
    const GAME_TRANSFER_SAME_HOST: felt252 = 'Game: transfer to the same host';
    const GAME_TOO_MANY_PLAYERS: felt252 = 'Game: too many players';
    const GAME_TOO_FEW_PLAYERS: felt252 = 'Game: too few players';
    const GAME_IS_FULL: felt252 = 'Game: is full';
    const GAME_NOT_FULL: felt252 = 'Game: not full';
    const GAME_IS_EMPTY: felt252 = 'Game: is empty';
    const GAME_NOT_ONLY_ONE: felt252 = 'Game: not only one';
    const GAME_IS_OVER: felt252 = 'Game: is over';
    const GAME_NOT_OVER: felt252 = 'Game: not over';
    const GAME_NOT_STARTED: felt252 = 'Game: not started';
    const GAME_HAS_STARTED: felt252 = 'Game: has started';
    const GAME_NOT_EXISTS: felt252 = 'Game: does not exist';
    const GAME_DOES_EXIST: felt252 = 'Game: does exist';
    const GAME_INVALID_HOST: felt252 = 'Game: invalid host';
}

#[generate_trait]
impl PlayerImpl of PlayerTrait {
    #[inline(always)]
    fn new(player_ip: felt252, player: ContractAddress, name: felt252) -> Player {
        // [Check] Host is valid
        assert(!player.is_zero(), errors::GAME_INVALID_HOST);

        Player { player_ip, player, name }
    }
}

