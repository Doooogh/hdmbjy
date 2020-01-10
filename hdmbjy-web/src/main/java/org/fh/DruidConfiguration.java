package org.fh;

import com.alibaba.druid.support.http.StatViewServlet;
import com.alibaba.druid.support.http.WebStatFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 说明：druid数据库连接池的配置类(必须与启动类包目录同级)
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
@Configuration
public class DruidConfiguration {

	@Bean
	public ServletRegistrationBean<StatViewServlet> statViewServlet() {
		// 创建servlet注册实体
		ServletRegistrationBean<StatViewServlet> servletRegistrationBean = new ServletRegistrationBean<StatViewServlet>(new StatViewServlet(), "/druid/*");
		// 设置ip白名单
		//servletRegistrationBean.addInitParameter("allow", "127.0.0.1");
		// 设置ip黑名单，如果allow与deny共同存在时,deny优先于allow
		//servletRegistrationBean.addInitParameter("deny", "192.168.0.1");
		// 设置控制台管理用户
		//servletRegistrationBean.addInitParameter("loginUsername", "druid");
		//servletRegistrationBean.addInitParameter("loginPassword", "fhadmin");
		// 是否可以重置数据
		servletRegistrationBean.addInitParameter("resetEnable", "false");
		return servletRegistrationBean;
	}

	@Bean
	public FilterRegistrationBean<WebStatFilter> statFilter() {
		// 创建过滤器
		FilterRegistrationBean<WebStatFilter> filterRegistrationBean = new FilterRegistrationBean<WebStatFilter>(new WebStatFilter());
		// 设置过滤器过滤路径
		filterRegistrationBean.addUrlPatterns("/*");
		// 忽略过滤的形式
		filterRegistrationBean.addInitParameter("exclusions", "*.js,*.gif,*.jpg,*.png,*.css,*.ico,/druid/*");
		return filterRegistrationBean;
	}
	
}
