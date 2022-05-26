package edu.wtbu.service.impl;

import edu.wtbu.dao.CityDao;
import edu.wtbu.pojo.Result;
import edu.wtbu.service.CityService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;

@Service
public class CityServiceImpl implements CityService {
    @Resource
    CityDao cityDao;

    @Override
    public Result getCityNames() {
        Result result = new Result("success",null,null);
        List<HashMap<String,Object>> list = cityDao.getCityNames();
        result.setData(list);
        return result;
    }
}
