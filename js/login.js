$(document).ready(function(){
    var userStr = localStorage.getItem("user");
    if(userStr != null && userStr != ""){
        var user = JSON.parse(userStr);
        var loginDate = new Date(user.date);
        var nowDate = new Date();
        if(nowDate < loginDate){
            jump(user);
        }
    }



    $(".login .loginButton").click(function(){
        var email = $(".email").val();
        var password = $(".password").val();
       
        $.ajax({
            type:"POST",
            url:"http://localhost:8080/SunshineAirlines/login",
            data:"email="+email+"&password="+password,
            success:function(msg){
                var json = JSON.parse(msg);
               
                if(json.flag != "success"){
                    $(".alertInfo").text(json.data);
                }else{
                    //判断七天登陆复选框是否勾选
                    if($(".is7day").is(":checked")){
                        var user = json.data;
                        var deadLine = new Date()
                        console.log(deadLine);
                        deadLine.setDate(deadLine.getDate()+7);
                        console.log(deadLine)
                        user.date=deadLine;
                        localStorage.setItem("user",JSON.stringify(user));
                    }
                                        
                    jump(json.data);
                }
            }
        })
    })


})

function jump(user){
    if(user.RoleId==1){
        location.href="./OfficeUserMenu.html";
    }else if(user.RoleId==2){
        location.href="./AdministratorMenu.html";
    }
}