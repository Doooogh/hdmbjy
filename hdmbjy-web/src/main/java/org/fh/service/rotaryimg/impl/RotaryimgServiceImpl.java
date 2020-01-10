package org.fh.service.rotaryimg.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.rotaryimg.RotaryimgMapper;
import org.fh.service.rotaryimg.RotaryimgService;

/** 
 * 说明： 轮播图管理接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-08-02
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class RotaryimgServiceImpl implements RotaryimgService{

	@Autowired
	private RotaryimgMapper rotaryimgMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		rotaryimgMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		rotaryimgMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		rotaryimgMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return rotaryimgMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return rotaryimgMapper.listAll(pd);
	}
	/**
	 * 已审核的轮播图片
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public List<PageData> listAllType(PageData pd)throws Exception{
		return rotaryimgMapper.listAllType(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return rotaryimgMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		rotaryimgMapper.deleteAll(ArrayDATA_IDS);
	}

	@Override
	public void delTp(PageData pd) throws Exception {
		rotaryimgMapper.delTp(pd);
		
	}
	
}

