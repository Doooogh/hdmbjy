package org.fh;

import org.activiti.spring.boot.SecurityAutoConfiguration;
import org.apache.ibatis.session.SqlSession;
import org.fh.config.MapperRefresh;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.concurrent.Executors;

/**
 * 说明：项目以war包方式运行时用到
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
@SpringBootApplication(exclude = SecurityAutoConfiguration.class)//去除冲突
@MapperScan("org.fh.mapper")
@EnableCaching
@EnableScheduling
public class SpringBootStartApplication extends SpringBootServletInitializer {


    @Autowired
    private SqlSession sqlSession;

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(FHmainApplication.class);  //这里要指向原先用main方法执行的FHmainApplication启动类
    }

    //mybatis热部署
    @PostConstruct
    public void postConstruct() throws IOException {
        Executors.newFixedThreadPool(20);
        Resource[] resources = new PathMatchingResourcePatternResolver().getResources("classpath*:mybatis/dsno1/**/*Mapper.xml");
        new MapperRefresh(resources, sqlSession.getConfiguration()).run();
    }

    @Primary
    @Bean
    public TaskExecutor primaryTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        return executor;
    }

}