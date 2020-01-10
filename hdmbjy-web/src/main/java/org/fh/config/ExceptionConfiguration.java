package org.fh.config;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

/**
 * 说明：错误异常拦截处理
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
@Configuration
public class ExceptionConfiguration implements HandlerExceptionResolver {

	@Override
	public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler,
			Exception ex) {
		ModelAndView mv = new ModelAndView(new MappingJackson2JsonView());	//返回json
		
		String exInfo = ex.toString().replaceAll("\n", "<br/>");
		
		boolean status = exInfo.contains("Subject does not have permission");
		
		if(status){
			exInfo = "[没有此页面的访问权限]" + exInfo;
        }else {
        	System.out.println("==============异常开始=============");
    		ex.printStackTrace();
    		System.out.println("==============异常结束=============");
        }
		mv.addObject("exception", exInfo);
		mv.addObject("result", "exception");
		
		return mv;
	}
	
}
