#pragma strict

var connectToIP : String = "127.0.0.1";
var connectPort : int = 25001;


function OnGUI() {

	if (Network.peerType == NetworkPeerType.Disconnected) {
		GUILayout.Label("Connection status: Disconnected");
		
		connectToIP = GUILayout.TextField(connectToIP, GUILayout.MinWidth(100));
		connectPort = parseInt(GUILayout.TextField(connectPort.ToString()));
		
		GUILayout.BeginVertical();
		if (GUILayout.Button ("Connect as client")) {
			Network.Connect(connectToIP, connectPort);
		}
		
		if (GUILayout.Button ("Start Server")) {
			Network.InitializeServer(32, connectPort, false); // No NAT punch-through (needs a facilitator)
		}
		GUILayout.EndVertical();
	} else {
		if (Network.peerType == NetworkPeerType.Connecting) {
			GUILayout.Label("Connection status: Connecting");
		} else if (Network.peerType == NetworkPeerType.Client) {
			GUILayout.Label("Connection status: Client!");
			GUILayout.Label("Ping to server: " + Network.GetAveragePing(Network.connections[0]));
		} else if (Network.peerType == NetworkPeerType.Server) {
			GUILayout.Label("Connection status: Server!");
			GUILayout.Label("Connections: " + Network.connections.length);
			if (Network.connections.length>=1) {
				GUILayout.Label("Ping to first player: " + Network.GetAveragePing(Network.connections[0]));
			}
		}

		if (GUILayout.Button ("Disconnect")) {
			Network.Disconnect(200);
		}
	}
}

// Client functions
function OnConnectedToServer() {
	Debug.Log("This CLIENT has connected to a server");	
	FindObjectOfType(ClientSetup).SetupClient();
}

function OnDisconnectedFromServer(info : NetworkDisconnection) {
	Debug.Log("This SERVER OR CLIENT has disconnected from a server");
	FindObjectOfType(ClientSetup).TeardownClient();
}

function OnFailedToConnect(error: NetworkConnectionError) {
	Debug.Log("Could not connect to server: "+ error);
}

// Server functions
function OnPlayerConnected(player: NetworkPlayer) {
	Debug.Log("Player connected from: " + player.ipAddress +":" + player.port);
}

function OnServerInitialized() {
	Debug.Log("Server initialized and ready");
}

function OnPlayerDisconnected(player: NetworkPlayer) {
	Debug.Log("Player disconnected from: " + player.ipAddress+":" + player.port);
}

// OTHERS:
function OnFailedToConnectToMasterServer(info: NetworkConnectionError) {
	Debug.Log("Could not connect to master server: "+ info);
}

function OnNetworkInstantiate (info : NetworkMessageInfo) {
	Debug.Log("New object instantiated by " + info.sender);
}

function OnSerializeNetworkView(stream : BitStream, info : NetworkMessageInfo) {
}

/*  
 @RPC
 function MyRPCKillMessage(){
	//Looks like I have been killed!
	//Someone send an RPC resulting in this function call
 }
*/
