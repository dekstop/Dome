#pragma strict

private var playerController : PlayerController;

function Start() {
	playerController = GameObject.Find("Player/Controller").GetComponent(PlayerController);
}

function OnCollisionEnter(collisionInfo : Collision) {
	if (IsNetworked() && !networkView.isMine) {
		return;
	}
	if (collisionInfo.gameObject.tag=="Surface") {
		playerController.SetSurfaceNormal(AverageNormal(collisionInfo.contacts)); 
	} else if (collisionInfo.gameObject.tag=="Player") {
		playerController.PlayerCollision(collisionInfo);
	}
}

function OnCollisionStay(collisionInfo : Collision) {
	if (IsNetworked() && !networkView.isMine) {
		return;
	}
	if (collisionInfo.gameObject.tag=="Surface") {
		playerController.SetSurfaceNormal(AverageNormal(collisionInfo.contacts));
	}
}

//function OnCollisionExit(collisionInfo : Collision) {
//	if (collisionInfo.gameObject.tag=="Surface") {
//		playerController.SetSurfaceNormal(Vector3.up);
//	}
//}

// Running in local or networked mode?
private function IsNetworked() {
	return Network.isServer || Network.isClient;
}

private function AverageNormal(contacts : ContactPoint[]) {
	var sum : Vector3 = Vector3.zero;
	var num : int = 0;
	for (var contact : ContactPoint in contacts) {
		sum += contact.normal;
		num++;
	}
	return sum / num;
}