package org.fh.controller.formdata.mbpxregister;

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
import org.fh.service.formdata.mbpxregister.MbPxRegisterService;

/** 
 * 说明：海淀区民办培训学校申请备案登记表
 * 作者：FH Admin QQ313596790
 * 时间：2019-12-06
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/mbpxregister")
public class MbPxRegisterController extends BaseController {
	
	@Autowired
	private MbPxRegisterService mbpxregisterService;

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
		pd.put("MBPXREGISTER_ID", this.get32UUID());	//主键
		mbpxregisterService.save(pd);
		PageData approveForm=new PageData();
		String APPROVEFORM_ID=this.get32UUID();
		approveForm.put("APPROVEFORM_ID",APPROVEFORM_ID);
		approveForm.put("FORMDATA_ID",pd.get("MBPXREGISTER_ID"));
		approveForm.put("APPROVE_ID",pd.get("APPROVE_ID"));
		approveForm.put("FORM_TYPE",pd.get("FORM_TYPE"));
		approveForm.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("SUB_STATUS",pd.get("SUB_STATUS"));  //暂存  1是
		PageData findFullData=new PageData();
		findFullData.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("CREATE_TIME",DateUtil.date2Str(new Date()));
		approveFormService.save(approveForm);
		map.put("RES_ID",pd.get("MBPXREGISTER_ID"));
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
		mbpxregisterService.delete(pd);
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
		mbpxregisterService.edit(pd);
		PageData findApproveForm=new PageData();
		findApproveForm.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		PageData approveFormRes = approveFormService.findById(findApproveForm);
		approveFormRes.put("SUB_STATUS",pd.get("SUB_STATUS"));
		approveFormService.edit(approveFormRes);
		map.put("RES_ID",pd.get("MBPXREGISTER_ID"));
		map.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		page.setPd(pd);
		List<PageData>	varList = mbpxregisterService.list(page);	//列出MbPxRegister列表
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
		pd = mbpxregisterService.findById(pd);	//根据ID读取
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
			mbpxregisterService.deleteAll(ArrayDATA_IDS);
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
	public ModelAndView exportExcel() throws Exception{
		ModelAndView mv = new ModelAndView();
		PageData pd = new PageData();
		pd = this.getPageData();
		Map<String,Object> dataMap = new HashMap<String,Object>();
		List<String> titles = new ArrayList<String>();
		titles.add("学校全称");	//1
		titles.add("校长及电话");	//2
		titles.add("联系人及电话");	//3
		titles.add("校长");	//4
		titles.add("决策机构负责人");	//5
		titles.add("决策机构成员");	//6
		titles.add("法定代表人");	//7
		titles.add("举办者更名");	//8
		titles.add("开办专业");	//9
		titles.add("备案前");	//10
		titles.add("备案后");	//11
		titles.add("举办者意见");	//12
		titles.add("举办者日期");	//13
		titles.add("教育业务主管部门意见");	//14
		titles.add("业务部门领导签字日期");	//15
		titles.add("交件人及电话");	//16
		titles.add("交件日期");	//17
		titles.add("受理人");	//18
		titles.add("受理日期");	//19
		titles.add("审核人");	//20
		titles.add("审核日期");	//21
		titles.add("教民号1");	//22
		titles.add("教民号2");	//23
		titles.add("备注");	//24
		dataMap.put("titles", titles);
		List<PageData> varOList = mbpxregisterService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("SC_ALLNAME"));	    //1
			vpd.put("var2", varOList.get(i).getString("PRINCIPAL_AND_PHONE"));	    //2
			vpd.put("var3", varOList.get(i).getString("LINKMAN_AND_PHONE"));	    //3
			vpd.put("var4", varOList.get(i).getString("PRINCIPAL"));	    //4
			vpd.put("var5", varOList.get(i).getString("DECISION_MAKING_HEADMAN"));	    //5
			vpd.put("var6", varOList.get(i).getString("DECISION_MAKING_MEMBER"));	    //6
			vpd.put("var7", varOList.get(i).getString("LEGAL_PERSON"));	    //7
			vpd.put("var8", varOList.get(i).getString("CHANGE_OF_ORGANIZER"));	    //8
			vpd.put("var9", varOList.get(i).getString("OPEN_MAJOR"));	    //9
			vpd.put("var10", varOList.get(i).getString("RECORD_BEFORE"));	    //10
			vpd.put("var11", varOList.get(i).getString("RECORD_AFTER"));	    //11
			vpd.put("var12", varOList.get(i).getString("ORGANIZER_OPINION"));	    //12
			vpd.put("var13", varOList.get(i).getString("ORGANIZER_DATE"));	    //13
			vpd.put("var14", varOList.get(i).getString("COMPETENT_ADVICE"));	    //14
			vpd.put("var15", varOList.get(i).getString("COMPETENT_DATE"));	    //15
			vpd.put("var16", varOList.get(i).getString("DELIVERY_AND_PHONE"));	    //16
			vpd.put("var17", varOList.get(i).getString("DELIVERY_DATE"));	    //17
			vpd.put("var18", varOList.get(i).getString("ACCEPTOR"));	    //18
			vpd.put("var19", varOList.get(i).getString("ACCEPTING_DATE"));	    //19
			vpd.put("var20", varOList.get(i).getString("VERIFIER"));	    //20
			vpd.put("var21", varOList.get(i).getString("VERIFIER_DATE"));	    //21
			vpd.put("var22", varOList.get(i).getString("NUMBER1"));	    //22
			vpd.put("var23", varOList.get(i).getString("NUMBER2"));	    //23
			vpd.put("var24", varOList.get(i).getString("BEIZHU"));	    //24
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
