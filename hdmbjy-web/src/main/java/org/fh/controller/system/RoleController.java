package org.fh.controller.system;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.entity.system.Menu;
import org.fh.entity.system.Role;
import org.fh.log.SysLog;
import org.fh.service.system.FHlogService;
import org.fh.service.system.MenuService;
import org.fh.service.system.RoleService;
import org.fh.service.system.UsersService;
import org.fh.util.DateUtil;
import org.fh.util.Jurisdiction;
import org.fh.util.RightsHelper;
import org.fh.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import net.sf.json.JSONArray;

/**
 * 说明：角色处理类
 * 作者：FH Admin Q 3 135 967 90
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/role")
public class RoleController extends BaseController {
	
	@Autowired
    private RoleService roleService;
	@Autowired
    private UsersService usersService;
	@Autowired
    private MenuService menuService;
	@Autowired
    private FHlogService FHLOG;
	
	/** 进入权限首页
	 * @param 
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/list")
	@RequiresPermissions("role:list")
	@ResponseBody
	public Object list()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		if(Tools.isEmpty(pd.getString("ROLE_ID"))){
			pd.put("ROLE_ID", "1");										//默认列出第一组角色(初始设计系统用户和会员组不能删除)
		}
		PageData fpd = new PageData();
		fpd.put("ROLE_ID", "0");
		List<Role> roleList = roleService.listAllRolesByPId(fpd);		//列出组(页面横向排列的一级组)
		List<Role> roleList_z = roleService.listAllRolesByPId(pd);		//列出此组下架角色
		pd = roleService.findById(pd);									//取得点击的角色组(横排的)
		map.put("pd", pd);
		map.put("roleList", roleList);
		map.put("roleList_z", roleList_z);
		map.put("result", errInfo);
		return map;
	}
	
	/**保存新增角色
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@RequiresPermissions("role:add")
	@ResponseBody
	@SysLog("新增角色")
	public Object add()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String parent_id = pd.getString("PARENT_ID");		//父类角色id
		PageData role=new PageData();
		pd.put("ROLE_ID", parent_id);			
		if("0".equals(parent_id)){
			pd.put("RIGHTS", "");							//菜单权限
		}else{
			role = roleService.findById(pd);
			String rights = role.getString("RIGHTS");
			pd.put("RIGHTS", (null == rights)?"":rights);	//组菜单权限
			map.put("ROLENAME",role.get(""));
		}
		String RNUMBER = "R"+DateUtil.getDays()+Tools.getRandomNum();
		pd.put("RNUMBER", RNUMBER);	//编码
		pd.put("ROLE_ID", this.get32UUID());				//主键
		pd.put("ADD_QX", "0");		//初始新增权限为否
		pd.put("DEL_QX", "0");		//删除权限
		pd.put("EDIT_QX", "0");		//修改权限
		pd.put("CHA_QX", "0");		//查看权限
		roleService.add(pd);
		/*map.put("ROLE_NAME",pd.get("ROLE_NAME"));   //用来记录日志 增加的角色名
		map.put("NAME",Jurisdiction.getName());     //用来记录日志 执行操作人*/
		map.put("CONTENT",Jurisdiction.getName()+"新增了角色:"+pd.get("ROLE_NAME"));   //记录的日志内容
		map.put("NAME",Jurisdiction.getName());   //用来记录日志 执行操作人
		map.put("USERNAME",Jurisdiction.getUsername());
