package org.fh.controller.government;

import org.activiti.engine.TaskService;
import org.activiti.engine.task.Task;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.session.Session;
import org.fh.controller.act.AcStartController;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.entity.system.User;
import org.fh.service.act.HiprocdefService;
import org.fh.service.act.RuprocdefService;
import org.fh.service.approveform.ApproveFormService;
import org.fh.service.approvetype.ApproveTypeService;
import org.fh.service.archive.ArchiveService;
import org.fh.service.attachment.AttachmentService;
import org.fh.service.booking.BookingService;
import org.fh.service.bookinginfo.BookingInfoService;
import org.fh.service.bookinguser.BookingUserService;
import org.fh.service.fhoa.DepartmentService;
import org.fh.service.government.GovernmentService;
import org.fh.service.scuser.ScuserService;
import org.fh.service.system.UsersService;
import org.fh.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.*;

/** 
 * 说明：行政审批
 * 作者：FH Admin QQ313596790
 * 时间：2019-09-17
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/government")
public class GovernmentController extends AcStartController {
	
	@Autowired
	private GovernmentService governmentService;
	@Autowired
	private UsersService usersService;

	@Autowired
	private DepartmentService departmentService;

	@Autowired
	private AttachmentService attachmentService;

	@Autowired
	private TaskService taskService;

	@Autowired
	private BookingService bookingService;

	@Autowired
	private BookingInfoService bookingInfoService;

	@Autowired
	private BookingUserService bookingUserService;

	@Autowired
	private ScuserService scuserService;

	@Autowired
	private ApproveFormService approveFormService;

	@Autowired
	private ApproveTypeService approveTypeService;

	@Autowired
	private RuprocdefService ruprocdefService;

	@Autowired
	private HiprocdefService hiprocdefService;

	@Autowired
	private ArchiveService archiveService;

	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@RequiresPermissions("government:add")
	@ResponseBody
	public Object add() throws Exception{
		Map<String,Object> zmap = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
//		pd.put("GOVERNMENT_ID", this.get32UUID());				//主键
		pd.put("CREATE_TIME",DateUtil.date2Str(new Date()));
		Session session = Jurisdiction.getSession();
		User user = Jurisdiction.getUser();
		pd.put("USERNAME",user.getUSERNAME());
		pd.put("USER_ID",user.getUSER_ID());
		PageData findOriganization=new PageData();
		findOriganization.put("SCUSER_ID",user.getUSER_ID());
		PageData findOrganizationRes = scuserService.findOrganizationByScuser(findOriganization);
		pd.put("DEPARTMENT_NAME",findOrganizationRes.get("ORGANIZATION_NAME"));
		try {
//			* 工作流的操作 *
			Map<String,Object> map = new LinkedHashMap<String, Object>();
			map.put("申请人员", Jurisdiction.getName());			//当前用户的姓名
			map.put("创建时间", pd.get("CREATE_TIME"));
			map.put("申请机构", pd.get("DEPARTMENT_NAME"));			//当前用户的姓名
			map.put("USERNAME", Jurisdiction.getUsername());			//指派代理人为当前用户
			map.put("附件",pd.get("ATTACHMENT_IDS"));    //附件
			map.put("GOVERNMENT_ID",pd.get("GOVERNMENT_ID"));    //行政id
			map.put("ACT_TYPE","government");    //设置流程类型为行政审批
			PageData find=new PageData();
			find.put("GOVERNMENT_ID",pd.get("GOVERNMENT_ID"));
			PageData government = governmentService.findById(find);
			if(pd.getString("DRAFTS").equals("0")&&null==government.get("PROC_INST_ID")){  //表示该审批不是 草稿
				String proId=startProcessInstanceByKeyHasVariables("KEY_government",map);		//启动流程实例(请假单流程)通过KEY
				Task task = taskService.createTaskQuery().processInstanceId(proId).singleResult();
				taskService.complete(task.getId());
				pd.put("PROC_INST_ID",proId);
				Object os = session.getAttribute("YAssignee");
				if(null != os && !"".equals(os.toString())){
					zmap.put("ASSIGNEE_",os.toString());
				}
			}else{  //表示该审批是草稿
				// 判断本次审批中的类型和上一次修改审批类型是否一致  如果不一致 将填报数据表和关联表删除
				PageData findApproveForm=new PageData();
				findApproveForm.put("APPROVE_ID",pd.get("GOVERNMENT_ID"));
				findApproveForm.put("isOrder",1);  //按着时间倒序排序
				List<PageData> approveAndForm = approveFormService.findApproveAndFormType(findApproveForm);
				if(approveAndForm.size()!=0){
					PageData newApproveForm = approveAndForm.get(0);
					for (PageData pageData : approveAndForm) {
						String formType = newApproveForm.getString("FORM_TYPE");
						if(!pageData.get("FORM_TYPE").equals(formType)){
							approveFormService.delete(pageData);
						}
					}
				}
			}
			pd.put("OFFLINE_RES","2");   //线下审批结果 2 为待审批
			pd.put("PRE_APPROVE","2");   //预审结果  2 为待审批
			pd.put("SUGGLY_DATA","2");  //材料再次审批结果  2 待审批
			PageData findApproveType=new PageData();
			findApproveType.put("APPROVETYPE_ID",pd.get("APPROVE_TYPE"));
			PageData childApprvoveType = approveTypeService.findById(findApproveType);
			findApproveType.put("APPROVETYPE_ID",childApprvoveType.get("PARENT_ID"));
//			PageData parentApproveType=approveTypeService.findById(findApproveType);
			//通过用户id 获取机构类型
			pd.put("APPROVE_TYPE_NAME",findOrganizationRes.getString("DNAME")+childApprvoveType.get("NAME"));
			governmentService.edit(pd);									//记录存入数据库
//			zmap.put("ASSIGNEE_",Jurisdiction.getUsername());			//用于给待办人发送新任务消息

		} catch (Exception e) {
			errInfo = "errer";
		}
		zmap.put("result", errInfo);				//返回结果
		return zmap;
	}

	//自动增加一条
	@RequestMapping(value="/autoAdd")
	@RequiresPermissions("government:add")
	@ResponseBody
	public Object autoAdd() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd.put("GOVERNMENT_ID",this.get32UUID());
		governmentService.autoSave(pd);
		map.put("result",errInfo);
		map.put("GOVERNMENT_ID",pd.get("GOVERNMENT_ID"));
		return map;
	}

	@RequestMapping(value="/closeAndDel")
	@RequiresPermissions("government:add")
	@ResponseBody
	public Object closeAndDel() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd=this.getPageData();
		pd.put("del","del");
		PageData government = governmentService.findById(pd);
		if(null!=government&&null==(government.get("PROC_INST_ID"))&&"2".equals(government.getString("DRAFTS"))){
			governmentService.delete(pd);
		}
		map.put("result",errInfo);
		return map;
	}

	@RequestMapping(value="/getInfo")
	@RequiresPermissions("government:add")
	@ResponseBody
	public Object getInfo() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		try{
			User user = Jurisdiction.getUser();
			PageData findOriganization=new PageData();
			findOriganization.put("SCUSER_ID",user.getUSER_ID());
			PageData findOrganizationRes = scuserService.findOrganizationByScuser(findOriganization);
			map.put("NAME",findOrganizationRes.get("ORGANIZATION_NAME"));
			map.put("HEADMAN",user.getNAME());
			map.put("result",errInfo);
		}catch (Exception e){
			errInfo="exception";
			e.printStackTrace();
			map.put("result",errInfo);
			return  map;
		}
		return map;
	}

	/**
	 * 判断年检中用户是否 已经有行政流程在审批
	 * @return
	 */
	@RequestMapping("/check")
	@ResponseBody
	@RequiresPermissions("government:add")
	public Object check(){
		Map<String,Object> map=new HashMap<>();
		String errInfo="success";
		PageData pd=new PageData();
		User user = (User) Jurisdiction.getSession().getAttribute(Const.SESSION_USER);
		pd.put("USER_ID",user.getUSER_ID());
		if(Const.ADMIN_USERNAME.contains(user.getUSERNAME())){
			map.put("result",errInfo);
			map.put("isUser",true);
			return map;
		}
		List<PageData> isHas = governmentService.findByUserId(pd);
		if(isHas.size()>0){
			map.put("isHas",true);
		}else{
			map.put("isHas",false);
		}
		map.put("result",errInfo);
		return map;
	}

	/**
	 * 判断行政中用户是否 已经有行政流程在线下预约节点
	 * @return
	 */
	@RequestMapping("/checkOffLine")
	@ResponseBody
	@RequiresPermissions("government:add")
	public Object checkHasOffLine(){
		Map<String,Object> map=new HashMap<>();
		String errInfo="success";
		PageData pd=new PageData();
		User user = (User) Jurisdiction.getSession().getAttribute(Const.SESSION_USER);
		pd.put("USER_ID",user.getUSER_ID());
		pd.put("OFFLINE_RES","0");
		pd.put("SUGGLY_DATA_USER","1");
		List<PageData> exList = governmentService.findByUserId(pd);//查询当前用户已经年审材料已经通过且未进行线下预约
		if(exList.size()!=1){
			map.put("code","1");  //表示已经有一个年检流程正在进行中
			map.put("result",errInfo);
			return map;
		}
		pd.put("TYPE",Const.BOOKINGUSER_TYPE_GOVERNMENT);
		List<PageData> bookingUserList = bookingUserService.findByUserId(pd);
		if(bookingUserList.size()>0){
			map.put("code","2");  //标识已经有一个线下预约正在进行中
			map.put("result",errInfo);
			return map;
		}
		map.put("code","0"); //表示没有问题
		map.put("result",errInfo);
		return map;
	}



	/**删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("government:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		governmentService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}

	//TODO  草稿状态的行政数据废除 并且删除相关的数据信息(已经上传的附件  相关联的填报表 以及关联表)
	/**废除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/cancel")
	@RequiresPermissions("government:edit")
	@ResponseBody
	public Object cancel() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		//先把该条审批删除

		governmentService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("government:edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> zmap = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		try {
			PageData find=new PageData();
			find.put("GOVERNMENT_ID",pd.get("GOVERNMENT_ID"));
			PageData government = governmentService.findById(find);
			if(pd.getString("DRAFTS").equals("0")&&null!=government&&null!=government.get("USER_ID")){

				String proId= (String) government.get("PROC_INST_ID");//获取流程实例id
				Task task = taskService.createTaskQuery().processInstanceId(proId).singleResult();
				String taskId = task.getId();
				taskService.setVariable(taskId,"附件",pd.get("ATTACHMENT_IDS"));
				taskService.complete(task.getId());

				/*String proId=startProcessInstanceByKeyHasVariables("KEY_government",map);		//启动流程实例(请假单流程)通过KEY
				Task task = taskService.createTaskQuery().processInstanceId(proId).singleResult();
				taskService.complete(task.getId());
				pd.put("PROC_INST_ID",proId);*/

			}
			governmentService.edit(pd);									//记录存入数据库
