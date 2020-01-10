package org.fh.service.fhoa;

import java.util.List;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.entity.fhoa.Department;

/** 
 * 说明： 组织机构接口
 * 作者：FH Admin QQ313596790
 * 时间：2019-07-01
 * 官网：www.fhadmin.org
 * @version
 */
public interface DepartmentService{

	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception;
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception;
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception;
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception;
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception;
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception;
	
	/**
	 * 通过ID获取其子级列表
	 * @param parentId
	 * @return
	 * @throws Exception
	 */
	public List<Department> listByParentId(String parentId) throws Exception;
	
	/**
	 * 获取所有数据并填充每条数据的子级列表(递归处理)
	 * @param MENU_ID
	 * @return
	 * @throws Exception
	 */
	public List<Department> listTree(String parentId) throws Exception;



	public List<Department> listTree(PageData  pd) throws Exception;
	/**
	 * 获取所有数据并填充每条数据的子级列表(递归处理)
	 * @param MENU_ID
	 * @return
	 * @throws Exception
	 */
	public List<Department> listTreeUser(String parentId) throws Exception;

	List<PageData> listAllTree(PageData pageData);

	List<PageData> getInfo(PageData pageData);
	/**
	 * 用户列表机构
	 * @param parentId
	 * @return
	 * @throws Exception
	 */
	public List<Department> listUserTree(String parentId) throws Exception;
	/**
	 * 机构变更
	 * @param pd
	 * @throws Exception
	 */
	public void change(PageData pd)throws Exception;

	public PageData findByBianma(PageData pd);

	public PageData findByDepName(PageData deppd)throws Exception;
	
	
	List<PageData> listTreeArchive(PageData pageData);
}

