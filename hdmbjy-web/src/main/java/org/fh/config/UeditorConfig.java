package org.fh.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Created with IntelliJ IDEA.
 * User: li long
 * Date: 2019/11/25
 * Description: No Description
 */
@Component
public class UeditorConfig {

    //@Value("${ueditor.httpurl}")
    private String httpurl;

    public String getHttpurl() {
        return httpurl;
    }

    public void setHttpurl(String httpurl) {
        this.httpurl = httpurl;
    }
}
