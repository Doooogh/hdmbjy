package org.fh.controller.inform;

import java.io.*;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.*;

import org.apache.commons.lang3.StringUtils;
import org.fh.entity.system.User;
import org.fh.service.attachment.AttachmentService;
import org.fh.service.informdetail.InformDetailService;
import org.fh.service.option.OptionService;
import org.fh.service.system.UsersService;
import org.fh.service.table.TableService;
import org.fh.service.tabledata.TableDataService;
import org.fh.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import org.apache.shiro.authz.annotation.RequiresPermissions;

import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.service.inform.InformService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 说明：系统通知
 * 作者：FH Admin QQ313596790
 * 时间：2019-08-22
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/inform")
public class InformController extends BaseController {

	@Autowired
	private InformService informService;

	@Autowired
	private AttachmentService attachmentService;

	@Autowired
	private UsersService usersService;

	@Autowired
	private InformDetailService informDetailService;

	@Autowired
	private TableService tableService;

	@Autowired
	private OptionService optionService;

	@Autowired
	private TableDataService tableDataService;



	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@RequiresPermissions("inform:add")
	@ResponseBody
	public Object add() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("ID", this.get32UUID());	//主键
		String ps=pd.getString("INFORMANTS");
		String person[]=ps.split(",");
		List<PageData> informDetails=new ArrayList<>();   //通知详细集合  需要批量添加
		String DRAFT=pd.getString("DRAFT");  //判断是否为草稿    1 是  0 否
		for (String per : person) {
			PageData pageData=new PageData();
			PageData sendSMS=new PageData();
			sendSMS.put("USER_ID",per);
			PageData userRes = usersService.findById(sendSMS);
		/*	if(null!=userRes&&DRAFT.equals("1")){
			SmsServiceUtil.sendSms(pd.getString("TYPE"),pd.getString("CONTENT"),userRes.getString("PHONE")); }else{ throw new Exception("通知用户不存在");
			}*/
			pageData.put("INFORMDETAIL_ID",this.get32UUID());
			pageData.put("INFORM_ID",pd.get("ID"));
			pageData.put("INFORMANT",per);
			pageData.put("READ","0");
			pageData.put("CREATE_DATE",new Date());
			pageData.put("ISDEL","0");
			informDetails.add(pageData);
		}
		try{
			informDetailService.batchSave(informDetails);
		}catch (Exception e){
			e.printStackTrace();
			errInfo="exception";
			map.put("result",errInfo);
			return map;
		}

