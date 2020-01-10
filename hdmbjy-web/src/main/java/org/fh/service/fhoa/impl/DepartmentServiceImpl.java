package org.fh.service.fhoa.impl;

import java.util.ArrayList;
import java.util.List;

import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.entity.fhoa.Department;
import org.fh.mapper.dsno1.fhoa.DepartmentMapper;
import org.fh.mapper.dsno1.system.UsersMapper;
import org.fh.service.fhoa.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 
 * 说明： 组织机构接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-07-01
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class DepartmentServiceImpl implements DepartmentService{

	@Autowired
	private DepartmentMapper departmentMapper;
	
	@Autowired 
	private UsersMapper usersMapper;
	 
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		String pIds="";
		PageData pPd=new PageData();
		pPd.put("DEPARTMENT_ID",pd.get("PARENT_ID"));
		PageData parent = departmentMapper.findById(pPd);
		if (parent == null) {
			pd.put("P_IDS",0);
		}else {
			String pPIds= (String) parent.get("P_IDS");
			pIds=pPIds+","+(String)pd.get("PARENT_ID");
			pd.put("P_IDS",pIds);
		}
		
		departmentMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		departmentMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		departmentMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return departmentMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return departmentMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return departmentMapper.findById(pd);
	}

	/**
	 * 通过ID获取其子级列表
	 * @param parentId
	 * @return
	 * @throws Exception
	 */
	public List<Department> listByParentId(String parentId) throws Exception {
		return departmentMapper.listByParentId(parentId);
	}
	
	/**
	 * 获取所有数据并填充每条数据的子级列表(递归处理)
	 * @param MENU_ID
	 * @return
	 * @throws Exception
	 */
	public List<Department> listTree(String parentId) throws Exception {
		List<Department> valueList = this.listByParentId(parentId);
		for(Department fhentity : valueList){
			fhentity.setTreeurl("department_list.html?DEPARTMENT_ID="+fhentity.getDEPARTMENT_ID());
			List<Department> departments = this.listTree(fhentity.getDEPARTMENT_ID());
			if(departments.size()==0){
				fhentity.setHasDepartment(false);
			}else{
				fhentity.setHasDepartment(true);
				fhentity.setSubDepartment(departments);
			}
			fhentity.setTarget("treeFrame");
		}
		return valueList;
	}
	
	/**
	 * 用户列表机构
	 */
	public List<Department> listUserTree(String parentId) throws Exception {
		List<Department> valueList = this.listByParentId(parentId);
		for(Department fhentity : valueList){
			fhentity.setTreeurl("department_list.html?DEPARTMENT_ID="+fhentity.getDEPARTMENT_ID());
			List<Department> departments = this.listTree(fhentity.getDEPARTMENT_ID());
			if(departments.size()==0){
				fhentity.setHasDepartment(false);
			}else{
				fhentity.setHasDepartment(true);
				fhentity.setSubDepartment(departments);
			}
			fhentity.setTarget("treeFrame");
		}
		return valueList;
	}
	
	
	

	@Override
	public List<Department> listTree(PageData pd) throws Exception {
		String parentId= (String) pd.get("parentId");
		List<Department> valueList = this.listByParentId(parentId);
		String [] ACCEPT_DEPARTMENT= (String[]) pd.get("ACCEPT_DEPARTMENT");
		for(Department fhentity : valueList){
			fhentity.setTreeurl("department_list.html?DEPARTMENT_ID="+fhentity.getDEPARTMENT_ID());
			PageData pageData=new PageData();
			pageData.put("parentId",fhentity.getDEPARTMENT_ID());
			pageData.put("ACCEPT_DEPARTMENT",ACCEPT_DEPARTMENT);
			List<Department> departments = this.listTree(pageData);
			if(departments.size()==0){
				fhentity.setHasDepartment(false);
			}else{
				fhentity.setHasDepartment(true);
				fhentity.setSubDepartment(departments);
			}
			for (String DEPARTMENT : ACCEPT_DEPARTMENT) {
				if(fhentity.getDEPARTMENT_ID().equals(DEPARTMENT)){
					fhentity.setChecked(true);
				}
			}
			fhentity.setTarget("treeFrame");
		}
		return valueList;
	}

	/**
	 * 获取所有数据并填充每条数据的子级列表(递归处理)
	 * @param
	 * @return
	 * @throws Exception
	 */
	public List<Department> listTreeUser(String parentId) throws Exception {
		List<Department> valueList = this.listByParentId(parentId);
		for(Department fhentity : valueList){
			fhentity.setTreeurl("user_list.html?DEPARTMENT_ID="+fhentity.getDEPARTMENT_ID());
			fhentity.setSubDepartment(this.listTreeUser(fhentity.getDEPARTMENT_ID()));
			fhentity.setTarget("treeFrame");
		}
		return valueList;
	}

	@Override
	public List<PageData> listAllTree(PageData pageData) {
		List<PageData> allDepartments = departmentMapper.listAll(pageData);
		List<PageData> all=new ArrayList<>();
		for (PageData data : allDepartments) {
			PageData deTree=new PageData();
			deTree.put("id",data.get("DEPARTMENT_ID"));
			deTree.put("name",data.get("NAME"));
			deTree.put("pId",data.get("PARENT_ID"));
			deTree.put("url","department_list.html?id="+data.get("DEPARTMENT_ID"));
			deTree.put("target","treeFrame");
			all.add(deTree);
		}
		return all;
	}

	@Override
	public List<PageData> getInfo(PageData pageData) {
		return departmentMapper.getInfo(pageData);
	}
	/**
	 * 机构变更
	 * @param pd
	 * @throws Exception
	 */
	public void change(PageData pd)throws Exception{
		PageData dep = departmentMapper.findById(pd);//张三机构
		PageData dep1 = departmentMapper.findById(pd);//张三机构
		PageData user = usersMapper.findById(pd);//王五 负责人
		PageData user1 = usersMapper.findById(pd);//王五 负责人
		
		//pd.put("HEADMAN", user1.getString("NAME"));
		//PageData ydep = departmentMapper.findByName(pd);//王五机构
		//PageData ydep1 = departmentMapper.findByName(pd);//王五机构
		pd.put("NAME", dep1.getString("HEADMAN"));
		PageData yuser = usersMapper.findByName(pd);//张三负责人
		//PageData yuser1 = usersMapper.findByName(pd);//张三负责人
			
		dep.put("HEADMAN", user1.getString("NAME"));
		dep.put("USER_ID", user1.getString("USER_ID"));
		user.put("DEPARTMENT_ID", dep1.getString("DEPARTMENT_ID"));		
		//ydep.put("HEADMAN", null);
		yuser.put("DEPARTMENT_ID", null);
		
		usersMapper.editUser(user);
		departmentMapper.edit(dep);
		
		usersMapper.editUser(yuser);
		//departmentMapper.edit(ydep);
	}

	@Override
	public PageData findByBianma(PageData pd) {
		return departmentMapper.findByBianma(pd);
	}

	@Override
	public PageData findByDepName(PageData deppd) throws Exception {
		return departmentMapper.findByDepName(deppd);
	}

	@Override
	public List<PageData> listTreeArchive(PageData pageData) {
		List<PageData> allDepartments = departmentMapper.listAll(pageData);
		List<PageData> all=new ArrayList<>();
		for (PageData data : allDepartments) {
			PageData deTree=new PageData();
			deTree.put("id",data.get("DEPARTMENT_ID"));
			deTree.put("name",data.get("NAME"));
			deTree.put("pId",data.get("PARENT_ID"));
			deTree.put("url","archive_list.html?id="+data.get("DEPARTMENT_ID"));
			deTree.put("target","treeFrame");
			all.add(deTree);
		}
		return all;
	}
}




















