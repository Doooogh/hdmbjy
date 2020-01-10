package org.fh.controller.system;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.apache.shiro.session.Session;
import org.fh.controller.base.BaseController;
import org.fh.entity.PageData;
import org.fh.entity.system.User;
import org.fh.service.system.UeditorService;
import org.fh.util.Const;
import org.fh.util.Jurisdiction;

/** 
 * 说明：副本编辑器内容缓存
 * 作者：FH Admin QQ313596790
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/ueditor")
public class UeditorController extends BaseController {
	
	@Autowired
	private UeditorService ueditorService;
	
	
	/**修改or新增
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		Session session = Jurisdiction.getSession();
		User user = (User)session.getAttribute(Const.SESSION_USER);
		pd.put("UEDITOR_ID", this.get32UUID());	//主键
		pd.put("USER_ID", user.getUSER_ID());	//用户ID
		pd.put("USERNAME", user.getUSERNAME());	//用户名
		ueditorService.edit(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	 /**获取内容
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/getContent")
	@ResponseBody
	public Object getContent()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("USERNAME", Jurisdiction.getUsername());	//用户名
		pd = ueditorService.findById(pd);				//根据用户名和类型读取
		if(null == pd) errInfo = "error";
		map.put("pd", pd);
		map.put("result", errInfo);						//返回结果
		return map;
	}	
	
}
