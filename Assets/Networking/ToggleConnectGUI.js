#pragma strict

var connectDialog : ConnectGUI;

function Update() {
	if (Input.GetKeyDown("n")){
		connectDialog.enabled = !connectDialog.enabled;
	}
}