package org.fh.config;

import org.activiti.spring.SpringProcessEngineConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;

/**
 * 说明：Activiti配置
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
@Controller
@Configuration
public class ActivitiConfig {

	@Autowired
	PlatformTransactionManager transactionManager;

	@Autowired
	ApplicationContext applicationContext;

	@Bean
	public SpringProcessEngineConfiguration getProcessEngineConfiguration() {
		DataSource dataSource = applicationContext.getBean(DataSource.class);
		SpringProcessEngineConfiguration config = new SpringProcessEngineConfiguration();
		config.setDataSource(dataSource);
		config.setDbIdentityUsed(false);
		config.setTransactionManager(transactionManager);
		/**设置字体**/
		config.setActivityFontName("宋体");
		config.setLabelFontName("宋体");
		config.setAnnotationFontName("宋体");
		config.setDatabaseType("mysql");
		return config;
	}

}
