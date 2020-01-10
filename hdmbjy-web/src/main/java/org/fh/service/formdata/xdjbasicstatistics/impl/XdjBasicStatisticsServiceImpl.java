package org.fh.service.formdata.xdjbasicstatistics.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.formdata.xdjbasicstatistics.XdjBasicStatisticsMapper;
import org.fh.service.formdata.xdjbasicstatistics.XdjBasicStatisticsService;

/** 
 * 说明： 校长、董事长（理事长）、举办者个人基本情况接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-12-06
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class XdjBasicStatisticsServiceImpl implements XdjBasicStatisticsService{

	@Autowired
	private XdjBasicStatisticsMapper xdjbasicstatisticsMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		xdjbasicstatisticsMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		xdjbasicstatisticsMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		xdjbasicstatisticsMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return xdjbasicstatisticsMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return xdjbasicstatisticsMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return xdjbasicstatisticsMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		xdjbasicstatisticsMapper.deleteAll(ArrayDATA_IDS);
	}
	
}

