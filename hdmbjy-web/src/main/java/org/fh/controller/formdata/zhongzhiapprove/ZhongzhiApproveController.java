package org.fh.controller.formdata.zhongzhiapprove;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.fh.entity.system.User;
import org.fh.service.approveform.ApproveFormService;
import org.fh.util.Jurisdiction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.apache.shiro.authz.annotation.RequiresPermissions;

import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.util.DateUtil;
import org.fh.util.ObjectExcelView;
import org.fh.util.Tools;
import org.fh.entity.PageData;
import org.fh.service.formdata.zhongzhiapprove.ZhongzhiApproveService;

/** 
 * 说明：海淀区民办学校申请终止审核表
 * 作者：FH Admin QQ313596790
 * 时间：2019-11-13
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/zhongzhiapprove")
public class ZhongzhiApproveController extends BaseController {
	
	@Autowired
	private ZhongzhiApproveService zhongzhiapproveService;

	@Autowired
	private ApproveFormService approveFormService;

	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@ResponseBody
	public Object add() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("ZHONGZHIAPPROVE_ID", this.get32UUID());	//主键
		zhongzhiapproveService.save(pd);
		PageData approveForm=new PageData();
		String APPROVEFORM_ID=this.get32UUID();
		approveForm.put("APPROVEFORM_ID",APPROVEFORM_ID);
		approveForm.put("FORMDATA_ID",pd.get("ZHONGZHIAPPROVE_ID"));
		approveForm.put("APPROVE_ID",pd.get("APPROVE_ID"));
		approveForm.put("FORM_TYPE",pd.get("FORM_TYPE"));
		approveForm.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("SUB_STATUS",pd.get("SUB_STATUS"));  //暂存  1是
		PageData findFullData=new PageData();
		findFullData.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("CREATE_TIME",DateUtil.date2Str(new Date()));
		approveFormService.save(approveForm);
		map.put("RES_ID",pd.get("ZHONGZHIAPPROVE_ID"));
		map.put("APPROVEFORM_ID",APPROVEFORM_ID);
		map.put("result", errInfo);
		return map;
	}

	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("zhongzhiapprove:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		zhongzhiapproveService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**修改
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
		zhongzhiapproveService.edit(pd);
		PageData findApproveForm=new PageData();
		findApproveForm.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		PageData approveFormRes = approveFormService.findById(findApproveForm);
		approveFormRes.put("SUB_STATUS",pd.get("SUB_STATUS"));
		approveFormService.edit(approveFormRes);
		map.put("RES_ID",pd.get("ZHONGZHIAPPROVE_ID"));
		map.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("zhongzhiapprove:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		page.setPd(pd);
		List<PageData>	varList = zhongzhiapproveService.list(page);	//列出ZhongzhiApprove列表
		map.put("varList", varList);
		map.put("page", page);
		map.put("result", errInfo);
		return map;
	}
	
	 /**去修改页面获取数据
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goEdit")
	@ResponseBody
	public Object goEdit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = zhongzhiapproveService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("zhongzhiapprove:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			zhongzhiapproveService.deleteAll(ArrayDATA_IDS);
			errInfo = "success";
		}else{
			errInfo = "error";
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	 /**导出到excel
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/excel")
	@RequiresPermissions("toExcel")
	public ModelAndView exportExcel() throws Exception{
		ModelAndView mv = new ModelAndView();
		PageData pd = new PageData();
		pd = this.getPageData();
		Map<String,Object> dataMap = new HashMap<String,Object>();
		List<String> titles = new ArrayList<String>();
		titles.add("学校全称(盖章)");	//1
		titles.add("证号");	//2
		titles.add("校长");	//3
		titles.add("联系人");	//4
		titles.add("联系电话");	//5
		titles.add("学校地址");	//6
		titles.add("终止办学理由");	//7
		titles.add("举办者意见");	//8
		titles.add("举办者日期");	//9
		titles.add("教育行政部门审批意见");	//10
		titles.add("教育行政部门审批意见日期");	//11
		titles.add("交件人及电话");	//12
		titles.add("交件日期");	//13
		titles.add("受理人");	//14
		titles.add("受理日期");	//15
		titles.add("审核人");	//16
		titles.add("审核日期");	//17
		titles.add("通知办结日期");	//18
		titles.add("送达地点");	//19
		titles.add("送达人及日期");	//20
		titles.add("收件人及日期");	//21
		dataMap.put("titles", titles);
		List<PageData> varOList = zhongzhiapproveService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("SC_NAME"));	    //1
			vpd.put("var2", varOList.get(i).getString("CERTIFICATE_NUM"));	    //2
			vpd.put("var3", varOList.get(i).getString("PRESIDENT"));	    //3
			vpd.put("var4", varOList.get(i).getString("LINKMAN"));	    //4
			vpd.put("var5", varOList.get(i).getString("PHONE"));	    //5
			vpd.put("var6", varOList.get(i).getString("SC_ADDRESS"));	    //6
			vpd.put("var7", varOList.get(i).getString("REASON"));	    //7
			vpd.put("var8", varOList.get(i).getString("OPINION"));	    //8
			vpd.put("var9", varOList.get(i).getString("OPINION_DATE"));	    //9
			vpd.put("var10", varOList.get(i).getString("APPROVE_OPINION"));	    //10
			vpd.put("var11", varOList.get(i).getString("APPROVE_OPINION_DATE"));	    //11
			vpd.put("var12", varOList.get(i).getString("DELIVERY_AND_PHONE"));	    //12
			vpd.put("var13", varOList.get(i).getString("DELIVERY_DATE"));	    //13
			vpd.put("var14", varOList.get(i).getString("RECEIVER"));	    //14
			vpd.put("var15", varOList.get(i).getString("RECEIVER_DATE"));	    //15
			vpd.put("var16", varOList.get(i).getString("VERIFIER"));	    //16
			vpd.put("var17", varOList.get(i).getString("VERIFIER_DATE"));	    //17
			vpd.put("var18", varOList.get(i).getString("NOTIFY_DATE_COMPLETION"));	    //18
			vpd.put("var19", varOList.get(i).getString("DELIVERED_TO_SITE"));	    //19
			vpd.put("var20", varOList.get(i).getString("SERVINT_PERSON_AND_DATE"));	    //20
			vpd.put("var21", varOList.get(i).getString("ADDRESSEE_AND_DATE"));	    //21
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}



	@ResponseBody
	@RequestMapping("/getFullDataUser")
	@RequiresPermissions("examination:add")
	public Object getFullDataUser(){
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		User user= Jurisdiction.getUser();
		if(null!=user){
			map.put("FULLDATA_BY",user.getNAME());
		}else{
			map.put("FULLDATA_BY","");
		}
		map.put("result",errInfo);
		return map;
	}


}
