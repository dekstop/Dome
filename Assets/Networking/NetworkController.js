#pragma strict

//
// Event Handling
//

// Server

function OnServerInitialized() {
	Debug.Log("Server is initialized.");
	FindObjectOfType(PlayerSetup).Setup();
}

function OnPlayerConnected(player : NetworkPlayer) {
	Debug.Log("Player " + player + " joined.");
}

function OnPlayerDisconnected(player : NetworkPlayer) {
	Debug.Log("Player " + player + " disconnected.");
	Network.RemoveRPCs(player);
	Network.DestroyPlayerObjects(player);
}

// Client

function OnConnectedToServer() {
	Debug.Log("Connected.");
	FindObjectOfType(ClientSetup).Setup();
	FindObjectOfType(PlayerSetup).Setup();
}

function OnFailedToConnect(error : NetworkConnectionError) {
	Debug.Log("Could not connect to server: " + error);
}

// Both

function OnNetworkInstantiate(info : NetworkMessageInfo) {
	Debug.Log("New object instantiated by " + info.sender);
}

function OnDisconnectedFromServer(info : NetworkDisconnection) {
	Debug.Log("Disconnected.");

	// Trying to avoid this, would rather just continue...
	// But all attempts to clean up phantom players failed.
	Application.LoadLevel(Application.loadedLevel); 

	// Find all player instances of other players and remove them
//	do {
//		var obj = GameObject.Find("PlayerObject(Clone)");
//		if (obj!=null) {
//			var nv : NetworkView = obj.GetComponent(NetworkView);
//			if (nv!=null && !nv.isMine) {
//				Debug.Log("Destroying " + obj + " which wasn't cleaned up properly.");
//				Network.DestroyPlayerObjects(nv.owner);
//			}
//			//Destroy(obj);
//		}
//	} while (obj!=null);

//	for (var nv : NetworkView in FindObjectsOfType(NetworkView)) {
//		if (nv!=null && !nv.isMine) {
//			Debug.Log("Removing " + nv.observed.gameObject + " which is attached to " + nv);
//			Destroy(nv.observed.gameObject);
//		}
//	}
//	Network.RemoveRPCs(Network.player);
//	Network.DestroyPlayerObjects(Network.player); // This is too destructive for our setup
}

//
// UI Hooks
//

function BeforeNetworkDisconnect() {
	// Now redundant since we're reloading the scene anyway, see above. 
//	FindObjectOfType(PlayerSetup).Teardown();
//	if (Network.isClient) {
//		FindObjectOfType(ClientSetup).Teardown();
//	}
}
