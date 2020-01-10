package org.fh.controller.system;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.fh.config.UeditorConfig;
import org.fh.controller.base.BaseController;
import org.fh.entity.PageData;
import org.fh.entity.system.Menu;
import org.fh.entity.system.Role;
import org.fh.entity.system.User;
import org.fh.log.SysLog;
import org.fh.service.organization.OrganizationService;
import org.fh.service.system.ButtonrightsService;
import org.fh.service.system.FHlogService;
import org.fh.service.system.FhButtonService;
import org.fh.service.system.MenuService;
import org.fh.service.system.RoleService;
import org.fh.service.system.UsersService;
import org.fh.util.Const;
import org.fh.util.DateUtil;
import org.fh.util.IniFileUtil;
import org.fh.util.Jurisdiction;
import org.fh.util.PathUtil;
import org.fh.util.RightsHelper;
import org.fh.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 说明：登录成功访问后台的处理类
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/main")
public class MainController extends BaseController {
	
	@Autowired
    private UsersService usersService;
	@Autowired
    private RoleService roleService;
    @Autowired
    private MenuService menuService;
    @Autowired
    private ButtonrightsService buttonrightsService;
    @Autowired
    private FhButtonService fhButtonService;
	@Autowired
    private FHlogService FHLOG;
	@Autowired
	private OrganizationService organizationService;

	@Autowired
	private UeditorConfig ueditorConfig;
	
	/**登录进来第一个访问的方法,初始用户权限以及缓存
	 * @return
	 * @throws Exception 
	 */
	@RequestMapping(value="/index", produces="application/json;charset=UTF-8")
	@ResponseBody
	public Object loginPage() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		Session session = Jurisdiction.getSession();
		User user = (User)session.getAttribute(Const.SESSION_USER);						//读取session中的用户信息(单独用户信息)
		if (user != null) {
			User userr = (User)session.getAttribute(Const.SESSION_USERROL);				//读取session中的用户信息(含角色信息)
			if(null == userr){
				user = usersService.getUserAndRoleById(user.getUSER_ID());				//通过用户ID读取用户信息和角色信息
				session.setAttribute(Const.SESSION_USERROL, user);						//存入session	
			}else{
				user = userr;
			}
			String USERNAME = user.getUSERNAME();
			Role role = user.getRole();													//获取用户角色
			String roleRights = role!=null ? role.getRIGHTS() : "";						//角色权限(菜单权限)
			String ROLE_IDS = user.getROLE_IDS();
			session.setAttribute(USERNAME + Const.SESSION_ROLE_RIGHTS, roleRights); 	//将角色权限存入session
			session.setAttribute(Const.SESSION_USERNAME, USERNAME);						//放入用户名到session
			session.setAttribute(Const.SESSION_U_NAME, user.getNAME());					//放入用户姓名到session
			List<Menu> menuList = new ArrayList<Menu>();
			Collection<String> shiroSet= new HashSet<String>();							//存放菜单权限标识
			menuList = this.getAttributeMenu(session, USERNAME, roleRights, getArrayRoleRights(ROLE_IDS), this.getUQX(user,role,shiroSet), this.getUQX2(user), shiroSet);		//菜单缓存以及赋值权限
			if(null == session.getAttribute(USERNAME + Const.SHIROSET)){
				session.setAttribute(USERNAME + Const.SHIROSET, shiroSet);				//存放菜单权限标识
			}
			this.setRemortIP(USERNAME);					//更新登录IP
			map.put("menuList", menuList);
			if(null == session.getAttribute(Const.SKIN)){//用户皮肤
				map.put("SKIN", user.getSKIN()); 	
				session.setAttribute(Const.SKIN, user.getSKIN());
			}else {
				map.put("SKIN", session.getAttribute(Const.SKIN));
			}
			
			String infFilePath = PathUtil.getClasspath()+Const.SYSSET;										//配置文件路径
			String startMusic = IniFileUtil.readCfgValue(infFilePath, "SysSet1", "startMusic", "true");		//是否开启卡机音乐
			map.put("startMusic", startMusic);
			
		}else{
			errInfo = "error";
		}

