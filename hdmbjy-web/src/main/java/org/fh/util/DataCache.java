package org.fh.util;

import java.util.HashMap;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

public class DataCache {
    public  static Map<String,Object> CACHEDATA=new HashMap<>();   //缓存数据


    public static void timing1(){
        Timer nTimer = new Timer();
        nTimer.schedule(new TimerTask() {
            @Override
            public void run() {
               CACHEDATA.clear();
            }
        },1000*60*10);  //每十分钟执行一次

    }






}
