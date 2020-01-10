package org.fh.controller.fhdb;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;


import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.service.fhdb.BRdbService;
import org.fh.util.DateUtil;
import org.fh.util.DbFH;
import org.fh.util.FileUtil;
import org.fh.util.Jurisdiction;
import org.fh.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 说明：数据库管理(备份和还原)
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/brdb")
public class BRdbController extends BaseController {
	
	@Autowired
	private BRdbService bRdbService;
	
	/**列出所有表
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/listAllTable")
	@RequiresPermissions("brdb:listAllTable")
	@ResponseBody
	public Object listAllTable() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		Object[] arrOb = DbFH.getTables();
		List<String> tblist = (List<String>)arrOb[1];
		List<List<String>> zlist = new ArrayList<List<String>>();
		List<String> list = null;
		for(int i=0;i<tblist.size();i++) {
			if(i%2 == 0) {
				list = new ArrayList<String>();
			}
			list.add(tblist.get(i));
			if((i+1)%2 == 0 || (i+1) == tblist.size()) {
				zlist.add(list);
			}
		}
		map.put("varList", zlist);				//所有表
		map.put("dbtype", arrOb[2]);			//数据库类型
		map.put("databaseName", arrOb[0]);		//数据库名
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	 /**备份全库
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/backupAll")
	@RequiresPermissions("brdb:add")
	@ResponseBody
	public Object backupAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		String username = Jurisdiction.getUsername();
		PageData pd = new PageData();		
		pd = this.getPageData();
		String kackupPath;
		kackupPath = DbFH.getDbFH().backup("").toString();			//调用数据库备份
		if(Tools.notEmpty(kackupPath) && !"errer".equals(kackupPath)){
			pd.put("FHDB_ID", this.get32UUID());					//主键
			pd.put("USERNAME", username);							//操作用户
			pd.put("BACKUP_TIME", DateUtil.date2Str(new Date()));	//备份时间
			pd.put("TABLENAME", "整库");								//表名
			pd.put("SQLPATH", kackupPath);							//存储位置
			pd.put("DBSIZE", FileUtil.getFilesize(kackupPath));		//文件大小
			pd.put("TYPE", 1);										//1: 备份整库，2：备份某表
			pd.put("BZ", username+"备份全库操作");					//备注
			try {
				bRdbService.save(pd);
			} catch (Exception e) {
				errInfo = "error";
			}
		}else{
			errInfo = "error";
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	 /**备份单表
	 * @param
	 * @throws ExecutionException 
	 * @throws InterruptedException 
	 * @throws Exception
	 */
	@RequestMapping(value="/backupTable")
	@ResponseBody
	@RequiresPermissions("brdb:add")
	public Object backupTable() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String username = Jurisdiction.getUsername();
		String TABLENAME = pd.getString("fhtable");					//页面ajax传过来的表名
		String kackupPath;
		kackupPath = DbFH.getDbFH().backup(TABLENAME).toString();	//调用数据库备份
		if(Tools.notEmpty(kackupPath) && !"errer".equals(kackupPath)){
			pd.put("FHDB_ID", this.get32UUID());				//主键
			pd.put("USERNAME", username);						//操作用户
			pd.put("BACKUP_TIME", DateUtil.date2Str(new Date()));	//备份时间
			pd.put("TABLENAME", TABLENAME);						//表名
			pd.put("SQLPATH", kackupPath);						//存储位置
			pd.put("DBSIZE", FileUtil.getFilesize(kackupPath));	//文件大小
			pd.put("TYPE", 2);									//1: 备份整库，2：备份某表
			pd.put("BZ", username+"备份单表");					//备注
			try {
				bRdbService.save(pd);
			} catch (Exception e) {
				errInfo = "error";
			}
		}else{
			errInfo = "error";
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	 /**数据还原操作
	 * @param
	 * @throws ExecutionException 
	 * @throws InterruptedException 
	 * @throws Exception
	 */
	@RequestMapping(value="/dbRecover")
	@ResponseBody
	@RequiresPermissions("brdb:edit")
	public Object dbRecover() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String TABLENAME = pd.getString("TABLENAME");			//页面ajax传过来的表名或数据库名
		String SQLPATH = pd.getString("SQLPATH");				//页面ajax传过来的备份文件完整路径
		String returnStr = DbFH.getDbFH().recover(TABLENAME, SQLPATH).toString();
		if("ok".equals(returnStr)){
			errInfo = "success";
		}else{
			errInfo = "error";
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@ResponseBody
	@RequiresPermissions("brdb:del")
	public Object delete() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		bRdbService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("brdb:edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		bRdbService.edit(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("brdb:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String keywords = pd.getString("keywords");						//关键词检索条件
		if(Tools.notEmpty(keywords))pd.put("keywords", keywords.trim());
		String lastStart = pd.getString("lastStart");					//开始时间
		String lastEnd = pd.getString("lastEnd");						//结束时间
		if(Tools.notEmpty(lastStart))pd.put("lastLoginStart", lastStart+" 00:00:00");
		if(Tools.notEmpty(lastEnd)) pd.put("lastLoginEnd", lastEnd+" 00:00:00");
		page.setPd(pd);
		List<PageData>	varList = bRdbService.list(page);			//列出Fhdb列表
		Map<String,String> DBmap = DbFH.getDBParameter();
		map.put("varList", varList);
		map.put("page", page);
		map.put("pd", pd);
		map.put("dbtype", DBmap.get("dbtype").toString());		//数据库类型
		map.put("remoteDB", DBmap.get("remoteDB").toString());	//是否远程备份数据库 yes or no
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	 /**去修改页面
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goEdit")
	@RequiresPermissions("brdb:edit")
	@ResponseBody
	public Object goEdit()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = bRdbService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("brdb:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			bRdbService.deleteAll(ArrayDATA_IDS);
		}else{
			errInfo = "error";
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
}
