package org.fh.service.system.impl;

import org.fh.entity.PageData;
import org.fh.mapper.dsno1.system.PhotoMapper;
import org.fh.service.system.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 说明：头像编辑服务接口实现类
 * 作者：FH Admin Q 31359679 0
 * 官网：www.fhadmin.org
 */
@Service
@Transactional //开启事物
public class PhotoServiceImpl implements PhotoService {
	
	@Autowired
	private PhotoMapper photoMapper;

	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd) throws Exception {
		photoMapper.save(pd);
	}

	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd) throws Exception {
		photoMapper.edit(pd);
	}

	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd) throws Exception {
		return photoMapper.findById(pd);
	}

}
