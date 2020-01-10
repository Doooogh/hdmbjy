package org.fh;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.activiti.spring.boot.SecurityAutoConfiguration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * 说明：启动类 
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
@SpringBootApplication(exclude = SecurityAutoConfiguration.class)//去除冲突 
@MapperScan("org.fh.mapper")
@EnableCaching
public class FHmainApplication {

	public static void main(String[] args) {
		SpringApplication.run(FHmainApplication.class, args);
	}


}