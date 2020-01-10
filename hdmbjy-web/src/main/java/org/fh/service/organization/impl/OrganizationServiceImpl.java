package org.fh.service.organization.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.entity.system.Dictionaries;
import org.fh.mapper.dsno1.organization.OrganizationMapper;
import org.fh.service.organization.OrganizationService;
import org.fh.service.system.DictionariesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 
 * 说明： 民办学校机构接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-09-27
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class OrganizationServiceImpl implements OrganizationService{

	@Autowired
	private OrganizationMapper organizationMapper;

	@Autowired
	private DictionariesService dictionariesService;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		organizationMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		organizationMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		organizationMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return organizationMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return organizationMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return organizationMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		organizationMapper.deleteAll(ArrayDATA_IDS);
	}

	@Override
	public List<PageData> listAllOrganization(PageData pageData) throws Exception {
		List<PageData> organizationList = organizationMapper.listAllOrganization(pageData);
		String type= (String) pageData.get("type");
		String tPage=pageData.getString("tPage");
		if(!StringUtils.isNotBlank(type)){
			throw new Exception("类型为空");
		}
		String tP="&tPage="+tPage;
		String  url="";
		if(type.equals("scuser")){
			url="scuser_list.html?oId=";
		}else if(type.equals("organization")){
			url="organization_list.html?oId=";
		}
		String param="&IDIS=1";   //是否是学区

		List<Dictionaries> organization_types = dictionariesService.listSubDictByParentNameEn("ORGANIZATION_TYPE");
		List<PageData> all=new ArrayList<>();

		for (Dictionaries organization_type : organization_types) {
			PageData oneNode=new PageData();
			oneNode.put("id",organization_type.getDICTIONARIES_ID());
			oneNode.put("name",organization_type.getNAME());
			oneNode.put("pId","-1");
			oneNode.put("url",url+organization_type.getDICTIONARIES_ID()+param+tP);
			oneNode.put("target","treeFrame");
			all.add(oneNode);
		}
	/*	node.put("id","0");
		node.put("name","顶级节点");
		node.put("pId","-1");
		node.put("target","treeFrame");
		if(type.equals("organization")){
			node.put("url",url+"0");
		}else if(type.equals("scuser")){
			node.put("url",url+"0"+tP);
		}*/
		for (PageData organization : organizationList) {
			PageData pd=new PageData();
			pd.put("id",organization.get("ORGANIZATION_ID"));
			pd.put("name",organization.get("NAME"));
			pd.put("pId",organization.get("PARENT_ID"));
			pd.put("url",url+organization.get("ORGANIZATION_ID")+tP);
			pd.put("target","treeFrame");
			all.add(pd);
		}
		return all;
	}

	@Override
	public List<PageData> listAllTree(PageData pageData) throws Exception {
		List<PageData> allDepartments = organizationMapper.listAll(pageData);
		List<PageData> all=new ArrayList<>();
		for (PageData data : allDepartments) {
			PageData deTree=new PageData();
			deTree.put("id",data.get("ORGANIZATION_ID"));
			deTree.put("name",data.get("NAME"));
			deTree.put("pId",data.get("PARENT_ID"));
			deTree.put("url","organization_list.html?oId="+data.get("ORGANIZATION_ID"));
			deTree.put("target","treeFrame");
			all.add(deTree);
		}
		return all;
	}

	@Override
	public List<PageData> listSubOrganizationByParentId(Page page) throws Exception {
		return organizationMapper.listSublistPage(page);
	}

	@Override
	public long findCountType(String type) throws Exception {
		return organizationMapper.findCountType(type);
	}

	@Override
	public long findByTypeXQ(String bianma) throws Exception {
		return  organizationMapper.findByTypeXQ(bianma);
	}

	@Override
	public List<PageData> findByUserId(String userid) {
		return  organizationMapper.findByUserId(userid);
	}

	@Override
	public PageData findByLicence(PageData pd) {
		return  organizationMapper.findByLicence(pd);
	}

	@Override
	public List<PageData> lists(PageData pd) throws Exception {
		return organizationMapper.lists(pd);
	}

	@Override
	public PageData findByHeadmanType(String headmanType) {
		return organizationMapper.findByHeadmanType(headmanType);
	}

	@Override
	public int count(PageData pd) {
		return organizationMapper.count(pd);
	}

	@Override
	public List<PageData> listAllMap(PageData pd) throws Exception {
		return organizationMapper.listAllMap(pd);
	}

	@Override
	public List<PageData> listTreeArchive(PageData pageData) throws Exception{
		List<PageData> organizationList = organizationMapper.listAllOrganization(pageData);
		//String type= (String) pageData.get("type");
		String tPage=pageData.getString("tPage");
		String tP="&tPage="+tPage;
		String url="archive_list.html?oId=";
		String param="&IDIS=1";   //是否是学区
		List<Dictionaries> organization_types = dictionariesService.listSubDictByParentNameEn("ORGANIZATION_TYPE");
		List<PageData> all=new ArrayList<>();
		for (Dictionaries organization_type : organization_types) {
			PageData oneNode=new PageData();
			oneNode.put("id",organization_type.getDICTIONARIES_ID());
			oneNode.put("name",organization_type.getNAME());
			oneNode.put("pId","-1");
			oneNode.put("url",url+organization_type.getDICTIONARIES_ID()+param);
			oneNode.put("target","treeFrame");
			all.add(oneNode);
		}
		for (PageData organization : organizationList) {
			PageData pd=new PageData();
			pd.put("id",organization.get("ORGANIZATION_ID"));
			pd.put("name",organization.get("NAME"));
			pd.put("pId",organization.get("PARENT_ID"));
			pd.put("url",url+organization.get("ORGANIZATION_ID")+tP);
			pd.put("target","treeFrame");
			all.add(pd);
		}
		return all;
	}

	@Override
	public PageData findByHeadmanId(PageData pd) {
		return organizationMapper.findByHeadmanId(pd);
	}


}

