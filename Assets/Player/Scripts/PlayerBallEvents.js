#pragma strict

private var playerController : PlayerController;

function Start() {
	playerController = GameObject.Find("Player/Controller").GetComponent(PlayerController);
}

function OnCollisionEnter(collision : Collision) {
	if (collision.gameObject.tag=="Surface") {
		playerController.SetSurfaceNormal(AverageNormal(collision.contacts)); 
	} else if (collision.gameObject.tag=="Ball") {
		playerController.PlayerCollision(collision);
	}
}

function OnCollisionStay(collision : Collision) {
	if (collision.gameObject.tag=="Surface") {
		playerController.SetSurfaceNormal(AverageNormal(collision.contacts));
	}
}

//function OnCollisionExit(collision : Collision) {
//	if (collision.gameObject.tag=="Surface") {
//		playerController.SetSurfaceNormal(Vector3.up);
//	}
//}


private function AverageNormal(contacts : ContactPoint[]) {
	var sum : Vector3 = Vector3.zero;
	var num : int = 0;
	for (var contact : ContactPoint in contacts) {
		sum += contact.normal;
		num++;
	}
	return sum / num;
}