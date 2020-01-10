package org.fh.service.option.impl;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.option.OptionMapper;
import org.fh.service.option.OptionService;

/** 
 * 说明： 反馈表表单数据选项表接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-11-15
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class OptionServiceImpl implements OptionService{

	@Autowired
	private OptionMapper optionMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		optionMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		optionMapper.delete(pd);
	}

	@Override
	public void deleteByTableId(PageData pd) {

	}

	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		optionMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return optionMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return optionMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return optionMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		optionMapper.deleteAll(ArrayDATA_IDS);
	}

	@Override
	public int batchSave(List<PageData> list) {
		return optionMapper.batchSave(list);
	}

	@Override
	public List<PageData> findTreeByTableId(PageData pd) {
		List<PageData> optionByTableId = optionMapper.listAll(pd);
		List<PageData> parentOptionsTree=new ArrayList<>();
		Map<String,PageData> map=new HashMap<>();  //保存list
		for (PageData pageData : optionByTableId) {  //将list 全部放入 map 中
			map.put(pageData.getString("OPTION_ID"),pageData);
		}

		//先查询出最顶层的option
		for (PageData option : optionByTableId) {
			if(null==map.get(option.getString("PARENT_ID"))){
				parentOptionsTree.add(option);
			}
		}
		//实现Comparator进行排序
		Collections.sort(parentOptionsTree,new Comparator<Object>(){
			@Override
			public int compare(Object o1, Object o2) {
				return (Integer.parseInt(((PageData)o1).getString("ORDER")) - Integer.parseInt(((PageData)o2).getString("ORDER")));
			}
		});

		for (PageData parentNode : parentOptionsTree) {
			PageData findChild=new PageData();
			findChild.put("PARENT_ID",parentNode.get("OPTION_ID"));
			List<PageData> childByParentId = findByParentId(findChild);
			if(childByParentId.size()!=0){
				parentNode.put("childOption",childByParentId);
			}
		}
		return parentOptionsTree;
	}

	List<PageData> findByParentId(PageData pd){
		List<PageData> byParentId = optionMapper.findByParentId(pd);
			for (PageData option : byParentId) {
				PageData findByParentId=new PageData();
				findByParentId.put("PARENT_ID",option.get("OPTION_ID"));
				List<PageData> childOptions = findByParentId(findByParentId);
				if(childOptions.size()!=0){
					option.put("childOption",childOptions);
				}else{
					option.put("childOption",new ArrayList<>());
				}

			}
		//实现Comparator进行排序
		Collections.sort(byParentId,new Comparator<Object>(){
			@Override
			public int compare(Object o1, Object o2) {
				return (Integer.parseInt(((PageData)o1).getString("ORDER")) - Integer.parseInt(((PageData)o2).getString("ORDER")));
			}
		});
		return byParentId;
	}

	@Override
	public List<PageData> findByPId(PageData pd) {
		return optionMapper.findByParentId(pd);
	}

}

