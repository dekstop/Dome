#pragma strict

var playerObject : GameObject;

private var playerController : PlayerController;

function Start() {
	playerController = GameObject.Find("Player/Controller").GetComponent(PlayerController);
}

function Update () {
	if (playerObject==null) {
		return;
	}
	transform.position = playerObject.transform.position;
	transform.up = playerController.GetSurfaceNormal();
}
