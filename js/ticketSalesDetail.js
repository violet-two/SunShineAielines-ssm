$(document).ready(function(){
    var scheduleId = localStorage.getItem("scheduleId");
    if(scheduleId != null && scheduleId!= "" && scheduleId != undefined){
        $.ajax({
            type:"POST",
            url:"http://localhost:8080/SunshineAirlines/getScheduleDetail",
            data:"scheduleId="+scheduleId,
            success:function(msg){
                var json = JSON.parse(msg);
                if(json.flag == "success"){
                    var scheduleInfo = json.data.ListSchedule[0];
                    var dateStr = scheduleInfo.Date.substring(0,10);
                    var scheduleInfoStr = scheduleInfo.DepartureAirportIATA+" to "+scheduleInfo.ArrivalAirportIATA+","+dateStr+","+scheduleInfo.Time+","+scheduleInfo.Name;
                    $(".scheduleInfo").text(scheduleInfoStr);
                    if(scheduleInfo.AircraftId == 2){
                        $(".aircraft1").hide();
                        $(".aircraft2").show();
                    }
                   
                    
                    //加载票务统计信息
                    var economyAllCount = parseInt(scheduleInfo.EconomySeatsAmount);
                    var businessAllCount = parseInt(scheduleInfo.BusinessSeatsAmount);
                    var firstAllCount = parseInt(scheduleInfo.FirstSeatsAmount);
                    var economySoldCount = 0;
                    var businessSoldCount = 0;
                    var firstSoldCount = 0;
                    for(var i=0; i<json.data.ListTickets.length;i++){
                        var ticketCountInfo = json.data.ListTickets[i];
                        if(ticketCountInfo.CabinTypeId == 1){
                            economySoldCount =ticketCountInfo.Counts;
                        }else if(ticketCountInfo.CabinTypeId == 2){
                            businessSoldCount =ticketCountInfo.Counts;
                        }else{
                            firstSoldCount =ticketCountInfo.Counts;
                        }
                    }
                    var economyHtmlStr = getCountInfoHtml(economyAllCount,economySoldCount);
                    var businessHtmlStr = getCountInfoHtml(businessAllCount,businessSoldCount);
                    var firstHtmlStr = getCountInfoHtml(firstAllCount,firstSoldCount);
                    $(".economyMsg").append(economyHtmlStr);
                    $(".businesstMsg").append(businessHtmlStr);
                    $(".firstMsg").append(firstHtmlStr);

                    //显示座位排布
                    for(var i=0; i<json.data.ListSeatLayout.length;i++){
                        var seatLayoutInfo = json.data.ListSeatLayout[i];
                        var cabinTypeId = seatLayoutInfo.CabinTypeId;
                        var columnName = seatLayoutInfo.ColumnName;
                        var className = "";
                        if(cabinTypeId == 3){
                            className="first"+columnName;
                        }else if(cabinTypeId == 2){
                            className="business"+columnName;
                        }else{
                            className="economy"+columnName;
                        }
                        var seatNumber = seatLayoutInfo.RowNumber+columnName;
                        $("."+className).append("<div class='busseat "+seatNumber+"'>"+seatNumber+"</div>");
                    }

                    //标识已售作为
                    for(var i=0; i<json.data.ListSeat.length;i++){
                        var soldSeatInfo = json.data.ListSeat[i];
                        var seatNumber = soldSeatInfo.RowNumber+soldSeatInfo.ColumnName;
                        $("."+seatNumber).addClass("selected");
                    }
                }
                
            }
        })
    }
    


})


function getCountInfoHtml(allCount,soldCount){
    var  rate = (100*soldCount/allCount).toFixed(2);
    var html="<p>"+soldCount+"/"+allCount+"  "+rate+"%</p>"+
    "<p>Total Tickets:"+allCount+"</p>"+
    "<p>Sold Tickets:"+soldCount+"</p>"+
    "<p>Seats Selected:0</p>";
    return html;
}