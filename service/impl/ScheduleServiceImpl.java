package edu.wtbu.service.impl;

import edu.wtbu.dao.ScheduleDao;
import edu.wtbu.pojo.Result;
import edu.wtbu.service.ScheduleService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.time.Year;
import java.util.HashMap;
import java.util.List;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    @Resource
    ScheduleDao scheduleDao;

    @Override
    public Result getSchedule(HashMap<String, Object> map) {
        Result result = new Result("success",null,null);
        List<HashMap<String,Object>> list = scheduleDao.getSchedule(map);
        result.setData(list);
        return result;
    }

    @Override
    public Result updateSchedule(HashMap<String, Object> map) {
        Result result = new Result("fail",null,null);
        int rs = scheduleDao.updateSchedule(map);
        if(rs>0){
            result.setFlag("success");
        }else{
            if(!findScheduleById(map.get("scheduleId"))){
                result.setData("航班计划不存在");
            }
        }
        return result;
    }

    private boolean findScheduleById(Object scheduleId) {
        List<HashMap<String,Object>> list = scheduleDao.findScheduleById(scheduleId);
        if(list!=null&&list.size()>0){
            return true;
        }else{
            return false;
        }
    }

    @Override
    public Result getTicketStatistics(HashMap<String, Object> map) {
        Result result = new Result("fail",null,null);
        List<HashMap<String,Object>> list = scheduleDao.getTicketStatistics(map);
        if(list!=null&&list.size()>0){
            for (HashMap<String,Object>  mapByList : list){
                int month = Integer.parseInt(mapByList.get("Month").toString());
                int year = Integer.parseInt(mapByList.get("Year").toString());
                String Month = "";
                if(month<10){
                    Month = year +"-0"+month;
                }else{
                    Month = year +"-"+month;
                }
                mapByList.remove("Year");
                mapByList.put("Month",Month);
            }
            result.setFlag("success");
            result.setData(list);
        }
        return result;
    }
}
