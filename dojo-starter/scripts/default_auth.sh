#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

export RPC_URL="https://api.cartridge.gg/x/dojo-canvas/katana";

export WORLD_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.world.address')

export ACTIONS_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.contracts[] | select(.name == "dojo_starter::systems::actions::actions" ).address')

echo "---------------------------------------------------------------------------"
echo world : $WORLD_ADDRESS 
echo " "
echo actions : $ACTIONS_ADDRESS
echo "---------------------------------------------------------------------------"

# enable system -> component authorizations
COMPONENTS=("Position" "Moves" "Game" "Tile" "Lock" "Player")

for component in ${COMPONENTS[@]}; do
    sozo auth writer $component $ACTIONS_ADDRESS --world $WORLD_ADDRESS --rpc-url $RPC_URL
    # time out for 1 second to avoid rate limiting
    sleep 1
done

echo "Default authorizations have been successfully set."