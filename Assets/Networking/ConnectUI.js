#pragma strict

var connectToIP : String = "127.0.0.1";
var connectPort : int = 25001;

var netController : NetworkController;

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
			netController.BeforeNetworkDisconnect();
			Network.Disconnect(200);
		}
	}
}
