package org.fh.service.organization;

import java.util.List;

import org.fh.entity.Page;
import org.fh.entity.PageData;

/** 
 * 说明： 民办学校机构接口
 * 作者：FH Admin QQ313596790
 * 时间：2019-09-27
 * 官网：www.fhadmin.org
 * @version
 */
public interface  OrganizationService{

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
	/**
	 * 地图查询
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public List<PageData> listAllMap(PageData pd)throws Exception;
	
	public List<PageData> lists(PageData pd)throws Exception;
	
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


	List<PageData> listAllOrganization(PageData pageData) throws Exception;

	List<PageData> listAllTree(PageData pageData) throws Exception;

	public List<PageData> listSubOrganizationByParentId(Page page)throws Exception;
	/**
	 * 机构分类
	 * @param type
	 * @return
	 * @throws Exception
	 */
	public long findCountType(String type)throws Exception;
	/**
	 * 学区分类
	 * @param bianma
	 * @return
	 */
	public long findByTypeXQ(String bianma)throws Exception;
	/**
	 *通过用户id查询机构
	 */

	public List<PageData> findByUserId(String userid);


	public PageData findByLicence(PageData pd);


	PageData findByHeadmanType(String headmanType);

	//统计机构的数量
	int count(PageData pd);
	
	//档案管理菜单
	public List<PageData> listTreeArchive(PageData pageData)throws Exception;

	PageData findByHeadmanId(PageData pd);



}

