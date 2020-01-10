package org.fh.controller.formdata.mbpxjgjxdbaspdjb;

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
import org.fh.service.formdata.mbpxjgjxdbaspdjb.MbpxjgjxdbaspdjbService;

/** 
 * 说明：海淀区民办教育培训机构教学点备案审批登记表
 * 作者：FH Admin QQ313596790
 * 时间：2019-12-05
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/mbpxjgjxdbaspdjb")
public class MbpxjgjxdbaspdjbController extends BaseController {
	
	@Autowired
	private MbpxjgjxdbaspdjbService mbpxjgjxdbaspdjbService;
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
		pd.put("MBPXJGJXDBASPDJB_ID", this.get32UUID());	//主键
		mbpxjgjxdbaspdjbService.save(pd);
		PageData approveForm=new PageData();
		String APPROVEFORM_ID=this.get32UUID();
		approveForm.put("APPROVEFORM_ID",APPROVEFORM_ID);
		approveForm.put("FORMDATA_ID",pd.get("MBPXJGJXDBASPDJB_ID"));
		approveForm.put("APPROVE_ID",pd.get("APPROVE_ID"));
		approveForm.put("FORM_TYPE",pd.get("FORM_TYPE"));
		approveForm.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("SUB_STATUS",pd.get("SUB_STATUS"));  //暂存  1是
		PageData findFullData=new PageData();
		findFullData.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("CREATE_TIME",DateUtil.date2Str(new Date()));
		approveFormService.save(approveForm);
		map.put("RES_ID",pd.get("MBPXJGJXDBASPDJB_ID"));
		map.put("APPROVEFORM_ID",APPROVEFORM_ID);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		mbpxjgjxdbaspdjbService.delete(pd);
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
		mbpxjgjxdbaspdjbService.edit(pd);
		PageData findApproveForm=new PageData();
		findApproveForm.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		PageData approveFormRes = approveFormService.findById(findApproveForm);
		approveFormRes.put("SUB_STATUS",pd.get("SUB_STATUS"));
		approveFormService.edit(approveFormRes);
		map.put("RES_ID",pd.get("FULLTEACHERFORM_ID"));
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
		List<PageData>	varList = mbpxjgjxdbaspdjbService.list(page);	//列出Mbpxjgjxdbaspdjb列表
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
		pd = mbpxjgjxdbaspdjbService.findById(pd);	//根据ID读取
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
			mbpxjgjxdbaspdjbService.deleteAll(ArrayDATA_IDS);
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
		titles.add("登记表号");	//1
		titles.add("办学许可证号第一个空");	//2
		titles.add("办学许可证号第二个空");	//3
		titles.add("校名");	//4
		titles.add("校长及电话");	//5
		titles.add("注册校址");	//6
		titles.add("注册校本部电话");	//7
		titles.add("教学点地址");	//8
		titles.add("联系电话");	//9
		titles.add("姓名1");	//10
		titles.add("性别1");	//11
		titles.add("年龄1");	//12
		titles.add("文化程度1");	//13
		titles.add("职称1");	//14
		titles.add("原工作单位1");	//15
		titles.add("户口所在地1");	//16
		titles.add("身份证号码1");	//17
		titles.add("是否在职1");	//18
		titles.add("身体状况1");	//19
		titles.add("姓名2");	//20
		titles.add("性别2");	//21
		titles.add("年龄2");	//22
		titles.add("文化程度2");	//23
		titles.add("职称2");	//24
		titles.add("原工作单位2");	//25
		titles.add("户口所在地2");	//26
		titles.add("身份证号码2");	//27
		titles.add("是否在职2");	//28
		titles.add("身体状况2");	//29
		titles.add("教学点面积");	//30
		titles.add("教室间数");	//31
		titles.add("教室面积");	//32
		titles.add("办公室间数");	//33
		titles.add("办公室面积");	//34
		titles.add("教学设备");	//35
		titles.add("外区设教学点所在区县教育行政部门意见");	//36
		titles.add("外区设教学点所在区县教育行政部门意见时间");	//37
		titles.add("发证机关审批意见");	//38
		titles.add("发证机关审批意见时间");	//39
		titles.add("交件人");	//40
		titles.add("受理人");	//41
		titles.add("审核人");	//42
		titles.add("复审人");	//43
		titles.add("交件日期");	//44
		titles.add("受理日期");	//45
		titles.add("审核日期");	//46
		titles.add("复审日期");	//47
		titles.add("备注");	//48
		titles.add("姓名3");	//49
		titles.add("性别3");	//50
		titles.add("年龄3");	//51
		titles.add("文化程度3");	//52
		titles.add("职称3");	//53
		titles.add("原工作单位3");	//54
		titles.add("户口所在地3");	//55
		titles.add("身份证号码3");	//56
		titles.add("是否在职3");	//57
		titles.add("身体状况3");	//58
		titles.add("姓名4");	//59
		titles.add("性别4");	//60
		titles.add("年龄4");	//61
		titles.add("文化程度4");	//62
		titles.add("职称4");	//63
		titles.add("原工作单位4");	//64
		titles.add("户口所在地4");	//65
		titles.add("身份证号码4");	//66
		titles.add("是否在职4");	//67
		titles.add("身体状况4");	//68
		dataMap.put("titles", titles);
		List<PageData> varOList = mbpxjgjxdbaspdjbService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("DJB_NUMBER"));	    //1
			vpd.put("var2", varOList.get(i).getString("BXXKZH_FIRST"));	    //2
			vpd.put("var3", varOList.get(i).getString("BXXKZH_SECOND"));	    //3
			vpd.put("var4", varOList.get(i).getString("SCHOOL_NAME"));	    //4
			vpd.put("var5", varOList.get(i).getString("SCHOOLMASTER_AND_PHONE"));	    //5
			vpd.put("var6", varOList.get(i).getString("REGISTER_ADDRESS"));	    //6
			vpd.put("var7", varOList.get(i).getString("REGISTER_XBB_PHONE"));	    //7
			vpd.put("var8", varOList.get(i).getString("JXD_ADDRESS"));	    //8
			vpd.put("var9", varOList.get(i).getString("PHONE"));	    //9
			vpd.put("var10", varOList.get(i).getString("NAME1"));	    //10
			vpd.put("var11", varOList.get(i).getString("GENDER1"));	    //11
			vpd.put("var12", varOList.get(i).getString("AGE1"));	    //12
			vpd.put("var13", varOList.get(i).getString("EDUCATION1"));	    //13
			vpd.put("var14", varOList.get(i).getString("ZHICHENG1"));	    //14
			vpd.put("var15", varOList.get(i).getString("YGZDW1"));	    //15
			vpd.put("var16", varOList.get(i).getString("HKSZD1"));	    //16
			vpd.put("var17", varOList.get(i).getString("ID_CARD1"));	    //17
			vpd.put("var18", varOList.get(i).getString("SFZZ1"));	    //18
			vpd.put("var19", varOList.get(i).getString("STZK1"));	    //19
			vpd.put("var20", varOList.get(i).getString("NAME2"));	    //20
			vpd.put("var21", varOList.get(i).getString("GENDER2"));	    //21
			vpd.put("var22", varOList.get(i).getString("AGE2"));	    //22
			vpd.put("var23", varOList.get(i).getString("EDUCATION2"));	    //23
			vpd.put("var24", varOList.get(i).getString("ZHICHENG2"));	    //24
			vpd.put("var25", varOList.get(i).getString("YGZDW2"));	    //25
			vpd.put("var26", varOList.get(i).getString("HKSZD2"));	    //26
			vpd.put("var27", varOList.get(i).getString("ID_CARD2"));	    //27
			vpd.put("var28", varOList.get(i).getString("SFZZ2"));	    //28
			vpd.put("var29", varOList.get(i).getString("STZK2"));	    //29
			vpd.put("var30", varOList.get(i).getString("JXDMJ"));	    //30
			vpd.put("var31", varOList.get(i).getString("JS_NUMBER"));	    //31
			vpd.put("var32", varOList.get(i).getString("JS_AREA"));	    //32
			vpd.put("var33", varOList.get(i).getString("BGS_NUMBER"));	    //33
			vpd.put("var34", varOList.get(i).getString("BGS_AREA"));	    //34
			vpd.put("var35", varOList.get(i).getString("JXSB"));	    //35
			vpd.put("var36", varOList.get(i).getString("WQS_BMYJ"));	    //36
			vpd.put("var37", varOList.get(i).getString("WQS_BMYJ_DATE"));	    //37
			vpd.put("var38", varOList.get(i).getString("FZJGSPYJ"));	    //38
			vpd.put("var39", varOList.get(i).getString("FZJGSPYJ_DATE"));	    //39
			vpd.put("var40", varOList.get(i).getString("JJR"));	    //40
			vpd.put("var41", varOList.get(i).getString("SLR"));	    //41
			vpd.put("var42", varOList.get(i).getString("SHR"));	    //42
			vpd.put("var43", varOList.get(i).getString("FSR"));	    //43
			vpd.put("var44", varOList.get(i).getString("JJRQ"));	    //44
			vpd.put("var45", varOList.get(i).getString("SLRQ"));	    //45
			vpd.put("var46", varOList.get(i).getString("SHRQ"));	    //46
			vpd.put("var47", varOList.get(i).getString("FSRQ"));	    //47
			vpd.put("var48", varOList.get(i).getString("REMARKS"));	    //48
			vpd.put("var49", varOList.get(i).getString("NAME3"));	    //49
			vpd.put("var50", varOList.get(i).getString("GENDER3"));	    //50
			vpd.put("var51", varOList.get(i).getString("AGE3"));	    //51
			vpd.put("var52", varOList.get(i).getString("EDUCATION3"));	    //52
			vpd.put("var53", varOList.get(i).getString("ZHICHENG3"));	    //53
			vpd.put("var54", varOList.get(i).getString("YGZDW3"));	    //54
			vpd.put("var55", varOList.get(i).getString("HKSZD3"));	    //55
			vpd.put("var56", varOList.get(i).getString("ID_CARD3"));	    //56
			vpd.put("var57", varOList.get(i).getString("SFZZ3"));	    //57
			vpd.put("var58", varOList.get(i).getString("STZK3"));	    //58
			vpd.put("var59", varOList.get(i).getString("NAME4"));	    //59
			vpd.put("var60", varOList.get(i).getString("GENDER4"));	    //60
			vpd.put("var61", varOList.get(i).getString("AGE4"));	    //61
			vpd.put("var62", varOList.get(i).getString("EDUCATION4"));	    //62
			vpd.put("var63", varOList.get(i).getString("ZHICHENG4"));	    //63
			vpd.put("var64", varOList.get(i).getString("YGZDW4"));	    //64
			vpd.put("var65", varOList.get(i).getString("HKSZD4"));	    //65
			vpd.put("var66", varOList.get(i).getString("ID_CARD4"));	    //66
			vpd.put("var67", varOList.get(i).getString("SFZZ4"));	    //67
			vpd.put("var68", varOList.get(i).getString("STZK4"));	    //68
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
