package org.fh.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.fh.entity.PageData;
import org.fh.util.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: li long
 * Date: 2019/11/22
 * Description: No Description
 */
@Controller
@RequestMapping("/test")
public class TestController {

    @RequestMapping("/test")
    @ResponseBody
    public String test(HttpServletRequest request){
        String ip=IPUtils.getIpAddr(request);
        System.out.println(ip);
        return ip;
    }

    @RequestMapping("/testRequest")
    @ResponseBody
    public Map testRequest(HttpServletRequest request){
        String ip="127.0.0.1".equals(IPUtils.getIpAddr(request))?"139.129.234.40":IPUtils.getIpAddr(request);
        Map<String,Object> responseMap=new HashMap<>();
        String addressToString = AddressUtils.getAddressToString(ip);
        String[] split = addressToString.split(",");
        responseMap.put("address",split[1]);
        return responseMap;
    }



}
