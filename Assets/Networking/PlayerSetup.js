#pragma strict

var localPlayer : GameObject;
var playerPrefab : GameObject;
var playerController : PlayerController;

private var netPlayer : GameObject;

function Setup() {
	// Hide non-networked player object
	localPlayer.SetActiveRecursively(false);

	// Instantiate networked object
	netPlayer = Network.Instantiate(playerPrefab, 
		localPlayer.transform.position, localPlayer.transform.rotation, 0);
	playerController.SetPlayerObject(netPlayer);
}

function Teardown() {
	// Restore non-networked player object
	localPlayer.transform.position = netPlayer.transform.position;
	localPlayer.transform.rotation = netPlayer.transform.rotation;

	playerController.SetPlayerObject(localPlayer);
	localPlayer.SetActiveRecursively(true);

	netPlayer.SetActiveRecursively(false);
//	Network.Destroy(netPlayer); // Doesn't work if we're already disconnected
	Destroy(netPlayer);
//	Network.DestroyPlayerObjects(player);
}
