package org.fh.log;


import com.alibaba.fastjson.JSON;
import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;

import org.fh.entity.PageData;
import org.fh.service.system.FHlogService;
import org.fh.util.AddressUtils;
import org.fh.util.HttpContextUtils;
import org.fh.util.IPUtils;
import org.fh.util.JSONUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.util.Date;
import java.util.Map;

@Aspect
@Component
public class LogAspect {


    private static final Logger logger = LoggerFactory.getLogger(LogAspect.class);

    @Autowired
    private FHlogService FHLOG;

    @Pointcut("@annotation(org.fh.log.SysLog)")
    public void logPointCut() {
    }

    @Around("logPointCut()")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        long beginTime = System.currentTimeMillis();
        // 执行方法
        Object result = point.proceed();
        // 执行时长(毫秒)
        long time = System.currentTimeMillis() - beginTime;
        //异步保存日志
        saveLog(point, time,result);
        return result;
    }

 /*   // 添加登录日志
    @After("logPointCut()")
    public Object aroundLogin(ProceedingJoinPoint point) throws Throwable {
        long beginTime = System.currentTimeMillis();
        // 执行方法
        Object result = point.proceed();
        // 执行时长(毫秒)
        long time = System.currentTimeMillis() - beginTime;
        //异步保存日志
        saveLoginLog(point, time,result);
        return result;
    }*/

    void saveLoginLog(ProceedingJoinPoint joinPoint, long time,Object result) throws InterruptedException {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        SysLog syslog = method.getAnnotation(SysLog.class);
        if(null!=syslog&&syslog.value().equals("登陆系统")){
            if(null!=result){
                String resultStr=JSON.toJSONString(result);  //获取返回值
                Map<String,Object> resultMap=JSONUtils.jsonToMap(resultStr);  //将返回值转化为map
                String loginResult= (String) resultMap.get("result");
                //获取登录的ip
                // 获取request
                HttpServletRequest request = HttpContextUtils.getHttpServletRequest();
                String ip=IPUtils.getIpAddr(request);  //获取ip
                String addressToString = AddressUtils.getAddressToString(ip);
                String[] split = addressToString.split(",");
                String ipLocation=split[1];  //ip地区
                String content= (String) resultMap.get("CONTENT");    //获取日志信息
                String username= (String) resultMap.get("USERNAME");  //登录用户名
                PageData pLog=new PageData();
                pLog.put("IP",ip);
                pLog.put("IP_LOCATION",ipLocation);
                pLog.put("CONTENT",content);
                if(StringUtils.isNotBlank(loginResult)&&"success".equals(loginResult)){  //表示登录成功
                    String name= (String) resultMap.get("NAME");  //获取执行人
                    pLog.put("NAME",name);
                    pLog.put("USERNAME",username);
                    FHLOG.save(pLog);   //登录成功 name为名字
                }else if(StringUtils.isNotBlank(loginResult)&&"usererror".equals(loginResult)){   //表示登录失败
                    pLog.put("NAME",username);
                    pLog.put("USERNAME",username);
                    FHLOG.save(pLog); //登录失败 name 为用户登录用户账号
                }
            }
        }
    }

    //在不是登录时使用
    void saveLog(ProceedingJoinPoint joinPoint, long time,Object result) throws InterruptedException {
       MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        SysLog syslog = method.getAnnotation(SysLog.class);
        String resultStr=JSON.toJSONString(result);  //获取返回值
        Map<String,Object> resultMap=JSONUtils.jsonToMap(resultStr);  //将返回值转化为map
        String content= (String) resultMap.get("CONTENT");    //获取日志信息
        String name= (String) resultMap.get("NAME");
        String username= (String) resultMap.get("USERNAME");  //登录用户名
        HttpServletRequest request = HttpContextUtils.getHttpServletRequest();
        String ip=IPUtils.getIpAddr(request);  //获取ip
        String addressToString = AddressUtils.getAddressToString(ip);
        String[] split = addressToString.split(",");
        String ipLocation=split[1];  //ip地区
        PageData pLog=new PageData();
        pLog.put("IP",ip);
        pLog.put("IP_LOCATION",ipLocation);
        pLog.put("CONTENT",content);
        pLog.put("TIME",String.valueOf(time));
        if(null!=syslog&&!syslog.value().equals("登陆系统")){
            pLog.put("USERNAME",username);
            pLog.put("NAME",name);
            FHLOG.save(pLog);
        }else if(null!=syslog&&syslog.value().equals("登陆系统")){
            String loginResult= (String) resultMap.get("result");
            if(StringUtils.isNotBlank(loginResult)&&"success".equals(loginResult)){  //表示登录成功
                pLog.put("NAME",name);
                pLog.put("USERNAME",username);
                FHLOG.save(pLog);   //登录成功 name为名字
            }else if(StringUtils.isNotBlank(loginResult)&&"usererror".equals(loginResult)){   //表示登录失败
                pLog.put("NAME",username);
                pLog.put("USERNAME",username);
                FHLOG.save(pLog); //登录失败 name 为用户登录用户账号
            }
        }

      /*   LogDO sysLog = new LogDO();
        Log syslog = method.getAnnotation(Log.class);
        if (syslog != null) {
            // 注解上的描述
            sysLog.setOperation(syslog.value());
        }
        // 请求的方法名
        String className = joinPoint.getTarget().getClass().getName();
        String methodName = signature.getName();
        sysLog.setMethod(className + "." + methodName + "()");
        // 请求的参数
        Object[] args = joinPoint.getArgs();
        try {
            String params = JSONUtils.beanToJson(args[0]).substring(0, 4999);
            sysLog.setParams(params);
        } catch (Exception e) {

        }
        // 获取request
        HttpServletRequest request = HttpContextUtils.getHttpServletRequest();
        // 设置IP地址
        sysLog.setIp(IPUtils.getIpAddr(request));
        // 用户名
        UserDO currUser = ShiroUtils.getUser();
        if (null == currUser) {
            if (null != sysLog.getParams()) {
                sysLog.setUserId(-1L);
                sysLog.setUsername(sysLog.getParams());
            } else {
                sysLog.setUserId(-1L);
                sysLog.setUsername("获取用户信息为空");
            }
        } else {
            sysLog.setUserId(ShiroUtils.getUserId());
            sysLog.setUsername(ShiroUtils.getUser().getUsername());
        }
        sysLog.setTime((int) time);
        // 系统当前时间
        Date date = new Date();
        sysLog.setGmtCreate(date);
        // 保存系统日志
        logService.save(sysLog);*/
    }

}
