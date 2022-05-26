package edu.wtbu.service.impl;

import com.github.pagehelper.PageHelper;
import edu.wtbu.dao.UserDao;
import edu.wtbu.pojo.Page;
import edu.wtbu.pojo.Result;
import edu.wtbu.service.UserService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Resource
    UserDao userDao;

    @Override
    public Result login(String email, String password) {
        Result result = new Result("fail",null,null);
        HashMap<String,Object> map = new HashMap<>();
        map.put("email",email);
        map.put("password",password);
        List<HashMap<String,Object>> list = userDao.login(map);
        if(list!=null && list.size()>0){
            result.setFlag("success");
            result.setData(list);
        }else {
            if(findEmailIsTure(email)){
                result.setData("密码错误");
            }else{
                result.setData("邮箱不存在");
            }
        }
        return result;
    }

    @Override
    public Result updatePassword(int userId, String password) {
        Result result = new Result("fail",null,null);
        HashMap<String,Object> map = new HashMap<>();
        map.put("userId",userId);
        map.put("password",password);
        int rs = userDao.updatePassword(map);
        if(rs>0){
            result.setFlag("success");
        }else{
            if(!findUserIdIsTrue(userId)){
                result.setData("用户信息不存在");
            }
        }
        return result;
    }

    @Override
    public Result userList(int roleId, String name, int startPage, int pageSize) {
        Result result = new Result("fail",null,null);
        HashMap<String,Object> map = new HashMap<>();
        map.put("roleId",roleId);
        map.put("name",name);
        map.put("startPage",((startPage-1)*10));
        map.put("pageSize",pageSize);
        int total = 0;
        List<HashMap<String,Object>> list = new ArrayList<>();
        if(roleId==0){
            total = userDao.getCountAll(map);
            list = userDao.getUserListALl(map);
        }else{
            total = userDao.getCountByRoleId(map);
            list = userDao.getUserListALlByRoleId(map);
        }
//        PageHelper.startPage((startPage-1)*10,10);
        if(list!=null&&list.size()>0){
            Page pages = new Page(pageSize,startPage,total);
            result.setFlag("success");
            result.setData(list);
            result.setPages(pages);
        }
        return result;
    }

    @Override
    public Result addUser(HashMap<String, Object> map) {
        Result result = new Result("fail",null,null);
        String email = map.get("email").toString();
        if(findEmailIsTure(email)){
            result.setData("邮箱重复");
            return result;
        }
        int rs = userDao.addUser(map);
        if(rs>0){
            result.setFlag("success");
        }
        return result;
    }


    private boolean findUserIdIsTrue(int userId) {
        List<HashMap<String,Object>> list = userDao.findUserId(userId);
        if(list!=null&&list.size()>0){
            return true;
        }else{
            return false;
        }
    }

    private boolean findEmailIsTure(String email) {
        List<HashMap<String,Object>> list = userDao.findEmail(email);
        if(list!=null&&list.size()>0){
            return true;
        }else{
            return false;
        }
    }
}
