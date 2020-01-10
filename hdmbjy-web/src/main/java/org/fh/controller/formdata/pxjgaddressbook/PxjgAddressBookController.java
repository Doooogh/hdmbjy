package org.fh.controller.formdata.pxjgaddressbook;

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
import org.fh.service.formdata.pxjgaddressbook.PxjgAddressBookService;

/** 
 * 说明：海淀区民办教育培训机构通讯录
 * 作者：FH Admin QQ313596790
 * 时间：2019-12-05
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/pxjgaddressbook")
public class PxjgAddressBookController extends BaseController {
	
	@Autowired
	private PxjgAddressBookService pxjgaddressbookService;
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
		pd.put("PXJGADDRESSBOOK_ID", this.get32UUID());	//主键
		pxjgaddressbookService.save(pd);
		PageData approveForm=new PageData();
		String APPROVEFORM_ID=this.get32UUID();
		approveForm.put("APPROVEFORM_ID",APPROVEFORM_ID);
		approveForm.put("FORMDATA_ID",pd.get("PXJGADDRESSBOOK_ID"));
		approveForm.put("APPROVE_ID",pd.get("APPROVE_ID"));
		approveForm.put("FORM_TYPE",pd.get("FORM_TYPE"));
		approveForm.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("SUB_STATUS",pd.get("SUB_STATUS"));  //暂存  1是
		PageData findFullData=new PageData();
		findFullData.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("CREATE_TIME",DateUtil.date2Str(new Date()));
		approveFormService.save(approveForm);
		map.put("RES_ID",pd.get("PXJGADDRESSBOOK_ID"));
		map.put("APPROVEFORM_ID",APPROVEFORM_ID);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("pxjgaddressbook:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pxjgaddressbookService.delete(pd);
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
		pxjgaddressbookService.edit(pd);
		PageData findApproveForm=new PageData();
		findApproveForm.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		PageData approveFormRes = approveFormService.findById(findApproveForm);
		approveFormRes.put("SUB_STATUS",pd.get("SUB_STATUS"));
		approveFormService.edit(approveFormRes);
		map.put("RES_ID",pd.get("PXJGADDRESSBOOK_ID"));
		map.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("pxjgaddressbook:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		page.setPd(pd);
		List<PageData>	varList = pxjgaddressbookService.list(page);	//列出PxjgAddressBook列表
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
		pd = pxjgaddressbookService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("pxjgaddressbook:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			pxjgaddressbookService.deleteAll(ArrayDATA_IDS);
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
		titles.add("填表日期");	//1
		titles.add("办学许可证号一");	//2
		titles.add("办学许可证号二");	//3
		titles.add("学校全称");	//4
		titles.add("办公电话");	//5
		titles.add("校址");	//6
		titles.add("招生电话");	//7
		titles.add("学校网址");	//8
		titles.add("电子邮箱");	//9
		titles.add("投诉电话");	//10
		titles.add("接收群发手机");	//11
		titles.add("24小时电话");	//12
		titles.add("校长(中心主任)");	//13
		titles.add("校长(中心主任)单位电话");	//14
		titles.add("校长(中心主任)住宅电话");	//15
		titles.add("校长(中心主任)手机");	//16
		titles.add("法定代表人");	//17
		titles.add("法定代表人单位电话");	//18
		titles.add("法定代表人住宅电话");	//19
		titles.add("法定代表人手机");	//20
		titles.add("举办者(个人)");	//21
		titles.add("举办者(个人)单位电话");	//22
		titles.add("举办者(个人)住宅电话");	//23
		titles.add("举办者(个人)手机");	//24
		titles.add("举办者(单位)");	//25
		titles.add("举办者(单位)电话");	//26
		titles.add("通信地址收信名称");	//27
		titles.add("邮政编码");	//28
		titles.add("联系人");	//29
		titles.add("手机");	//30
		titles.add("电话");	//31
		titles.add("备注");	//32
		dataMap.put("titles", titles);
		List<PageData> varOList = pxjgaddressbookService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("FILLFORM_DATE"));	    //1
			vpd.put("var2", varOList.get(i).getString("LICENCE_ONE"));	    //2
			vpd.put("var3", varOList.get(i).getString("LICENCE_TWO"));	    //3
			vpd.put("var4", varOList.get(i).getString("SCHOOL_NAME"));	    //4
			vpd.put("var5", varOList.get(i).getString("OFFICE_PHONE"));	    //5
			vpd.put("var6", varOList.get(i).getString("SCHOOL_ADDRESS"));	    //6
			vpd.put("var7", varOList.get(i).getString("ENROLLMENT_PHONE"));	    //7
			vpd.put("var8", varOList.get(i).getString("SCHOOL_WEBSITE"));	    //8
			vpd.put("var9", varOList.get(i).getString("ELECTRONIC_MAIL"));	    //9
			vpd.put("var10", varOList.get(i).getString("COMPLAINT_PHONE"));	    //10
			vpd.put("var11", varOList.get(i).getString("PRINCIPAL_PHONE"));	    //11
			vpd.put("var12", varOList.get(i).getString("TWENTYFOUR_PHONE"));	    //12
			vpd.put("var13", varOList.get(i).getString("PRINCIPAL_NAME"));	    //13
			vpd.put("var14", varOList.get(i).getString("PRINCIPAL_WORKPHONE"));	    //14
			vpd.put("var15", varOList.get(i).getString("PRINCIPAL_HOUSEPHONE"));	    //15
			vpd.put("var16", varOList.get(i).getString("PRINCIPAL_MOBILEPHONE"));	    //16
			vpd.put("var17", varOList.get(i).getString("LEGAL_NAME"));	    //17
			vpd.put("var18", varOList.get(i).getString("LEGAL_WORKPHONE"));	    //18
			vpd.put("var19", varOList.get(i).getString("LEGAL_HOUSEPHONE"));	    //19
			vpd.put("var20", varOList.get(i).getString("LEGAL_MOBILEPHONE"));	    //20
			vpd.put("var21", varOList.get(i).getString("GR_ORGAN_NAME"));	    //21
			vpd.put("var22", varOList.get(i).getString("GR_ORGAN_WORKPHONE"));	    //22
			vpd.put("var23", varOList.get(i).getString("GR_ORGAN_HOUSEPHONE"));	    //23
			vpd.put("var24", varOList.get(i).getString("GR_ORGAN_MOBILEPHONE"));	    //24
			vpd.put("var25", varOList.get(i).getString("DW_ORGAN_NAME"));	    //25
			vpd.put("var26", varOList.get(i).getString("DW_ORGAN_PHONE"));	    //26
			vpd.put("var27", varOList.get(i).getString("MAIL_ADDRESS"));	    //27
			vpd.put("var28", varOList.get(i).getString("POSTAL_CODE"));	    //28
			vpd.put("var29", varOList.get(i).getString("LINKMAN"));	    //29
			vpd.put("var30", varOList.get(i).getString("MOBILE_PHONE"));	    //30
			vpd.put("var31", varOList.get(i).getString("PHONE"));	    //31
			vpd.put("var32", varOList.get(i).getString("BEIZHU"));	    //32
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
