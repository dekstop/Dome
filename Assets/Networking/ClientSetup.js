#pragma strict

var kinematicObjectGroup : GameObject;

function SetupClient() {
	if (!Network.isClient) {
		Debug.Log("Error: Trying to configure a non-client as client");
		return;
	}
	
	// Make certain objects kinematic
	for (var child in kinematicObjectGroup.transform) {
		var rb : Rigidbody = (child as Transform).GetComponent(Rigidbody);
		if (rb!=null) {
			rb.useGravity = false;
			rb.isKinematic = true;
		}
	}
}

function TeardownClient() {
	if (!Network.isClient) {
		Debug.Log("Error: Trying to tear down a non-client as client");
		return;
	}
	
	// Make certain objects non-kinematic
	for (var child in kinematicObjectGroup.transform) {
		var rb : Rigidbody = (child as Transform).GetComponent(Rigidbody);
		if (rb!=null) {
			rb.useGravity = true;
			rb.isKinematic = false;
		}
	}
}
