#pragma strict

// The camera is considered part of the player controls since
// control forces are applied relative to the current viewpoint
// and angle.

var accelleration : float = 10.0;
var lateralForce : float = 15.0;

var flowSpeedupMultiplier : float = 1.1; // Slow steady speedup until player collision
var flowSpeedup : float = 1.0;
private var maxFlowSpeedup : float = 2;
var keySpeedupMultiplier : float = 2.0; // Shift key speedup

var cameraDamping : float = 0.1; // [0..1]

var minCameraDistance : float = 10.0;
var speedCameraDistance : float = 0.1; // Increase in distance over speed
var minFieldOfView = 45; // Increase in FOV over speed
var maxFieldOfView = 90;

// camera shake
var camShakeIntensity = 0.1;
var camShakeDecay = 0.002;
private var curCamShakeIntensity : float;
private var curCamShakeDecay : float;

var playerObject : GameObject;
var cameraObject : Camera;

var spawnCenter : Vector3 = new Vector3(0, 85, 0);
var spawnRadius : float = 84;

private var surfaceNormal : Vector3 = Vector3.up;

function Start() {
	// Random spawn location	
	playerObject.transform.position = spawnCenter + 
		Quaternion.Euler(Random.value * 360, Random.value * 360, Random.value * 360) *
		new Vector3(spawnRadius, 0, 0);
//	playerObject.GetComponent(Rigidbody).freezeRotation = true;
}

function Update () {
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
	
	// Update camera
	CameraUpdate();
}

function SetSurfaceNormal(surfaceNormal : Vector3) {
	this.surfaceNormal = surfaceNormal;
}

function GetSurfaceNormal() : Vector3 {
	return surfaceNormal;
}

// Collided with another ball
function PlayerCollision(collision : Collision) {
	flowSpeedup = 1.0;
	Shake(Mathf.Min(1, collision.relativeVelocity.magnitude / 50.0));
}

// strength: 0..1
function Shake(strength : float) {
	curCamShakeIntensity = camShakeIntensity * strength;
	curCamShakeDecay = camShakeDecay;
}

function CameraUpdate() {
	var velocity : Vector3 = playerObject.GetComponent(Rigidbody).velocity;
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
	
	var shakePosition = Vector3.zero;
	var shakeUpVector = Vector3.zero;
	if (curCamShakeIntensity >= 0.0001){
    	shakePosition = Random.insideUnitSphere * curCamShakeIntensity;
        shakeUpVector = Random.insideUnitSphere * curCamShakeIntensity;
        curCamShakeIntensity -= curCamShakeDecay;
    }
		
	var cameraPos : Vector3 =
		shakePosition +
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
		shakeUpVector + 
		Vector3.Lerp(
			cameraObject.transform.up, 
			surfaceNormal, 
			Time.deltaTime * (1.0 - cameraDamping)); // parametrised damping

	cameraObject.fieldOfView = fieldOfView;
	cameraObject.transform.position = cameraPos;
	cameraObject.transform.LookAt(cameraTarget, cameraUp);
}
