import * as Cfx from "fivem-js";

const RESPONSE_OK = { status: "ok" };

let nuiActive = false;

RegisterNuiCallbackType("spawnCar");
on(`__cfx_nui:spawnCar`, async (data: {model: string}, cb: any) => {
    const playerCoords = Cfx.Game.PlayerPed.Position;
    const vehicle = await Cfx.World.createVehicle(new Cfx.Model(data.model), playerCoords, 4);
    Cfx.Game.PlayerPed.setIntoVehicle(vehicle, Cfx.VehicleSeat.Driver);
    // notify nui about spawned car
    SendNuiMessage(JSON.stringify({ type: "notification", message: `Spawned car: "${data.model}"`}))
    cb(RESPONSE_OK);
});

function toggleNUI(): void {
    nuiActive = !nuiActive;
    SetNuiFocus(nuiActive, nuiActive);
    SetNuiFocusKeepInput(nuiActive);
}

setTick(() => {
    if (IsControlPressed(0, 244)) {
        toggleNUI();
    }
    if (nuiActive) {
        // LookLeftRight
        DisableControlAction(0, 1, nuiActive);
        // LookUpDown
        DisableControlAction(0, 2, nuiActive);
        // MeleeAttackAlternate
        DisableControlAction(0, 142, nuiActive);
        // VehicleMouseControlOverride
        DisableControlAction(0, 106, nuiActive);
    }
})

function wait(ms: number) {
    new Promise(res => setTimeout(res, ms));
}
async function spawnCar(model: string) {

    const hash = GetHashKey(model);

      // Request the model and wait until the game has loaded it
      RequestModel(hash);
      while (!HasModelLoaded(hash))
      {
          await wait(500);
      }
  
      const ped = PlayerPedId();
  
      // Get the coordinates of the player's Ped (their character)
      //@ts-ignore
      const coords = GetEntityCoords(ped);
      //const vector = new Vector3(
      //    coords[0],
      //    coords[1],
      //    coords[2]
      //);

      //const modelFivemJs = new fivemjs.Model(hash);
      //const vehicle = fivemjs.World.createVehicle(modelFivemJs, vector, GetEntityHeading(ped));
  
      // Create a vehicle at the player's position
      const vehicle = CreateVehicle(hash, coords[0], coords[1], coords[2], GetEntityHeading(ped), true, false);
  
      // Set the player into the drivers seat of the vehicle
      SetPedIntoVehicle(ped, vehicle, -1);
  
      // Allow the game engine to clean up the vehicle and model if needed
      SetEntityAsNoLongerNeeded(vehicle);
      SetModelAsNoLongerNeeded(model);
  
      // Tell the player the car spawned
      emit('chat:addMessage', {
          args: [`Woohoo! Enjoy your new ^*${model}!`]
      });
}

RegisterNuiCallbackType('button:spawnCar');
on('__cfx_nui:button:spawnCar', async(data: any) => {
    if (data.model === 'adder') {
        spawnCar('adder');
    }
    if (data.model === 't20') {
        spawnCar('t20');
    }
});
