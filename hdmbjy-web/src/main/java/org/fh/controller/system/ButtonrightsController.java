package org.fh.controller.system;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.fh.controller.base.BaseController;
import org.fh.entity.PageData;
import org.fh.entity.system.Role;
import org.fh.log.SysLog;
import org.fh.service.system.ButtonrightsService;
import org.fh.service.system.FHlogService;
import org.fh.service.system.FhButtonService;
import org.fh.service.system.RoleService;
import org.fh.util.Jurisdiction;
import org.fh.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 说明：按钮权限处理类
 * 作者：FH Admin Q313596-790
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping(value="/buttonrights")
public class ButtonrightsController extends BaseController {
	
	@Autowired
	private ButtonrightsService buttonrightsService;
	@Autowired
    private RoleService roleService;
	@Autowired
	private FhButtonService fhButtonService;
	@Autowired
    private FHlogService FHLOG;
	
	/**列表
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("buttonrights:list")
	@ResponseBody
	public Object list() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		if(Tools.isEmpty(pd.getString("ROLE_ID"))){
			pd.put("ROLE_ID", "1");											//默认列出第一组角色(初始设计系统用户组不能删除)
		}
		PageData fpd = new PageData();
		fpd.put("ROLE_ID", "0");
		List<Role> roleList = roleService.listAllRolesByPId(fpd);			//列出组(页面横向排列的一级组)
		List<Role> roleList_z = roleService.listAllRolesByPId(pd);			//列出此组下架角色
		List<PageData> buttonlist = fhButtonService.listAll(pd);			//列出所有按钮
		List<PageData> roleFhbuttonlist = buttonrightsService.listAll(pd);	//列出所有角色按钮关联数据
		pd = roleService.findById(pd);										//取得点击的角色组(横排的)
		map.put("pd", pd);
		map.put("roleList", roleList);
		map.put("roleList_z", roleList_z);
		map.put("buttonlist", buttonlist);
		map.put("roleFhbuttonlist", roleFhbuttonlist);
		map.put("result", errInfo);
		return map;
	}
	
	/**点击按钮处理关联表
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/upRb")
	@ResponseBody
	@RequiresPermissions("buttonrights:edit")
	@SysLog("点击按钮权限修改")
	public Object updateRolebuttonrightd()throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		PageData pd = new PageData();
		pd = this.getPageData();
		String errInfo = "success";
		if(null != buttonrightsService.findById(pd)){	//判断关联表是否有数据 是:删除/否:新增
			buttonrightsService.delete(pd);				//删除
		}else{
			pd.put("RB_ID", this.get32UUID());			//主键
			buttonrightsService.save(pd);				//新增
		}
		Role role = roleService.getRoleById(pd.getString("ROLE_ID"));
		PageData but=new PageData();
		but.put("FHBUTTON_ID",pd.getString("BUTTON_ID"));
		PageData button = fhButtonService.findById(but);
		map.put("CONTENT",Jurisdiction.getName()+"修改了角色("+role.getROLE_NAME()+")的点击按钮权限,修改的按钮为:"+button.getString("NAME"));   //记录的日志内容
		map.put("NAME",Jurisdiction.getName());   //用来记录日志 执行操作人
		map.put("USERNAME",Jurisdiction.getUsername());
//		FHLOG.save(Jurisdiction.getUsername(), "操作了按钮权限的开关:角色ID："+pd.getString("ROLE_ID")+", 按钮ID："+pd.getString("BUTTON_ID"));				//记录日志
		map.put("result", errInfo);
		return map;
	}
	
}
