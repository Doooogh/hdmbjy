package org.fh.controller.formdata.termapprove;

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
import org.fh.service.formdata.termapprove.TermApproveService;

/** 
 * 说明：海淀区民办培训学校申请终止审批表
 * 作者：FH Admin QQ313596790
 * 时间：2019-12-04
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/termapprove")
public class TermApproveController extends BaseController {
	
	@Autowired
	private TermApproveService termapproveService;
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
		pd.put("TERMAPPROVE_ID", this.get32UUID());	//主键
		termapproveService.save(pd);
		PageData approveForm=new PageData();
		String APPROVEFORM_ID=this.get32UUID();
		approveForm.put("APPROVEFORM_ID",APPROVEFORM_ID);
		approveForm.put("FORMDATA_ID",pd.get("TERMAPPROVE_ID"));
		approveForm.put("APPROVE_ID",pd.get("APPROVE_ID"));
		approveForm.put("FORM_TYPE",pd.get("FORM_TYPE"));
		approveForm.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("SUB_STATUS",pd.get("SUB_STATUS"));  //暂存  1是
		PageData findFullData=new PageData();
		findFullData.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("CREATE_TIME",DateUtil.date2Str(new Date()));
		approveFormService.save(approveForm);
		map.put("RES_ID",pd.get("TERMAPPROVE_ID"));
		map.put("APPROVEFORM_ID",APPROVEFORM_ID);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		termapproveService.delete(pd);
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
		termapproveService.edit(pd);
		PageData findApproveForm=new PageData();
		findApproveForm.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		PageData approveFormRes = approveFormService.findById(findApproveForm);
		approveFormRes.put("SUB_STATUS",pd.get("SUB_STATUS"));
		approveFormService.edit(approveFormRes);
		map.put("RES_ID",pd.get("TERMAPPROVE_ID"));
		map.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("termapprove:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		page.setPd(pd);
		List<PageData>	varList = termapproveService.list(page);	//列出TermApprove列表
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
		pd = termapproveService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			termapproveService.deleteAll(ArrayDATA_IDS);
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
		titles.add("海教社停号");	//1
		titles.add("学校全称");	//2
		titles.add("许可证号");	//3
		titles.add("校长");	//4
		titles.add("校长身份证号");	//5
		titles.add("校长家庭住址");	//6
		titles.add("校长电话手机");	//7
		titles.add("法定代表人");	//8
		titles.add("法定代表人身份证号");	//9
		titles.add("法定代表人家庭住址");	//10
		titles.add("法定代表人电话手机");	//11
		titles.add("举办者(个人)");	//12
		titles.add("举办者(个人)身份证号");	//13
		titles.add("举办者(个人)家庭住址");	//14
		titles.add("举办者(个人)电话手机");	//15
		titles.add("举办者单位名称");	//16
		titles.add("举办者单位电话");	//17
		titles.add("举办者单位地址");	//18
		titles.add("举办者单位地址电话");	//19
		titles.add("举办者单位地址邮编");	//20
		titles.add("终止办学理由");	//21
		titles.add("善后工作处理结果");	//22
		titles.add("举办者意见");	//23
		titles.add("举办者意见日期");	//24
		titles.add("教育行政部门意见");	//25
		titles.add("教育行政部门意见日期");	//26
		titles.add("交件人");	//27
		titles.add("交件日期");	//28
		titles.add("受理人");	//29
		titles.add("受理日期");	//30
		titles.add("审核人");	//31
		titles.add("审核日期");	//32
		titles.add("复审人");	//33
		titles.add("复审日期");	//34
		titles.add("备注");	//35
		dataMap.put("titles", titles);
		List<PageData> varOList = termapproveService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("NUMBER"));	    //1
			vpd.put("var2", varOList.get(i).getString("SCHOOL_ALLNAME"));	    //2
			vpd.put("var3", varOList.get(i).getString("LICENSE"));	    //3
			vpd.put("var4", varOList.get(i).getString("PRINCIPAL"));	    //4
			vpd.put("var5", varOList.get(i).getString("PRINCIPAL_ID_NUMBER"));	    //5
			vpd.put("var6", varOList.get(i).getString("PRINCIPAL_ADDRESS"));	    //6
			vpd.put("var7", varOList.get(i).getString("PRINCIPAL_PHONE"));	    //7
			vpd.put("var8", varOList.get(i).getString("LEGAL_PERSON"));	    //8
			vpd.put("var9", varOList.get(i).getString("LEGAL PERSON_ID_NUMBER"));	    //9
			vpd.put("var10", varOList.get(i).getString("LEGAL PERSON_ADDRESS"));	    //10
			vpd.put("var11", varOList.get(i).getString("LEGAL PERSON_PHONE"));	    //11
			vpd.put("var12", varOList.get(i).getString("ORGANIZER"));	    //12
			vpd.put("var13", varOList.get(i).getString("ORGANIZER_ID_NUMBER"));	    //13
			vpd.put("var14", varOList.get(i).getString("ORGANIZER_ADDRESS"));	    //14
			vpd.put("var15", varOList.get(i).getString("ORGANIZER_PHONE"));	    //15
			vpd.put("var16", varOList.get(i).getString("ORGANIZER_C_NAME"));	    //16
			vpd.put("var17", varOList.get(i).getString("ORGANIZER_C_PHONE"));	    //17
			vpd.put("var18", varOList.get(i).getString("ORGANIZER_C_ADDRESS"));	    //18
			vpd.put("var19", varOList.get(i).getString("ORGANIZER_C_ADDRESS_PHONE"));	    //19
			vpd.put("var20", varOList.get(i).getString("ORGANIZER_C_ADDRESS_POST"));	    //20
			vpd.put("var21", varOList.get(i).getString("TERM_REASON"));	    //21
			vpd.put("var22", varOList.get(i).getString("HAND_RESULT"));	    //22
			vpd.put("var23", varOList.get(i).getString("ORGANIZER_OPINION"));	    //23
			vpd.put("var24", varOList.get(i).getString("ORGANIZER_OPINION_DATE"));	    //24
			vpd.put("var25", varOList.get(i).getString("DEPT_OPINION"));	    //25
			vpd.put("var26", varOList.get(i).getString("DEPT_OPINION_DATE"));	    //26
			vpd.put("var27", varOList.get(i).getString("SENDER"));	    //27
			vpd.put("var28", varOList.get(i).getString("SEND_DATE"));	    //28
			vpd.put("var29", varOList.get(i).getString("RECEIVER"));	    //29
			vpd.put("var30", varOList.get(i).getString("RECEIVE_DATE"));	    //30
			vpd.put("var31", varOList.get(i).getString("VERIFIER"));	    //31
			vpd.put("var32", varOList.get(i).getString("VERIFIER_DATE"));	    //32
			vpd.put("var33", varOList.get(i).getString("REHEARING_PERSON"));	    //33
			vpd.put("var34", varOList.get(i).getString("REHEARING_PERSON_DATE"));	    //34
			vpd.put("var35", varOList.get(i).getString("BEIZHU"));	    //35
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}


	@ResponseBody
	@RequestMapping("/getFullDataUser")
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
