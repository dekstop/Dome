#pragma strict

var connectDialog : ConnectUI;

function Update() {
	if (Input.GetKeyDown("n")){
		connectDialog.enabled = !connectDialog.enabled;
	}
}