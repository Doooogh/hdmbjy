package org.fh.service.job;

import org.fh.entity.PageData;
import org.fh.service.scuser.ScuserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Created with IntelliJ IDEA.
 * User: li long
 * Date: 2019/10/23
 * Description: No Description
 */
@Component
public class TimingJob {

    @Autowired
    private ScuserService scuserService;

    //定时检测合同是否过期
    @Scheduled(cron = "0/1 0 0 1/1 * ? ")
    public void test(){
        scuserService.findExpirescUser(new PageData());
    }


}
