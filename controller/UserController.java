package edu.wtbu.controller;

import edu.wtbu.pojo.Result;
import edu.wtbu.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.HashMap;


@Controller
public class UserController {

    @Resource
    UserService userService;

    @RequestMapping("/login")
    @ResponseBody
    public Object login(String email,String password){
        Result result = userService.login(email,password);
        return result;
    }

    @RequestMapping("/updatePassword")
    @ResponseBody
    public Object updatePassword(int userId,String password){
        Result result = userService.updatePassword(userId,password);
        return result;
    }

    @RequestMapping("/userList")
    @ResponseBody
    public Object userList(int roleId,String name,int startPage ,int pageSize ){
        Result result = userService.userList(roleId,name,startPage,pageSize);
        return result;
    }

    @RequestMapping("/addUser")
    @ResponseBody
    public Object addUser(String email,String firstName,String lastName ,String gender,
                        String dateOfBirth,String phone,String photo ,String address,
                         int roleId ){
        HashMap<String,Object> map = new HashMap<>();
        map.put("email",email);
        map.put("firstName",firstName);
        map.put("lastName",lastName);
        map.put("gender",gender);
        map.put("dateOfBirth",dateOfBirth);
        map.put("phone",phone);
        map.put("photo",photo);
        map.put("address",address);
        map.put("roleId",roleId);
        String password = email.split("@")[0];
        if(password.length()>6){
            password = password.substring(0,6);
        }
        System.out.println(password);
        map.put("password",password);
        Result result = userService.addUser(map);
        return result;
    }

}
