package org.fh.mapper.dsno1.formdata.mark;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.fh.entity.Page;
import org.fh.entity.PageData;

/** 
 * 说明： 海淀区民办幼儿园年检自查表-评分表Mapper
 * 作者：FH Admin QQ313596790
 * 时间：2019-11-05
 * 官网：www.fhadmin.org
 * @version
 */
public interface MarkMapper{

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
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	void deleteAll(String[] ArrayDATA_IDS);


	int batchSave(@Param("list")List<PageData> list);

	List<PageData> findByYexmyCheckId(PageData pd);

	int deleteByYexmyCheckId(PageData pd);
	
}

