package org.fh.service.formdata.member;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.fh.entity.Page;
import org.fh.entity.PageData;

/** 
 * 说明： 决策机构成员接口
 * 作者：FH Admin QQ313596790
 * 时间：2019-11-04
 * 官网：www.fhadmin.org
 * @version
 */
public interface MemberService{

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
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception;

	/**
	 *批量添加
	 * @author li long
	 * @date 2019/11/4
	 * @param  * @param list
	 * @return int
	 */
	int batchSave(List<PageData> list);

	/**
	 *根据PolicymakingId 查询
	 * @author li long
	 * @date 2019/11/4
	 * @param  * @param pd
	 * @return java.util.List<org.fh.entity.PageData>
	 */
	List<PageData> findByPolicymakingId(PageData pd);

	/**
	 *根据PolicymakingId删除
	 * @author li long
	 * @date 2019/11/4
	 * @param  * @param pd
	 * @return java.util.List<org.fh.entity.PageData>
	 */
	int deleteByPolicymakingId(PageData pd);


}

