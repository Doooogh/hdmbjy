package org.fh.mapper.dsno1.fhoa;

import java.util.List;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.entity.fhoa.Department;

/** 
 * 说明： 组织机构Mapper
 * 作者：FH Admin QQ313596790
 * 时间：2019-07-01
 * 官网：www.fhadmin.org
 * @version
 */
public interface DepartmentMapper{

	/**新增
	 * @param pd
	 * @throws Exception
	 */
	void save(PageData pd);
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	void delete(PageData pd);
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	void edit(PageData pd);
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	List<PageData> datalistPage(Page page);
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	List<PageData> listAll(PageData pd);
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	PageData findById(PageData pd);
	
	/**
	 * 通过ID获取其子级列表
	 * @param parentId
	 * @return
	 * @throws Exception
	 */
	List<Department> listByParentId(String parentId);

	List<PageData> listPageDataByParentId(PageData pageData);

	List<String> getParentIds(PageData pageData);


	List<PageData> getInfo(PageData pageData);
	/**
	 * 通过用户名称查询jig
	 * @param pd
	 * @return
	 */
	PageData findByName(PageData pd);
		/**
		 * 判断许可证号是否重复
		 * @param pd
		 * @return
		 */
	PageData findByBianma(PageData pd);
	/**
	 * 通过机构名称查询
	 * @param deppd
	 * @return
	 */
    PageData findByDepName(PageData deppd);
	
}

