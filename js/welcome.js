
//11.6. - 봉재 - 처음 시작하면 불러오는것을 여기에 추가 
function welcome_list_load()
{
	member_load();
	Unfinished_post_list_load();
}

// 11.6. - 봉재 - 아직 완료되지 않은 Post들을 가져오는것 여기에는 리스트의 개수제한이 없음
function Unfinished_post_list_load(){
	
	var sessionId = sessionStorage.getItem("ase.id");
	var sessionServerAdmin = sessionStorage.getItem("ase.serveradmin");
	var boardOpenPolicy = "PU";
	
	var param = "sessionId="+sessionId+"&sessionServerAdmin="+sessionServerAdmin+"&boardOpenPolicy="+boardOpenPolicy; 
	$.ajax({
        type: "GET",
        url: "http://" + domainText + "/ase_server/board/board_loadunfinishedpostlist.do?",
        callback:"callbak",
        data: param,
		dataType: "jsonp",
		timeout : 5000,
		success:
			function(data){
        	$.each(data, function(k,v){
            	if(k=="success"){
            		var html = '';
            		html += '<tr>';
            		html += '<td width="120">ID</td>';
            		html += '<td width="300">Title</td>';
            		html += '<td width="300">Due Time</td>';
            		html += '</tr>';
               		$.each(v, function(l,m){
            			html += '<tr>'
            			html += '<td width="120" onclick="view_article('+m["boardNumSeq"]+')">'+m["boardWriter"]+'</td>';
                		html += '<td width="300" onclick="view_article('+m["boardNumSeq"]+')">'+m["boardSubject"]+'</td>';
                		html += '<td width="300" onclick="view_article('+m["boardNumSeq"]+')">'+m["boardFinishedTime"]+'</td>';
                		html += '</tr>';
            		});
            		
            		$("#UnfinishedPost").html(html);
            		
            	}

            	if(k=="fail"){
            		html = '<tr>';
            		html += '<td> There is no new post now!</td>';
            		html += '</tr>';
            		$("#UnfinishedPost").html(html);
            		
            	}
        	});
        },
        
        //404에러와 같이 서버응담이 없는경우 실패 alert만 생성하고 현재 페이지에 위치함
        error: function(){
        	alert("Cannot connect to the server");
        }
		
    });
	
}

//11.6. - 봉재 - 리스트 중 하나를 누르면 해당 게시물을 보여주는 페이지로 전환
function view_article(seq){
	location.href="./BoardViewPage.html?seq="+seq;
}

//11.6. - 봉재 - 시스템 정보 페이지로 전환
function moveSystemInfoPage(){
	
	location.href="./SystemInfo.html";
}

//11.6. - 봉재 - 사용자 정보 수정 페이지로 전환
function moveModifyUserInfoPage(){
	location.href="./ModifyUserInfo.html";
}

//11.6. - 봉재 - 새로운 게시물을 등록하는 페이지로 전환
function moveRegisterNewPostPage(){
	location.href="./RegisterNewPost.html";
}

//11.6. - 봉재 - 모든 등록된 게시물로 이동하는 페이지로 전환
function moveListAllPostPage(){
	location.href="./ListAllPost.html";
}
