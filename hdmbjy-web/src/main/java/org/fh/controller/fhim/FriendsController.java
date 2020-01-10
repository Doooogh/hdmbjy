package org.fh.controller.fhim;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.service.fhim.FriendsService;
import org.fh.util.Jurisdiction;
import org.fh.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 说明：好友管理
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/friends")
public class FriendsController extends BaseController {
	
	@Autowired
	private FriendsService friendsService;
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("friends:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String keywords = pd.getString("keywords");						//关键词检索条件
		if(Tools.notEmpty(keywords))pd.put("keywords", keywords.trim());
		pd.put("USERNAME", Jurisdiction.getUsername());
		page.setPd(pd);
		List<PageData>	varList = friendsService.datalistPage(page);	//列出Friends列表
		map.put("varList", varList);
		map.put("page", page);
		map.put("pd", pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/deletefromlist")
	@ResponseBody
	@RequiresPermissions("friends:del")
	public Object deletefromlist() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		PageData pd = new PageData();
		pd = this.getPageData();
		String errInfo = "success";
		friendsService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**拉黑
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/pullblackfromlist")
	@RequiresPermissions("friends:del")
	@ResponseBody
	public Object pullblackfromlist() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		PageData pd = new PageData();
		pd = this.getPageData();
		String errInfo = "success";
		friendsService.delete(pd);						//删除自己好友栏
		pd.put("USERNAME", Jurisdiction.getUsername());	//用户名
		friendsService.pullblack(pd);					//删除对方好友栏
		map.put("result", errInfo);							//返回结果
		return map;
	}
	
	/**删除 从右下角好友列表里面右键拉黑好友
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("friends:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		PageData pd = new PageData();
		pd = this.getPageData();
		String errInfo = "success";
		String FRIENDS_ID = pd.getString("FRIENDS_ID");
		if("null".equals(FRIENDS_ID)){						
			pd.put("USERNAME", Jurisdiction.getUsername());	//用户名
			pd = friendsService.findMyFriend(pd);
		}						
		friendsService.delete(pd);
		map.put("result", errInfo);								//返回结果
		return map;
	}
	
	/**拉黑 从右下角好友列表里面右键拉黑好友
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/pullblack")
	@RequiresPermissions("friends:del")
	@ResponseBody
	public Object pullblack() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String FRIENDS_ID = pd.getString("FRIENDS_ID");
		if("null".equals(FRIENDS_ID)){						
			pd.put("USERNAME", Jurisdiction.getUsername());	//用户名
			pd = friendsService.findMyFriend(pd);
		}
		friendsService.delete(pd);						//删除自己好友栏
		pd.put("USERNAME", Jurisdiction.getUsername());	//用户名
		friendsService.pullblack(pd);					//删除对方好友栏
		map.put("result", errInfo);						//返回结果
		return map;
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("friends:edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		friendsService.edit(pd);
		map.put("result", errInfo);								//返回结果
		return map;
	}
	
	 /**去修改页面
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goEdit")
	@ResponseBody
	public Object goEdit()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String FRIENDS_ID = pd.getString("FRIENDS_ID");
		if("null".equals(FRIENDS_ID)){						//从右下角好友列表里面右键
			pd.put("USERNAME", Jurisdiction.getUsername());	//用户名
			pd = friendsService.findMyFriend(pd);
		}else{
			pd = friendsService.findById(pd);				//根据ID读取
		}
		map.put("pd", pd);
		map.put("result", errInfo);							//返回结果
		return map;
	}
	
	/**添加好友检索
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/search")
	@ResponseBody
	public Object search()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		int fcount = 3;
		if(null !=  pd.get("fcount")) {
			fcount = Integer.parseInt(pd.get("fcount").toString());		//一列数量
		}
		String keywords = pd.getString("keywords");						//关键词检索条件
		if(Tools.notEmpty(keywords))pd.put("keywords", keywords.trim());
		pd.put("USERNAME", Jurisdiction.getUsername());					//不检索自己
		List<PageData>	varList = friendsService.listAllToSearch(pd);
		List<List<PageData>> zlist = new ArrayList<List<PageData>>();
		List<PageData> list = null;
		for(int i=0;i<varList.size();i++) {
			if(i%fcount == 0) {
				list = new ArrayList<PageData>();
			}
			list.add(varList.get(i));
			if((i+1)%fcount == 0 || (i+1) == varList.size()) {
				zlist.add(list);
			}
		}
		map.put("varList", zlist);
		map.put("result", errInfo);										//返回结果
		return map;
	}
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@ResponseBody
	@RequiresPermissions("friends:del")
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			friendsService.deleteAll(ArrayDATA_IDS);
		}else{
			errInfo = "error";
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}

}
