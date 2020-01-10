package org.fh.service.system.impl;

import java.util.Date;
import java.util.List;

import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.system.FHlogMapper;
import org.fh.service.system.FHlogService;
import org.fh.util.DateUtil;
import org.fh.util.UuidUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 说明：操作日志记录接口实现类
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
@Service
@Transactional //开启事物
public class FHlogServiceImpl implements FHlogService {
	
	@Autowired
	private FHlogMapper fHlogMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(String USERNAME, String CONTENT)throws Exception{
		PageData pd = new PageData();
		pd.put("USERNAME", USERNAME);						//用户名
		pd.put("CONTENT", CONTENT);							//事件
		pd.put("FHLOG_ID", UuidUtil.get32UUID());			//主键
		pd.put("CZTIME", DateUtil.date2Str(new Date()));	//操作时间
		fHlogMapper.save(pd);
	}

	@Override
	public void save(PageData pd) {
		pd.put("FHLOG_ID", UuidUtil.get32UUID());			//主键
		pd.put("CZTIME", DateUtil.date2Str(new Date()));	//操作时间
		fHlogMapper.save(pd);
	}

	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		fHlogMapper.delete(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return fHlogMapper.datalistPage(page);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		fHlogMapper.deleteAll(ArrayDATA_IDS);
	}

}
