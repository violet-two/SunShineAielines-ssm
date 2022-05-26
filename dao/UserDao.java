package edu.wtbu.dao;

import org.apache.ibatis.annotations.Mapper;
import org.mybatis.spring.annotation.MapperScan;

import java.util.HashMap;
import java.util.List;

@Mapper
public interface UserDao {
    List<HashMap<String, Object>> login(HashMap<String, Object> map);

    List<HashMap<String, Object>> findEmail(String email);

    int updatePassword(HashMap<String, Object> map);

    List<HashMap<String, Object>> findUserId(int userId);

    int getCountAll(HashMap<String, Object> map);

    int getCountByRoleId(HashMap<String, Object> map);

    List<HashMap<String, Object>> getUserListALl(HashMap<String, Object> map);

    List<HashMap<String, Object>> getUserListALlByRoleId(HashMap<String, Object> map);

    int addUser(HashMap<String, Object> map);
}
