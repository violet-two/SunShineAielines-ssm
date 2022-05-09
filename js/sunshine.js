$(document).ready(function(){
    $(".list_out").click(function(){
        localStorage.setItem("user","");
        location.href="./Login.html";
    })
})

//初始化页码部分数据及显示
function initPage(total,searchObj){
    $(".totals").text(total);
    var pages = parseInt(total/10);
    if(total%10 != 0){
        pages++;
    }
    //存储到全局变量，便于翻页操作根据总页数处理分页逻辑
    searchObj.pages = pages;
    $(".totalpage .pages").text(pages);
    var optionHtml = "";
    for(var i=0;i<pages;i++){
        if(i == searchObj.startPage){
            optionHtml += "<option  value='"+i+"' selected>"+(i+1)+"</option>";
        }else{
            optionHtml += "<option  value='"+i+"'>"+(i+1)+"</option>";
        }
    }
    $(".NUM .pages").html(optionHtml);
}