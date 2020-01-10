package org.fh.controller.act.rutask;

import java.net.URLDecoder;
import java.util.*;

import org.activiti.engine.TaskService;
import org.activiti.engine.task.Task;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.session.Session;
import org.fh.controller.act.AcBusinessController;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.service.act.HiprocdefService;
import org.fh.service.act.RuprocdefService;
import org.fh.service.approveform.ApproveFormService;
import org.fh.service.attachment.AttachmentService;
import org.fh.service.examination.ExaminationService;
import org.fh.service.government.GovernmentService;
import org.fh.service.organization.OrganizationService;
import org.fh.service.system.FhsmsService;
import org.fh.service.system.UsersService;
import org.fh.service.userconfirm.UserConfirmService;
import org.fh.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 说明：待办任务
 * 作者：FH Admin Q31-35-96790
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping(value="/rutask")
public class RuTaskController extends AcBusinessController {
	
	@Autowired
	private RuprocdefService ruprocdefService;
	
	@Autowired
	private FhsmsService fhsmsService;
	
	@Autowired
	private HiprocdefService hiprocdefService;

	@Autowired
	private AttachmentService attachmentService;

	@Autowired
	private TaskService taskService;

	@Autowired
	private ExaminationService examinationService;

	@Autowired
	private GovernmentService governmentService;

	@Autowired
	private UserConfirmService userConfirmService;

	@Autowired
	private ApproveFormService approveFormService;