//			zmap.put("ASSIGNEE_",Jurisdiction.getUsername());			//用于给待办人发送新任务消息

		} catch (Exception e) {
			errInfo = "errer";
		}
		zmap.put("result", errInfo);				//返回结果
		return zmap;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("government:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());

		String rnumbers = Jurisdiction.getRnumbers();
		//不显示自动添加的数据 并且除了机构负责人 其他角色不能查看草稿的流程
		if(!rnumbers.contains(Const.GOVERNMENT_ADMIN_ROLE)){
			if(!Const.ADMIN_USERNAME.contains(Jurisdiction.getUsername())){ //判断用户为机构负责人  可以查看草稿
				User user= (User) Jurisdiction.getSession().getAttribute(Const.SESSION_USER);
				String USER_ID=user.getUSER_ID();
				pd.put("USER_ID",USER_ID);

			}else{
				pd.put("DRAFTS","0");
			}
		}else{  //如果是行政管理员   只能看上报完的流程数据
			pd.put("DRAFTS","0");
		}
		page.setPd(pd);
		List<PageData>	varList = governmentService.list(page);	//列出Government列表
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
	@RequiresPermissions("government:edit")
	@ResponseBody
	public Object goEdit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = governmentService.findById(pd);	//根据ID读取
		if(!pd.get("ATTACHMENT_IDS").toString().equals("")){
			String ATTACHMENT=pd.get("ATTACHMENT_IDS").toString();
			pd.put("ATTACHMENT",ATTACHMENT);
			List<PageData> apd=attachmentService.findAttachmentByIds(pd);
			map.put("apd", apd);  //查询出来的附件名字集合
		}
		PageData findApproveForm=new PageData();
		findApproveForm.put("APPROVE_ID",pd.getString("GOVERNMENT_ID"));
		//根据id 获取审批类型和表单
		List<PageData> approveFormList = approveFormService.findApproveAndFormType(findApproveForm);
		if(approveFormList.size()!=0&&null!=approveFormList.get(0).get("FORM_TYPE")){
			PageData approve=approveFormList.get(0);
			map.put("approveFormList",approveFormList);   //表格list
			map.put("childType",approve.get("FORM_TYPE"));   //审批子类型
			//通过审批子类型查找审批父类型
			PageData findApprove=new PageData();
			findApprove.put("APPROVETYPE_ID",approve.get("FORM_TYPE"));
			PageData childApprove= approveTypeService.findById(findApprove);
			findApprove.put("APPROVETYPE_ID",childApprove.get("PARENT_ID"));
			PageData parentApprove= approveTypeService.findById(findApprove);
			map.put("parentType",parentApprove.get("APPROVETYPE_ID"));   //审批父级类型
		}else{
			map.put("childType",pd.get("APPROVE_TYPE"));   //审批子类型
			//通过审批子类型查找审批父类型
			PageData findApprove=new PageData();
			findApprove.put("APPROVETYPE_ID",pd.get("APPROVE_TYPE"));
			PageData childApprove= approveTypeService.findById(findApprove);
			findApprove.put("APPROVETYPE_ID",childApprove.get("PARENT_ID"));
			PageData parentApprove= approveTypeService.findById(findApprove);
			map.put("parentType",parentApprove.get("APPROVETYPE_ID"));   //审批父级类型
		}
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}


	/**查看详情
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/getDetail")
	@RequiresPermissions("government:list")
	@ResponseBody
	public Object getDetail() throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		//先判断行政审批的状态    是否全部完成  是否中途结束
		PageData government = governmentService.findById(pd);
		//TODO 通过行政审批id  判断状态
		//查询出上传数据
		if(null!=government){
			List<PageData> attList=new ArrayList<>();     //附件列表
			List<PageData> approveFormList=new ArrayList<>();   //表单数据列表
			 List<PageData>	varList = ruprocdefService.varList(pd);			//列出流程变量列表
			PageData find=new PageData();
			find.put("PROC_INST_ID_",government.get("PROC_INST_ID"));
			varList=ruprocdefService.varList(find);  //流程中的变量
			if(varList.size()==0){
				varList = hiprocdefService.hivarList(find);
			}
			Iterator<PageData> dataIterator = varList.iterator();
			while (dataIterator.hasNext()){
				PageData next = dataIterator.next();
				if(next.getString("NAME_").equals("ACT_TYPE")||
						next.getString("NAME_").equals("GOVERNMENT_ID")||
						next.getString("NAME_").equals("附件")||
						next.getString("NAME_").equals("res")||
						next.getString("NAME_").equals("BOOKINGUSER_ID")){
					dataIterator.remove();
				}
			}
			find.clear();
			find.put("ATTACHMENT",government.get("ATTACHMENT_IDS"));
			attList=attachmentService.findAttachmentByIds(find);  //提交的附件
			find.clear();
			find.put("APPROVE_ID",government.get("GOVERNMENT_ID"));
			approveFormList = approveFormService.findApproveFormAndFullDataUrl(find);  //提交的表单数据  可能为空
			find.clear();
			find.put("PROC_INST_ID_",government.get("PROC_INST_ID"));
			List<PageData>	hitaskList = ruprocdefService.hiTaskList(find);	//历史任务节点列表
			map.put("attList",attList);   //附件
			map.put("varList",varList);  //流程变量
			map.put("approveFormList",approveFormList);
			map.put("hitaskList",hitaskList);
			if("0".equals(government.getString("STATUS"))){//表示作废
				map.put("status","0");
			}else if("1".equals(government.getString("STATUS"))){  //表示正在进行
				map.put("status","1");
			}else if("2".equals(government.getString("STATUS"))){  //表示已经完成
				map.put("status","2");
			}
			map.put("result","success");
		}else{
			throw new Exception("行政审批查询详情失败!");
		}
		return map;
	}


	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("government:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			governmentService.deleteAll(ArrayDATA_IDS);
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
		titles.add("机构id");	//2
		titles.add("用户名");	//3
		titles.add("用户id");	//4
		titles.add("附件ids");	//5
		titles.add("线下审批时间");	//6
		titles.add("线下审批结果( 1 通过  0  未通过)");	//7
		titles.add("预审结果(1 已通过  0  未通过)");	//8
		titles.add("预审结果确认时间");	//9
		titles.add("预审用户是否确认过(1 已确认  0未确认)");	//10
		titles.add("材料再次审核是否通过(1 已通过  0 未通过)");	//11
		titles.add("确认补发材料时间");	//12
		titles.add("用户补发材料是否确认过(1 已确认  0未确认)");	//13
		titles.add("创建时间");	//14
		titles.add("流程实例id");	//15
		titles.add("是否有效(1 有效 0已失效 或已完成)");	//16
		dataMap.put("titles", titles);
		List<PageData> varOList = governmentService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("GOVERNMENT_ID"));	    //1
			vpd.put("var2", varOList.get(i).getString("DEPARTMENT_NAME"));	    //2
			vpd.put("var3", varOList.get(i).getString("USERNAME"));	    //3
			vpd.put("var4", varOList.get(i).getString("USER_ID"));	    //4
			vpd.put("var5", varOList.get(i).getString("ATTACHMENT_IDS"));	    //5
			vpd.put("var6", varOList.get(i).getString("OFFLINE_RES_TIME"));	    //6
			vpd.put("var7", varOList.get(i).getString("OFFLINE_RES"));	    //7
			vpd.put("var8", varOList.get(i).getString("PRE_APPROVE"));	    //8
			vpd.put("var9", varOList.get(i).getString("PRE_APPROVE_TIME"));	    //9
			vpd.put("var10", varOList.get(i).getString("PRE_APPROVE_USER"));	    //10
			vpd.put("var11", varOList.get(i).getString("SUGGLY_DATA"));	    //11
			vpd.put("var12", varOList.get(i).getString("SUGGLY_DATA_TIME"));	    //12
			vpd.put("var13", varOList.get(i).getString("SUGGLY_DATA_USER"));	    //13
			vpd.put("var14", varOList.get(i).getString("CREATE_TIME"));	    //14
			vpd.put("var15", varOList.get(i).getString("PROC_INST_ID"));	    //15
			vpd.put("var16", varOList.get(i).getString("STATUS"));	    //16
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}


	//    @RequiresPermissions("article:add")
	@RequestMapping("/attachmentLoad")
	@ResponseBody
	public Object attachmentLoad(@RequestParam("file") MultipartFile file){
		Map<String,Object> map=new HashMap<>();
		PageData pageData=new PageData();
		pageData=this.getPageData();
		String ids="";
		//文件的原名字
		String originalName = file.getOriginalFilename();
		//文件的现名字 当前时间精确到毫秒
		String fileName=(new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date()))+ UUID.randomUUID().toString().substring(5,10);
		//根据操作系统获取上传文件路径
		String filePath = Const.ATTACHMENTPATH;
		try {
			fileName=FileUpload.fileUp(file, filePath, fileName);
			String url=filePath+fileName;
			pageData.put("URL",url);
			pageData.put("ORIGINAL_NAME",originalName);
			pageData.put("NAME",fileName);
			pageData.put("CREATE_DATE",new Date());
			pageData.put("CREATE_BY",Const.USER_NAME);
			attachmentService.save(pageData);
			Object id1= pageData.get("ID");
			if(null!=id1){
				String id2=id1.toString();
				map.put("ids",id2);
				map.put("code",0);
			}else{
				map.put("code",1);
			}
		} catch (Exception e) {
			e.printStackTrace();
			map.put("code",1);
			return  map;
		}
		return map;
	}

	@RequestMapping("/deleteAttachment")
	@RequiresPermissions("government:add")
	@ResponseBody
	public Object deleteAttachment(){
		String errInfo="success";
		Map map=new HashMap();
		PageData pageData=new PageData();
		pageData=this.getPageData();
		try{
			attachmentService.deleteAttachment(pageData);
		}catch (Exception e){
			errInfo="exception";
			map.put("result",errInfo);
			e.printStackTrace();
			return map;
		}
		map.put("result",errInfo);
		return map;
	}


	/**
	 * 上传扫描件
	 * @return
	 */
	@RequestMapping("/uploadScanning")
	@ResponseBody
	@RequiresPermissions("government:add")
	@Transactional
	public Object uploadScanning(HttpServletRequest request,HttpServletResponse res) throws Exception {
		Map<String,Object> map=new HashMap<>();
		String errInfo="success";
		PageData pd=new PageData();
		pd=this.getPageData();
		try{
			if(null==pd.get("PROC_INST_ID")){
				errInfo="exception";
				map.put("result",errInfo);
				return map;
			}
			if(null==pd.get("GOVERNMENT_ID")){
				errInfo="exception";
				map.put("result",errInfo);
				return map;
			}
			if(null==pd.get("BOOKINGUSER_ID")){
				errInfo="exception";
				map.put("result",errInfo);
				return map;
			}

			PageData government = governmentService.findById(pd);
			String ATTACHMENT_IDS= (String) government.get("ATTACHMENT_IDS");
			if(null!=pd.get("ATTACHMENT_IDS")&&(!"".equals(pd.get("ATTACHMENT_IDS")))){
				ATTACHMENT_IDS+=(","+(String)pd.get("ATTACHMENT_IDS"));
			}
			government.put("ATTACHMENT_IDS",ATTACHMENT_IDS);
			government.put("STATUS","2");  //将该条行政审批设置为已经完成状态
			governmentService.edit(government);
			//TODO 流程结束后为用户发送短信通知


			PageData findBookingUser=new PageData();
			findBookingUser.put("BOOKINGUSER_ID",pd.get("BOOKINGUSER_ID"));
			PageData bookinguser = bookingUserService.findById(findBookingUser);
			bookinguser.put("STATUS","2");  //表示已经完成
			bookingUserService.edit(bookinguser);


			//对流程中的文件进行打包 存储
			PageData findApproveType=new PageData();
			findApproveType.put("APPROVETYPE_ID",government.get("APPROVE_TYPE"));
			PageData approveType = approveTypeService.findById(findApproveType);
			String approveTypeName= approveType.getString("NAME");
			PageData zipPd=new PageData();

			zipPd.put("user",Jurisdiction.getUser());
			zipPd.put("ELSE_ID",government.get("GOVERNMENT_ID"));
			zipPd.put("UPLOAD_USERNAME",government.get("USER_ID"));
			PageData findApproveType1=new PageData();
			findApproveType1.put("APPROVETYPE_ID",government.get("APPROVE_TYPE"));
			PageData approveType1= approveTypeService.findById(findApproveType1);
			zipPd.put("TYPE",approveType1.get("RECORD_TYPE"));
			zipPd.put("zipBasePath",Const.GOVERNMENT_ZIP_PATH);
			zipPd.put("zipName",government.get("USERNAME")+"_"+approveTypeName+DateUtil.date2Str(new Date(), "yyyyMMddHHmmss"));
			List<String> filePaths=new ArrayList<>();
			PageData findAtt=new PageData();
			String ATTACHMENT=government.get("ATTACHMENT_IDS").toString();
			findAtt.put("ATTACHMENT",ATTACHMENT);
			List<PageData> attachmentByIds = attachmentService.findAttachmentByIds(findAtt);
			/*for (PageData attachmentById : attachmentByIds) {
				filePaths.add(attachmentById.getString("URL"));
			}*/
			zipPd.put("filePaths",attachmentByIds);
			archiveService.examineZip(zipPd,request,res);

			String proId= (String) pd.get("PROC_INST_ID");//获取流程实例id
			Task task = taskService.createTaskQuery().processInstanceId(proId).singleResult();
			Map<String,Object> var=new HashMap<>();
			String OPINION = Jurisdiction.getName() + ",fh,"+"已经上传扫描件";//审批人的姓名+审批意见
			var.put("审批结果", "【通过】" + OPINION);
			taskService.setVariablesLocal(task.getId(),var);
			taskService.setVariable(task.getId(),"res","是");
			taskService.complete(task.getId());



		}catch (Exception e){
			e.printStackTrace();
			errInfo="exception";
			map.put("result",errInfo);
			return map;
		}
		map.put("result",errInfo);
		return map;
	}



	@RequestMapping(value = "/download")
	@ResponseBody
	@RequiresPermissions("government:list")
	public Object download(HttpServletRequest request, HttpServletResponse response) throws UnsupportedEncodingException {
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		PageData attachment = attachmentService.getOneById(pd);
		String url="";
		String fileName="";
		if(attachment!=null){
			url= (String) attachment.get("URL");
			fileName= (String) attachment.get("ORIGINAL_NAME");
		}else{
			errInfo="exception";
			map.put("result", errInfo);
			return map;
		}
		String userAgent = request.getHeader("User-Agent");
		if (/* IE 8 至 IE 10 */
				userAgent.toUpperCase().contains("MSIE") ||
						/* IE 11 */
						userAgent.contains("Trident/7.0")) {
			try {
				fileName = URLEncoder.encode(fileName, "UTF-8");
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
		} else if (userAgent.toUpperCase().contains("MOZILLA") ||
				userAgent.toUpperCase().contains("CHROME")) {
			fileName = new String(fileName.getBytes(), "ISO-8859-1");
		} else {
			fileName = URLEncoder.encode(fileName, "UTF-8");
		}
		if (fileName != null) {
			//设置文件路径
			File file = new File(url);
			if (file.exists()) {
				response.setCharacterEncoding("UTF-8");
				response.setContentType("application/force-download");// 设置强制下载不打开
				response.setHeader("Content-Disposition", "attachment;fileName=" + fileName);// 设置文件名
				byte[] buffer = new byte[1024];
				FileInputStream fis = null;
				BufferedInputStream bis = null;
				try {
					fis = new FileInputStream(file);
					bis = new BufferedInputStream(fis);
					OutputStream os = response.getOutputStream();
					int i = bis.read(buffer);
					while (i != -1) {
						os.write(buffer, 0, i);
						i = bis.read(buffer);
					}
					os.close();
				} catch (Exception e) {
					e.printStackTrace();
				} finally {
					if (bis != null) {
						try {
							bis.close();
						} catch (IOException e) {
							e.printStackTrace();
						}
					}
					if (fis != null) {
						try {
							fis.close();
						} catch (IOException e) {
							e.printStackTrace();
						}
					}
				}
			}
		}
		return map;
	}


}
