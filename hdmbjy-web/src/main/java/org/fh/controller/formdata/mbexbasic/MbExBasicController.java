package org.fh.controller.formdata.mbexbasic;

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
import org.fh.service.formdata.mbexbasic.MbExBasicService;

/** 
 * 说明：年检民办幼儿园海淀区民办幼儿园基本情况表
 * 作者：FH Admin QQ313596790
 * 时间：2019-11-06
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/mbexbasic")
public class MbExBasicController extends BaseController {
	
	@Autowired
	private MbExBasicService mbexbasicService;


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
		pd.put("MBEXBASIC_ID", this.get32UUID());	//主键
		mbexbasicService.save(pd);
		PageData approveForm=new PageData();
		String APPROVEFORM_ID=this.get32UUID();
		approveForm.put("APPROVEFORM_ID",APPROVEFORM_ID);
		approveForm.put("FORMDATA_ID",pd.get("MBEXBASIC_ID"));
		approveForm.put("APPROVE_ID",pd.get("APPROVE_ID"));
		approveForm.put("FORM_TYPE",pd.get("FORM_TYPE"));
		approveForm.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		PageData findFullData=new PageData();
		findFullData.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("CREATE_TIME",DateUtil.date2Str(new Date()));
		approveForm.put("SUB_STATUS",pd.get("SUB_STATUS"));  //暂存  1是
		approveFormService.save(approveForm);
		map.put("APPROVEFORM_ID",APPROVEFORM_ID);
		map.put("RES_ID",pd.get("MBEXBASIC_ID"));
		map.put("result", errInfo);
		return map;
	}


	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("mbexbasic:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		mbexbasicService.delete(pd);
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
		mbexbasicService.edit(pd);
		PageData findApproveForm=new PageData();
		findApproveForm.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		PageData approveFormRes = approveFormService.findById(findApproveForm);
		approveFormRes.put("SUB_STATUS",pd.get("SUB_STATUS"));
		approveFormService.edit(approveFormRes);
		map.put("RES_ID",pd.get("MBEXBASIC_ID"));
		map.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("mbexbasic:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		page.setPd(pd);
		List<PageData>	varList = mbexbasicService.list(page);	//列出MbExBasic列表
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
		pd = mbexbasicService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("mbexbasic:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			mbexbasicService.deleteAll(ArrayDATA_IDS);
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
		titles.add("幼儿园名称");	//1
		titles.add("园址");	//2
		titles.add("举办者");	//3
		titles.add("园长");	//4
		titles.add("法人证书编号");	//5
		titles.add("法人证书有效期");	//6
		titles.add("法定代表人");	//7
		titles.add("食堂卫生许可证编号");	//8
		titles.add("食堂卫生许可证有效期");	//9
		titles.add("院舍租赁年限");	//10
		titles.add("院舍租赁有效期");	//11
		titles.add("卫生保健合格证编号");	//12
		titles.add("卫生保健合格证有效期");	//13
		titles.add("保教费标准");	//14
		titles.add("教师学历达标率");	//15
		titles.add("教职工岗位证书持有率");	//16
		titles.add("每天服务时间");	//17
		titles.add("寒暑假时间");	//18
		titles.add("网址");	//19
		titles.add("电话");	//20
		titles.add("传真");	//21
		titles.add("占地总面积");	//22
		titles.add("占地生均面积");	//23
		titles.add("建筑总面积");	//24
		titles.add("建筑生均面积");	//25
		titles.add("活动场地总面积");	//26
		titles.add("活动场地生均面积");	//27
		titles.add("教学用房总面积");	//28
		titles.add("教学用房生均面积");	//29
		titles.add("生活用房总面积");	//30
		titles.add("生活用房生均面积");	//31
		titles.add("图书总数");	//32
		titles.add("图书生均");	//33
		titles.add("玩具设备种类");	//34
		titles.add("玩具设备生均数量");	//35
		titles.add("大班人数");	//36
		titles.add("大班班数");	//37
		titles.add("中班人数");	//38
		titles.add("中班班数");	//39
		titles.add("小班人数");	//40
		titles.add("小班班数");	//41
		titles.add("小小班人数");	//42
		titles.add("小小班班数");	//43
		titles.add("教职工总数");	//44
		titles.add("教职工教师数");	//45
		titles.add("教职工教育员数");	//46
		titles.add("其他");	//47
		titles.add("幼儿园幼儿总数");	//48
		titles.add("每班教师保育员数");	//49
		titles.add("填表人");	//50
		titles.add("填表日期");	//51
		dataMap.put("titles", titles);
		List<PageData> varOList = mbexbasicService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("SC_NAME"));	    //1
			vpd.put("var2", varOList.get(i).getString("SC_ADDRESS"));	    //2
			vpd.put("var3", varOList.get(i).getString("ORGANIZER"));	    //3
			vpd.put("var4", varOList.get(i).getString("KINDERGARTEN_LEADER"));	    //4
			vpd.put("var5", varOList.get(i).getString("CERTIFICATE_NUMBER"));	    //5
			vpd.put("var6", varOList.get(i).getString("CERTIFICATE_VALIDTO"));	    //6
			vpd.put("var7", varOList.get(i).getString("LEGAL_PERSON"));	    //7
			vpd.put("var8", varOList.get(i).getString("HYGIENE_PERMIT_NUMBER"));	    //8
			vpd.put("var9", varOList.get(i).getString("HYGIENE_PERMIT_VALIDTO"));	    //9
			vpd.put("var10", varOList.get(i).getString("LEASE_HOME"));	    //10
			vpd.put("var11", varOList.get(i).getString("LEASE_HOME_VALIDTO"));	    //11
			vpd.put("var12", varOList.get(i).getString("HEALTH_CARE_CERTIFICATION_NUMBER"));	    //12
			vpd.put("var13", varOList.get(i).getString("HEALTH_CARE_CERTIFICATION_VALIDTO"));	    //13
			vpd.put("var14", varOList.get(i).getString("BJF_STANDARD"));	    //14
			vpd.put("var15", varOList.get(i).getString("PERCENTAGE_QUALIFIED"));	    //15
			vpd.put("var16", varOList.get(i).getString("HOLDING_RATE"));	    //16
			vpd.put("var17", varOList.get(i).getString("SERVICE_HOURS"));	    //17
			vpd.put("var18", varOList.get(i).getString("VACATION_TIME"));	    //18
			vpd.put("var19", varOList.get(i).getString("URL"));	    //19
			vpd.put("var20", varOList.get(i).getString("PHONE"));	    //20
			vpd.put("var21", varOList.get(i).getString("FAX"));	    //21
			vpd.put("var22", varOList.get(i).getString("ZD_TOTAL_AREA"));	    //22
			vpd.put("var23", varOList.get(i).getString("ZD_MEAN_AREA"));	    //23
			vpd.put("var24", varOList.get(i).getString("JZ_TOTAL_AREA"));	    //24
			vpd.put("var25", varOList.get(i).getString("JZ_MEAN_AREA"));	    //25
			vpd.put("var26", varOList.get(i).getString("HDCD_TOTAL_AREA"));	    //26
			vpd.put("var27", varOList.get(i).getString("HDCD_MEAN_AREA"));	    //27
			vpd.put("var28", varOList.get(i).getString("JXYF_TOTAL_AREA"));	    //28
			vpd.put("var29", varOList.get(i).getString("JXYF_MEAN_AREA"));	    //29
			vpd.put("var30", varOList.get(i).getString("SHYF_TOTAL_AREA"));	    //30
			vpd.put("var31", varOList.get(i).getString("SHYF_MEAN_AREA"));	    //31
			vpd.put("var32", varOList.get(i).getString("TS_TOTAL_BOOK_NUMBER"));	    //32
			vpd.put("var33", varOList.get(i).getString("TS_MEAN_BOOK_NUMBER"));	    //33
			vpd.put("var34", varOList.get(i).getString("WJSB_KIND"));	    //34
			vpd.put("var35", varOList.get(i).getString("WJSB_MEAN_NUMBER"));	    //35
			vpd.put("var36", varOList.get(i).getString("DB_PERSON_NUMBER"));	    //36
			vpd.put("var37", varOList.get(i).getString("DB_CLASS_NUMBER"));	    //37
			vpd.put("var38", varOList.get(i).getString("ZB_PERSON_NUMBER"));	    //38
			vpd.put("var39", varOList.get(i).getString("ZB_CLASS_NUMBER"));	    //39
			vpd.put("var40", varOList.get(i).getString("XB_PERSON_NUMBER"));	    //40
			vpd.put("var41", varOList.get(i).getString("XV_CLASS_NUMBER"));	    //41
			vpd.put("var42", varOList.get(i).getString("XXB_PERSON_NUMBER"));	    //42
			vpd.put("var43", varOList.get(i).getString("XXB_CLASS_NUMBER"));	    //43
			vpd.put("var44", varOList.get(i).getString("STAFF_TOTAL_NUMBER"));	    //44
			vpd.put("var45", varOList.get(i).getString("STAFF_TEACHER_NUMBER"));	    //45
			vpd.put("var46", varOList.get(i).getString("STAFF_NURSERY_NUMBER"));	    //46
			vpd.put("var47", varOList.get(i).getString("STAFF_ELSE_NUMBER"));	    //47
			vpd.put("var48", varOList.get(i).getString("YEY_CHILD_TOTAL_NUMBER"));	    //48
			vpd.put("var49", varOList.get(i).getString("EVERYCLASS_NURSERY_NUMBER"));	    //49
			vpd.put("var50", varOList.get(i).getString("FULLDATA_BY"));	    //50
			vpd.put("var51", varOList.get(i).getString("FULDATA_DATE"));	    //51
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
		User user=Jurisdiction.getUser();
		if(null!=user){
			map.put("FULLDATA_BY",user.getNAME());
		}else{
			map.put("FULLDATA_BY","");
		}
		map.put("result",errInfo);
		return map;
	}
	
}
