#pragma strict

// We're only regarding the first point of contact.

var playerController : PlayerController;

function OnCollisionEnter(collisionInfo : Collision) {
	if (collisionInfo.gameObject.tag=="Surface") {
		playerController.SetSurfaceNormal(AverageNormal(collisionInfo.contacts)); 
	} else if (collisionInfo.gameObject.tag=="Player") {
		playerController.PlayerCollision(collisionInfo);
	}
}

function OnCollisionStay(collisionInfo : Collision) {
	if (collisionInfo.gameObject.tag=="Surface") {
		playerController.SetSurfaceNormal(AverageNormal(collisionInfo.contacts));
	}
}

//function OnCollisionExit(collisionInfo : Collision) {
//	if (collisionInfo.gameObject.tag=="Surface") {
//		playerController.SetSurfaceNormal(Vector3.up);
//	}
//}

function AverageNormal(contacts : ContactPoint[]) {
	var sum : Vector3 = Vector3.zero;
	var num : int = 0;
	for (var contact : ContactPoint in contacts) {
		sum += contact.normal;
		num++;
	}
	return sum / num;
}