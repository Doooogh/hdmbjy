package org.fh.service.article;

import java.util.List;
import java.util.Map;

import org.fh.entity.Page;
import org.fh.entity.PageData;

/** 
 * 说明： 文章管理接口
 * 作者：FH Admin QQ313596790
 * 时间：2019-08-01
 * 官网：www.fhadmin.org
 * @version
 */
public interface ArticleService{

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
	public List<PageData> listType(Page page)throws Exception;
	
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

	PageData findMaxId(PageData pd);

	List<PageData> findAttachmentByIds(PageData pd);

	public void deleteFileById(PageData pd)throws Exception;

	public Map deleteAllAndAttachment(PageData pageData);
	/**
	 * 通过栏目id查询文章
	 * @param id
	 * @return
	 */
	public List<PageData> findBycategoryId(PageData pd)throws Exception;
	public List<PageData> findBycategoryIdOrDate(PageData pd)throws Exception;


}

