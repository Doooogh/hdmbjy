package org.fh.mapper.dsno1.informdetail;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.fh.entity.Page;
import org.fh.entity.PageData;

/** 
 * 说明： 通知详细Mapper
 * 作者：FH Admin QQ313596790
 * 时间：2019-10-10
 * 官网：www.fhadmin.org
 * @version
 */
public interface InformDetailMapper {

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

	/**
	 *功能描述
	 * @author li long
	 * @date 2019/10/12
	 * @param  * @param pd
	 * @return void
	 */
	void deleteByInformId(PageData pd);


	
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

	/**\
	 * 批量添加
	 * @param list
	 * @return
	 */
	int batchSave(@Param("list")List<PageData> list);

	List<PageData> findPersonByInformId(PageData pd);

	PageData findByinformantId(PageData pd);

	/**
	 *根据通知id 获取
	 * @author li long
	 * @date 2019/10/12
	 * @param  * @param pd
	 * @return java.util.List<org.fh.entity.PageData>
	 */
	List<PageData> findListByInformId(PageData pd);
	
}

