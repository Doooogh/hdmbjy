package org.fh.service.act.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.act.ProcdefMapper;
import org.fh.service.act.ProcdefService;

/** 
 * 说明： 流程管理接口实现类
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 * @version
 */
@Service(value="procdefServiceImpl")
@Transactional //开启事物
public class ProcdefServiceImpl implements ProcdefService{

	@Autowired
	private ProcdefMapper procdefMapper;
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return procdefMapper.datalistPage(page);
	}
	
}

