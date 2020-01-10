package org.fh.util;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.fh.entity.PageData;
import org.fh.entity.system.User;

/**
 * 说明：权限工具类
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
public class Jurisdiction {
	
	/**shiro管理的session
	 * @return
	 */
	public static Session getSession(){
		return SecurityUtils.getSubject().getSession();
	}
	
	/**获取当前登录的用户名
	 * @return
	 */
	public static String getUsername(){
		return getSession().getAttribute(Const.SESSION_USERNAME).toString();
	}
	
	/**获取当前登录的姓名
	 * @return
	 */
	public static String getName(){
		return getSession().getAttribute(Const.SESSION_U_NAME).toString();
	}
	
	/**获取当前登录用户的角色编码
	 * @return
	 */
	public static String getRnumbers(){
		return getSession().getAttribute(Const.SESSION_RNUMBERS).toString();
	}

	/**
	 * 通过当前用户 use
	 * @return
	 */
	public static User getUser(){
		User user= (User) getSession().getAttribute(Const.SESSION_USER);
		return user;
	}



}
