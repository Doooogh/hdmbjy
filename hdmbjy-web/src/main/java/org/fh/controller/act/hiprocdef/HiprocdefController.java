package org.fh.controller.act.hiprocdef;

import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.fh.controller.act.AcBusinessController;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.service.act.HiprocdefService;
import org.fh.service.act.RuprocdefService;
import org.fh.util.Const;
import org.fh.util.ImageAnd64Binary;
import org.fh.util.PathUtil;
import org.fh.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 说明：历史流程任务
 * 作者：FH Admin Q31-35-96790
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/hiprocdef")
public class HiprocdefController extends AcBusinessController {
	
	@Autowired
	private RuprocdefService ruprocdefService;
	@Autowired
	private HiprocdefService hiprocdefService;
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("hiprocdef:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("keywords", KEYWORDS.trim());
		String STRARTTIME = pd.getString("STRARTTIME");					//开始时间
		String ENDTIME = pd.getString("ENDTIME");						//结束时间
		if(Tools.notEmpty(STRARTTIME))pd.put("lastStart", STRARTTIME+" 00:00:00");
		if(Tools.notEmpty(ENDTIME))pd.put("lastEnd", ENDTIME+" 00:00:00");
		page.setPd(pd);
		List<PageData> varList = hiprocdefService.list(page);			//列出Hiprocdef列表
		for(int i=0;i<varList.size();i++){
			Long ztime = Long.parseLong(varList.get(i).get("DURATION_").toString());
			Long tian = ztime / (1000*60*60*24);
			Long shi = (ztime % (1000*60*60*24))/(1000*60*60);
			Long fen = (ztime % (1000*60*60*24))%(1000*60*60)/(1000*60);
			varList.get(i).put("ZTIME", tian+"天"+shi+"时"+fen+"分");
			varList.get(i).put("INITATOR", getInitiator(varList.get(i).getString("PROC_INST_ID_")));//流程申请人
		}
		map.put("varList", varList);
		map.put("page", page);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**查看流程信息页面
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/view")
	@ResponseBody
	public Object view()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		List<PageData>	varList = hiprocdefService.hivarList(pd);			//列出历史流程变量列表
		Iterator<PageData> varIterator = varList.iterator();
		while (varIterator.hasNext()){
			PageData next = varIterator.next();
			if("附件".equals((String)next.get("NAME_"))){
				varIterator.remove();
			}
			if("EXAMINATION_ID".equals((String)next.get("NAME_"))){
				varIterator.remove();
			}
			if("GOVERNMENT_ID".equals((String)next.get("NAME_"))){
				varIterator.remove();
			}
			if("res".equals((String)next.get("NAME_"))){
				varIterator.remove();
			}
			if("ACT_TYPE".equals((String)next.get("NAME_"))){
				varIterator.remove();
			}
		}
		List<PageData>	hitaskList = ruprocdefService.hiTaskList(pd);		//历史任务节点列表
		Iterator<PageData> iterator = hitaskList.iterator();
		while (iterator.hasNext()){
			PageData next = iterator.next();
			if("exclusiveGateway".equals((String)next.get("ACT_TYPE_"))){
				iterator.remove();
			}else if("pre_approve".equals((String)next.get("TEXT_"))||"confirm_data".equals((String)next.get("TEXT_"))){
				iterator.remove();
			}else{
				if(null!=next.get("DURATION_")){  //根据耗时的毫秒数计算天时分秒
					Long ztime = Long.parseLong(next.get("DURATION_").toString());
					Long tian = ztime / (1000*60*60*24);
					Long shi = (ztime % (1000*60*60*24))/(1000*60*60);
					Long fen = (ztime % (1000*60*60*24))%(1000*60*60)/(1000*60);
					Long miao = (ztime % (1000*60*60*24))%(1000*60*60)%(1000*60)/1000;
					next.put("ZTIME", tian+"天"+shi+"时"+fen+"分"+miao+"秒");
				}
			}
		}
		String FILENAME = URLDecoder.decode(pd.getString("FILENAME"), "UTF-8");
		createXmlAndPngAtNowTask(pd.getString("PROC_INST_ID_"),FILENAME);	//生成当前任务节点的流程图片
		pd.put("FILENAME", FILENAME);
		String imgSrcPath = PathUtil.getProjectpath()+Const.FILEACTIVITI+FILENAME;
		map.put("imgSrc", "data:image/jpeg;base64,"+ImageAnd64Binary.getImageStr(imgSrcPath)); //解决图片src中文乱码，把图片转成base64格式显示(这样就不用修改tomcat的配置了)
		map.put("varList", varList);
		map.put("hitaskList", hitaskList);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("hiprocdef:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		PageData pd = new PageData();
		pd = this.getPageData();
		deleteHiProcessInstance(pd.getString("PROC_INST_ID_"));
		map.put("result", "success");
		return map;
	}
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("hiprocdef:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		PageData pd = new PageData();		
		Map<String,Object> map = new HashMap<String,Object>();
		pd = this.getPageData();
		String errInfo = "success";
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			for(int i=0;i<ArrayDATA_IDS.length;i++){
				deleteHiProcessInstance(ArrayDATA_IDS[i]);
			}
		}else{
			errInfo = "error";
		}
		map.put("result", errInfo);
		return map;
	}

}
