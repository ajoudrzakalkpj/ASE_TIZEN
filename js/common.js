function getDomain(){
	return "210.107.198.173:8080";
}

var domainText = getDomain();	

function check_session(){
	var sessionId = sessionStorage.getItem("ase.id");
	var sessionSeq = sessionStorage.getItem("ase.seq");
	var sessionSSID = sessionStorage.getItem("ase.ssid");
	var sessionServerAdmin = sessionStorage.getItem("ase.serveradmin");
	if(sessionId == null)
		return "NM";
	else
		return "TM";
}

(function($) {
    $.fn.invisible = function() {
        return this.each(function() {
            $(this).css("display", "none");
        });
    };
    $.fn.visible = function() {
        return this.each(function() {
            $(this).css("visibility", "visible");
        });
    };
}(jQuery));


function member_load(){
	var tmp = check_session();
	if (tmp== "TM"){
		$("#tbIdentifyUser").text(sessionStorage.getItem("ase.id"));
		$("#tbIdentifyServerAdmin").text(sessionStorage.getItem("ase.serveradmin"));
		$("#tbIdentifySSID").text(sessionStorage.getItem("ase.ssid"));
	} else {
		tizen.application.getCurrentApplication().exit();
	}
	
	
}

function system_admin_check(){
	var sessionid =sessionStorage.getItem("ase.id");
	var sessionserveradmin =sessionStorage.getItem("ase.serveradmin"); 
	if (sessionid === sessionserveradmin){
		
	} else{
		alert("You are not system administartor! Automatically go back welcome page!");
		location.href="./welcome.html";
	}
}


function logout(){
	sessionStorage.removeItem("ase.id");
	sessionStorage.removeItem("ase.seq");
	location.href="main.html";

}

function getUrlSeq(){
	var url      = window.location.href; 
	var tmpArr = url.split("?");
	var tmp1Arr = tmpArr[1].split("=");
	var seq = tmp1Arr[1];
	
	return seq;
}