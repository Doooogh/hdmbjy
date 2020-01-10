package org.fh.controller.formdata.mbregister;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.fh.service.approveform.ApproveFormService;
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
import org.fh.service.formdata.mbregister.MbregisterService;

/** 
 * 说明：海淀区民办学校备案登记表
 * 作者：FH Admin QQ313596790
 * 时间：2019-11-04
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/mbregister")
public class MbregisterController extends BaseController {

	@Autowired
	private MbregisterService mbregisterService;

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
		pd.put("MBREGISTER_ID", this.get32UUID());	//主键
		mbregisterService.save(pd);
		PageData approveForm=new PageData();
		String APPROVEFORM_ID=this.get32UUID();
		approveForm.put("APPROVEFORM_ID",APPROVEFORM_ID);
		approveForm.put("FORMDATA_ID",pd.get("MBREGISTER_ID"));
		approveForm.put("APPROVE_ID",pd.get("APPROVE_ID"));
		approveForm.put("FORM_TYPE",pd.get("FORM_TYPE"));
		approveForm.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		PageData findFullData=new PageData();
		findFullData.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("CREATE_TIME",DateUtil.date2Str(new Date()));
		approveForm.put("SUB_STATUS",pd.get("SUB_STATUS"));  //暂存  1是
		approveFormService.save(approveForm);
		map.put("RES_ID",pd.get("MBREGISTER_ID"));
		map.put("APPROVEFORM_ID",APPROVEFORM_ID);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("mbregister:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		mbregisterService.delete(pd);
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
		mbregisterService.edit(pd);
		PageData findApproveForm=new PageData();
		findApproveForm.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		PageData approveFormRes = approveFormService.findById(findApproveForm);
		approveFormRes.put("SUB_STATUS",pd.get("SUB_STATUS"));
		approveFormService.edit(approveFormRes);
		map.put("RES_ID",pd.get("MBREGISTER_ID"));
		map.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("mbregister:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		page.setPd(pd);
		List<PageData>	varList = mbregisterService.list(page);	//列出Mbregister列表
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
		pd = mbregisterService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("mbregister:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			mbregisterService.deleteAll(ArrayDATA_IDS);
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
		titles.add("学校全称");	//2
		titles.add("校长及电话");	//3
		titles.add("联系人及电话");	//4
		titles.add("校长");	//5
		titles.add("董事长");	//6
		titles.add("法定代表人");	//7
		titles.add("决策机构成员");	//8
		titles.add("招生简章和广告");	//9
		titles.add("年度审计报告");	//10
		titles.add("举办者更名");	//11
		titles.add("收退费办法");	//12
		titles.add("章程");	//13
		titles.add("备案前");	//14
		titles.add("备案后");	//15
		titles.add("举办者意见");	//16
		titles.add("举办者日期");	//17
		titles.add("教育业务主管部门意见");	//18
		titles.add("业务部门领导签字日期");	//19
		titles.add("交件人及电话");	//20
		titles.add("交件日期");	//21
		titles.add("受理人");	//22
		titles.add("受理日期");	//23
		titles.add("审核人");	//24
		titles.add("审核日期");	//25
		titles.add("通知办结日期");	//26
		titles.add("送达地点");	//27
		titles.add("送达人及日期");	//28
		titles.add("收件人及日期");	//29
		titles.add("备注30");	//30
		titles.add("备注31");	//31
		titles.add("备注32");	//32
		dataMap.put("titles", titles);
		List<PageData> varOList = mbregisterService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("MBREGISTER_ID"));	    //1
			vpd.put("var2", varOList.get(i).getString("SC_ALLNAME"));	    //2
			vpd.put("var3", varOList.get(i).getString("PRINCIPAL_AND_PHONE"));	    //3
			vpd.put("var4", varOList.get(i).getString("LINKMAN_AND_PHONE"));	    //4
			vpd.put("var5", varOList.get(i).getString("PRINCIPAL"));	    //5
			vpd.put("var6", varOList.get(i).getString("CHAIRMAN"));	    //6
			vpd.put("var7", varOList.get(i).getString("LEGAL_PERSON"));	    //7
			vpd.put("var8", varOList.get(i).getString("DECISION_MAKING_MEMBER"));	    //8
			vpd.put("var9", varOList.get(i).getString("BROCHURE_AND_ADVERTISEMENT"));	    //9
			vpd.put("var10", varOList.get(i).getString("ANNUAL_AUDIT_REPORT"));	    //10
			vpd.put("var11", varOList.get(i).getString("CHANGE_OF_ORGANIZER"));	    //11
			vpd.put("var12", varOList.get(i).getString("REFUND_METHOD"));	    //12
			vpd.put("var13", varOList.get(i).getString("CONSTITUTION"));	    //13
			vpd.put("var14", varOList.get(i).getString("RECORD_BEFORE"));	    //14
			vpd.put("var15", varOList.get(i).getString("RECORD_AFTER"));	    //15
			vpd.put("var16", varOList.get(i).getString("ORGANIZER_OPINION"));	    //16
			vpd.put("var17", varOList.get(i).getString("ORGANIZER_DATE"));	    //17
			vpd.put("var18", varOList.get(i).getString("COMPETENT_ADVICE"));	    //18
			vpd.put("var19", varOList.get(i).getString("COMPETENT_DATE"));	    //19
			vpd.put("var20", varOList.get(i).getString("DELIVERY_AND_PHONE"));	    //20
			vpd.put("var21", varOList.get(i).getString("DELIVERY_DATE"));	    //21
			vpd.put("var22", varOList.get(i).getString("ACCEPTOR"));	    //22
			vpd.put("var23", varOList.get(i).getString("ACCEPTING_DATE"));	    //23
			vpd.put("var24", varOList.get(i).getString("VERIFIER"));	    //24
			vpd.put("var25", varOList.get(i).getString("VERIFIER_DATE"));	    //25
			vpd.put("var26", varOList.get(i).getString("COMPLETION_DATE"));	    //26
			vpd.put("var27", varOList.get(i).getString("DELIVERED"));	    //27
			vpd.put("var28", varOList.get(i).getString("PROCESS_AND_DATE"));	    //28
			vpd.put("var29", varOList.get(i).getString("ADDRESSEE_AND_DATE"));	    //29
			vpd.put("var30", varOList.get(i).getString("FIELD1"));	    //30
			vpd.put("var31", varOList.get(i).getString("FIELD2"));	    //31
			vpd.put("var32", varOList.get(i).getString("FIELD3"));	    //32
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}
	
}