	@Autowired
	private UsersService usersService;
	@Autowired
	private OrganizationService organizationService;


	
	/**待办任务列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("rutask:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("keywords", KEYWORDS.trim());
		String STRARTTIME = pd.getString("STRARTTIME");					//开始时间
		String ENDTIME = pd.getString("ENDTIME");						//结束时间
		if(Tools.notEmpty(STRARTTIME))pd.put("lastStart", STRARTTIME+" 00:00:00");
		if(Tools.notEmpty(ENDTIME))pd.put("lastEnd", ENDTIME+" 00:00:00");
		pd.put("USERNAME", Jurisdiction.getUsername()); 		//查询当前用户的任务(用户名查询)
		pd.put("RNUMBERS", Jurisdiction.getRnumbers()); 		//查询当前用户的任务(角色编码查询)
		page.setPd(pd);
		List<PageData>	varList = ruprocdefService.list(page);	//列出Rutask列表
		for(int i=0;i<varList.size();i++){
			varList.get(i).put("INITATOR", getInitiator(varList.get(i).getString("PROC_INST_ID_")));//流程申请人
		}
		map.put("varList", varList);
		map.put("page", page);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**待办任务列表(只显示5条)
	 * @param page
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/getList")
	@ResponseBody
	public Object getList(Page page) throws Exception{
		PageData pd = new PageData();
		Map<String,Object> map = new HashMap<String,Object>();
		pd.put("USERNAME", Jurisdiction.getUsername()); 		//查询当前用户的任务(用户名查询)
		pd.put("RNUMBERS", Jurisdiction.getRnumbers()); 		//查询当前用户的任务(角色编码查询)
		List<PageData> pdo = organizationService.findByUserId(Jurisdiction.getUser().getUSER_ID());
		page.setPd(pd);
		page.setShowCount(5);
		List<PageData>	varList = ruprocdefService.list(page);	//列出Rutask列表
		List<PageData> pdList = new ArrayList<PageData>();
		for(int i=0;i<varList.size();i++){
			PageData tpd = new PageData();
			tpd.put("NAME_", varList.get(i).getString("NAME_"));	//任务名称
			tpd.put("PNAME_", varList.get(i).getString("PNAME_"));	//流程名称
			tpd.put("CREATE_TIME", varList.get(i).get("CREATE_TIME_"));	//创建时间
			if (pdo.size()>0) {
				tpd.put("ORG_NAME", pdo.get(0).getString("NAME"));	//创建时间
			}
			pdList.add(tpd);
		}
		map.put("list", pdList);
		map.put("taskCount", page.getTotalResult());
		return map;
	}
	
	/**待办任务数量
	 * @param page
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/getTaskCount")
	@ResponseBody
	public Object getTaskCount(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd.put("USERNAME", Jurisdiction.getUsername()); 		//查询当前用户的任务(用户名查询)
		pd.put("RNUMBERS", Jurisdiction.getRnumbers()); 		//查询当前用户的任务(角色编码查询)
		page.setPd(pd);
		page.setShowCount(5);
		ruprocdefService.list(page);						
		map.put("taskCount", page.getTotalResult());
		map.put("result", errInfo);
		return map;
	}
	
	/**去办理任务页面获取数据
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/getHandleData")
	@ResponseBody
	public Object getHandleData()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		List<PageData> attList=new ArrayList<>();     //附件列表
		List<PageData> approveFormList=new ArrayList<>();   //表单数据列表
		List<PageData>	varList = ruprocdefService.varList(pd);			//列出流程变量列表
		boolean hasAttachment=false;
		boolean hasApproveForm=false;
		Iterator<PageData> varIterator = varList.iterator();
		String APPROVE_ID="";
		while (varIterator.hasNext()){
			PageData next = varIterator.next();
			if("附件".equals((String)next.get("NAME_"))&&StringUtils.isNotBlank((String)next.get("TEXT_"))){
				hasAttachment=true;
				pd.put("ATTACHMENT",(String)next.get("TEXT_"));
				attList=attachmentService.findAttachmentByIds(pd);
				varIterator.remove();
			}
			if("EXAMINATION_ID".equals((String)next.get("NAME_"))){
				APPROVE_ID=next.getString("TEXT_");
				varIterator.remove();
			}
			if("GOVERNMENT_ID".equals((String)next.get("NAME_"))){
				APPROVE_ID=next.getString("TEXT_");
				varIterator.remove();
			}
			if("ACT_TYPE".equals((String)next.get("NAME_"))){
				varIterator.remove();
			}
		}

		//TODO  根据提交的表单  将表单进行预览

		if(StringUtils.isNotBlank(APPROVE_ID)){
			//通过审批id 审批 表单中间表获取填写表单数据
			PageData findAppAndFullDataAllUrl=new PageData();
			findAppAndFullDataAllUrl.put("APPROVE_ID",APPROVE_ID);
			approveFormList = approveFormService.findApproveFormAndFullDataUrl(findAppAndFullDataAllUrl);
			if(approveFormList.size()!=0){
				hasApproveForm=true;
			}
		}


		List<PageData>	hitaskList = ruprocdefService.hiTaskList(pd);	//历史任务节点列表
		Iterator<PageData> iterator = hitaskList.iterator();
		while (iterator.hasNext()){
			PageData next = iterator.next();
			if("exclusiveGateway".equals((String)next.get("ACT_TYPE_"))){
				iterator.remove();
			}else if("pre_approve".equals((String)next.get("TEXT_"))||"confirm_data".equals((String)next.get("TEXT_"))){
				iterator.remove();
			}else{
				if(null!=next.get("DURATION_")){  //根据耗时的毫秒数计算天时分秒
					Long ztime = Long.parseLong(next.get("DURATION_").toString());
					Long shi = (ztime % (1000*60*60*24))/(1000*60*60);
					Long tian = ztime / (1000*60*60*24);
					Long fen = (ztime % (1000*60*60*24))%(1000*60*60)/(1000*60);
					Long miao = (ztime % (1000*60*60*24))%(1000*60*60)%(1000*60)/1000;
					next.put("ZTIME", tian+"天"+shi+"时"+fen+"分"+miao+"秒");
				}
			}
		}
		pd.put("ID",pd.get("PROC_INST_ID_"));
		PageData pageData=ruprocdefService.getInfo(pd);
		String FILENAME = URLDecoder.decode(pd.getString("FILENAME"), "UTF-8");
		createXmlAndPngAtNowTask(pd.getString("PROC_INST_ID_"),FILENAME);//生成当前任务节点的流程图片
		String imgSrcPath = PathUtil.getProjectpath()+Const.FILEACTIVITI+FILENAME;
		String rnumbers = Jurisdiction.getRnumbers();
		if(rnumbers.contains(Const.HEADMAN_ROLE)){
			map.put("isUser",true);
		}else{
			map.put("isUser",false);
		}
		map.put("imgSrc", "data:image/jpeg;base64,"+ImageAnd64Binary.getImageStr(imgSrcPath)); //解决图片src中文乱码，把图片转成base64格式显示(这样就不用修改tomcat的配置了)
		map.put("key", pageData.get("KEY_"));
		map.put("varList", varList);
		map.put("hasAttachment",hasAttachment);
		if(hasAttachment){
			map.put("attList",attList);
		}
		map.put("hasApproveForm",hasApproveForm);
		if(hasApproveForm){
			map.put("approveFormList",approveFormList);
		}
		map.put("hitaskList", hitaskList);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**办理任务
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/handle")
	@RequiresPermissions("rutask:edit")
	@ResponseBody
	public Object handle() throws Exception{
		Map<String,Object> zmap = new HashMap<String,Object>();
		String errInfo = "success";
		Session session = Jurisdiction.getSession();
		PageData pd = new PageData();
		pd = this.getPageData();
		String taskId = pd.getString("ID_");	//任务ID
		String sfrom = "";
		Object ofrom = getVariablesByTaskIdAsMap(taskId,"审批结果");
		if(null != ofrom){
			sfrom = ofrom.toString();
		}
		Map<String,Object> map = new LinkedHashMap<String, Object>();
		String OPINION = sfrom + Jurisdiction.getName() + ",fh,"+pd.getString("OPINION");//审批人的姓名+审批意见
		String msg = pd.getString("msg");
		if("yes".equals(msg)){								//批准
			map.put("审批结果", "【批准】" + OPINION);		//审批结果
			setVariablesByTaskIdAsMap(taskId,map);			//设置流程变量
			setVariablesByTaskId(taskId,"RESULT","批准");
			completeMyPersonalTask(taskId);
		}else{												//驳回
			map.put("审批结果", "【驳回】" + OPINION);		//审批结果
			setVariablesByTaskIdAsMap(taskId,map);			//设置流程变量
			setVariablesByTaskId(taskId,"RESULT","驳回");
			completeMyPersonalTask(taskId);
		}
		try{
			removeVariablesByPROC_INST_ID_(pd.getString("PROC_INST_ID_"),"RESULT");			//移除流程变量(从正在运行中)
		}catch(Exception e){
			/*此流程变量在历史中**/
		}
		try{
			String ASSIGNEE_ = pd.getString("ASSIGNEE_");							//下一待办对象
			if(Tools.notEmpty(ASSIGNEE_)){
				setAssignee(session.getAttribute("TASKID").toString(),ASSIGNEE_);	//指定下一任务待办对象
			}else{
				Object os = session.getAttribute("YAssignee");
				if(null != os && !"".equals(os.toString())){
					ASSIGNEE_ = os.toString();										//没有指定就是默认流程的待办人
				}else{
					trySendSms(zmap,pd); 			//没有任务监听时，默认流程结束，发送站内信给任务发起人
				}
			}
			zmap.put("ASSIGNEE_",ASSIGNEE_);		//用于给待办人发送新任务消息
		}catch(Exception e){
			zmap.put("ASSIGNEE_","null");
			/*手动指定下一待办人，才会触发此异常。
			 * 任务结束不需要指定下一步办理人了,发送站内信通知任务发起人**/
			trySendSms(zmap,pd);
		}
		zmap.put("result", errInfo);				//返回结果
		return zmap;
	}

	@RequestMapping(value="/getNodeInfo")
	@RequiresPermissions("rutask:edit")
	@ResponseBody
	public Object getNodeInfo() throws Exception {
		Map<String,Object>map=new HashMap<>();
		String result="success";
		PageData pd=new PageData();
		pd=this.getPageData();
		String taskId = pd.getString("ID_");	//任务ID
		Task task=taskService.createTaskQuery() // 创建任务查询
				.taskId(taskId) // 根据任务id查询
				.singleResult();

		String nodeName=task.getTaskDefinitionKey();
		List<PageData>	varList = ruprocdefService.varList(pd);			//列出流程变量列表
		for (PageData pageData : varList) {
			if(StringUtils.isNotBlank((String)pageData.get("NAME_"))&&((String)pageData.get("NAME_")).equals("EXAMINATION_ID")){
				map.put("APPROVE_ID",pageData.get("TEXT_"));
			}
			if(StringUtils.isNotBlank((String)pageData.get("NAME_"))&&((String)pageData.get("NAME_")).equals("GOVERNMENT_ID")){
				map.put("APPROVE_ID",pageData.get("TEXT_"));
			}
			if(((String)pageData.get("NAME_")).equals("ACT_TYPE")){
				map.put("ACT_TYPE",pageData.get("TEXT_"));
			}
		}

		map.put("nodeName",nodeName);
		map.put("result",result);
		return map;
	}

	/**办理年度审批任务
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/exHandle")
	@RequiresPermissions("rutask:edit")
	@ResponseBody
	public Object exHandle() throws Exception{
		Map<String,Object> zmap = new HashMap<String,Object>();
		String errInfo = "success";
		Session session = Jurisdiction.getSession();
		PageData pd = new PageData();
		pd = this.getPageData();
		String taskId = pd.getString("ID_");	//任务ID
		String sfrom = "";
		Object ofrom = getVariablesByTaskIdAsMap(taskId,"审批结果");
		if(null != ofrom){
			sfrom = ofrom.toString();
		}
		Map<String,Object> map = new LinkedHashMap<String, Object>();
		String OPINION = sfrom + Jurisdiction.getName() + ",fh,"+pd.getString("OPINION");//审批人的姓名+审批意见
		String msg = pd.getString("msg");
		Task task=taskService.createTaskQuery() // 创建任务查询
				.taskId(taskId) // 根据任务id查询
				.singleResult();
		String nodeName=task.getTaskDefinitionKey();
		if(nodeName.equals("pre_approve")||nodeName.equals("confirm_data")){
			map.put(nodeName,nodeName);
		}
		boolean isContains=nodeName.contains("_confirm");

		String  EXAMINATION_ID= (String) getVariablesByTaskIdAsMap(taskId, "EXAMINATION_ID");  //获取该年审数据id
		PageData pageData=new PageData();
		pageData.put("EXAMINATION_ID",EXAMINATION_ID);
		PageData examination = examinationService.findById(pageData);   // 根据流程中的id 获取当前年审数据

		if("yes".equals(msg)){								//批准
			String res="是";
			if(isContains){
				map.put("确认结果","用户:"+Jurisdiction.getUsername()+"【已经确认】");

				//todo  进行用户确认并 签名确认
				List<PageData> hisNodes = ruprocdefService.hiTaskList(pd);  //获取流程节点
				Iterator<PageData> iterator = hisNodes.iterator();
				while (iterator.hasNext()){
					PageData node = iterator.next();
					if("exclusiveGateway".equals((String)node.get("ACT_TYPE_"))) {
						iterator.remove();
					}
				}
				PageData lastNode = hisNodes.get(hisNodes.size() - 2);
				PageData requrie=new PageData();
				requrie.put("stage", lastNode.get("ACT_NAME_"));
				requrie.put("name", Jurisdiction.getUsername());
				requrie.put("process", "年度审核");
				requrie.put("state", "审批通过");
				//todo  生成word 并且转化为pdf  并添加签名
				String pdfUrl=ToPdf.writeinWord(Const.APPROVAL_PATH,requrie);
				if(StringUtils.isNotBlank(pdfUrl)){
					//如果成功生成pdf，将该信息进行存储
					PageData userPd=new PageData();
					userPd.put("USERCONFIRM_ID",this.get32UUID());
					userPd.put("PRO_ID",pd.get("PROC_INST_ID_"));
					userPd.put("RRO_TYPE","1");   //1  年度审核  2 行政审批
					userPd.put("USER_ID",Jurisdiction.getUser().getUSER_ID());
					userPd.put("RES",1);  //审批通过
					userPd.put("ATT_ID","");  //通过转化得到的pdf url
					userPd.put("CREATE_TIME",new Date());
					try{
						userConfirmService.save(userPd);
					}catch (Exception e){
						e.printStackTrace();
					}
				}else{
					throw new Exception("用户签名错误");
				}


			}else {
				map.put("审批结果", "【批准】" + OPINION);		//审批结果
			}
			setVariablesByTaskIdAsMap(taskId,map);			//设置流程变量
			setVariablesByTaskId(taskId,"res",res);
			completeMyPersonalTask(taskId);
			if(nodeName.equals("pre_approve")){  //该节点为预审通过
				examination.put("PRE_APPROVE","1");
			}else if(nodeName.equals("confirm_data")){ //该节点为材料审核通过
				examination.put("SUGGLY_DATA","1");
			}else if(nodeName.equals("offline_booking")){  //该节点为线下审批通过
				examination.put("OFFLINE_RES","1");
				examination.put("OFFLINE_RES_TIME",new Date());
			}else if(nodeName.equals("pre_confirm01_yes")){ //该节点为用户确定预审通过
				examination.put("PRE_APPROVE_USER","1");
				examination.put("PRE_APPROVE_TIME",new Date());
			}else if(nodeName.equals("data_confirm02_yes")){  //该节点为用户确定材料审批通过
				examination.put("SUGGLY_DATA_USER","1");
				examination.put("SUGGLY_DATA_TIME",new Date());
				zmap.put("offline","success");
			}
			examinationService.edit(examination);
		}else{												//驳回
			String res="否";
			if(isContains){
				map.put("确认结果","用户:"+Jurisdiction.getUsername()+"【未确认】");
				//todo  进行用户确认并 签名确认
				List<PageData> hisNodes = ruprocdefService.hiTaskList(pd);  //获取流程节点
				Iterator<PageData> iterator = hisNodes.iterator();
				while (iterator.hasNext()){
					PageData node = iterator.next();
					if("exclusiveGateway".equals((String)node.get("ACT_TYPE_"))) {
						iterator.remove();
					}
				}
				PageData lastNode = hisNodes.get(hisNodes.size() - 2);
				PageData requrie=new PageData();
				requrie.put("stage", lastNode.get("ACT_NAME_"));
				requrie.put("name", Jurisdiction.getUsername());
				requrie.put("process", "年度审核");
				requrie.put("state", "审批未通过");

				//todo  生成word 并且转化为pdf  并添加签名
				String pdfUrl=ToPdf.writeinWord(Const.APPROVAL_PATH,requrie);
				if(StringUtils.isNotBlank(pdfUrl)){
					//如果成功生成pdf，将该信息进行存储
					PageData userPd=new PageData();
					userPd.put("USERCONFIRM_ID",this.get32UUID());
					userPd.put("PRO_ID",pd.get("PROC_INST_ID_"));
					userPd.put("RRO_TYPE","1");  //1  年度审核  2 行政审批
					userPd.put("USER_ID",Jurisdiction.getUser().getUSER_ID());
					userPd.put("RES",0);     //审批未通过
					userPd.put("ATT_ID","");  //通过转化得到的pdf url
					userPd.put("CREATE_TIME",new Date());
					try{
						userConfirmService.save(userPd);
					}catch (Exception e){
						e.printStackTrace();
					}
				}else{
					throw new Exception("用户签名错误");
				}

			}else{
				map.put("审批结果", "【驳回】" + OPINION);		//审批结果
				map.put("LAST_NODE_NAME",task.getName());
			}

			setVariablesByTaskIdAsMap(taskId,map);			//设置流程变量
			setVariablesByTaskId(taskId,"res",res);
			completeMyPersonalTask(taskId);

			if(nodeName.equals("pre_approve")){  //该节点为预审没有通过
				examination.put("PRE_APPROVE","0");
			}else if(nodeName.equals("confirm_data")){ //该节点为材料审核没有通过
				examination.put("SUGGLY_DATA","0");
			}else if(nodeName.equals("offline_booking")){  //该节点为线下审批没有通过
				examination.put("OFFLINE_RES_TIME",new Date());
				examination.put("OFFLINE_RES","0");
			}else if(nodeName.equals("pre_confirm01_yes")){ //该节点为用户确定预审不通过
				examination.put("PRE_APPROVE_USER","0");
				examination.put("PRE_APPROVE_TIME",new Date());
			}else if(nodeName.equals("data_confirm02_yes")){  //该节点为用户确定材料审批不通过
				examination.put("SUGGLY_DATA_USER","0");
				examination.put("SUGGLY_DATA_TIME",new Date());
			}else if(nodeName.equals("_confirm_no")){  //该节点为用户不确定节点
				examination.put("SUGGLY_DATA_USER","0");
				examination.put("SUGGLY_DATA_TIME",new Date());
				examination.put("STATUS","0");   //将该条年检信息失效

			/*	Object pre_approve = getVariablesByTaskIdAsMap(taskId, "pre_approve");
				Object confirm_data = getVariablesByTaskIdAsMap(taskId, "confirm_data");
				if(null!=pre_approve){
					if(null!=confirm_data){
						//该节点为材料审批未通过的用户确认
						examination.put("PRE_APPROVE_USER","0");
						examination.put("PRE_APPROVE_TIME",new Date());
						examination.put("STATUS","0");  //将该条年检信息失效
					}
					//该节点为预审未通过时用户的确认
					examination.put("SUGGLY_DATA_USER","0");
					examination.put("SUGGLY_DATA_TIME",new Date());
					examination.put("STATUS","0");   //将该条年检信息失效

				}*/
			}
			examinationService.edit(examination);
		}
		try{
			removeVariablesByPROC_INST_ID_(pd.getString("PROC_INST_ID_"),"res");			//移除流程变量(从正在运行中)
		}catch(Exception e){
			/*此流程变量在历史中**/
		}
		try{
			String ASSIGNEE_ = pd.getString("ASSIGNEE_");							//下一待办对象
			if(Tools.notEmpty(ASSIGNEE_)){
				setAssignee(session.getAttribute("TASKID").toString(),ASSIGNEE_);	//指定下一任务待办对象
			}else{
				Object os = session.getAttribute("YAssignee");
				if(null != os && !"".equals(os.toString())){
					ASSIGNEE_ = os.toString();										//没有指定就是默认流程的待办人
				}else{
					trySendSms(zmap,pd); 			//没有任务监听时，默认流程结束，发送站内信给任务发起人
				}
			}
			zmap.put("ASSIGNEE_",ASSIGNEE_);		//用于给待办人发送新任务消息
		}catch(Exception e){
			zmap.put("ASSIGNEE_","null");
			/*手动指定下一待办人，才会触发此异常。
			 * 任务结束不需要指定下一步办理人了,发送站内信通知任务发起人**/
			trySendSms(zmap,pd);
		}
		zmap.put("result", errInfo);				//返回结果
		return zmap;
	}
	/**办理行政审批任务
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/govHandle")
	@RequiresPermissions("rutask:edit")
	@ResponseBody
	public Object govHandle() throws Exception{
		Map<String,Object> zmap = new HashMap<String,Object>();
		String errInfo = "success";
		Session session = Jurisdiction.getSession();
		PageData pd = new PageData();
		pd = this.getPageData();
		String taskId = pd.getString("ID_");	//任务ID
		String sfrom = "";
		Object ofrom = getVariablesByTaskIdAsMap(taskId,"审批结果");
		if(null != ofrom){
			sfrom = ofrom.toString();
		}
		Map<String,Object> map = new LinkedHashMap<String, Object>();
		String OPINION = sfrom + Jurisdiction.getName() + ",fh,"+pd.getString("OPINION");//审批人的姓名+审批意见
		String msg = pd.getString("msg");
		Task task=taskService.createTaskQuery() // 创建任务查询
				.taskId(taskId) // 根据任务id查询
				.singleResult();
		String nodeName=task.getTaskDefinitionKey();
		if(nodeName.equals("pre_approve")||nodeName.equals("confirm_data")){
			map.put(nodeName,nodeName);
		}
		boolean isContains=nodeName.contains("_confirm");

		String  GOVERNMENT_ID= (String) getVariablesByTaskIdAsMap(taskId, "GOVERNMENT_ID");  //获取该行政审批数据id
		PageData pageData=new PageData();
		pageData.put("GOVERNMENT_ID",GOVERNMENT_ID);
		String informType="行政审批通知";
		PageData government = governmentService.findById(pageData);   // 根据流程中的id 获取当前年审数据
		//根据提交用户的id 查询用户
		PageData findUser=new PageData();
		findUser.put("USER_ID",government.get("USER_ID"));
		PageData user = usersService.findById(findUser);

		//根据审批id  获取该审批的类型
		PageData findApproveTypeName=new PageData();
		findApproveTypeName.put("APPROVE_ID",GOVERNMENT_ID);
		PageData approveTypeName = approveFormService.findApproveTypeNameByApproveId(findApproveTypeName);
		if(null!=approveTypeName&&StringUtils.isNotBlank(approveTypeName.getString("TYPE_NAME"))){
			informType=approveTypeName.getString("TYPE_NAME");
		}

		if("yes".equals(msg)){								//批准
			String res="是";
			if(isContains){
				map.put("确认结果","用户:"+Jurisdiction.getUsername()+"【已经确认】");
			}else {
				map.put("审批结果", "【批准】" + OPINION);		//审批结果
				if(null!=user){
					SmsServiceUtil.sendSms(informType,"【批准】" + OPINION,user.getString("PHONE"));
				}else{
					throw new Exception("通知用户不存在");
				}
			}
			setVariablesByTaskIdAsMap(taskId,map);			//设置流程变量
			setVariablesByTaskId(taskId,"res",res);
			completeMyPersonalTask(taskId);
			if(nodeName.equals("pre_approve")){  //该节点为预审通过
				government.put("PRE_APPROVE","1");
			}else if(nodeName.equals("confirm_data")){ //该节点为材料审核通过
				government.put("SUGGLY_DATA","1");
			}else if(nodeName.equals("offline_booking")){  //该节点为线下审批通过
				government.put("OFFLINE_RES","1");
				government.put("OFFLINE_RES_TIME",new Date());
			}else if(nodeName.equals("pre_confirm01_yes")){ //该节点为用户确定预审通过
				government.put("PRE_APPROVE_USER","1");
				government.put("PRE_APPROVE_TIME",new Date());
			}else if(nodeName.equals("data_confirm02_yes")){  //该节点为用户确定材料审批通过
				government.put("SUGGLY_DATA_USER","1");
				government.put("SUGGLY_DATA_TIME",new Date());
				zmap.put("offline","success");
			}
			governmentService.edit(government);
		}else{												//驳回
			String res="否";
			if(isContains){
				map.put("确认结果","用户:"+Jurisdiction.getUsername()+"【未确认】");
			}else{
				map.put("审批结果", "【驳回】" + OPINION);		//审批结果
				if(null!=user){
					SmsServiceUtil.sendSms(informType,"【批准】" + OPINION,user.getString("PHONE"));
				}else{
					throw new Exception("通知用户不存在");
				}
			}

			setVariablesByTaskIdAsMap(taskId,map);			//设置流程变量
			setVariablesByTaskId(taskId,"res",res);
			completeMyPersonalTask(taskId);

			if(nodeName.equals("pre_approve")){  //该节点为预审没有通过
				government.put("PRE_APPROVE","0");
			}else if(nodeName.equals("confirm_data")){ //该节点为材料审核没有通过
				government.put("SUGGLY_DATA","0");
			}else if(nodeName.equals("offline_booking")){  //该节点为线下审批没有通过
				government.put("OFFLINE_RES","0");
				government.put("OFFLINE_RES_TIME",new Date());
			}else if(nodeName.equals("pre_confirm01_yes")){ //该节点为用户确定预审不通过
				government.put("PRE_APPROVE_USER","0");
				government.put("PRE_APPROVE_TIME",new Date());
			}else if(nodeName.equals("data_confirm02_yes")){  //该节点为用户确定材料审批不通过
				government.put("SUGGLY_DATA_USER","0");
				government.put("SUGGLY_DATA_TIME",new Date());
			}else if(nodeName.equals("_confirm_no")){  //该节点为用户不确定节点
				government.put("SUGGLY_DATA_USER","0");
				government.put("SUGGLY_DATA_TIME",new Date());
				government.put("STATUS","0");   //将该条年检信息失效
			/*	Object pre_approve = getVariablesByTaskIdAsMap(taskId, "pre_approve");
				Object confirm_data = getVariablesByTaskIdAsMap(taskId, "confirm_data");
				if(null!=pre_approve){
					if(null!=confirm_data){
						//该节点为材料审批未通过的用户确认
						government.put("PRE_APPROVE_USER","0");
						government.put("PRE_APPROVE_TIME",new Date());
						government.put("STATUS","0");  //将该条年检信息失效
					}
					//该节点为预审未通过时用户的确认
					government.put("SUGGLY_DATA_USER","0");
					government.put("SUGGLY_DATA_TIME",new Date());
					government.put("STATUS","0");   //将该条年检信息失效

				}*/
			}
			governmentService.edit(government);
		}
		try{
			removeVariablesByPROC_INST_ID_(pd.getString("PROC_INST_ID_"),"res");			//移除流程变量(从正在运行中)
		}catch(Exception e){
			/*此流程变量在历史中**/
		}
		try{
			String ASSIGNEE_ = pd.getString("ASSIGNEE_");							//下一待办对象
			if(Tools.notEmpty(ASSIGNEE_)){
				setAssignee(session.getAttribute("TASKID").toString(),ASSIGNEE_);	//指定下一任务待办对象
			}else{
				Object os = session.getAttribute("YAssignee");
				if(null != os && !"".equals(os.toString())){
					ASSIGNEE_ = os.toString();										//没有指定就是默认流程的待办人
				}else{
					trySendSms(zmap,pd); 			//没有任务监听时，默认流程结束，发送站内信给任务发起人
				}
			}
			zmap.put("ASSIGNEE_",ASSIGNEE_);		//用于给待办人发送新任务消息
		}catch(Exception e){
			zmap.put("ASSIGNEE_","null");
			/*手动指定下一待办人，才会触发此异常。
			 * 任务结束不需要指定下一步办理人了,发送站内信通知任务发起人**/
			trySendSms(zmap,pd);
		}
		zmap.put("result", errInfo);				//返回结果
		return zmap;
	}
	
	/**发送站内信
	 * @param
	 * @param pd
	 * @throws Exception
	 */
	public void trySendSms(Map<String,Object> zmap,PageData pd)throws Exception{
		List<PageData>	hivarList = hiprocdefService.hivarList(pd);			//列出历史流程变量列表
		for(int i=0;i<hivarList.size();i++){
			if("USERNAME".equals(hivarList.get(i).getString("NAME_"))){
				sendSms(hivarList.get(i).getString("TEXT_"));
				zmap.put("FHSMS",hivarList.get(i).getString("TEXT_"));
				break;
			}
		}
	}
	
	/**发站内信通知审批结束
	 * @param USERNAME
	 * @throws Exception
	 */
	public void sendSms(String USERNAME) throws Exception{
		PageData pd = new PageData();
		pd.put("SANME_ID", this.get32UUID());			//ID
		pd.put("SEND_TIME", DateUtil.getTime());		//发送时间
		pd.put("FHSMS_ID", this.get32UUID());			//主键
		pd.put("TYPE", "1");							//类型1：收信
		pd.put("FROM_USERNAME", USERNAME);				//收信人
		pd.put("TO_USERNAME", "系统消息");
		pd.put("CONTENT", "您申请的任务已经审批完毕,请到已办任务列表查看");
		pd.put("STATUS", "2");
		fhsmsService.save(pd);
	}

	@RequestMapping(value="/proview")
	@RequiresPermissions("rutask:edit")
	@ResponseBody
	public Object proview(){
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		//将传过来的路径进行转化为pdf, 并获取pdf路径
		try{
			String URL="";
			if(StringUtils.isNotBlank((String) pd.get("URL"))){
				URL= (String) pd.get("URL");
			}
			PageData attachment = attachmentService.getOneById(pd);
			if(((String)attachment.get("URL")).equals(URL)){
				//根据URL 进行pdf 转化并且获取pdf 存储路径
				String pdf=ToPdf.fileUpPdf(URL);
				map.put("pdf",pdf);
			}
		}catch (Exception e){
			errInfo="exception";
			map.put("result",errInfo);
			e.printStackTrace();
			return map;
		}
		map.put("result",errInfo);
		return map;
	}

}
