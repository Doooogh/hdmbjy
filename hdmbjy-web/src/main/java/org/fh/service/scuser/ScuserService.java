package org.fh.service.scuser;

import org.fh.entity.Page;
import org.fh.entity.PageData;

import java.util.List;
import java.util.Map;

/** 
 * 说明： 民办机构用户接口
 * 作者：FH Admin QQ313596790
 * 时间：2019-09-27
 * 官网：www.fhadmin.org
 * @version
 */
public interface ScuserService{

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

	public PageData getData(PageData page)throws Exception;

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
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception;

	PageData findByHeadmanInfo(PageData pd);

	PageData findOrganizationByScuser(PageData pd);

	public List<PageData> findByName(PageData pd);

	/**
	 *机构教师分析 根据教师类型查看各学历数量
	 * @author li long
	 * @date 2019/10/23
	 * @param  * @param pd
	 * @return java.util.List<org.fh.entity.PageData>
	 */
	List<PageData>defaultTeacherDataAnalysis(PageData pd);

	void findExpirescUser(PageData pd);

	int findExpirescUserCount(PageData pd);

	public long findByEducation(PageData pd);

	int countScuserNum(PageData pd);

	PageData findOrganizationTypeName(PageData pageData);

	Map resetPS(PageData pd);


	/**查询已经删除了的机构用户
	 *
	 * @param pd   pd 中FTYPE:1  查询单个  FTYPE:list(SCUSER_IDS) 查询多个
	 * @return
	 */
	List<PageData> findDelete(PageData pd);


}

