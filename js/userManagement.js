$(document).ready(function(){
    findUserList(0, "",0);

    $("#show").click(function(){
        var roleId = $(".RoleId").val();
        var name = $(".userName").val();
        var startPage = 0;
        findUserList(roleId,name,startPage);
    })
    $(".NUM .pages").change(function(){
        findUserList(searchObj.roleId,searchObj.name,$(this).val());
    })

    //首页
    $(".fa-step-backward").click(function(){
        if(searchObj.startPage == 0){
            alert("已经是第一页！");
        }else{
            findUserList(searchObj.roleId,searchObj.name,0);
        }
    })
    //上一页
    $(".fa-chevron-left").click(function(){
        if(searchObj.startPage == 0){
            alert("已经是第一页！");
        }else{
            findUserList(searchObj.roleId,searchObj.name,searchObj.startPage-1);
        }
    })
    //下一页
    $(".fa-chevron-right").click(function(){
        if(searchObj.startPage == searchObj.pages-1){
            alert("已经是最后一页！");
        }else{
            findUserList(searchObj.roleId,searchObj.name,searchObj.startPage+1);
        }
    })
    //最后一页
    $(".fa-step-forward").click(function(){
        if(searchObj.startPage == searchObj.pages-1){
            alert("已经是最后一页！");
        }else{
            findUserList(searchObj.roleId,searchObj.name,searchObj.pages-1);
        }
    })
    //点击新增用户按钮
    $("#goAddUser").click(function(){
        localStorage.setItem("userId",0);
        location.href="./EditUser.html";
    })
})
var searchObj = {};

function edit(userId){
    if(userId > 0){
        localStorage.setItem("userId",userId);
        location.href="./EditUser.html";
    }
}

function findUserList(roleId,name,startPage){
    searchObj.startPage = startPage;
    searchObj.roleId = roleId;
    searchObj.name = name;
    $.ajax({
        type:"POST",
        url:"http://localhost:8080/SunshineAirlines/userList",
        data:"roleId="+roleId+"&name="+name+"&startPage="+startPage+"&pageSize=10",
        success:function(msg){
           
            var json = JSON.parse(msg);
            //加载列表部分内容
            if(json.flag == "success"){
                var html = "";
                for(var i=0;i<json.data.length;i++){
                    var gender = json.data[i].Gender == 'M' ? "Male":"Female";
                    var roleName = json.data[i].RoleId == 1?"Office User":"Administrator";
                    html+= "<tr>"+
                    "<td>"+json.data[i].Email+"</td>"+
                    "<td>"+json.data[i].FirstName+" "+json.data[i].LastName+"</td>"+
                    "<td>"+gender+"</td>"+
                    "<td>"+json.data[i].DateOfBirth+"</td>"+
                    " <td>"+json.data[i].Phone+"</td>"+
                    "<td>"+roleName+"</td>"+
                    "<td><input style='width: 80px;  font-size: 16px;' type='button' id='show' value='Edit' userId='1' onClick='edit("+json.data[i].UserId+")'/></td>"+
                    "</tr>";
                }
                $(".formclass tbody").html(html);
                //:odd匹配序号为奇数的tr元素
                $(".formclass tbody tr:odd").addClass("tdcolor");
                //:odd匹配序号为偶数的tr元素
                $(".formclass tbody tr:even").addClass("tdcolor1");
                initPage(json.page.total,searchObj);
            }
        }
    })

}

