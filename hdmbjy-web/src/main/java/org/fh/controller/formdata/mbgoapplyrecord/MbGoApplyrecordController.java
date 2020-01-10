package org.fh.controller.formdata.mbgoapplyrecord;

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
import org.fh.service.formdata.mbgoapplyrecord.MbGoApplyrecordService;

/** 
 * 说明：行政民办中小学变更1海淀区民办学校申请备案登记表
 * 作者：FH Admin QQ313596790
 * 时间：2019-11-06
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/mbgoapplyrecord")
public class MbGoApplyrecordController extends BaseController {
	
	@Autowired
	private MbGoApplyrecordService mbgoapplyrecordService;

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
		pd.put("MBGOAPPLYRECORD_ID", this.get32UUID());	//主键
		mbgoapplyrecordService.save(pd);
		PageData approveForm=new PageData();
		String APPROVEFORM_ID=this.get32UUID();
		approveForm.put("APPROVEFORM_ID",APPROVEFORM_ID);
		approveForm.put("FORMDATA_ID",pd.get("MBGOAPPLYRECORD_ID"));
		approveForm.put("APPROVE_ID",pd.get("APPROVE_ID"));
		approveForm.put("FORM_TYPE",pd.get("FORM_TYPE"));
		approveForm.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		PageData findFullData=new PageData();
		findFullData.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("CREATE_TIME",DateUtil.date2Str(new Date()));
		approveForm.put("SUB_STATUS",pd.get("SUB_STATUS"));  //暂存  1是
		approveFormService.save(approveForm);
		map.put("RES_ID",pd.get("MBGOAPPLYRECORD_ID"));
		map.put("APPROVEFORM_ID",APPROVEFORM_ID);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("mbgoapplyrecord:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		mbgoapplyrecordService.delete(pd);
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
		mbgoapplyrecordService.edit(pd);
		PageData findApproveForm=new PageData();
		findApproveForm.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		PageData approveFormRes = approveFormService.findById(findApproveForm);
		approveFormRes.put("SUB_STATUS",pd.get("SUB_STATUS"));
		approveFormService.edit(approveFormRes);
		map.put("RES_ID",pd.get("MBGOAPPLYRECORD_ID"));
		map.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("mbgoapplyrecord:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		page.setPd(pd);
		List<PageData>	varList = mbgoapplyrecordService.list(page);	//列出MbGoApplyrecord列表
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
		pd = mbgoapplyrecordService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("mbgoapplyrecord:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			mbgoapplyrecordService.deleteAll(ArrayDATA_IDS);
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
		titles.add("学校全称");	//1
		titles.add("校长及电话");	//2
		titles.add("联系人及电话");	//3
		titles.add("预备案项目校名");	//4
		titles.add("预备案项目地址");	//5
		titles.add("预备案项目层次");	//6
		titles.add("预备案项目类别");	//7
		titles.add("预备案项目分立");	//8
		titles.add("预备案项目合并");	//9
		titles.add("预备案项目举办者");	//10
		titles.add("变更前");	//11
		titles.add("变更后");	//12
		titles.add("举办者意见");	//13
		titles.add("举办者意见日期");	//14
		titles.add("教育行政部门审批意见");	//15
		titles.add("教育行政部门审批意见日期");	//16
		titles.add("交件人及电话");	//17
		titles.add("交件日期");	//18
		titles.add("受理人");	//19
		titles.add("受理日期");	//20
		titles.add("审批人");	//21
		titles.add("审核日期");	//22
		titles.add("通知办结日期");	//23
		titles.add("送达地点");	//24
		titles.add("送达人及日期");	//25
		titles.add("收件人及日期");	//26
		dataMap.put("titles", titles);
		List<PageData> varOList = mbgoapplyrecordService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("SC_NAME"));	    //1
			vpd.put("var2", varOList.get(i).getString("PRINCIPAL_AND_PHONE"));	    //2
			vpd.put("var3", varOList.get(i).getString("CONTACTS_AND_PHONE"));	    //3
			vpd.put("var4", varOList.get(i).getString("PRE_PRO_SCNAME"));	    //4
			vpd.put("var5", varOList.get(i).getString("PRE_PRO_ADDREDD"));	    //5
			vpd.put("var6", varOList.get(i).getString("PRE_PRO_LEVEL"));	    //6
			vpd.put("var7", varOList.get(i).getString("PRE_PRO_TYPE"));	    //7
			vpd.put("var8", varOList.get(i).getString("PRE_PRO_DISCRETE"));	    //8
			vpd.put("var9", varOList.get(i).getString("PRE_PRO_MERGE"));	    //9
			vpd.put("var10", varOList.get(i).getString("PRE_PRO_ORGANIZER"));	    //10
			vpd.put("var11", varOList.get(i).getString("CHANGE_BEFORE"));	    //11
			vpd.put("var12", varOList.get(i).getString("CHANGE_AFTER"));	    //12
			vpd.put("var13", varOList.get(i).getString("ORGANIZER_OPINION"));	    //13
			vpd.put("var14", varOList.get(i).getString("ORGANIZER_OPINION_DATE"));	    //14
			vpd.put("var15", varOList.get(i).getString("ADMINISTRATIVE_OPINION"));	    //15
			vpd.put("var16", varOList.get(i).getString("ADMINISTRATIVE_OPINION_DATE"));	    //16
			vpd.put("var17", varOList.get(i).getString("DELIVERY_AND_PHONE"));	    //17
			vpd.put("var18", varOList.get(i).getString("DELIVERY_DATE"));	    //18
			vpd.put("var19", varOList.get(i).getString("RECEIVER"));	    //19
			vpd.put("var20", varOList.get(i).getString("RECEIVER_DATE"));	    //20
			vpd.put("var21", varOList.get(i).getString("AUDITOR"));	    //21
			vpd.put("var22", varOList.get(i).getString("AUDITOR_DATE"));	    //22
			vpd.put("var23", varOList.get(i).getString("NOTITY_DATE_COMPLETE"));	    //23
			vpd.put("var24", varOList.get(i).getString("DELIVERED_TO_SITE"));	    //24
			vpd.put("var25", varOList.get(i).getString("SERVING_PERSON_AND_DATE"));	    //25
			vpd.put("var26", varOList.get(i).getString("RECIPIENT_AND_DATE"));	    //26
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