		if (Const.ADMIN_USERNAME.contains(Jurisdiction.getUsername())) {
			map.put("orgName","");
			map.put("isUser",false);
		}else {
			List<PageData> list =organizationService.findByUserId(Jurisdiction.getUser().getUSER_ID());
			map.put("orgName", list.get(0).getString("NAME"));
			map.put("isUser",true);
		}
		map.put("result", errInfo);
		return map;
	}
	
	/**获取菜单
	 * @return
	 */
	@RequestMapping(value="/getMenus")
	@ResponseBody
	@SuppressWarnings("unchecked")
	public Object getMenus() {
		PageData pd = new PageData();
		pd = this.getPageData();
		String MENU_TYPE = pd.getString("MENU_TYPE");	//菜单类型, 1:桌面菜单，2:开始菜单
		Session session = Jurisdiction.getSession();
		List<Menu> allmenuList = new ArrayList<Menu>(); //全部菜单
		allmenuList = (List<Menu>)session.getAttribute(Jurisdiction.getUsername() + Const.SESSION_ALLMENU);
		List<Map<String,Object>> remenuList = new ArrayList<Map<String,Object>>();//返回的菜单
		Map<String,Object> zmap = new LinkedHashMap<String,Object>();
		if("1".equals(MENU_TYPE)){
			zmap.put("code", 1);
			zmap.put("message", "成功");
			for(int i=0;i<allmenuList.size();i++){
				Menu firstMenu = allmenuList.get(i);
				if("1".equals(firstMenu.getMENU_TYPE())){
					if(firstMenu.isHasMenu() && "1".equals(firstMenu.getMENU_STATE())){				//有权限，并且是可视的（一级菜单）
						List<Menu> secondMenuList = allmenuList.get(i).getSubMenu();
						for(int n=0;n<secondMenuList.size();n++){
							Menu secondMenu = secondMenuList.get(n);
							if(secondMenu.isHasMenu() && "1".equals(secondMenu.getMENU_STATE())){	//有权限，并且是可视的（二级菜单）
								Map<String,Object> smap = new LinkedHashMap<String,Object>();
								smap.put("title", secondMenu.getMENU_NAME());
								if(secondMenu.getSubMenu().size()>0){
									smap.put("pageURL", "../menu/menu_ztree_other.html?MENU_ID="+secondMenu.getMENU_ID());
								}else{
									smap.put("pageURL", secondMenu.getMENU_URL());
								}
								smap.put("name", secondMenu.getMENU_NAME());
								smap.put("icon", secondMenu.getMENU_ICON());
								smap.put("openType", 2);
								smap.put("maxOpen", -1);
								smap.put("extend", false);
								smap.put("childs", null);
								smap.put("id", Integer.parseInt(secondMenu.getMENU_ID()));
								remenuList.add(smap);
							}
						}
					}
				}
			}
			zmap.put("data", remenuList);
		}else if("2".equals(MENU_TYPE)){
			zmap.put("code", 1);
			zmap.put("message", "成功");
			for(int i=0;i<allmenuList.size();i++){
				Menu firstMenu = allmenuList.get(i);
				if("2".equals(firstMenu.getMENU_TYPE())){
					if(firstMenu.isHasMenu() && "1".equals(firstMenu.getMENU_STATE())){				//有权限，并且是可视的（一级菜单）
						Map<String,Object> fmap = new LinkedHashMap<String,Object>();
						fmap.put("title", firstMenu.getMENU_NAME());
						fmap.put("pageURL", null);
						fmap.put("name", firstMenu.getMENU_NAME());
						fmap.put("icon", firstMenu.getMENU_ICON());
						fmap.put("openType", 1);
						fmap.put("extend", false);
						List<Map<String,Object>> semenuList = new ArrayList<Map<String,Object>>();	//二级菜单
						List<Menu> secondMenuList = allmenuList.get(i).getSubMenu();
						for(int n=0;n<secondMenuList.size();n++){
							Menu secondMenu = secondMenuList.get(n);
							if(secondMenu.isHasMenu() && "1".equals(secondMenu.getMENU_STATE())){	//有权限，并且是可视的（二级菜单）
								Map<String,Object> smap = new LinkedHashMap<String,Object>();
								smap.put("title", secondMenu.getMENU_NAME());
								if(secondMenu.getSubMenu().size()>0){
									smap.put("pageURL", "../menu/menu_ztree_other.html?MENU_ID="+secondMenu.getMENU_ID());
								}else{
									smap.put("pageURL", secondMenu.getMENU_URL());
								}
								smap.put("name", secondMenu.getMENU_NAME());
								smap.put("icon", secondMenu.getMENU_ICON());
								smap.put("openType", 2);
								smap.put("maxOpen", -1);
								smap.put("extend", false);
								smap.put("childs", null);
								smap.put("id", Integer.parseInt(secondMenu.getMENU_ID()));
								semenuList.add(smap);
							}
						}
						fmap.put("childs", semenuList);
						remenuList.add(fmap);
					}
				}
			}
			zmap.put("data", remenuList);
		}
		return zmap;
	}
	
	/**菜单缓存以及赋值权限
	 * @param session
	 * @param USERNAME 用户名
	 * @param roleRights 主职角色加密的权限字符串
	 * @param arrayRoleRights 副职角色加密的权限字符串列表
	 * @param uqxmap	主职角色的增删改查权限
	 * @param uqxmap2	副职角色的增删改查权限
	 * @param shiroSet 放入shiro权限标识的的SET
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public List<Menu> getAttributeMenu(Session session, String USERNAME, String roleRights, List<String> arrayRoleRights, Map<String, String> uqxmap, Map<String, List<String>> uqxmap2, Collection<String> shiroSet) throws Exception{
		List<Menu> allmenuList = new ArrayList<Menu>();
		if(null == session.getAttribute(USERNAME + Const.SESSION_ALLMENU)){	
			allmenuList = menuService.listAllMenuQx("0");											//获取所有菜单
			if(Tools.notEmpty(roleRights)){
				allmenuList = this.readMenu(USERNAME, allmenuList, roleRights, arrayRoleRights, shiroSet, uqxmap, uqxmap2);				//根据角色权限获取本权限的菜单列表
			}
			session.setAttribute(USERNAME + Const.SESSION_ALLMENU, allmenuList);					//菜单权限放入session中
		}else{
			allmenuList = (List<Menu>)session.getAttribute(USERNAME + Const.SESSION_ALLMENU);
		}
		return allmenuList;
	}
	
	/**获取副职角色权限List
	 * @param ROLE_IDS 副职角色ID列表
	 * @return
	 * @throws Exception
	 */
	public List<String> getArrayRoleRights(String ROLE_IDS) throws Exception{
		if(Tools.notEmpty(ROLE_IDS)){
			List<String> list = new ArrayList<String>();
			String arryROLE_ID[] = ROLE_IDS.split(",");
			for(int i=0;i<arryROLE_ID.length;i++){
				PageData pd = new PageData();
				pd.put("ROLE_ID", arryROLE_ID[i]);
				pd = roleService.findById(pd);
				if(null != pd){
					String RIGHTS = pd.getString("RIGHTS");
					if(Tools.notEmpty(RIGHTS)){
						list.add(RIGHTS);
					}
				}
			}
			return list.size() == 0 ? null : list;
		}else{
			return null;
		}
	}
	
	/**根据角色权限获取本权限的菜单列表(递归处理)
	 * @param USERNAME 用户名
	 * @param menuList 传入的总菜单
	 * @param roleRights 主职角色加密的权限字符串
	 * @param arrayRoleRights 副职角色加密的权限字符串列表
	 * @param shiroSet	放入shiro权限标识的的Set
	 * @param uqxmap	主职角色的增删改查权限
	 * @param uqxmap2	副职角色的增删改查权限
	 * @return
	 */
	public List<Menu> readMenu(String USERNAME, List<Menu> menuList,String roleRights, List<String> arrayRoleRights, Collection<String> shiroSet, Map<String, String> uqxmap, Map<String, List<String>> uqxmap2){
		for(int i=0;i<menuList.size();i++){
			Boolean b1 = RightsHelper.testRights(roleRights, menuList.get(i).getMENU_ID());
			menuList.get(i).setHasMenu(b1); //赋予主职角色菜单权限
			if(!b1 && null != arrayRoleRights){
				for(int n=0;n<arrayRoleRights.size();n++){
					if(RightsHelper.testRights(arrayRoleRights.get(n), menuList.get(i).getMENU_ID())){
						menuList.get(i).setHasMenu(true);
						if(Tools.notEmpty(menuList.get(i).getSHIRO_KEY()) && !"(无)".equals(menuList.get(i).getSHIRO_KEY())) {
							shiroSet.add(menuList.get(i).getSHIRO_KEY());
						}
						break;
					}
				}
			}
			if(b1){			//有此菜单权限才进行按钮权限判断
				if(Tools.notEmpty(menuList.get(i).getSHIRO_KEY()) && !"(无)".equals(menuList.get(i).getSHIRO_KEY())) {
					
					shiroSet.add(menuList.get(i).getSHIRO_KEY()); //把菜单权限标识放入shiro Set
				
					/*以下判断增删改查的按钮权限*/
					Boolean b_add = RightsHelper.testRights(uqxmap.get("adds").toString(), menuList.get(i).getMENU_ID());
					if(b_add || "admin".equals(USERNAME)){ 	//判断主职角色此菜单下有无新增权限，有则把此菜单下的新增权限标识放入 shiro Set
						shiroSet.add(menuList.get(i).getSHIRO_KEY().split(":")[0]+":add");
					}else if(null != uqxmap2 && null != uqxmap2.get("addsList")){ 	//无则继续判断副职角色权限
						for(int n=0;n<uqxmap2.get("addsList").size();n++) {
							Boolean b_add_s = RightsHelper.testRights(uqxmap2.get("addsList").get(n), menuList.get(i).getMENU_ID()); //判断第一个副职角色的此菜单的新增权限
							if(b_add_s){ 	//有则把此菜单下的新增权限标识放入 shiro Set, 并且跳出循环，无则继续循环判断其它副职的角色
								shiroSet.add(menuList.get(i).getSHIRO_KEY().split(":")[0]+":add");
								break;
							}
						}
					}
					Boolean b_del = RightsHelper.testRights(uqxmap.get("dels").toString(), menuList.get(i).getMENU_ID());
					if(b_del || "admin".equals(USERNAME)){ 	//判断主职角色此菜单下有无删除权限，有则把此菜单下的删除权限标识放入 shiro Set
						shiroSet.add(menuList.get(i).getSHIRO_KEY().split(":")[0]+":del");
					}else if(null != uqxmap2 && null != uqxmap2.get("delsList")){ 	//无则继续判断副职角色权限
						for(int n=0;n<uqxmap2.get("delsList").size();n++) {
							Boolean b_del_s = RightsHelper.testRights(uqxmap2.get("delsList").get(n), menuList.get(i).getMENU_ID()); //判断第一个副职角色的此菜单的删除权限
							if(b_del_s){ 	//有则把此菜单下的删除权限标识放入 shiro Set, 并且跳出循环，无则继续循环判断其它副职的角色
								shiroSet.add(menuList.get(i).getSHIRO_KEY().split(":")[0]+":del");
								break;
							}
						}
					}
					Boolean b_edit = RightsHelper.testRights(uqxmap.get("edits").toString(), menuList.get(i).getMENU_ID());
					if(b_edit || "admin".equals(USERNAME)){ 	//判断主职角色此菜单下有无修改权限，有则把此菜单下的修改权限标识放入 shiro Set
						shiroSet.add(menuList.get(i).getSHIRO_KEY().split(":")[0]+":edit");
					}else if(null != uqxmap2 && null != uqxmap2.get("editsList")){ 	//无则继续判断副职角色权限
						for(int n=0;n<uqxmap2.get("editsList").size();n++) {
							Boolean b_edit_s = RightsHelper.testRights(uqxmap2.get("editsList").get(n), menuList.get(i).getMENU_ID()); //判断第一个副职角色的此菜单的修改权限
							if(b_edit_s){ 	//有则把此菜单下的修改权限标识放入 shiro Set, 并且跳出循环，无则继续循环判断其它副职的角色
								shiroSet.add(menuList.get(i).getSHIRO_KEY().split(":")[0]+":edit");
								break;
							}
						}
					}
					Boolean b_cha = RightsHelper.testRights(uqxmap.get("chas").toString(), menuList.get(i).getMENU_ID());
					if(b_cha || "admin".equals(USERNAME)){ 	//判断主职角色此菜单下有无查看权限，有则把此菜单下的查看权限标识放入 shiro Set
						shiroSet.add(menuList.get(i).getSHIRO_KEY().split(":")[0]+":cha");
					}else if(null != uqxmap2 && null != uqxmap2.get("chasList")){ 	//无则继续判断副职角色权限
						for(int n=0;n<uqxmap2.get("chasList").size();n++) {
							Boolean b_cha_s = RightsHelper.testRights(uqxmap2.get("chasList").get(n), menuList.get(i).getMENU_ID()); //判断第一个副职角色的此菜单的查看权限
							if(b_cha_s){ 	//有则把此菜单下的查看权限标识放入 shiro Set, 并且跳出循环，无则继续循环判断其它副职的角色
								shiroSet.add(menuList.get(i).getSHIRO_KEY().split(":")[0]+":cha");
								break;
							}
						}
					}
				}
			}
			if(menuList.get(i).isHasMenu()){		//判断是否有此菜单权限
				this.readMenu(USERNAME, menuList.get(i).getSubMenu(), roleRights, arrayRoleRights, shiroSet, uqxmap, uqxmap2);//是：继续排查其子菜单
			}
		}
		return menuList;
	}
	
	/**获取用户权限（主职的增删改查权限，以及全部角色的独立按钮权限）
	 * @param user 用户对象
	 * @param role	角色对象
	 * @param shiroSet 放入shiro权限标识的的Set
	 * @return
	 */
	public Map<String, String> getUQX(User user,Role role,Collection<String> shiroSet){
		PageData pd = new PageData();
		Map<String, String> map = new HashMap<String, String>();
		try {
			String ROLE_ID = role.getROLE_ID();
			String ROLE_IDS = user.getROLE_IDS();
			pd.put("ROLE_ID", ROLE_ID);					//获取角色ID
			map.put("adds", role.getADD_QX());			//增
			map.put("dels", role.getDEL_QX());			//删
			map.put("edits", role.getEDIT_QX());		//改
			map.put("chas", role.getCHA_QX());			//查
			/* 独立的按钮权限 */
			List<PageData> buttonQXnamelist = new ArrayList<PageData>();
			if("admin".equals(user.getUSERNAME())){
				buttonQXnamelist = fhButtonService.listAll(pd);						//admin用户拥有所有按钮权限
			}else{
				if(Tools.notEmpty(ROLE_IDS)){//(主副职角色综合按钮权限)
					ROLE_IDS = ROLE_IDS+ "," + ROLE_ID;
					String arryROLE_ID[] = ROLE_IDS.split(",");
					buttonQXnamelist = buttonrightsService.listAllBrAndQxnameByZF(arryROLE_ID);
				}else{						 //(主职角色按钮权限)
					buttonQXnamelist = buttonrightsService.listAllBrAndQxname(pd);	//此角色拥有的按钮权限标识列表
				}
			}
			for(int i=0;i<buttonQXnamelist.size();i++){
				shiroSet.add(buttonQXnamelist.get(i).getString("SHIRO_KEY"));		//按钮权限标识放入shiro Set 中
			}
		} catch (Exception e) {
		}	
		return map;
	}
	
	/**获取用户权限(处理副职角色)
	 * @param user 用户对象
	 * @return
	 */
	public Map<String, List<String>> getUQX2(User user){
		Map<String, List<String>> maps = new HashMap<String, List<String>>();
		try {
			String ROLE_IDS = user.getROLE_IDS();
			if(Tools.notEmpty(ROLE_IDS)){
				String arryROLE_ID[] = ROLE_IDS.split(",");
				PageData rolePd = new PageData();
				List<String> addsList = new ArrayList<String>();
				List<String> delsList = new ArrayList<String>();
				List<String> editsList = new ArrayList<String>();
				List<String> chasList = new ArrayList<String>();
				for(int i=0;i<arryROLE_ID.length;i++){
					rolePd.put("ROLE_ID", arryROLE_ID[i]);
					rolePd = roleService.findById(rolePd);
					addsList.add(rolePd.getString("ADD_QX"));
					delsList.add(rolePd.getString("DEL_QX"));
					editsList.add(rolePd.getString("EDIT_QX"));
					chasList.add(rolePd.getString("CHA_QX"));
				}
				maps.put("addsList", addsList);		//增
				maps.put("delsList", delsList);		//删
				maps.put("editsList", editsList);	//改
				maps.put("chasList", chasList);		//查
			}
		} catch (Exception e) {
		}	
		return maps;
	}
	
	/** 更新登录用户的IP
	 * @param USERNAME 用户名
	 * @throws Exception
	 */
	public void setRemortIP(String USERNAME) throws Exception {  
		PageData pd = new PageData();
		HttpServletRequest request = this.getRequest();
		String ip = "";
		if (request.getHeader("x-forwarded-for") == null) {  
			ip = request.getRemoteAddr();  
	    }else{
	    	ip = request.getHeader("x-forwarded-for");  
	    }
		pd.put("LAST_LOGIN",DateUtil.getTime().toString());
		pd.put("USERNAME", USERNAME);
		pd.put("IP", ip);
		usersService.saveIP(pd);
	}  
	
	/**
	 * 用户注销
	 * @param
	 * @return
	 * @throws Exception 
	 */
	@RequestMapping(value="/logout", produces="application/json;charset=UTF-8")
	@ResponseBody
	@SysLog("退出系统")
	public Object logout() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		String USERNAME = Jurisdiction.getUsername();	//当前登录的用户名
		String NAME=Jurisdiction.getName();
		this.removeSession(USERNAME);					//清缓存
		Subject subject = SecurityUtils.getSubject(); 	//shiro销毁登录
		subject.logout();
