// 이거는 백버튼 누를때 어떻게 반응하는지를 나타내는것

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
});  


var validIdcheck = 0;
var wifissid = '';
var domainText = getDomain();	

//취소 버튼 누를시
function previousPage()
{
	location.href="./index.html"
}


function onSuccessCallback(wifi) {

	wifissid = wifi.ssid;
    alert("You are connectted to "+wifissid);
}

 function onErrorCallback(error) {
    alert("Not supported: " + error.message);
}
function get_initial_info(){
	tizen.systeminfo.getPropertyValue("WIFI_NETWORK", onSuccessCallback, onErrorCallback);
	
}
//11.4. 아이디 중복 체크 이후 아이디 텍스트 필드 수정 불가 및 버튼 disabled 기능 추가

function checkUniqueId(){
	
	var param = "userID="+$("#tbRegId").attr("value");	

	// Alert when the ID is null
	if ( $("#tbRegId").val() == "")
	{
		alert("Alert!! Please fill the ID first");
		return false;
	}
	
	// check whether the ID is over 4 characters  
	if ($("#tbRegId").val().length < 4) 
	{
		alert("Alert!! ID must be over 4 characters ");
		return false;
	} 
	// Server communication! 
	$.ajax({
        type: "POST",
        url: "http://" + domainText + "/ase_server/user/user_checkUniqueId.do",
        callback:"callbak",
		dataType: "jsonp",
		data:param,	
		timeout:4000,
		//when Success to check, the ID input box is disable and the button is disabled 
		success:
			function(data){
        	$.each(data, function(k,v){
            	if(k=="success"){
            		alert("You can use this ID!! Thanks!");
            		validIdcheck = validIdcheck + 1;
            	    $("#btnIDCheck").attr("disabled", true);
            		$("#tbRegId").attr("readonly", true);
            	}
            	
            	// 동일한 ID가 있는 경우
            	if(k=="fail"){
            		alert("Alert! Your Id is already used. Please rewrite your ID .");
            	}
        	});
        },
        
        //404에러와 같이 서버응담이 없는경우 실패 alert만 생성하고 현재 페이지에 위치함
        error: function(){
        	alert("Can not connect to server!!");
        }
		
    });
    return false;
	
}


var reg_pwd = /^.*(?=.{8,16})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
var reg_phone = /^((01[1|6|7|8|9])[1-9]+[0-9]{6,7})|(010[1-9][0-9]{7})$/;


//회원가입처리
//11.3. 아이디 중복 체크 기능 수행여부 추가(전역변수) 

function registerComplete(){
	
	var birthdate = $("#Birthdate").val();
	var passwd = $("#tbRegPassword1").val();

	if (validIdcheck == 0)
	{
		alert("Alert!!! Please check the Id unique check!!");
		return false;
	}
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
	
	if ( $("#tbRegName").val() == "")
	{
		alert("Alert!! Please fill the name field!!");
		return false;
	} 
	
	var phone = $("#tbRegCellPhone").val();
	if(!reg_phone.test(phone)){
		alert("Alert!! please put the correct Cell Phone Number.");
		return false;
	}
	
	var privilege = $(':radio[name="privilege-choice"]:checked').val();
	
	if(privilege == 2){
		if($("#tbRegServerAdmin").val() != ""){
			alert("Alert!! please leave this box with blank!!")
			return false;
		}
		$("#tbRegServerAdmin").val($("#tbRegId").val());
	}
	
		
	var param = "userID="+$("#tbRegId").attr("value")
	+"&userPassword="+$("#tbRegPassword1").attr("value")
	+"&userName="+$("#tbRegName").attr("value")
	+"&userPhoneNumber="+$("#tbRegCellPhone").attr("value")
	+"&userBirthdate="+$("#Birthdate").attr("value")
	+"&userPrivilege="+privilege
	+"&userServerAdmin="+$("#tbRegServerAdmin").attr("value");
	
	
	$.ajax({
        type: "POST",
        url: "http://" + domainText + "/ase_server/user/user_registration.do",
        callback:"callbak",
		dataType: "jsonp",
		data:param,	
		timeout : 4000,
		//성공하면 성공 메시지가 뜨고 /success로 이동하고, 실패하면, 처음부터 다시임
		success:
			function(data){
        	$.each(data, function(k,v){
            	if(k=="success"){
            		alert("Success to register user!!");
            		
  
            		location.href="#three"
            	}
            	
            	if(k=="fail"){
            		alert("Fail to user registration!! Please try again!!");
            	}
        	});
        },
        
        //404에러와 같이 서버응담이 없는경우 실패 alert만 생성하고 현재 페이지에 위치함
        error: function(){
        	alert("Can not connect to server!!");
        }
		
    });
    return false;
}


