package org.fh.config;

import org.fh.util.DbFH;
import org.springframework.boot.web.server.ConfigurableWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 说明：WEB服务器设置
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
@Configuration
public class WebServerFactoryConfiguration {
	
	@Bean
	public WebServerFactoryCustomizer<ConfigurableWebServerFactory> containerCustomizer() {
	    return new WebServerFactoryCustomizer<ConfigurableWebServerFactory>() {
	        
	        @Override
            public void customize(ConfigurableWebServerFactory factory) {
	        	//启动时会执行这里
	        	//factory.setPort(8081);	//端口设置 
	        	reductionDbBackupQuartzState();//
            }
	        
	    	/**
	    	 * 服务重启时，所有定时备份状态关闭
	    	 */
	    	public void reductionDbBackupQuartzState(){
	    		try {
	    			DbFH.executeUpdateFH("update DB_TIMINGBACKUP set STATUS = '2'");
	    		} catch (Exception e) {
	    			System.out.println("==============数据库备份异常=============");
	    			System.out.println("=======检查dbfh.properties配置文件=======");
	    		}
	    	}

	    };
	}
}
