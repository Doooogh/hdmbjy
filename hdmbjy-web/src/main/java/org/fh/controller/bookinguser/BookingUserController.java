package org.fh.controller.bookinguser;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.task.Task;
import org.apache.commons.lang3.StringUtils;
import org.fh.entity.system.User;
import org.fh.service.act.RuprocdefService;
import org.fh.service.booking.BookingService;
import org.fh.service.bookinginfo.BookingInfoService;
import org.fh.service.examination.ExaminationService;
import org.fh.service.government.GovernmentService;
import org.fh.service.organization.OrganizationService;
import org.fh.service.scuser.ScuserService;
import org.fh.service.system.UsersService;
import org.fh.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.apache.shiro.authz.annotation.RequiresPermissions;

import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.service.bookinguser.BookingUserService;

/**
 * 说明：预约人员
 * 作者：FH Admin QQ313596790
 * 时间：2019-09-05
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/bookinguser")
public class BookingUserController extends BaseController {

	@Autowired
	private BookingUserService bookinguserService;

	@Autowired
	private BookingService bookingService;

	@Autowired
	private TaskService taskService;

	@Autowired
	private ExaminationService examinationService;

	@Autowired
	private UsersService usersService;

	@Autowired
	private BookingInfoService bookingInfoService;

	@Autowired
	private GovernmentService governmentService;

	@Autowired
	private RuprocdefService ruprocdefService;

	@Autowired
	private ScuserService scuserService;

	@Autowired
	private OrganizationService organizationService;


	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@RequiresPermissions("bookinguser:add")
	@ResponseBody
	public Object add() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("BOOKINGUSER_ID", this.get32UUID());	//主键
		pd.put("BOOKING_TIME",new Date());  //预约时间
		pd.put("ISPASS","0");
//		pd.put("TYPE",Const.BOOKINGUSER_TYPE_EXAMINATION);
		//预约凭证  USER_ID+|+EXAMINATION_ID+|BOOKING_ID
		pd.put("EVIDENCE",pd.get("USER_ID")+"|"+pd.get("EXAMINATION_ID")+"|"+pd.get("BOOKING_ID"));
		PageData booking=bookingService.findById(pd);
		if(null!=booking){
			Map result = bookingService.offlineSuccss(booking);
			if(result.get("result").equals("NO_REAMIN")){
				errInfo="failed";
				map.put("result",errInfo);
				return map;
			}else if("SUCCESS".equals(result.get("result"))){
				String  proId = (String) pd.get("PROC_INST_ID");  //获取流程id
				Task task = taskService.createTaskQuery().processInstanceId(proId).singleResult();
				taskService.complete(task.getId());   //通过线下预约任务
			}

		/*	Integer REMAIN_NUM= (Integer) booking.get("REMAIN_NUM"); //剩余数量
			if(REMAIN_NUM-1<0){
				errInfo="failed";
				map.put("result",errInfo);
                return map;
            }else{
			    try{
                    bookingService.edit(booking);
					String  proId = (String) pd.get("PROC_INST_ID");  //获取流程id
					Task task = taskService.createTaskQuery().processInstanceId(proId).singleResult();
					taskService.complete(task.getId());   //通过线下预约任务
				}catch (Exception e){
                    errInfo="exception";
                    map.put("result",errInfo);
			        e.printStackTrace();
			        return map;
                }
			}*/
		}else{
			errInfo="exception";
			map.put("result",errInfo);
			return map;
		}
		bookinguserService.save(pd);
		map.put("result", errInfo);
		return map;
	}


	/**
	 * 在预约界面进行用户信息确认
	 * @return
	 */
	@RequestMapping(value="/getUserInfo")
	@RequiresPermissions("bookinguser:add")
	@ResponseBody
	public Object getInfo() throws Exception {
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		User user1= (User) Jurisdiction.getSession().getAttribute(Const.SESSION_USER);
		if(null!=user1){
			pd.put("USER_ID",user1.getUSER_ID()) ;
			pd =usersService.findWithDepartmentById(pd);  //查询出用户信息包含部门信息
			pd.put("SUGGLY_DATA_USER","1");
			pd.put("OFFLINE_RES","0");
			map.put("pd",pd);
			map.put("result",errInfo);
		}else{
			map.put("result","exception");
			return map;
		}
		return map;
	}

	/**
	 * 通过用户信息 确定审批类型和进程是否正确
	 * @return
	 */
	@RequestMapping(value="/getInfoByUser")
	@ResponseBody
	public Object getInfoByUser() throws Exception {
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String APPROVE_ID=pd.getString("APP_ID");
		User user= (User) Jurisdiction.getSession().getAttribute(Const.SESSION_USER);
		PageData findUser=new PageData();
		findUser.put("USER_ID",user.getUSER_ID());
		PageData userRes = usersService.findById(findUser);
		PageData findOrganization=new PageData();
		findOrganization.put("ORGANIZATION_ID",userRes.get("DEPARTMENT_ID"));
		PageData organization = organizationService.findById(findOrganization);
		if(null!=organization){
			Map userMap=new HashMap();
			userMap.put("NAME",userRes.get("NAME"));
			userMap.put("PHONE",userRes.get("PHONE"));
			userMap.put("ORGANIZATION_NAME",organization.get("NAME"));
			userMap.put("USER_ID",userRes.get("USER_ID"));
			map.put("user",userMap);  //返回用户信息
		}
		PageData findFlowByUserId=new PageData();
		findFlowByUserId.put("USER_ID",user.getUSER_ID());
		findFlowByUserId.put("APPROVE_ID",APPROVE_ID);
		List<PageData> governments = governmentService.findByUserId(findFlowByUserId);
		if(governments.size()!=0&&governments.size()==1){
			map.put("BOOKING_TYPE","BOOKING_TYPE_GOVERNMENT");	//表示行政审批
			map.put("BOOKING_TYPE_NAME","行政审批");	//表示行政审批
			map.put("result",errInfo);
			return map;
		}
		List<PageData> examinations = examinationService.findByUserId(findFlowByUserId);
		if(examinations.size()!=0&&examinations.size()==1){
			map.put("BOOKING_TYPE","BOOKING_TYPE_EXAMINATION");	//表示年度审批
			map.put("BOOKING_TYPE_NAME","年度审批");	//表示年度审批
			map.put("result",errInfo);
			return map;
		}
		map.put("msg","暂时没有可以申请线下审批的流程");
		map.put("result",errInfo);
		return map;
	}

	@RequestMapping("/checkUser")
	@ResponseBody
	@RequiresPermissions("bookinguser:add")
	public Object checkUser () throws Exception {
		Map<String, Object> map = new HashMap<>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		if(StringUtils.isNotBlank((String)pd.get("BOOKING_TYPE"))){
			String BOOKING_TYPE=(String)pd.get("BOOKING_TYPE");
			User user1= (User) Jurisdiction.getSession().getAttribute(Const.SESSION_USER);
			if(null!=user1) {
				pd.put("USER_ID", user1.getUSER_ID());
				PageData find=new PageData();
				find.put("SCUSER_ID",user1.getUSER_ID());
				PageData organizationInfo=scuserService.findOrganizationByScuser(find);
				PageData scuser = scuserService.findById(find);
				pd.put("NAME",scuser.get("NAME"));
				pd.put("PHONE",scuser.get("PHONE"));
				pd.put("ORGANIZATION_NAME",organizationInfo.get("ORGANIZATION_NAME"));
				pd.put("SUGGLY_DATA_USER", "1");
				pd.put("OFFLINE_RES", "has");
				pd.put("STATUS","1");  //筛选年审有效的数据
			if(BOOKING_TYPE.equals("BOOKING_TYPE_EXAMINATION")){ //用户选择的是年度审批
				List<PageData> exList = examinationService.findByUserId(pd);
				if(exList.size()==1){
					pd.put("TYPE",BOOKING_TYPE);
					List<PageData> bookingUserList = bookinguserService.findByUserId(pd);
					if(bookingUserList.size()>0){
						map.put("code","1");  //标识已经有一个年审类型线下预约正在进行中
						map.put("result",errInfo);
						return map;
					}
					PageData examination = exList.get(0);
					pd.put("APPROVE_ID",examination.get("EXAMINATION_ID"));  //年审id
					pd.put("PROC_INST_ID",examination.get("PROC_INST_ID"));  //流程实例id
				}else if(exList.size()==0){
					map.put("code",3); //表示没有需要线下预约的年度审批流程
					map.put("result",errInfo);
					return map;
				}else {  //表示没有进行到线下预约的年审流程
					errInfo = "exception";
					map.put("result", errInfo);
					return map;
				}
			}else if(BOOKING_TYPE.equals("BOOKING_TYPE_GOVERNMENT")){
				List<PageData> govList = governmentService.findByUserId(pd);
				if(govList.size()==1){
					pd.put("TYPE",BOOKING_TYPE);
					List<PageData> bookingUserList = bookinguserService.findByUserId(pd);
					if(bookingUserList.size()>0){
						map.put("code","2");  //标识已经有一个行政类型线下预约正在进行中
						map.put("result",errInfo);
						return map;
					}
					PageData government = govList.get(0);
					pd.put("APPROVE_ID",government.get("GOVERNMENT_ID"));  //行政审批id
					pd.put("PROC_INST_ID",government.get("PROC_INST_ID"));  //流程实例id
				}else if(govList.size()==0){
					map.put("code",4); //表示没有需要线下预约的行政审批流程
					map.put("result",errInfo);
					return map;
				} else{
					errInfo="exception";
					map.put("result",errInfo);
					return map;
				}
			 }else{
				errInfo="exception";
				map.put("result",errInfo);
				return map;
			}
			}else{
				errInfo="exception";
				map.put("result",errInfo);
				return map;
			}
		}else{
			errInfo="exception";
			map.put("result",errInfo);
			return map;
		}
		map.put("result",errInfo);
		map.put("code",0);
		map.put("pd",pd);
		return map;
	}


	@RequestMapping("/check")
	@ResponseBody
	public Map check(){
		Map<String,Object> map=new HashMap<>();
		String errInfo="success";
		PageData pd=new PageData();
		pd=this.getPageData();
		User user=Jurisdiction.getUser();
		if(Const.ADMIN_USERNAME.contains(user.getUSERNAME())){
			map.put("result",errInfo);
			map.put("isUser",true);
			return map;
		}
		//查询是否有正在线下预约节点流程(线下预约为 0 状态为 1 drafts 为0  USER_ID))
        PageData pUser=new PageData();
		pUser.put("USER_ID",user.getUSER_ID());
		pUser.put("SUGGLE_DATA_USER","1");
		pUser.put("OFFLINE_RES","0 or 2");
        List<PageData> gList = governmentService.findByUserId(pUser);
        if(gList.size()==0){
            map.put("status","0");
            map.put("mag","当前有一个需要进行线下预约的流程");

        }else if(gList.size()==1){
            map.put("status","1");
            map.put("msg","当前");
        }else{
            errInfo="exception";
            map.put("result",errInfo);
            return map;
        }
        List<PageData> eList = examinationService.findByUserId(pUser);
        if(eList.size()==0){
            map.put("status","0");
            map.put("mag","当前有一个需要进行线下预约的流程");
        }else if(eList.size()==1){
            map.put("status","1");
            map.put("msg","当前没有需要线下审批的流程");
        }else{
            errInfo="exception";
            map.put("result",errInfo);
            return map;
        }
        map.put("result",errInfo);
		map.put("isUser",false);
		return  map;
	}


	@RequestMapping("/confirmInfo")
	@ResponseBody
	@RequiresPermissions("examination:add")
	public Object confirmInfo () throws Exception {
		Map<String,Object> map=new HashMap<>();
		String errInfo="success";
		PageData pd=new PageData();
		pd=this.getPageData();

		User user= (User) Jurisdiction.getSession().getAttribute(Const.SESSION_USER);
		pd.put("USER_ID",user.getUSER_ID());
		PageData info = usersService.findById(pd);//根据当前用户的id 查询数据库中该用户的信息
		PageData booking = bookingService.findById(pd);  //根据预约id 查询预约
		PageData bookingInfo=bookingInfoService.findById(booking);
		info.put("BOOKING_INFO_NAME",bookingInfo.get("TITLE"));
		booking.get("BOOKINGINFO_ID");
		info.put("START_TIME",booking.get("START_TIME"));
		info.put("ALL_NUM",booking.get("ALL_NUM")); //总名额
		info.put("END_TIME",booking.get("END_TIME"));
		info.put("REMAIN_NUM",booking.get("REMAIN_NUM")); //剩余名额
		pd.put("SUGGLY_DATA_USER","1");
		List<PageData> exList = examinationService.findByUserId(pd);//查询当前用户已经年审材料已经通过的机构名称
		if(exList.size()==1){
			PageData examination = exList.get(0);
			info.put("EXAMINATION_ID",examination.get("EXAMINATION_ID"));  //年审id
			info.put("DEPARTMENT_NAME",examination.get("DEPARTMENT_NAME"));  //机构名
			info.put("PROC_INST_ID",examination.get("PROC_INST_ID"));  //流程实例id
		}else{
			errInfo="exception";
			map.put("result",errInfo);
			return map;
		}
		map.put("info",info);
		map.put("result",errInfo);
		return map;
	}


	/**删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("bookinguser:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		bookinguserService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}

	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("bookinguser:edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		bookinguserService.edit(pd);
		map.put("result", errInfo);
		return map;
	}

	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
//	@RequiresPermissions("bookinguser:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		String KEYWORDS1 = pd.getString("KEYWORDS1");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		if(Tools.notEmpty(KEYWORDS1))pd.put("KEYWORDSA", KEYWORDS1.trim());
		User user=Jurisdiction.getUser();
		String username=user.getUSERNAME();
		if(Const.ADMIN_USERNAME.contains(username)){ //说明不是机构负责人
			map.put("isUser",false);
		}else{
			map.put("isUser",true);
			pd.put("USER_ID",user.getUSER_ID());
		}


		page.setPd(pd);
		List<PageData>	varList = bookinguserService.list(page);	//列出BookingUser列表J


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
	@RequiresPermissions("bookinguser:edit")
	@ResponseBody
	public Object goEdit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = bookinguserService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}

	/**
	 * 拒绝线下申请
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/offlineRefuse")
	@ResponseBody
	@RequiresPermissions("bookinguser:edit")
	public Object offlineRefuse() throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		try{
			PageData bookinguser = bookinguserService.findById(pd);
			bookinguser.put("STATUS",0);   //状态为0 表示该线下预约已经失效 或者被拒绝
			bookinguserService.edit(bookinguser);
			//如果拒绝后将预约数量增加1
			PageData findBooking=new PageData();
			findBooking.put("BOOKINT_ID",bookinguser.get("BOOKING_ID"));
			PageData booking = bookingService.findById(bookinguser);

			/*//剩余量增加1
			booking.put("ALREADY_NUM",String.valueOf((int)booking.get("ALREADY_NUM")-1));
			//
			booking.put("REMAIN_NUM",String.valueOf((int)booking.get("REMAIN_NUM")+1));
			//修改预约数量
			bookingService.edit(booking);*/

			bookingService.offlineFailure(booking);
			String proId= (String) bookinguser.get("PROC_INST_ID");//获取流程实例id
			Task task = taskService.createTaskQuery().processInstanceId(proId).singleResult();
			Map<String,Object> var=new HashMap<>();
			String OPINION = Jurisdiction.getName() + ",fh,"+"没有通过线下审批";//审批人的姓名+审批意见
			var.put("审批结果", "【驳回】" + OPINION);
			taskService.setVariablesLocal(task.getId(),var);
			taskService.setVariable(task.getId(),"res","否");
			taskService.setVariable(task.getId(),"BOOKINGUSER_ID",bookinguser.get("BOOKINGUSER_ID"));
			taskService.complete(task.getId());
			String BOOKING_TYPE= (String) pd.get("BOOKING_TYPE");
			if(BOOKING_TYPE.equals("BOOKING_TYPE_GOVERNMENT")){
				bookinguser.put("GOVERNMENT_ID",bookinguser.get("APPROVE_ID"));
				PageData government = governmentService.findById(bookinguser);
				government.put("OFFLINE_RES","0");
				government.put("OFFLINE_TIME",new Date());
				government.put("OFFLINE_RES_TIME",new Date());
				examinationService.edit(government);
			}else if(BOOKING_TYPE.equals("BOOKING_TYPE_EXAMINATION")){
				bookinguser.put("EXAMINATION_ID",bookinguser.get("APPROVE_ID"));
				PageData examination = examinationService.findById(bookinguser);
				examination.put("OFFLINE_RES","0");
				examination.put("OFFLINE_TIME",new Date());
				examination.put("OFFLINE_RES_TIME",new Date());
				examinationService.edit(examination);
			}
		}catch (Exception e){
			errInfo="exception";
			map.put("result",errInfo);
			e.printStackTrace();
			return  map;
		}
		map.put("result",errInfo);
		return map;
	}
    /**
     * 线下审批
     * @return
     * @throws Exception
     */
	@RequestMapping("/offlineApprove")
	@ResponseBody
	@RequiresPermissions("bookinguser:edit")
	public Object offlineApprove() throws Exception {
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		try {
			PageData bookingUser = bookinguserService.findById(pd);
			bookingUser.put("ISPASS","1");  //将状态更改为已经通过审批
			//将流程进行下一步 并发送通知
			String proId= (String) bookingUser.get("PROC_INST_ID");//获取流程实例id
			Task task = taskService.createTaskQuery().processInstanceId(proId).singleResult();
			Map<String,Object> var=new HashMap<>();
			String OPINION = Jurisdiction.getName() + ",fh,"+"批准通过线下审批";//审批人的姓名+审批意见
			var.put("审批结果", "【批准】" + OPINION);
			taskService.setVariablesLocal(task.getId(),var);
			taskService.setVariable(task.getId(),"res","是");
			taskService.setVariable(task.getId(),"BOOKINGUSER_ID",bookingUser.get("BOOKINGUSER_ID"));
			taskService.complete(task.getId());
			bookinguserService.edit(bookingUser);
			String BOOKING_TYPE= (String) pd.get("BOOKING_TYPE");
			if(BOOKING_TYPE.equals("BOOKING_TYPE_GOVERNMENT")){
				bookingUser.put("GOVERNMENT_ID",bookingUser.get("APPROVE_ID"));
				PageData government = governmentService.findById(bookingUser);
				government.put("OFFLINE_RES","1");
				government.put("OFFLINE_TIME",new Date());
				government.put("OFFLINE_RES_TIME",new Date());
				examinationService.edit(government);
			}else if(BOOKING_TYPE.equals("BOOKING_TYPE_EXAMINATION")){
				bookingUser.put("EXAMINATION_ID",bookingUser.get("APPROVE_ID"));
				PageData examination = examinationService.findById(bookingUser);
				examination.put("OFFLINE_RES","1");
				examination.put("OFFLINE_TIME",new Date());
				examination.put("OFFLINE_RES_TIME",new Date());
				examinationService.edit(examination);
			}
		}catch (Exception e){
			e.printStackTrace();
			errInfo="exception";
			map.put("result",errInfo);
			return map;
		}
		map.put("result",errInfo);
		return map;
	}
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("bookinguser:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			bookinguserService.deleteAll(ArrayDATA_IDS);
			errInfo = "success";
		}else{
			errInfo = "error";
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}

	@RequestMapping(value="/getBookingUserId")
	@RequiresPermissions("bookinguser:edit")
	@ResponseBody
	public Object getBookingUserId () throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		List<PageData>	varList = ruprocdefService.varList(pd);
		for (PageData pageData : varList) {
			if(pageData.get("NAME_").equals("BOOKINGUSER_ID")){
				map.put("BOOKINGUSER_ID",pageData.get("TEXT_"));
				break;
			}
		}
		if(null==map.get("BOOKINGUSER_ID")){
			errInfo="exception";
			map.put("result",errInfo);
			return map;
		}
		map.put("result",errInfo);
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
		titles.add("预约人id");	//1
		titles.add("预约表id");	//2
		titles.add("年审id");	//3
		titles.add("预约 时间");	//4
		titles.add("预约凭证");	//5
		titles.add("是否通过预约(1 通过  0 未通过)");	//6
		titles.add("备注7");	//7
		titles.add("备注8");	//8
		titles.add("备注9");	//9
		titles.add("备注10");	//10
		dataMap.put("titles", titles);
		List<PageData> varOList = bookinguserService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("BOOKINGUSER_ID"));	    //1
			vpd.put("var2", varOList.get(i).getString("BOOKING_ID"));	    //2
			vpd.put("var3", varOList.get(i).getString("EXAMINATION_ID"));	    //3
			vpd.put("var4", varOList.get(i).getString("BOOKING_TIME"));	    //4
			vpd.put("var5", varOList.get(i).getString("EVIDENCE"));	    //5
			vpd.put("var6", varOList.get(i).getString("ISPASS"));	    //6
			vpd.put("var7", varOList.get(i).getString("FIELD1"));	    //7
			vpd.put("var8", varOList.get(i).getString("FIELD2"));	    //8
			vpd.put("var9", varOList.get(i).getString("FIELD3"));	    //9
			vpd.put("var10", varOList.get(i).getString("FIELD4"));	    //10
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}

}
