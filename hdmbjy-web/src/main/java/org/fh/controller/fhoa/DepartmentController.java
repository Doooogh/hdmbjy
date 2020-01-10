package org.fh.controller.fhoa;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.entity.fhoa.Department;
import org.fh.service.fhoa.DepartmentService;
import org.fh.service.inform.InformService;
import org.fh.service.system.UsersService;
import org.fh.util.Const;
import org.fh.util.DateUtil;
import org.fh.util.FileDownload;
import org.fh.util.FileUpload;
import org.fh.util.GetPinyin;
import org.fh.util.ObjectExcelRead;
import org.fh.util.ObjectExcelView;
import org.fh.util.PathUtil;
import org.fh.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import net.sf.json.JSONArray;

/** 
 * 说明：组织机构
 * 作者：FH Admin QQ313596790
 * 时间：2019-07-01
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/department")
public class DepartmentController extends BaseController {
	
	@Autowired
	private DepartmentService departmentService;

	@Autowired
	private UsersService usersService;
	
	@Autowired
	private InformService informService;
	
	
	
	/**
	 * 机构变更
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/change")
	@ResponseBody
	public Object change() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		departmentService.change(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**
	 * 用户列表
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/getUser")
	@ResponseBody
	public Object getLevelsByNameEn() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		List<PageData>	varList = usersService.listAllUserByDepToNull(pd);
		List<PageData> pdList = new ArrayList<PageData>();
		for(PageData d :varList){
			PageData pdf = new PageData();
			pdf.put("BIANMA", d.getString("USER_ID"));
			pdf.put("NAME", d.getString("NAME"));
			pdList.add(pdf);
		}
		map.put("list", pdList);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	
	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@RequiresPermissions("department:add")
	@ResponseBody
	public Object add() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("DEPARTMENT_ID", this.get32UUID());	//主键
		pd.put("CREATOR_DATE", DateUtil.date2Str(new Date()));
		departmentService.save(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("department:del")
	@ResponseBody
	public Object delete(@RequestParam String DEPARTMENT_ID) throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd.put("DEPARTMENT_ID", DEPARTMENT_ID);
		if(departmentService.listByParentId(DEPARTMENT_ID).size() > 0){		//判断是否有子级，是：不允许删除
			errInfo = "error";
		}else{
			departmentService.delete(pd);
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("department:edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("CREATOR_DATE", DateUtil.date2Str(new Date()));
		departmentService.edit(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("department:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");								//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		String DEPARTMENT_ID = null == pd.get("DEPARTMENT_ID")?"":pd.get("DEPARTMENT_ID").toString();
		pd.put("DEPARTMENT_ID", DEPARTMENT_ID);					//当作上级ID
		page.setPd(pd);
		List<PageData>	varList = departmentService.list(page);			//列出Department列表
		if("".equals(DEPARTMENT_ID) || "0".equals(DEPARTMENT_ID)) {
			map.put("PARENT_ID", "0");											//上级ID
		}else {
			map.put("PARENT_ID", departmentService.findById(pd).getString("PARENT_ID"));	//上级ID
		}
		map.put("varList", varList);
		map.put("page", page);
		map.put("result", errInfo);
		return map;
	}

	/**
	 * 显示列表ztree
	 * @return
	 */
	@RequestMapping(value="/listTree")
	@RequiresPermissions("department:list")
	@ResponseBody
	public Object listTree()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pageData=new PageData();
		pageData=this.getPageData();
		List<Department> departments=new ArrayList<>();
		if(null!=pageData.get("ID")&& !StringUtils.isBlank((String)pageData.get("ID"))){
			pageData.put("parentId","0");
			PageData inform = informService.findById(pageData);
			String DEPARTMENT_ID[]= ((String) inform.get("DEPARTMENT_ID")).split(",");
			pageData.put("ACCEPT_DEPARTMENT",DEPARTMENT_ID);
			departments = departmentService.listTree(pageData);
		}else{
		departments = departmentService.listTree("0");
		}
		JSONArray arr = JSONArray.fromObject(departments);
		String json = arr.toString();
		json = json.replaceAll("DEPARTMENT_ID", "id").replaceAll("PARENT_ID", "pId").replaceAll("NAME", "name").replaceAll("subDepartment", "children").replaceAll("treeurl", "url").replaceAll("hasDepartment", "isParent");  //.replaceAll("hasDepartment", "checked")
		map.put("zTreeNodes", json);
		map.put("result", errInfo);
		return map;
	}
	
	
	/**
	 * 显示列表ztree @RequiresPermissions("department:list")
	 * @return
	 */
	@RequestMapping(value="/listTreeForUser")
	@ResponseBody
	public Object listTreeForUser()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		JSONArray arr = JSONArray.fromObject(departmentService.listUserTree("0"));
		String json = arr.toString();
		json = json.replaceAll("DEPARTMENT_ID", "id").replaceAll("PARENT_ID", "pId").replaceAll("NAME", "label").replaceAll("subDepartment", "children").replaceAll("hasDepartment", "isParent").replaceAll("treeurl", "url").replaceAll("typeChoice", "isDisabled");
		//删除children为空的
		//json = json.replace("\"children\":[],", "");
		map.put("zTreeNodes", json);
		map.put("result", errInfo);
		PageData pageData=new PageData();
		pageData=this.getPageData();
		map.put("msg", pageData.getString("msg"));
		return map;
	}

	/**
	 * 显示列表ztree
	 * @return
	 */
	@RequestMapping(value="/listTreeAll")
	@RequiresPermissions("department:list")
	@ResponseBody
	public Object listTreeAll()throws Exception{
		PageData pageData=new PageData();
		pageData=this.getPageData();
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		List<PageData> all = departmentService.listAllTree(pageData);
		if(!StringUtils.isBlank((String)(pageData.get("ID")))){
			PageData inform = informService.findById(pageData);
			String DEPARTMENT_IDS= (String) inform.get("DEPARTMENT_ID");
			String[] split = DEPARTMENT_IDS.split(",");
			for (PageData data : all) {
				for (String s : split) {
					String dId=(String)data.get("id");
					if(dId.equals(s)){
						data.put("checked",true);
					}
				}
			}
		}
		JSONArray arr = JSONArray.fromObject(all);
		String json = arr.toString();
		map.put("zTreeNodes", json);
		map.put("result", errInfo);
		return map;
	}


	
	/**去新增页面
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goAdd")
	@RequiresPermissions("department:add")
	@ResponseBody
	public Object goAdd()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String DEPARTMENT_ID = null == pd.get("DEPARTMENT_ID")?"":pd.get("DEPARTMENT_ID").toString();
		pd.put("DEPARTMENT_ID", DEPARTMENT_ID);					//上级ID
		map.put("pds",departmentService.findById(pd));					//传入上级所有信息
		map.put("result", errInfo);
		return map;
	}	
	
	 /**去修改页面
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goEdit")
	@RequiresPermissions("department:edit")
	@ResponseBody
	public Object goEdit()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = departmentService.findById(pd);									//根据ID读取		
		map.put("pd", pd);																//放入视图容器
		pd.put("DEPARTMENT_ID",pd.get("PARENT_ID").toString());					//用作上级信息
		map.put("pds",departmentService.findById(pd));							//传入上级所有信息
		map.put("result", errInfo);
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
		titles.add("名称");	//1
		titles.add("英文");	//2
		titles.add("编码");	//3
		titles.add("上级ID");	//4
		titles.add("备注");	//5
		titles.add("负责人");	//6
		titles.add("电话");	//7
		titles.add("部门职能");	//8
		titles.add("地址");	//9
		dataMap.put("titles", titles);
		List<PageData> varOList = departmentService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("NAME"));	    //1
			vpd.put("var2", varOList.get(i).getString("NAME_EN"));	    //2
			vpd.put("var3", varOList.get(i).getString("BIANMA"));	    //3
			vpd.put("var4", varOList.get(i).getString("PARENT_ID"));	    //4
			vpd.put("var5", varOList.get(i).getString("BZ"));	    //5
			vpd.put("var6", varOList.get(i).getString("HEADMAN"));	    //6
			vpd.put("var7", varOList.get(i).getString("TEL"));	    //7
			vpd.put("var8", varOList.get(i).getString("FUNCTIONS"));	    //8
			vpd.put("var9", varOList.get(i).getString("ADDRESS"));	    //9
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}
	
	
	/**
	 * 判断许可证是否重复
	 * @return
	 */
	@RequestMapping(value="/hasBianma")
	@ResponseBody
	public Object hasBianma(){
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		try{
			pd = this.getPageData();
			
			PageData pds = departmentService.findByBianma(pd);
			if(pds != null){
				errInfo = "error";
			}
		} catch(Exception e){
			errInfo = "error";
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	@RequestMapping(value="/hasNameEn")
	@ResponseBody
	public Object hasNameEn() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
	    pd = this.getPageData();
		String name = GetPinyin.getPingYin(pd.getString("NAME"));
		map.put("result", errInfo);				//返回结果
		map.put("NAME_EN", name);				
		return map;
	}
	
	/**从EXCEL导入到数据库
	 * @param file
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/readExcel")
	@RequiresPermissions("fromExcel")
	@SuppressWarnings("unchecked")
	@ResponseBody
	public Object readExcel(@RequestParam(value="excel",required=false) MultipartFile file) throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		if (null != file && !file.isEmpty()) {
			String filePath = PathUtil.getProjectpath() + Const.FILEPATHFILE;								//文件上传路径
			String fileName =  FileUpload.fileUp(file, filePath, "departmentexcel");								//执行上传
			List<PageData> listPd = (List)ObjectExcelRead.readExcel(filePath, fileName, 2, 0, 0);			//执行读EXCEL操作,读出的数据导入List 2:从第3行开始；0:从第A列开始；0:第0个sheet
			pd.put("CONTENT", "");				
			pd.put("RECRUIT", "");						
			pd.put("USER_ID", "");						
			pd.put("HEADMAN", "");						
			pd.put("TEL", "");						
			pd.put("FUNCTIONS", "");					
			/**
			 * var0 :机构名称
			 * var1 :许可证号
			 * var2 :地址
			 * var3 :上级菜单
			 * var4 :备注
			 */
			for(int i=0;i<listPd.size();i++){		
				pd.put("DEPARTMENT_ID", this.get32UUID());			
				pd.put("NAME", listPd.get(i).getString("var0").trim());				
				String NAME_EN = GetPinyin.getPingYin(listPd.get(i).getString("var0").trim());
				pd.put("NAME_EN", NAME_EN);		
				pd.put("BIANMA", listPd.get(i).getString("var1").trim());				
				pd.put("ADDRESS", listPd.get(i).getString("var2").trim());	
				pd.put("BZ", listPd.get(i).getString("var4").trim());	
				pd.put("CREATOR_DATE", DateUtil.date2Str(new Date()));	
				if (listPd.get(i).getString("var3").trim() == null) {
					pd.put("PARENT_ID", 0);
				}else {
					PageData deppd = new PageData();
					deppd.put("NAME", listPd.get(i).getString("var3").trim());
					PageData dep = departmentService.findByDepName(deppd);
					pd.put("PARENT_ID", dep.getString("DEPARTMENT_ID").trim());
				}
				
				if (departmentService.findByDepName(pd) !=null) {
					continue;
				}
				
				departmentService.save(pd);
			}
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**下载模版
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value="/downExcel")
	public void downExcel(HttpServletResponse response)throws Exception{
		FileDownload.fileDownload(response, PathUtil.getProjectpath() + Const.FILEPATHFILE + "Department.xls", "Department.xls");
	}
}