// 11.3 로그인 로직 처리


 
 function login(userId, passwd){

	var params = "userID="+userId+"&userPassword="+passwd+ "&userSSID=" + wifissid;
	$.ajax({
        type: "POST",
        url: "http://"+domainText+"/ase_server/user/login.do",
        callback: "callbak",
		dataType: "jsonp",
		data:params,
		timeout : 4000,
        error: function(){
        	alert("Can not connect to server!!");
        }, 
		success: function(data){
        	$.each(data, function(k,v){
        		console.log(data)
            	if(k=="success"){
            		sessionStorage.setItem("ase.id", v["userID"]);
					sessionStorage.setItem("ase.seq", v["userSeq"]);
					sessionStorage.setItem("ase.ssid", v["userSSID"]);
					sessionStorage.setItem("ase.serveradmin", v["userServerAdmin"]);
            		location.href="./src/welcome.html";
            	}
            	
            	if(k=="fail"){
            		alert("Fail to Login : check ID, Password, Confirmed");
            		$("#tbLoginId").val("");
            		$("#tbLoginPassword").val("");
            	}
        		
        	});
        }

    });
	
}

// 로그인 로직 처리전 로그인 ID와 Password 확인 
function check()
{
	var id = $("#tbLoginId").attr("value");
	var passwd = $("#tbLoginPassword").attr("value");
	
	if(id == "")
	{
    	alert("Please fill in the ID text box.");
 		$("#tbLoginId").focus();
 		
 		return false;
	}
	
	if(passwd == "")
	{
	    alert("Please fill in the Password text box.");
		$("#tbLoginPassword").focus();
		
		return false;
	}

	login(id, passwd);
	
}




function user_modify_load()
{
	member_load();
	
	
	var param = "userID="+sessionStorage.getItem("secure.id");
	
	$.ajax({
        type: "POST",
        url: "http://" + domainText + "/ase_server/user/getUserInfo.do",
        callback:"callbak",
		dataType: "jsonp",
		data:param,	
		//성공하면 성공 메시지가 뜨고 /success로 이동하고, 실패하면, 처음부터 다시임
		success:
			function(data){
        	$.each(data, function(k,v){
            	if(k=="success"){
            		console.log(v);
            		$("#tbUserID").val(v["userID"]);
            		$("#tbUserName").val(v["userName"]);
            		$("#tbEmail1").val(v["userEmail1"]);
            		$("#tbEmail2").val(v["userEmail2"]);
            		$("#tbMobil").val(v["userPhoneNumber"]);
            		$("#tbAddress").val(v["userAddress"]);
            		
            		$("#tbUserID").attr("readonly","true");
            	}
            	
            	if(k=="fail"){
            		alert("사용자 정보를 가져오지 못하였습니다. 잠시 후 다시 이용해주세요.");
            		location.href="main.html";
            	}
        	});
        },
        
        //404에러와 같이 서버응담이 없는경우 실패 alert만 생성하고 현재 페이지에 위치함
        error: function(){
        	alert("실패");
        }
		
    });
}


function userInfoUpdate() {
	// 필수 항목 기입 여부 점검

	if ($("#tbPassWord1").val().length < 8) 
	{
		alert("입력값 오류! 비밀번호는 영문, 숫자, 기호를 혼합하여 8자 이상 16자 이하로 만들어주세요.");
		return false;
	}

	var passwd = $("#tbPassWord1").val();
	
	if(!reg_pwd.test(passwd)){
		alert("입력값 오류! 비밀번호는 영문, 숫자, 기호를 혼합하여 8자 이상 16자 이하로 만들어주세요.");
		return false;
	}


	if ($("#tbPassWord1").val() != $("#tbPassWord2").val()) {
		alert("입력값 오류! 입력하신 비밀번호가 다릅니다.");
		return false;
	}
	
	var email = $("#tbEmail1").val() + "@" + $("#tbEmail2").val() ;
	if(!reg_email.test(email)){
		alert("입력값 오류! 이메일을 정확히 입력해주세요.");
		return false;
	}

	var phone = $("#tbMobil").val();
	if(!reg_phone.test(phone)){
		alert("입력값 오류! 휴대전화번호를 입력해주세요.");
		return false;
	}
	
	
	// 전송 메시지 생성:registration.do 서블릿을 확인하여 userController로 ajax로 작성된 JSON 메시지 전송
	// 10.08. POST로 타입 변경
	// 10.09 POST 로 타입 변경후 var 선언 부분 조정
	
	var param = "userID="+$("#tbUserID").attr("value")+"&userPassword="+$("#tbPassWord1").attr("value")
	+"&userEmail1="+$("#tbEmail1").attr("value")+"&userEmail2="+$("#tbEmail2").attr("value")
	+"&userPhoneNumber="+$("#tbMobil").attr("value")+"&userAddress="+$("#tbAddress").attr("value");
	
	
	$.ajax({
        type: "POST",
        url: "http://" + domainText + "/secure_server/user/updateUserInfo.do",
        callback:"callbak",
		dataType: "jsonp",
		data:param,	

		//성공하면 성공 메시지가 뜨고 /success로 이동하고, 실패하면, 처음부터 다시임
		success:
			function(data){
        	$.each(data, function(k,v){
            	if(k=="success"){
            		alert("수정 되었습니다.");
            		location.href="./main.html"
            	}
            	
            	if(k=="fail"){
            		alert("수정에 실패하였습니다. 잠시 후 다시 이용해 주세요.");
            	}
        	});
        },
        
        //404에러와 같이 서버응담이 없는경우 실패 alert만 생성하고 현재 페이지에 위치함
        error: function(){
        	alert("서버가 연결되어 있지 않습니다.");
        }
		
    });
    return false;
}


function user_registration_load()
{
	member_load();
}






