package edu.wtbu.service;

import edu.wtbu.dao.UserDao;
import edu.wtbu.pojo.Result;

import javax.annotation.Resource;
import java.util.HashMap;

public interface UserService {

    Result login(String email, String password);

    Result updatePassword(int userId, String password);

    Result userList(int userId, String name, int startPage, int pageSize);

    Result addUser(HashMap<String, Object> map);
}