//		FHLOG.save(Jurisdiction.getUsername(), "新增角色"+pd.getString("ROLE_NAME"));				//记录日志
		map.put("result", errInfo);
		return map;
	}
	
	/**请求编辑
	 * @param ROLE_ID
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/toEdit")
	@RequiresPermissions("role:edit")
	@ResponseBody
	public Object toEdit()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = roleService.findById(pd);
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**保存修改
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("role:edit")
	@ResponseBody
	@SysLog("修改角色信息")
	public Object edit()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		roleService.edit(pd);
//		FHLOG.save(Jurisdiction.getUsername(), "修改角色"+pd.getString("ROLE_NAME"));				//记录日志
		map.put("CONTENT",Jurisdiction.getName()+"修改了角色:"+pd.get("ROLE_NAME"));   //记录的日志内容
		map.put("NAME",Jurisdiction.getName());   //用来记录日志 执行操作人
		map.put("USERNAME",Jurisdiction.getUsername());
		map.put("result", errInfo);
		return map;
	}
	
	/**删除角色
	 * @param ROLE_ID
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@ResponseBody
	@RequiresPermissions("role:del")
	@SysLog("删除角色")
	public Object deleteRole(@RequestParam String ROLE_ID)throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		PageData pd = new PageData();
		String errInfo = "";
		pd.put("ROLE_ID", ROLE_ID);
		List<Role> roleList_z = roleService.listAllRolesByPId(pd);			//列出此角色的所有下级
		if("fhadminzhuche".equals(ROLE_ID)|| roleList_z.size() > 0){
			errInfo = "false";												//下级有数据时or注册用户角色，删除失败
		}else{
			List<PageData> userlist = usersService.listAllUserByRoldId(pd);	//此角色下的用户
			if(userlist.size() > 0){										//此角色已被使用就不能删除
				errInfo = "false2";
			}else{
			roleService.deleteRoleById(ROLE_ID);							//执行删除
			errInfo = "success";
//			FHLOG.save(Jurisdiction.getUsername(), "删除角色ID为:"+ROLE_ID);	//记录日志
			map.put("CONTENT",Jurisdiction.getName()+"删除了角色:"+pd.get("ROLE_NAME"));   //记录的日志内容
			map.put("NAME",Jurisdiction.getName());   //用来记录日志 执行操作人
			map.put("USERNAME",Jurisdiction.getUsername());
			}
		}
		map.put("result", errInfo);
		return map;
	}
	
	/**
	 * 显示菜单列表ztree(菜单授权菜单)
	 * @return
	 */
	@RequestMapping(value="/menuqx")
	@RequiresPermissions("role:list")
	@ResponseBody
	public Object listAllMenu(String ROLE_ID)throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		Role role = roleService.getRoleById(ROLE_ID);			//根据角色ID获取角色对象
		String roleRights = role.getRIGHTS();					//取出本角色菜单权限
		List<Menu> menuList = menuService.listAllMenuQx("0");	//获取所有菜单
		menuList = this.readMenu(menuList, roleRights);			//根据角色权限处理菜单权限状态(递归处理)
		JSONArray arr = JSONArray.fromObject(menuList);
		String json = arr.toString();
		json = json.replaceAll("MENU_ID", "id").replaceAll("PARENT_ID", "pId").replaceAll("MENU_NAME", "name").replaceAll("subMenu", "nodes").replaceAll("hasMenu", "checked");
		map.put("zTreeNodes", json);
		map.put("result", errInfo);
		return map;
	}
	
	/**根据角色权限处理权限状态(递归处理)
	 * @param menuList：传入的总菜单
	 * @param roleRights：加密的权限字符串
	 * @return
	 */
	public List<Menu> readMenu(List<Menu> menuList,String roleRights){
		for(int i=0;i<menuList.size();i++){
			menuList.get(i).setHasMenu(RightsHelper.testRights(roleRights, menuList.get(i).getMENU_ID()));
			this.readMenu(menuList.get(i).getSubMenu(), roleRights);					//是：继续排查其子菜单
		}
		return menuList;
	}
	
	/**保存角色菜单权限
	 * @param ROLE_ID 角色ID
	 * @param menuIds 菜单ID集合
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/saveMenuqx")
	@RequiresPermissions("role:edit")
	@ResponseBody
	@SysLog("编辑角色菜单权限")
	public Object saveMenuqx(@RequestParam String ROLE_ID,@RequestParam String menuIds)throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		PageData pd = new PageData();
		Role editRole=null;
		if(null != menuIds && !"".equals(menuIds.trim())){
			BigInteger rights = RightsHelper.sumRights(Tools.str2StrArray(menuIds));//用菜单ID做权处理
			Role role = roleService.getRoleById(ROLE_ID);	//通过id获取角色对象
			editRole=role;
			role.setRIGHTS(rights.toString());
			roleService.updateRoleRights(role);				//更新当前角色菜单权限
			pd.put("rights",rights.toString());
			map.put("CONTENT",Jurisdiction.getName()+"修改了角色:"+editRole.getROLE_NAME()+"的菜单权限");   //记录的日志内容
			map.put("NAME",Jurisdiction.getName());   //用来记录日志 执行操作人
		}else{
			Role role = new Role();
			role.setRIGHTS("");
			role.setROLE_ID(ROLE_ID);
			editRole = roleService.getRoleById(ROLE_ID);	//通过id获取角色对象
			roleService.updateRoleRights(role);				//更新当前角色菜单权限(没有任何勾选)
			pd.put("rights","");
			map.put("CONTENT",Jurisdiction.getName()+"清空了角色:"+editRole.getROLE_NAME()+"的所有菜单权限");   //记录的日志内容
			map.put("NAME",Jurisdiction.getName());   //用来记录日志 执行操作人
		}
		pd.put("ROLE_ID", ROLE_ID);
		if(!"1".equals(ROLE_ID)){							//当修改admin权限时,不修改其它角色权限
			roleService.setAllRights(pd);					//更新此角色所有子角色的菜单权限
		}
		map.put("result", "success");
		map.put("USERNAME",Jurisdiction.getUsername());
//		FHLOG.save(Jurisdiction.getUsername(), "给角色ID："+ROLE_ID+" 授权了菜单权限操作");	//记录日志
		return map;
	}
	
	/**请求角色按钮授权页面(增删改查)
	 * @param ROLE_ID： 角色ID
	 * @param msg： 区分增删改查
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/b4Button")
	@RequiresPermissions("role:list")
	@ResponseBody
	public Object b4Button(@RequestParam String ROLE_ID,@RequestParam String msg)throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		List<Menu> menuList = menuService.listAllMenuQx("0"); //获取所有菜单
		Role role = roleService.getRoleById(ROLE_ID);		  //根据角色ID获取角色对象
		String roleRights = "";
		if("add_qx".equals(msg)){
			roleRights = role.getADD_QX();	//新增权限
		}else if("del_qx".equals(msg)){
			roleRights = role.getDEL_QX();	//删除权限
		}else if("edit_qx".equals(msg)){
			roleRights = role.getEDIT_QX();	//修改权限
		}else if("cha_qx".equals(msg)){
			roleRights = role.getCHA_QX();	//查看权限
		}
		menuList = this.readMenu(menuList, roleRights);		//根据角色权限处理菜单权限状态(递归处理)
		JSONArray arr = JSONArray.fromObject(menuList);
		String json = arr.toString();
		json = json.replaceAll("MENU_ID", "id").replaceAll("PARENT_ID", "pId").replaceAll("MENU_NAME", "name").replaceAll("subMenu", "nodes").replaceAll("hasMenu", "checked");
		map.put("zTreeNodes", json);
		map.put("result", "success");
		return map;
	}
	
	/**
	 * 保存角色按钮权限
	 * @param ROLE_ID
	 * @param menuIds
	 * @param msg
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/saveB4Button")
	@RequiresPermissions("role:edit")
	@ResponseBody
	@SysLog("编辑角色按钮权限")
	public Object saveB4Button(@RequestParam String ROLE_ID,@RequestParam String menuIds,@RequestParam String msg)throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		PageData pd = new PageData();
		pd = this.getPageData();
		if(null != menuIds && !"".equals(menuIds.trim())){
			BigInteger rights = RightsHelper.sumRights(Tools.str2StrArray(menuIds));
			pd.put("value",rights.toString());
		}else{
			pd.put("value","");
		}
		pd.put("ROLE_ID", ROLE_ID);
		roleService.saveB4Button(msg,pd);
		Role role = roleService.getRoleById(ROLE_ID);	//通过id获取角色对象
		map.put("result", "success");
		map.put("CONTENT",Jurisdiction.getName()+"修改了角色("+role.getROLE_NAME()+")的curd权限");   //记录的日志内容
		map.put("NAME",Jurisdiction.getName());   //用来记录日志 执行操作人
		map.put("USERNAME",Jurisdiction.getUsername());
//		FHLOG.save(Jurisdiction.getUsername(), "给角色ID："+ROLE_ID+" 授权了增删改查按钮权限操作");	//记录日志
		return map;
	}

	/** 选择角色(弹窗选择用)
	 * @param 
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/roleListWindow")
	@ResponseBody
	public Object roleListWindow(Page page)throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		page.setPd(pd);
		List<PageData> roleList = roleService.roleListWindow(page);		//列出所有角色
		map.put("roleList", roleList);
		map.put("page", page);
		map.put("result", "success");
		return map;
	}
	
}
