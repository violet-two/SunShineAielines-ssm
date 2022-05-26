package edu.wtbu.controller;

import edu.wtbu.dao.ScheduleDao;
import edu.wtbu.pojo.Result;
import edu.wtbu.service.ScheduleService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.HashMap;

@Controller
public class ScheduleController {

    @Resource
    ScheduleService scheduleService;

    @RequestMapping("/getSchedule")
    @ResponseBody
    public Object getSchedule(String fromCity,String toCity,String startDate,String endDate){
        HashMap<String,Object> map = new HashMap<>();
        map.put("fromCity",fromCity);
        map.put("toCity",toCity);
        map.put("startDate",startDate);
        map.put("endDate",endDate);
        Result result = scheduleService.getSchedule(map);
        return result;
    }

    @RequestMapping("/updateSchedule")
    @ResponseBody
    public Object updateSchedule(int scheduleId,String status){
        HashMap<String,Object> map = new HashMap<>();
        map.put("scheduleId",scheduleId);
        map.put("status",status);
        Result result = scheduleService.updateSchedule(map);
        return result;
    }

    @RequestMapping("/getTicketStatistics")
    @ResponseBody
    public Object getTicketStatistics(String startDate,String endDate){
        HashMap<String,Object> map = new HashMap<>();
        startDate = startDate + "-01 00:00:00";
        String[] endDateArr = endDate.split("-");
        int endMonth = Integer.parseInt(endDateArr[1]);
        int endYear = Integer.parseInt(endDateArr[0]);
        if(endMonth<12){
            endMonth++;
            String monthStr = endMonth<10?"0"+endMonth:""+endMonth;
            endDate = endYear + "-"+monthStr+"-01 00:00:00";
        }else{
            endDate = (endYear+1) +"-01-01 00:00:00";
        }
        System.out.println(startDate);
        System.out.println(endDate);
        map.put("startDate",startDate);
        map.put("endDate",endDate);
        Result result = scheduleService.getTicketStatistics(map);
        return result;
    }
}
