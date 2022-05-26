package edu.wtbu.controller;

import edu.wtbu.pojo.Result;
import edu.wtbu.service.CityService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;

@Controller
public class CityController {

    @Resource
    CityService cityService;

    @RequestMapping("/getCityNames")
    @ResponseBody
    public Object getCityNames(){
        Result result = cityService.getCityNames();
        return result;
    }

}
