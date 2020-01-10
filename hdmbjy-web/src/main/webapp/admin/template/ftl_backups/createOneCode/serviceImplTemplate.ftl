package org.fh.service.${packageName}.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.${packageName}.${objectName}Mapper;
import org.fh.service.${packageName}.${objectName}Service;

/** 
 * 说明： ${TITLE}接口实现类
 * 作者：FH Admin Q313596790
 * 时间：${nowDate?string("yyyy-MM-dd")}
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class ${objectName}ServiceImpl implements ${objectName}Service{

	@Autowired
	private ${objectName}Mapper ${objectNameLower}Mapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		${objectNameLower}Mapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		${objectNameLower}Mapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		${objectNameLower}Mapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return ${objectNameLower}Mapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return ${objectNameLower}Mapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return ${objectNameLower}Mapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		${objectNameLower}Mapper.deleteAll(ArrayDATA_IDS);
	}
	
}

