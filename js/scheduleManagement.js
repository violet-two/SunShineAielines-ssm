$(document).ready(function(){
    //初始化城市下拉列表
    $.ajax({
        type:"POST",
        url:"http://localhost:8080/SunshineAirlines/getCityNames",
        data:"",
        success:function(msg){
            var json = JSON.parse(msg);
            if(json.flag == "success"){
               //1.循环遍历列表数据
               var optionHtml = "";
                for(var i = 0;i<json.data.length;i++){
                    //2.拼接option HTML代码字符串
                    optionHtml += "<option value='"+json.data[i].CityName+"'>"+json.data[i].CityName+"</option>";
                }
                //3.添加到下拉框元素中
                $(".fromCity").html(optionHtml);
                $(".toCity").html(optionHtml);
            }            
        }
    })
    
    //交换功能
    $(".changeicon").click(function(){
        var leftVal = $(".fromCity").val();
        var rightVal = $(".toCity").val();
        $(".fromCity").val(rightVal);
        $(".toCity").val(leftVal);
    })

    //查询按钮点击事件
    $("#show").click(function(){
        searchScheduleList();
    })
})

function scheduleDetail(scheduleId){
    localStorage.setItem("scheduleId",scheduleId);
    location.href="./TicketSalesDetail.html";
}


function updateScheduleStatus(scheduleId,status){
    var newStatus = "Confirmed";
    if(status == 1){
        newStatus = "Canceled";
    }

    var paramStr = "scheduleId="+scheduleId+"&status="+newStatus;

    $.ajax({
        type:"POST",
        url:"http://localhost:8080/SunshineAirlines/updateSchedule",
        data:paramStr,
        success:function(msg){
            var json = JSON.parse(msg);
            if(json.flag == "success"){
                searchScheduleList();
            }else{
                alert(json.data);
            }            
        }
    })
}

function searchScheduleList(){
        var fromCity = $(".fromCity").val();
        var toCity = $(".toCity").val();
        var startDate = $(".startDate").val();
        var endDate = $(".endDate").val();
        var paramStr = "fromCity="+fromCity+"&toCity="+toCity+"&startDate="+startDate+"&endDate="+endDate;
        $.ajax({
            type:"POST",
            url:"http://localhost:8080/SunshineAirlines/getSchedule",
            data:paramStr,
            success:function(msg){
                var json = JSON.parse(msg);
                if(json.flag == "success"){
                   //1.循环遍历列表数据
                   var trHtml = "";
                    for(var i = 0;i<json.data.length;i++){
                        //2.将航班计划信息拼接入每行数据HTML代码中
                        var dateStr = json.data[i].Date.substring(0,10);
                        var timeStr =  json.data[i].Time.substring(0,5);
                        var buttonName = "Confirm";
                        var status = 0;
                        if(json.data[i].Status == "Confirmed") {
                            buttonName = "Cancel";
                            status=1;
                        }
                        trHtml+="<tr>"+
                            "<td>"+dateStr+"</td>"+
                            "<td>"+timeStr+"</td>"+
                            "<td>"+json.data[i].DepartCityName+"/"+json.data[i].DepartureAirportIATA+"</td>"+
                            "<td>"+json.data[i].ArriveCityName+"/"+json.data[i].ArrivalAirportIATA+"</td>"+
                            "<td>"+json.data[i].Name+"</td>"+
                            "<td>"+json.data[i].EconomyPrice+"</td>"+
                            "<td>"+json.data[i].FlightNumber+"</td>"+
                            "<td>"+json.data[i].Gate+"</td>"+
                            "<td>"+json.data[i].Status+"</td>"+
                            "<td> <input type='button' value='Detail' onClick='scheduleDetail("+json.data[i].ScheduleId+")'/>&nbsp;<input type='button' value='"+buttonName+"' onClick='updateScheduleStatus("+json.data[i].ScheduleId+","+status+")'/></td>"+
                        "</tr>";
                    }
                   //3.添加到table元素中
                   $(".formclass table tbody").html(trHtml);
                   $(".formclass table tbody tr:odd").addClass("tdcolor");
                   $(".formclass table tbody tr:even").addClass("tdcolor1");
                }            
            }
        })
}