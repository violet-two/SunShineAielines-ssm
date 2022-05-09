$(document).ready(function(){
    $(".wayRadio").change(function(){
        var value = $(this).val();
        if(value == "1"){
            $(".returnDateCondititon").hide();
        }else{
            $(".returnDateCondititon").show();
        }
    })

    $(".departureDate").change(function(){
        $(".returnDate").prop("min",$(".departureDate").val());
    })
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

    $(".searchFlight").click(function(){
        var fromCity = $(".fromCity").val();
            var toCity = $(".toCity").val();
            var departureDate = $(".departureDate").val();
            var cabinType = $(".cabinType").val();
            var flightType = $(".flightType").val();
            var paramStr = "fromCity="+fromCity+"&toCity="+toCity+"&departureDate="+departureDate+"&cabinType="+cabinType+"&flightType="+flightType;
        //1.判断是双程还是单程
        if($(".oneWay").prop("checked")){
            //单程
            loadSearchData(paramStr,"departureFlights");
            //如果是单程，隐藏returnMsgtitle
            $(".returnMsgtitle").hide();
            $(".returnFlights").hide();
        }else{
            //往返双程
            var returnDate = $(".returnDate").val();
            var departParamStr = paramStr;
            var returnParamStr = "fromCity="+toCity+"&toCity="+fromCity+"&departureDate="+returnDate+"&cabinType="+cabinType+"&flightType="+flightType;
            loadSearchData(departParamStr,"departureFlights");
            loadSearchData(returnParamStr,"returnFlights");
            //如果是单程，显示returnMsgtitle
            $(".returnMsgtitle").show();
            $(".returnFlights").show();
        }

        
    })
})

function getNonStopHtmlStr(scheduleObj,cabinType){
    var price = "";
    var cabinTypeName = "";
    if(cabinType == 3){
        cabinTypeName ="First";
        price = scheduleObj.EconomyPrice*1.5;
    }else if(cabinType == 2){
        cabinTypeName ="Business";
        price = scheduleObj.EconomyPrice*1.25;
    }else{
        cabinTypeName ="Economy";
        price = scheduleObj.EconomyPrice;
    }
    price = price.toFixed(2);
    var ontimeRate = ((scheduleObj.NotDelay/scheduleObj.AllCount)*100).toFixed(2);
    //无中转航班是含有scheduleId字段的
    var dateStr = scheduleObj.Date.substring(0,16);
    var preArrivalTimeStr = scheduleObj.PreArrivalTime.substring(0,16);
    var flightTimeStr = getTimeDiffStr(scheduleObj.FlightTime);
    
    var htmlStr="<div class='innermsg'>"+
                "<div class='optionone' style='margin: auto;'>"+
                    "<input name='Flight' type='radio' />Select"+
                "</div>"+
                "<div class='innerlist'>"+
                    "<p>$"+price+"</p>"+
                    "<p>"+cabinTypeName+"</p>"+
                    "<p>Flight "+scheduleObj.FlightNumber+"("+ontimeRate+"%)</p>"+
                "</div>"+
                "<div class='innerlist' style='width: 450px;'>"+
                    "<div class='placelist'> "+
                        "<p class='citymsg'>"+scheduleObj.DepartCityName+"/"+scheduleObj.DepartureAirportIATA+"</p>"+
                        "<p class='datemsg'>"+dateStr+"</p>"+
                    "</div>"+
                    "<div class='placelist'> "+
                        "<div class='citymsg'>"+scheduleObj.ArriveCityName+"/"+scheduleObj.ArrivalAirportIATA+"</div>"+
                        "<div class='datemsg'>"+preArrivalTimeStr+"</div> "+
                    "</div>"+
                "</div>"+
                "<div class='innerlist'>"+
                    "<p>Non-stop</p>"+
                    "<p>Total time:"+flightTimeStr+"</p>"+
                    "<p style='color: red;'>"+scheduleObj.ResidueTickets+" available tickets</p>"+   
                " </div>"+
            "</div>";
        return htmlStr;
}


