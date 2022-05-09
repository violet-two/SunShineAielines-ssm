$(document).ready(function(){
    $("#searchFlightStatus").click(function(){
        var departureDate = $(".departureDate").val();
        getFlightStatus(departureDate,0);
    })
    //选择某一页
    $(".NUM .pages").change(function(){
        getFlightStatus(searchObj.departureDate,$(this).val());
    })

    //首页
    $(".fa-step-backward").click(function(){
        if(searchObj.startPage == 0){
            alert("已经是第一页！");
        }else{
            getFlightStatus(searchObj.departureDate,0);
        }
    })
    //上一页
    $(".fa-chevron-left").click(function(){
        if(searchObj.startPage == 0){
            alert("已经是第一页！");
        }else{
            getFlightStatus(searchObj.departureDate,searchObj.startPage-1);
        }
    })
    //下一页
    $(".fa-chevron-right").click(function(){
        if(searchObj.startPage == searchObj.pages-1){
            alert("已经是最后一页！");
        }else{
            getFlightStatus(searchObj.departureDate,searchObj.startPage+1);
        }
    })
    //最后一页
    $(".fa-step-forward").click(function(){
        if(searchObj.startPage == searchObj.pages-1){
            alert("已经是最后一页！");
        }else{
            getFlightStatus(searchObj.departureDate,searchObj.pages-1);
        }
    })




})
var searchObj = {};

function getFlightStatus(departureDate,startPage){
    searchObj.departureDate = departureDate;
    searchObj.startPage = startPage;
    var paramStr = "departureDate="+departureDate+"&startPage="+startPage;
    $.ajax({
    type:"POST",
    url:"http://localhost:8080/SunshineAirlines/getFlightStatus",
    data:paramStr,
    success:function(msg){
        var json = JSON.parse(msg);
        if(json.flag == "success"){
            var html = "";
            for(var i = 0;i<json.data.length;i++){
                var timeStr = json.data[i].Time.substring(0,5);
                
                
                //计划起飞时间字符串转化为date对象
                var scheduleArrive = new Date(json.data[i].Date);
                //类比7天登录的方式，通过设置分钟数实现（起飞时间的分钟数+飞行时间）【超过60分钟，在set的时候自动会向上进位】
                scheduleArrive.setMinutes(scheduleArrive.getMinutes()+json.data[i].FlightTime);
                
                var scheduleArriveHourStr =  scheduleArrive.getHours()<10?'0'+scheduleArrive.getHours():scheduleArrive.getHours();
                var scheduleArriveMinuteStr =  scheduleArrive.getMinutes()<10?'0'+scheduleArrive.getMinutes():scheduleArrive.getMinutes();
                var scheduleArriveStr = scheduleArriveHourStr+':'+scheduleArriveMinuteStr;
                var ActualArrivalTime = json.data[i].ActualArrivalTime.substring(11,16);

                //判断迟到或晚到，根据实际到达时间与计划到达时间去比较(两个date类型相减得到ms差)
                var timeDiff = parseInt((new Date(json.data[i].ActualArrivalTime)-scheduleArrive)/60000);
                var status = "";
                if(timeDiff<0){
                    status = "early "+(-timeDiff)+"minutes";
                }else if(timeDiff>0){
                    status = "Delay "+timeDiff+" minutes";
                }else{
                    status = "On time";
                }
                html+= "<tr>"+
                "<td>"+(startPage*10+i+1)+"</td>"+
                "<td>"+json.data[i].FlightNumber+"</td>"+
                "<td>"+json.data[i].DepartCityName+"/"+json.data[i].DepartureAirportIATA+"</td>"+
                "<td>"+json.data[i].ArriveCityName+"/"+json.data[i].ArrivalAirportIATA+"</td>"+
                "<td>"+timeStr+"</td>"+
                "<td>"+scheduleArriveStr+"</td>"+
                "<td>"+ActualArrivalTime+"</td>"+
                "<td>"+json.data[i].Gate+"</td>"+
                "<td>"+status+"</td>"+
                "</tr>";
                
            }
            $(".formclass table tbody").html(html);
            //:odd匹配序号为奇数的tr元素
            $(".formclass tbody tr:odd").addClass("tdcolor");
            //:odd匹配序号为偶数的tr元素
            $(".formclass tbody tr:even").addClass("tdcolor1");
            initPage(json.page.total,searchObj);
        }
    }
})
}