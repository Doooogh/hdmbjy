package org.fh.controller.formdata.jsbshenpi;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.entity.system.User;
import org.fh.service.approveform.ApproveFormService;
import org.fh.service.formdata.jsbshenpi.LodgingService;
import org.fh.util.DateUtil;
import org.fh.util.Jurisdiction;
import org.fh.util.ObjectExcelView;
import org.fh.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/** 
 * 说明：开办寄宿部申报表
 * 作者：FH Admin QQ313596790
 * 时间：2019-11-12
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/lodging")
public class LodgingController extends BaseController {
	
	@Autowired
	private LodgingService lodgingService;
	
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
		pd.put("LODGING_ID", this.get32UUID());	//主键
		lodgingService.save(pd);
		PageData approveForm=new PageData();
		String APPROVEFORM_ID=this.get32UUID();
		approveForm.put("APPROVEFORM_ID",APPROVEFORM_ID);
		approveForm.put("FORMDATA_ID",pd.get("LODGING_ID"));
		approveForm.put("APPROVE_ID",pd.get("APPROVE_ID"));
		approveForm.put("FORM_TYPE",pd.get("FORM_TYPE"));
		approveForm.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		PageData findFullData=new PageData();
		findFullData.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("CREATE_TIME",DateUtil.date2Str(new Date()));
		approveFormService.save(approveForm);
		map.put("RES_ID",pd.get("LODGING_ID"));
		map.put("APPROVEFORM_ID",APPROVEFORM_ID);
		map.put("result", errInfo);
		return map;
	}
	/*
	 * @RequestMapping(value="/add")
	 * 
	 * @RequiresPermissions("lodging:add")
	 * 
	 * @ResponseBody public Object add() throws Exception{ Map<String,Object> map =
	 * new HashMap<String,Object>(); String errInfo = "success"; PageData pd = new
	 * PageData(); pd = this.getPageData(); pd.put("LODGING_ID", this.get32UUID());
	 * //主键
	 * 
	 * 
	 * 
	 * lodgingService.save(pd); map.put("result", errInfo); return map; }
	 */
	
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
		lodgingService.delete(pd);
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
		lodgingService.edit(pd);
		PageData findApproveForm=new PageData();
		findApproveForm.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		PageData approveFormRes = approveFormService.findById(findApproveForm);
		approveFormRes.put("SUB_STATUS",pd.get("SUB_STATUS"));
		approveFormService.edit(approveFormRes);
		map.put("RES_ID",pd.get("LODGING_ID"));
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
		List<PageData>	varList = lodgingService.list(page);	//列出Lodging列表
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
		pd = lodgingService.findById(pd);	//根据ID读取
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
			lodgingService.deleteAll(ArrayDATA_IDS);
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
		titles.add("单位名称");	//1
		titles.add("法人姓名");	//2
		titles.add("单位地址");	//3
		titles.add("校（园）长联系电话");	//4
		titles.add("主管校长姓名");	//5
		titles.add("办公电话");	//6
		titles.add("手机");	//7
		titles.add("在校学生总数");	//8
		titles.add("普通教室");	//9
		titles.add("专业教室");	//10
		titles.add("审批寄宿生人数");	//11
		titles.add("寄宿生是否单独编班");	//12
		titles.add("寄宿生班最高班额");	//13
		titles.add("学生宿舍");	//14
		titles.add("是否为非教学用房");	//15
		titles.add("住宿楼出口数");	//16
		titles.add("宿舍床位/间");	//17
		titles.add("宿舍区配备灭火器总数");	//18
		titles.add("有无经批准的学生食堂");	//19
		titles.add("每间宿舍使用面积");	//20
		titles.add("校医姓名");	//21
		titles.add("校医联系电话");	//22
		titles.add("宿舍管理老师数额");	//23
		titles.add("住宿楼联系电话");	//24
		titles.add("中学初一");	//25
		titles.add("中学初二");	//26
		titles.add("中学初三");	//27
		titles.add("中学高一");	//28
		titles.add("中学高二");	//29
		titles.add("中学高三");	//30
		titles.add("小学小一");	//31
		titles.add("小学小二");	//32
		titles.add("小学小三");	//33
		titles.add("小学小四");	//34
		titles.add("小学小五");	//35
		titles.add("小学小六");	//36
		titles.add("职高高一");	//37
		titles.add("职高高二");	//38
		titles.add("职高高三");	//39
		titles.add("幼儿园小班");	//40
		titles.add("幼儿园中班");	//41
		titles.add("幼儿园大班");	//42
		titles.add("校（园）长意见");	//43
		titles.add("时间");	//44
		titles.add("主管业务科室");	//45
		titles.add("保健所");	//46
		titles.add("保卫科");	//47
		titles.add("后勤中心");	//48
		titles.add("食品安全科");	//49
		titles.add("基建科");	//50
		titles.add("教育行政部门意见");	//51
		titles.add("教育行政部门意见时间");	//52
		dataMap.put("titles", titles);
		List<PageData> varOList = lodgingService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("UNIT_NAME"));	    //1
			vpd.put("var2", varOList.get(i).getString("CORPORATION"));	    //2
			vpd.put("var3", varOList.get(i).getString("ADDRESS"));	    //3
			vpd.put("var4", varOList.get(i).getString("TELEPHONE"));	    //4
			vpd.put("var5", varOList.get(i).getString("PRINCIPAL_NAME"));	    //5
			vpd.put("var6", varOList.get(i).getString("OFFICETEL"));	    //6
			vpd.put("var7", varOList.get(i).getString("PHONE"));	    //7
			vpd.put("var8", varOList.get(i).getString("STUDENT_NUM"));	    //8
			vpd.put("var9", varOList.get(i).getString("REGULAR_CLASSROOM"));	    //9
			vpd.put("var10", varOList.get(i).getString("PROFESSIONAL_CLASSROOM"));	    //10
			vpd.put("var11", varOList.get(i).getString("BOARDERS_NUM"));	    //11
			vpd.put("var12", varOList.get(i).getString("BOARDER_ISNOTCLASS"));	    //12
			vpd.put("var13", varOList.get(i).getString("BOARDER_MAXCLASS"));	    //13
			vpd.put("var14", varOList.get(i).getString("STUDENT_DORM"));	    //14
			vpd.put("var15", varOList.get(i).getString("TEACHING_ISNOTHOUSE"));	    //15
			vpd.put("var16", varOList.get(i).getString("STAYFLOOR_EXITNUM"));	    //16
			vpd.put("var17", varOList.get(i).getString("DORMBED_NUM"));	    //17
			vpd.put("var18", varOList.get(i).getString("ANNIHILATOR_NUM"));	    //18
			vpd.put("var19", varOList.get(i).getString("ISNOTAPPROVAL_CANTEEN"));	    //19
			vpd.put("var20", varOList.get(i).getString("DORMAREA"));	    //20
			vpd.put("var21", varOList.get(i).getString("DOCTORNAME"));	    //21
			vpd.put("var22", varOList.get(i).getString("DOCTOR_PHONE"));	    //22
			vpd.put("var23", varOList.get(i).getString("TEACHER_NUM"));	    //23
			vpd.put("var24", varOList.get(i).getString("STAY_PHONE"));	    //24
			vpd.put("var25", varOList.get(i).getString("MIDDLE_ONE"));	    //25
			vpd.put("var26", varOList.get(i).getString("MIDDLE_TWO"));	    //26
			vpd.put("var27", varOList.get(i).getString("MIDDLE_THREE"));	    //27
			vpd.put("var28", varOList.get(i).getString("SENIOR_ONE"));	    //28
			vpd.put("var29", varOList.get(i).getString("SENIOR_TWO"));	    //29
			vpd.put("var30", varOList.get(i).getString("SENIOR_THREE"));	    //30
			vpd.put("var31", varOList.get(i).getString("PRIMARY_ONE"));	    //31
			vpd.put("var32", varOList.get(i).getString("PRIMARY_TWO"));	    //32
			vpd.put("var33", varOList.get(i).getString("PRIMARY_THREE"));	    //33
			vpd.put("var34", varOList.get(i).getString("PRIMARY_FOUR"));	    //34
			vpd.put("var35", varOList.get(i).getString("PRIMARY_FIVE"));	    //35
			vpd.put("var36", varOList.get(i).getString("PRIMARY_SIX"));	    //36
			vpd.put("var37", varOList.get(i).getString("JOB_ONE"));	    //37
			vpd.put("var38", varOList.get(i).getString("JOB_TWO"));	    //38
			vpd.put("var39", varOList.get(i).getString("JOB_THREE"));	    //39
			vpd.put("var40", varOList.get(i).getString("KINDERGARTEN_ONE"));	    //40
			vpd.put("var41", varOList.get(i).getString("KINDERGARTEN_TWO"));	    //41
			vpd.put("var42", varOList.get(i).getString("KINDERGARTEN_THREE "));	    //42
			vpd.put("var43", varOList.get(i).getString("OPINION"));	    //43
			vpd.put("var44", varOList.get(i).getString("OPINION_DATE"));	    //44
			vpd.put("var45", varOList.get(i).getString("OPINION_ZYYWKS"));	    //45
			vpd.put("var46", varOList.get(i).getString("OPINION_BJS"));	    //46
			vpd.put("var47", varOList.get(i).getString("OPINION_BWK"));	    //47
			vpd.put("var48", varOList.get(i).getString("OPINION_HQZX"));	    //48
			vpd.put("var49", varOList.get(i).getString("OPINION_SPAQK"));	    //49
			vpd.put("var50", varOList.get(i).getString("OPINION_JJK"));	    //50
			vpd.put("var51", varOList.get(i).getString("OPINION_DEP"));	    //51
			vpd.put("var52", varOList.get(i).getString("OPINION_DEPDATE"));	    //52
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
