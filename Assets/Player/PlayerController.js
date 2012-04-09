#pragma strict

// The camera is considered part of the player controls since
// control forces are applied relative to the current viewpoint
// and angle.

var accelleration : float = 10.0;
var lateralForce : float = 15.0;

var flowSpeedupMultiplier : float = 1.1; // Slow steady speedup until player collision
var flowSpeedup : float = 1.0;
private var maxFlowSpeedup : float = 2;
var keySpeedupMultiplier : float = 3.0; // Shift key speedup

var cameraDamping : float = 0.1; // [0..1]

var minCameraDistance : float = 10.0;
var speedCameraDistance : float = 0.05; // Increase in distance over speed
var minFieldOfView = 45; // Increase in FOV over speed
var maxFieldOfView = 90;

var playerObject : GameObject;
var cameraObject : Camera;
var companionObject : GameObject;

var spawnCenter : Vector3 = new Vector3(0, 85, 0);
var spawnRadius : float = 85;

private var surfaceNormal : Vector3 = Vector3.up;

function Start() {
	// Random spawn location	
	playerObject.transform.position = spawnCenter + 
		Quaternion.Euler(Random.value * 360, Random.value * 360, Random.value * 360) *
		new Vector3(spawnRadius, 0, 0);
//	playerObject.GetComponent(Rigidbody).freezeRotation = true;
}

function Update () {
	var velocity : Vector3 = playerObject.GetComponent(Rigidbody).velocity;
	
	// Handle application keys
	if (Input.GetKeyDown(KeyCode.Escape)) {
		Application.Quit();
	}
	if (Input.GetKeyDown(KeyCode.Space)) {
		Application.LoadLevel(0);
	}
	
	// Handle player controls
	var force : Vector3 = flowSpeedup *
		lateralForce * cameraObject.transform.right * Input.GetAxis("Horizontal") +
		accelleration * cameraObject.transform.forward * Input.GetAxis("Vertical");
	if (Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift)) {
		force *= keySpeedupMultiplier;
	}
	if (force.magnitude > 0) { // Accellerating?
		flowSpeedup = Mathf.Min(
			flowSpeedup * Mathf.Lerp(1.0, flowSpeedupMultiplier, Time.deltaTime), 
			maxFlowSpeedup);
		// this will be reset by player collision
	}
	playerObject.GetComponent(Rigidbody).AddForce(force);
	
	// Update companion object
	companionObject.transform.position = playerObject.transform.position;
	companionObject.transform.up = surfaceNormal;

	// Update camera
	var targetFieldOfView : float = Mathf.Min(maxFieldOfView, 
		minFieldOfView + velocity.magnitude / 100 * (maxFieldOfView - minFieldOfView));
	var fieldOfView : float = 
		Mathf.Lerp(
			cameraObject.fieldOfView, 
			targetFieldOfView, 
			Time.deltaTime * (1.0 - cameraDamping)); // parametrised damping
	
	var targetCameraDistance = minCameraDistance + 
		velocity.magnitude * speedCameraDistance; // increase camera distance with speed
		
	var targetCameraPosition : Vector3 = // new target camera position
		playerObject.transform.position - 
		targetCameraDistance * velocity.normalized +
		surfaceNormal * 3;
		
	var cameraPos : Vector3 =
		Vector3.Lerp(
			cameraObject.transform.position, 
			targetCameraPosition, 
			Time.deltaTime * (1.0 - cameraDamping)); // parametrised damping
	var cameraTarget : Vector3 =
		Vector3.Lerp(
			cameraObject.transform.forward, 
			playerObject.transform.position,// + surfaceNormal * 5, 
			Time.deltaTime * 100); // fixed damping
	var cameraUp : Vector3 = 
		Vector3.Lerp(
			cameraObject.transform.up, 
			surfaceNormal, 
			Time.deltaTime * (1.0 - cameraDamping)); // parametrised damping

	cameraObject.fieldOfView = fieldOfView;
	cameraObject.transform.position = cameraPos;
	cameraObject.transform.LookAt(cameraTarget, cameraUp);
}

function SetSurfaceNormal(surfaceNormal : Vector3) {
	this.surfaceNormal = surfaceNormal;
}

function PlayerCollision(collision : Collision) {
	flowSpeedup = 1.0;
}