//		FHLOG.save(USERNAME, "退出系统");				//记录日志
		map.put("NAME",NAME);  //用来加入日志中
		map.put("USERNAME",USERNAME);  //用来加入日志中
		map.put("CONTENT",NAME+"退出系统");
		map.put("result", errInfo);
		return map;
	}
	
	/**
	 * 清理session
	 */
	public void removeSession(String USERNAME){
		Session session = Jurisdiction.getSession();	//以下清除session缓存
		session.removeAttribute(Const.SESSION_USER);
		session.removeAttribute(USERNAME + Const.SESSION_ROLE_RIGHTS);
		session.removeAttribute(USERNAME + Const.SESSION_ALLMENU);
		session.removeAttribute(USERNAME + Const.SHIROSET);
		session.removeAttribute(Const.SESSION_USERNAME);
		session.removeAttribute(Const.SESSION_U_NAME);
		session.removeAttribute(Const.SESSION_USERROL);
		session.removeAttribute(Const.SESSION_RNUMBERS);
		session.removeAttribute(Const.SKIN);
	}

	@RequestMapping("/getHttpUrl")
	@ResponseBody()
	public Object getHttpUrl(){
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		map.put("result",errInfo);
		map.put("httpurl",ueditorConfig.getHttpurl());
		return map;
	}
	
}