		pd.put("CREATE_DATE",new Date());
		informService.save(pd);
		map.put("result", errInfo);
		return map;
	}

	/**删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("inform:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		if(!Const.ADMIN_USERNAME.contains(Jurisdiction.getUsername())){  //如果是机构负责人 删除为逻辑删除
			User user = Jurisdiction.getUser();
			PageData find=new PageData();
			find.put("INFORM_ID",pd.get("ID"));    //通知id
			find.put("INFORMANT",user.getUSER_ID());   //用户id
			PageData informDetail = informDetailService.findByinformantId(find);
			informDetail.put("ISDEL","1");
			informDetailService.edit(informDetail);
		}else{
			informService.delete(pd);  //如果不是机构负责人   删除为物理删除
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}

	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("inform:edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("INFORM_ID",pd.get("ID"));
//		pd.put("ID", this.get32UUID());	//主键
		informDetailService.deleteByInformId(pd);
		String ps=pd.getString("INFORMANTS");
		String person[]=ps.split(",");
		List<PageData> informDetails=new ArrayList<>();   //通知详细集合  需要批量添加
		String DRAFT=pd.getString("DRAFT");  //判断是否为草稿    1 是  0 否
		for (String per : person) {
			PageData pageData=new PageData();
			pageData.put("INFORMDETAIL_ID",this.get32UUID());
			pageData.put("INFORM_ID",pd.get("ID"));
			pageData.put("READ","0");
			pageData.put("INFORMANT",per);
			pageData.put("CREATE_DATE",new Date());
			PageData sendSMS=new PageData();
			sendSMS.put("USER_ID",per);
			PageData userRes = usersService.findById(sendSMS);
			/*if(null!=userRes&&DRAFT.equals("1")){
				SmsServiceUtil.sendSms(pd.getString("TYPE"),pd.getString("CONTENT"),userRes.getString("PHONE")); }else{ throw new Exception("通知用户不存在");
			}*/
			informDetails.add(pageData);
		}
		try{
			informDetailService.batchSave(informDetails);
		}catch (Exception e){
			e.printStackTrace();
			errInfo="exception";
			map.put("result",errInfo);
			return map;
		}

		pd.put("UPDATE_DATE",new Date());
		informService.edit(pd);
		map.put("result", errInfo);
		return map;
	}

	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("inform:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());

		if(!Const.ADMIN_USERNAME.contains(Jurisdiction.getUsername())) {
			User user = (User) Jurisdiction.getSession().getAttribute(Const.SESSION_USER);
			pd.put("USER_ID", user.getUSER_ID());
		}
		page.setPd(pd);
		//管理员需要看到所有的通知，包括草稿和已经发布的
		//负责人只能看到已经发布的属于自己的通知
		List<PageData>	varList = informService.list(page);	//列出Inform列表
		if(Const.ADMIN_USERNAME.contains(Jurisdiction.getUsername())){
			map.put("isAdmin",true);
		}else{
			map.put("isAdmin",false);
		}
		map.put("varList", varList);
		map.put("page", page);
		map.put("result", errInfo);
		return map;
	}



	/**待办任务列表(只显示5条,用于右下角通知消息条数使用)
	 * @param page
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/getNoInformList")
	@ResponseBody
	public Object getList(Page page) throws Exception{
		PageData pd = new PageData();
		Map<String,Object> map = new HashMap<String,Object>();
		User user= (User) Jurisdiction.getSession().getAttribute(Const.SESSION_USER);
		pd.put("INFORMANT", user.getUSER_ID()); 		//查询当前用户的任务(用户名查询)
		page.setPd(pd);
		page.setShowCount(5);
		List<PageData>	varList = informService.listNoInformByUserIdlistPage(page);	//列出Inform列表
		map.put("list", varList);
		map.put("informCount", page.getTotalResult());
		if(Const.ADMIN_USERNAME.contains(user.getUSERNAME())){
			map.put("list", new ArrayList<>());
			map.put("informCount",0);
		}
		return map;
	}

	 /**去修改页面获取数据
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goEdit")
	@RequiresPermissions("inform:edit")
	@ResponseBody
	public Object goEdit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = informService.findById(pd);	//根据ID读取
		PageData findInformDeatail=new PageData();
		findInformDeatail.put("INFORM_ID",pd.get("ID"));
		List<PageData> informDetailList = informDetailService.findListByInformId(findInformDeatail);
		String  INFORMANTS="";
		for (PageData pageData : informDetailList) {
			INFORMANTS+=(pageData.get("INFORMANT")+",");
		}
		if(!("".equals(INFORMANTS))){
			INFORMANTS=INFORMANTS.substring(0,INFORMANTS.length()-1);
		}
		pd.put("INFORMANTS",INFORMANTS);
		if(!pd.get("ATTACHMENT").toString().equals("")){
			List<PageData> apd=informService.findAttachmentByIds(pd);
			map.put("apd", apd);  //查询出来的附件名字集合
		}
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}



	@RequestMapping("/attachmentLoad")
//	@RequiresPermissions("inform:edit")
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
			pageData.put("NAME",fileName);
			pageData.put("ORIGINAL_NAME",originalName);
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

	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("inform:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			informService.deleteAll(ArrayDATA_IDS);
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
		titles.add("通知标题");	//2
		titles.add("附件");	//3
		titles.add("类型");	//4
		titles.add("发起人");	//5
		titles.add("发起人姓名");	//6
		titles.add("是否按组  1 是  0 不是");	//7
		titles.add("接收人");	//8
		titles.add("通知内容");	//9
		titles.add("创建时间");	//10
		titles.add("修改时间");	//11
		titles.add("备注12");	//12
		titles.add("备注13");	//13
		titles.add("备注14");	//14
		dataMap.put("titles", titles);
		List<PageData> varOList = informService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("ID"));	    //1
			vpd.put("var2", varOList.get(i).getString("TITLE"));	    //2
			vpd.put("var3", varOList.get(i).getString("ATTACHMENT"));	    //3
			vpd.put("var4", varOList.get(i).getString("TYPE"));	    //4
			vpd.put("var5", varOList.get(i).getString("INITIATOR"));	    //5
			vpd.put("var6", varOList.get(i).getString("INITIATOR_NAME"));	    //6
			vpd.put("var7", varOList.get(i).getString("GROUP"));	    //7
			vpd.put("var8", varOList.get(i).getString("RECIPIENT"));	    //8
			vpd.put("var9", varOList.get(i).getString("CONTENT"));	    //9
			vpd.put("var10", varOList.get(i).getString("CREATE_DATE"));	    //10
			vpd.put("var11", varOList.get(i).getString("UPATE_DATE"));	    //11
			vpd.put("var12", varOList.get(i).getString("FIELD1"));	    //12
			vpd.put("var13", varOList.get(i).getString("FIELD2"));	    //13
			vpd.put("var14", varOList.get(i).getString("FIELD3"));	    //14
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}

	@RequestMapping(value = "/getUser")
	@ResponseBody
	@RequiresPermissions("inform:edit")
	public Object getUser(){
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		User user= (User) Jurisdiction.getSession().getAttribute(Const.SESSION_USER);
		if(null!=user){
			pd.put("INITIATOR",user.getUSER_ID());
			pd.put("INITIATOR_NAME",user.getNAME());
		}else{
			errInfo="exception";
		}
		map.put("result",errInfo);
		map.put("pd",pd);
		return map;
	}

	@RequestMapping(value="/deleteFileById")
	@RequiresPermissions("inform:del")
	@ResponseBody
	public Object deleteFileById() throws Exception {
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		PageData oneById = attachmentService.getOneById(pd);
		if(null!=oneById) {
			try{
				informService.deleteFileById(pd);
				FileUtil.delFile((String) oneById.get("URL"));
			}catch (Exception e){
				errInfo="exception";
				e.printStackTrace();
			}
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}


	@RequestMapping(value = "/findInformUser")
	@ResponseBody
	@RequiresPermissions("inform:list")
	public Object findInformUser() throws Exception {
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = informService.findById(pd);	//根据ID读取
		List<PageData> users=new ArrayList<>();
		users=informDetailService.findPersonByInformId(pd);
//		users=informService.findInformUser(pd);
		Collections.sort(users, new Comparator<PageData>() {
			@Override
			public int compare(PageData o1, PageData o2) {
				return (Integer.valueOf((String)o2.get("READ"))).compareTo(Integer.valueOf((String)o1.get("READ")));
			}

		});
		map.put("result",errInfo);
		map.put("users",users);
		return map;
	}



	@RequestMapping(value = "/getById")
	@ResponseBody
	@RequiresPermissions("inform:list")
	public Object getById() throws Exception {
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = informService.findById(pd);	//根据ID读取
		List<PageData> varList=new ArrayList<>();
		if(null!=pd.get("ATTACHMENT")&&!pd.get("ATTACHMENT").toString().equals("")){
			varList=informService.findAttachmentByIds(pd);

		}
		map.put("isUser",!Const.ADMIN_USERNAME.contains(Jurisdiction.getUsername()));
		map.put("varList", varList);
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}

	@RequestMapping(value = "/download")
	@ResponseBody
	@RequiresPermissions("inform:list")
	public Object download(HttpServletRequest request, HttpServletResponse response) throws UnsupportedEncodingException {
		Map<String,Object> map = new HashMap<String,Object>();
		PageData pd = new PageData();
		String errInfo = "success";
		pd = this.getPageData();
		PageData attachment = attachmentService.getOneById(pd);
		String url="";
		String fileName="";
		if(attachment!=null){
			fileName= (String) attachment.get("ORIGINAL_NAME");
			url= (String) attachment.get("URL");
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
				BufferedInputStream bis = null;
				FileInputStream fis = null;
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

	@RequestMapping(value = "/removeUserIdFromNoInform")
	@ResponseBody
	@RequiresPermissions("inform:list")
	public Object removeUserIdFromNoInform() throws Exception {
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		User user= (User) Jurisdiction.getSession().getAttribute(Const.SESSION_USER);
//		pd.put("USER_ID",user.getUSER_ID());
		if(!Const.ADMIN_USERNAME.contains(user.getUSERNAME())){
			PageData informDetail=new PageData();
			informDetail.put("INFORM_ID",pd.get("ID"));
			informDetail.put("INFORMANT",user.getUSER_ID());
			PageData informDetailRes = informDetailService.findByinformantId(informDetail);
			if(null!=informDetailRes){
				if(!informDetailRes.getString("READ").equals("1")){
					informDetailRes.put("READ","1");
					informDetailRes.put("READ_DATE",new Date());
					informDetailService.edit(informDetailRes);
				}
			}else{
				errInfo="exception";
				map.put("result", errInfo);
				return map;
			}
		}
		map.put("result", errInfo);
		return map;
	}

	@RequestMapping(value = "/getInformTable")
	@ResponseBody
	public Object getInformTable() throws Exception {
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		//根据inform 获取绑定的回执单id
		PageData findInformTableByInformId=new PageData();
		findInformTableByInformId.put("INFORM_ID",pd.get("ID"));
		PageData informTable = tableService.findInformTableByInformId(findInformTableByInformId);
		if(null!=informTable){
			PageData findOptionTree=new PageData();
			map.put("hasInformTable",true);   //该通知是否有回执
			findOptionTree.put("TABLE_ID",informTable.get("TABLE_ID"));
			List<PageData> options = optionService.findTreeByTableId(findOptionTree);  //详细项目列表

			//查询用户是否已经填过回执  如果填过 回显
			PageData findTableData=new PageData();
			findTableData.put("INFORM_ID",pd.get("ID"));
			findTableData.put("HEADMAN_ID",null==Jurisdiction.getUser()?"":Jurisdiction.getUser().getUSER_ID());
			PageData tableDataInfo = tableDataService.findByInformIdAndUserId(findTableData);//获取该用户的填报的回执单
			if(null!=tableDataInfo){
				map.put("tableDataInfo",tableDataInfo.get("VALUE"));
				map.put("hasTableDataInfo",true);
			}else{
				map.put("hasTableDataInfo",false);
			}
			map.put("informTable",informTable);
			map.put("options",options);
		}else{
			map.put("hasInformTable",false);
		}
		map.put("result", errInfo);
		return map;
	}

	@RequestMapping(value = "/getInformTableInfo")
	@ResponseBody
	public Object getInformTableInfo() throws Exception {
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		PageData informTable = tableService.findById(pd);  //反馈表内容
		PageData findOptionTree=new PageData();
		findOptionTree.put("TABLE_ID",pd.get("TABLE_ID"));
		List<PageData> options = optionService.findTreeByTableId(pd);
		PageData tableData = tableDataService.findById(pd);
		map.put("informTable",informTable);  //反馈表信息
		map.put("options",options);   //反馈表内容选项
		if(null!=tableData){
			map.put("tableData",tableData.get("VALUE"));   //反馈表内容项数据
		}
		map.put("result", errInfo);
		return map;
	}









}
