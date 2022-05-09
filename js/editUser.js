$(document).ready(function(){
    var userId = localStorage.getItem("userId");
    if(userId > 0){
        //修改操作
        $(".headtitle").text("Edit User");
        //查询用户信息并加载显示
        $.ajax({
            type:"POST",
            url:"http://localhost:8080/SunshineAirlines/getUserInfo",
            data:"userId="+userId,
            success:function(msg){
                var json = JSON.parse(msg);
                if(json.flag == "success"){
                    $(".email").val(json.data.Email);
                    if(json.data.RoleId==1){
                        $(".roleUser").prop("checked",true);
                    }else{
                        $(".roleAdministrator").prop("checked",true);
                    }
                    if(json.data.Gender == 'M'){
                        $(".genderMale").prop("checked",true);
                    }else{
                        $(".genderFemale").prop("checked",true);
                    }
                    $(".photo").attr("src",json.data.Photo)
                    $(".firstName").val(json.data.FirstName);
                    $(".lastName").val(json.data.LastName);
                    $(".dateOfBirth").val(json.data.DateOfBirth);
                    $(".phone").val(json.data.Phone);
                    $(".address").val(json.data.Address);
                }
                
                
            }
        })
    }


    //提交保存按钮
    $(".submit").click(function(){
        var email = $(".email").val();
        var roleId = 2;
        if($(".roleUser").prop("checked")){
            roleId = 1;
        }
        var gender = 'F';
        if($(".genderMale").prop("checked")){
            gender = 'M';
        }
        var photo = $(".photo").attr("src");
        //进行Uri编码，避免后端servlet取值丢失+
        photo = encodeURIComponent(photo);
        var firstName = $(".firstName").val();
        var lastName = $(".lastName").val();
        var dateOfBirth = $(".dateOfBirth").val();
        var phone = $(".phone").val();
        var address = $(".address").val();
        var paramStr= "email="+email+"&roleId="+roleId+
        "&gender="+gender+"&photo="+photo+
        "&firstName="+firstName+"&lastName="+lastName+
        "&dateOfBirth="+dateOfBirth+"&phone="+phone+
        "&address="+address;
        if(userId > 0){
            //修改用户信息
            paramStr+="&userId="+userId;
            $.ajax({
                type:"POST",
                url:"http://localhost:8080/SunshineAirlines/updateUser",
                data:paramStr,
                success:function(msg){
                    var json = JSON.parse(msg);
                    if(json.flag == "success"){
                       location.href="./UserManagement.html";
                    }else{
                        alert(json.data);
                    }
                    
                    
                }
            })
        }else{
            //新增用户
            $.ajax({
                type:"POST",
                url:"http://localhost:8080/SunshineAirlines/addUser",
                data:paramStr,
                success:function(msg){
                    var json = JSON.parse(msg);
                    if(json.flag == "success"){
                       location.href="./UserManagement.html";
                    }else{
                        alert(json.data);
                    }
                    
                    
                }
            })
        }
         
    })


    $("#upload-input").change(function(){
        var file = this.files[0];
        var fileReader = new FileReader();
        fileReader.onload=function(event){
            //通过fileReader解析加载的时候触发的event事件获取base64码
            var imgBase64Url  = event.target.result;
            //将base64码加载显示
            $(".photo").attr("src",imgBase64Url);
        }
        fileReader.readAsDataURL(file);
    })
})