function get1StopHtmlStr(scheduleObj,cabinType){
    var s1DateStr = scheduleObj.S1Date.substring(0,16);
    var s2DateStr = scheduleObj.S2Date.substring(0,16);
    var s1PreArrivalTimeStr = scheduleObj.S1PreArrivalTime.substring(0,16);
    var s2PreArrivalTimeStr = scheduleObj.S2PreArrivalTime.substring(0,16);
    var waitTime = (new Date(s2DateStr)-new Date(s1PreArrivalTimeStr))/60000;//date对象相减得到结果是毫秒数，换算成分钟单位
    var waitTimeStr = getTimeDiffStr(waitTime);
    var s1ResidueTickets = scheduleObj.S1ResidueTickets;
    var s2ResidueTickets = scheduleObj.S2ResidueTickets;
    var residueTickets =  s1ResidueTickets<s2ResidueTickets?s1ResidueTickets:s2ResidueTickets;
    //总的时间=第一程飞行时间+候机时间+第二程飞行时间
    var totalTime =scheduleObj.S1FlightTime+waitTime+scheduleObj.S2FlightTime;
    var totalTimeStr = getTimeDiffStr(totalTime);

    var s1OntimeRate = ((scheduleObj.S1NotDelay/scheduleObj.S1AllCount)*100).toFixed(2);
    var s2OntimeRate = ((scheduleObj.S2NotDelay/scheduleObj.S2AllCount)*100).toFixed(2);
    var price = "";
    var cabinTypeName = "";
    if(cabinType == 3){
        cabinTypeName ="First";
        price = (scheduleObj.S1EconomyPrice+scheduleObj.S2EconomyPrice)*1.5;
    }else if(cabinType == 2){
        cabinTypeName ="Business";
        price = (scheduleObj.S1EconomyPrice+scheduleObj.S2EconomyPrice)*1.25;
    }else{
        cabinTypeName ="Economy";
        price = scheduleObj.S1EconomyPrice+scheduleObj.S2EconomyPrice;
    }
    price = price.toFixed(2);
    var htmlStr="<div class='stopinnermsg' >"+
                    "<div class='optionone' style='margin: auto;'>"+
                        "<input name='Flight' type='radio' />Select"+
                    "</div>"+
                    "<div class='innerlist' style='height: 120px;'>"+
                        "<p>$"+price+"</p>"+
                        "<p>"+cabinTypeName+"</p>"+
                        "<p>Flight "+scheduleObj.S1FlightNumber+"("+s1OntimeRate+"%)</p>"+
                        "<p>Flight "+scheduleObj.S2FlightNumber+"("+s2OntimeRate+"%)</p> "+    
                    "</div>"+
                    "<div class='linelist' style='height: 204px;'>"+
                        "<div class='placelist'>  "+                   
                            "<p class='citymsg'>"+scheduleObj.S1DepartCityName+"/"+scheduleObj.S1DepartureAirportIATA+"</p>"+
                            "<p class='datemsg'>"+s1DateStr+"</p>"+
                            "<p class='citymsg'>"+scheduleObj.S1ArriveCityName+"/"+scheduleObj.S1ArrivalAirportIATA+"</p>"+
                            "<p class='datemsg'>"+s1PreArrivalTimeStr+"</p>"+
                        "</div>"+
                        "<div class='stoplist'> "+
                            "<p>"+waitTimeStr+" transfer in "+scheduleObj.S1ArriveCityName+"/"+scheduleObj.S1ArrivalAirportIATA+"</p>"+
                        "</div>"+
                        "<div class='placelist'>"+                     
                            "<p class='citymsg'>"+scheduleObj.S2DepartCityName+"/"+scheduleObj.S2DepartureAirportIATA+"</p>"+
                            "<p class='datemsg'>"+s2DateStr+"</p>"+
                            "<p class='citymsg'>"+scheduleObj.S2ArriveCityName+"/"+scheduleObj.S2ArrivalAirportIATA+"</p>"+
                            "<p class='datemsg'>"+s2PreArrivalTimeStr+"</p>    "+            
                        "</div>"+
                    "</div>"+
                    "<div class='innerlist' >"+
                        "<p>1-stop </p>"+
                        "<p>Total time:"+totalTimeStr+"</p>"+
                        "<p>"+residueTickets+" available tickets</p>"+  
                    "</div>"+
                "</div>";
        return htmlStr;
}

function getTimeDiffStr(timeDiff){
    var timeDiffHour = parseInt(timeDiff/60);
    var timeDiffMinute = timeDiff%60;
    var timeDiffStr = "";
    if(timeDiffHour>0){
        timeDiffStr+=timeDiffHour+"h ";
    }
    if(timeDiffMinute>0){
        timeDiffStr+=timeDiffMinute+"m";
    }
    return timeDiffStr;
}


function loadSearchData(paramStr,className){
    var cabinType = $(".cabinType").val();
    $.ajax({
        type:"POST",
        url:"http://localhost:8080/SunshineAirlines/getSearchFlight",
        data:paramStr,
        async: false,
        success:function(msg){
            console.log(paramStr);
            console.log(msg)
            var json = JSON.parse(msg);
            if(json.flag == "success"){
                var html="";
                //循环遍历数据拼接HTML代码字符串
               for(var i=0;i<json.data.length;i++){
                    var scheduleObj = json.data[i];
                    if(scheduleObj.FlightType == "Non-stop"){
                        //根据nonstop的HTML模板和元素数据拼接得到页面HTML代码
                        var nonstopHtmlStr = getNonStopHtmlStr(scheduleObj,cabinType);
                        html+=nonstopHtmlStr;
                    }else{
                        //根据nonstop的HTML模板和元素数据拼接得到页面HTML代码
                        var oneStopHtmlStr = get1StopHtmlStr(scheduleObj,cabinType);
                        html+=oneStopHtmlStr;
                    }
               }
               //HTML加载到元素中
               $("."+className).html(html);

            }            
        }
    })
}