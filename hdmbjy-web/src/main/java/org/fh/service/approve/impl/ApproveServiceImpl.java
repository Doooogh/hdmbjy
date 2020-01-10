package org.fh.service.approve.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.catalina.core.ApplicationContext;
import org.apache.commons.lang3.StringUtils;
import org.fh.entity.system.Dictionaries;
import org.fh.service.system.DictionariesService;
import org.fh.util.SpringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.approve.ApproveMapper;
import org.fh.service.approve.ApproveService;

/** 
 * 说明： 审批类型接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-10-14
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class ApproveServiceImpl implements ApproveService{

	@Autowired
	private ApproveMapper approveMapper;

	@Autowired
	private DictionariesService dictionariesService;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		approveMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		approveMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		approveMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return approveMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return approveMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return approveMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		approveMapper.deleteAll(ArrayDATA_IDS);
	}

	@Override
	public List<PageData> listAllApprove(PageData pageData) throws Exception {
		List<PageData> approveList = approveMapper.listAllOrganization(pageData);
		PageData node=new PageData();
		String type= (String) pageData.get("type");
//		String tPage=pageData.getString("tPage");
		if(!StringUtils.isNotBlank(type)){
			throw new Exception("类型为空");
		}
		String  url="";
		if(type.equals("approve")){
			url="approve_list.html?aId=";
		}else if(type.equals("fulldata")){
			url="fulldata_list.html?aId=";
		}
	/*	node.put("id","0");
		node.put("name","顶级节点");
		node.put("pId","-1");
		node.put("open","true");
		node.put("target","treeFrame");
		if(type.equals("approve")){
			node.put("url",url+"0");
		}else if(type.equals("scuser")){
			node.put("url",url+"0");
		}*/


		List<Dictionaries> organization_types = dictionariesService.listSubDictByParentNameEn("ORGANIZATION_TYPE");
		List<PageData> all=new ArrayList<>();

		for (Dictionaries organization_type : organization_types) {
			PageData oneNode=new PageData();
			oneNode.put("id",organization_type.getDICTIONARIES_ID());
			oneNode.put("name",organization_type.getNAME());
			oneNode.put("pId","-1");
			oneNode.put("url",url+organization_type.getDICTIONARIES_ID());
			oneNode.put("target","treeFrame");
			all.add(oneNode);
		}

//		all.add(node);
		for (PageData approve : approveList) {
			PageData pd=new PageData();
			pd.put("id",approve.get("APPROVE_ID"));
			pd.put("name",approve.get("NAME"));
			pd.put("pId",approve.get("PARENT_ID"));
			pd.put("url",url+approve.get("APPROVE_ID"));
			pd.put("target","treeFrame");
			all.add(pd);
		}
		return all;
	}

	@Override
	public List<PageData> listAllTree(PageData pageData) throws Exception {
		List<PageData> allApprove = approveMapper.listAll(pageData);
		List<PageData> all=new ArrayList<>();
		for (PageData data : allApprove) {
			PageData deTree=new PageData();
			deTree.put("id",data.get("APPROVE_ID"));
			deTree.put("name",data.get("NAME"));
			deTree.put("pId",data.get("PARENT_ID"));
			deTree.put("url","approve_list.html?oId="+data.get("APPROVE_ID"));
			deTree.put("target","treeFrame");
			all.add(deTree);
		}
		return all;
	}

	@Override
	public List<PageData> listSubApproveByParentId(Page page) throws Exception {
		return approveMapper.listSublistPage(page);
	}

	@Override
	public String getAllPathByApproveId(PageData pd) {
		String allPath="";
		PageData parentApprove = approveMapper.findById(pd);
		while (null!=parentApprove&&StringUtils.isNotBlank(parentApprove.getString("PARENT_ID"))){
			PageData findParent=new PageData();
			findParent.put("APPROVE_ID",parentApprove.get("PARENT_ID"));
			allPath+=(parentApprove.getString("NAME_EN")+"/");
			parentApprove=approveMapper.findById(findParent);
		}
		String[] paths = allPath.split("/");
		allPath="";
		for (int i = paths.length - 1; i >= 0; i--) {
			if(StringUtils.isNotBlank(paths[i])){
				allPath+=(paths[i]+"/");
			}
		}
		return allPath;
	}





}

