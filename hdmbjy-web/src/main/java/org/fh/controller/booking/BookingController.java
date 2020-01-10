package org.fh.controller.booking;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.mchange.v2.lang.ObjectUtils;
import org.fh.entity.system.User;
import org.fh.service.bookinginfo.BookingInfoService;
import org.fh.service.examination.ExaminationService;
import org.fh.service.system.RoleService;
import org.fh.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.apache.shiro.authz.annotation.RequiresPermissions;

import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.service.booking.BookingService;

/** 
 * 说明：预约
 * 作者：FH Admin QQ313596790
 * 时间：2019-08-30
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/booking")
public class BookingController extends BaseController {
	
	@Autowired
	private BookingService bookingService;

	@Autowired
	private RoleService roleService;

	@Autowired
	private BookingInfoService bookingInfoService;

	@Autowired
	private ExaminationService examinationService;
	
	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@RequiresPermissions("booking:add")
	@ResponseBody
	public Object add() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("BOOKING_ID", this.get32UUID());	//主键
		pd.put("ALREADY_NUM", 0);	//已经预约人数初始为0
		pd.put("REMAIN_NUM", pd.get("ALL_NUM"));	//剩余预约人数为总预约人数
		pd.put("VERSION", 1);	//剩余预约人数为总预约人数
		bookingService.save(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("booking:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		bookingService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("booking:edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		bookingService.edit(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
//	@RequiresPermissions("booking:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		page.setPd(pd);
		List<PageData>	varList = bookingService.list(page);	//列出Booking列表
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
	@RequiresPermissions("booking:edit")
	@ResponseBody
	public Object goEdit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = bookingService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("booking:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			bookingService.deleteAll(ArrayDATA_IDS);
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
		titles.add("id");	//1
		titles.add("预约信息表id");	//2
		titles.add("审批角色");	//3
		titles.add("预约开始时间");	//4
		titles.add("预约结束时间");	//5
		titles.add("预约人数");	//6
		titles.add("已预约人数");	//7
		titles.add("剩余预约人数");	//8
		titles.add("备注9");	//9
		titles.add("备注10");	//10
		titles.add("备注11");	//11
		titles.add("备注12");	//12
		dataMap.put("titles", titles);
		List<PageData> varOList = bookingService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("BOOKING_ID"));	    //1
			vpd.put("var2", varOList.get(i).getString("BOOKINGINFO_ID"));	    //2
			vpd.put("var3", varOList.get(i).getString("APPROVAL_ROLE"));	    //3
			vpd.put("var4", varOList.get(i).getString("START_TIME"));	    //4
			vpd.put("var5", varOList.get(i).getString("END_TIME"));	    //5
			vpd.put("var6", varOList.get(i).get("ALL_NUM").toString());	//6
			vpd.put("var7", varOList.get(i).get("ALREADY_NUM").toString());	//7
			vpd.put("var8", varOList.get(i).get("REMAIN_NUM").toString());	//8
			vpd.put("var9", varOList.get(i).getString("FIELD1"));	    //9
			vpd.put("var10", varOList.get(i).getString("FIELD2"));	    //10
			vpd.put("var11", varOList.get(i).getString("FIELD3"));	    //11
			vpd.put("var12", varOList.get(i).getString("FIELD4"));	    //12
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}

	@RequestMapping("/getRoleAndBookingInfo")
	@RequiresPermissions("booking:add")
	@ResponseBody
    public Object getRoleAndBookingInfo()  {
		Map map=new HashMap();
		String msg="success";
		PageData pageData=new PageData();
		pageData=this.getPageData();
		pageData.put("ROLE_ID","1"); //查询系统管理组的角色列表
		List<PageData> roles = new ArrayList<>();
		List<PageData> bookingInfos =  new ArrayList<>();  //查询还没有结束的预约信息
		try {
			roles=roleService.getRolesForBooking(pageData);
			bookingInfos = bookingInfoService.listAllWithNoEnd(pageData);
		} catch (Exception e) {
			msg="错误";
			map.put("result",msg);
			e.printStackTrace();
			return map;
		}
		map.put("roles",roles);
		map.put("bookingInfos",bookingInfos);
		map.put("result",msg);
		return map;
	}

	@RequestMapping("/isHas")
	@RequiresPermissions("booking:list")
	@ResponseBody
	public Object isHas(){
		Map<String,Object> map=new HashMap<>();
		PageData pd=new PageData();
		pd=this.getPageData();
		User user= (User) Jurisdiction.getSession().getAttribute(Const.SESSION_USER);
		pd.put("USER_ID",user.getUSER_ID());
		boolean has = examinationService.isHas(pd);
		map.put("isHas",has);
		map.put("result","success");
		return map;
	}
}
