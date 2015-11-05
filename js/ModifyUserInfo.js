( function () {
    window.addEventListener( 'tizenhwkey', function( ev ) {
        if( ev.keyName === "back" ) {
            var activePopup = document.querySelector( '.ui-popup-active' ),
                page = document.getElementsByClassName( 'ui-page-active' )[0],
                pageid = page ? page.id : "";

            if( pageid === "one" && !activePopup ) {
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch (ignore) {
                }
            } else {
                window.history.back();
            }
        }
    } );
} () );
   
function previousPage()
{
	location.href="./welcome.html"
}

function get_usermodification_info(){
	member_load();
	
	var param = "userID="+sessionStorage.getItem("ase.id");
	
	$.ajax({
        type: "POST",
        url: "http://" + domainText + "/ase_server/user/getUserInfo.do",
        callback:"callbak",
		dataType: "jsonp",
		data:param,	
		success:
			function(data){
        	$.each(data, function(k,v){
            	if(k=="success"){
            		$("#tbRegCellPhone").val(v["userCellPhone"]);
            		$("#tbRegServerAdmin").val(v["userServerAdmin"]);
            		if (v["userprivilege"]==2){
            			$("#tbRegServerAdmin").attr("readonly",true);
            		}
            	}
            	
            	if(k=="fail"){
            		alert("Fail to bring user information.");
            		
            	}
        	});
        },
        //404에러와 같이 서버응담이 없는경우 실패 alert만 생성하고 현재 페이지에 위치함
        error: function(){
        	alert("Cannot connect to the server!!");
        }
    });
}

function updateComplete(){

	var reg_pwd = /^.*(?=.{8,16})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
	var reg_phone = /^((01[1|6|7|8|9])[1-9]+[0-9]{6,7})|(010[1-9][0-9]{7})$/;
	var passwd = $("#tbRegPassword1").val();
	
	if(!reg_pwd.test(passwd)){
		alert("Alert!! Password must be over 8character and under 16 characters mixing character, number, and symbols!");
		return false;
	}
	
	if ($("#tbRegPassword2").val() == "") {
		alert("Alert! Please fill in the password for confirm your password.");
		return false;
	}

	if ($("#tbRegPassword1").val() != $("#tbRegPassword2").val()) {
		alert("Alert! Passwords are not correspond with each other.");
		return false;
	}
	
	var phone = $("#tbRegCellPhone").val();
	if(!reg_phone.test(phone)){
		alert("Alert!! please put the correct Cell Phone Number.");
		return false;
	}
	
	
	
	// 전송 메시지 생성:registration.do 서블릿을 확인하여 userController로 ajax로 작성된 JSON 메시지 전송
	// 10.08. POST로 타입 변경
	// 10.09 POST 로 타입 변경후 var 선언 부분 조정
	
	var param = "userID="+sessionStorage.getItem("ase.id")
	+"&userPassword="+$("#tbRegPassword1").attr("value")
	+"&userPhoneNumber="+$("#tbRegCellPhone").attr("value")
	+"&userServerAdmin="+$("#tbRegServerAdmin").attr("value");
	
	
	$.ajax({
        type: "POST",
        url: "http://" + domainText + "/ase_server/user/updateUserInfo.do",
        callback:"callbak",
		dataType: "jsonp",
		data:param,	

		//성공하면 성공 메시지가 뜨고 /success로 이동하고, 실패하면, 처음부터 다시임
		success:
			function(data){
        	$.each(data, function(k,v){
            	if(k=="success"){
            		location.href="#three"
            	}
            	
            	if(k=="fail"){
            		alert("User information is not updated. Please retry it again.");
            	}
        	});
        },
        
        //404에러와 같이 서버응담이 없는경우 실패 alert만 생성하고 현재 페이지에 위치함
        error: function(){
        	alert("Cannot connect to server.");
        }
		
    });
    return false;
	
	
	
}
