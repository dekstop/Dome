#pragma strict

var minHitVelocity = 40.0;
var growthRate = 1.01;
var growthAccel = 1.2;
var maxGrowth = 15.0;

private var wasHit = false;
private var initialScale : float;
private var scale : float;
private var curGrowthRate : float;

private var playerController : PlayerController;

function Start() {
	playerController = GameObject.Find("Player/Controller").GetComponent(PlayerController);
}

function Update () {
	if (wasHit) {
		transform.localScale = Vector3.one * scale;
	    scale += curGrowthRate * Time.deltaTime;
	    curGrowthRate *= growthAccel;
		if ((scale/initialScale) > maxGrowth) {
			gameObject.active = false;
		}
	}
}

function OnCollisionEnter(collision : Collision) {
	if (collision.gameObject.tag == "Player") {
		if (collision.relativeVelocity.magnitude >= minHitVelocity) {
    		wasHit = true;
    		scale = initialScale = transform.localScale.x;
    		curGrowthRate = growthRate;
//    		gameObject.GetComponent(Rigidbody).isKinematic = true;
//    		gameObject.GetComponent(SphereCollider).enabled = false;
		}
	}
}

function OnCollisionStay(collision : Collision) {
}

function OnCollisionExit(collision : Collision) {
}
