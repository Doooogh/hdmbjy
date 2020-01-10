package org.fh.config;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import com.alibaba.druid.pool.DruidDataSource;

/**
 * 说明：第二数据源配置
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
@Configuration
@MapperScan(basePackages = No2DataSourceConfig.PACKAGE, sqlSessionFactoryRef = "no2SqlSessionFactory")	//扫描 Mapper 接口并容器管理
public class No2DataSourceConfig {

    static final String PACKAGE = "org.fh.mapper.dsno2";								//master 目录
    static final String MAPPER_LOCATION = "classpath:mybatis/dsno2/*/*.xml";			//扫描的 xml 目录
    static final String CONFIG_LOCATION = "classpath:mybatis/dsno2/mybatis-config.xml"; //自定义的mybatis config 文件位置
    static final String TYPE_ALIASES_PACKAGE = "org.fh.entity"; 						//扫描的 实体类 目录
 
    @Value("${datasource.no2.url}")
    private String url;
 
    @Value("${datasource.no2.username}")
    private String user;
 
    @Value("${datasource.no2.password}")
    private String password;
 
    @Value("${datasource.no2.driver-class-name}")
    private String driverClass;
 
    @Bean(name = "no2DataSource")
    public DataSource no2DataSource() {
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setDriverClassName(driverClass);
        dataSource.setUrl(url);
        dataSource.setUsername(user);
        dataSource.setPassword(password);
        return dataSource;
    }
 
    @Bean(name = "no2TransactionManager")
    public DataSourceTransactionManager no2TransactionManager() {
        return new DataSourceTransactionManager(no2DataSource());
    }
 
    @Bean(name = "no2SqlSessionFactory")
    public SqlSessionFactory no2SqlSessionFactory(@Qualifier("no2DataSource") DataSource no2DataSource)throws Exception {
        final SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        sessionFactory.setDataSource(no2DataSource);
        sessionFactory.setMapperLocations(new PathMatchingResourcePatternResolver().getResources(No2DataSourceConfig.MAPPER_LOCATION));
        sessionFactory.setConfigLocation(new DefaultResourceLoader().getResource(No2DataSourceConfig.CONFIG_LOCATION));
        sessionFactory.setTypeAliasesPackage(No2DataSourceConfig.TYPE_ALIASES_PACKAGE);
        return sessionFactory.getObject();
    }
}
