package org.fh.service.approvetype.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.fh.entity.system.Dictionaries;
import org.fh.service.system.DictionariesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.approvetype.ApproveTypeMapper;
import org.fh.service.approvetype.ApproveTypeService;

/** 
 * 说明： 审批类型接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-10-14
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class ApproveTypeServiceImpl implements ApproveTypeService {

	@Autowired
	private ApproveTypeMapper approveTypeMapper;

	@Autowired
	private DictionariesService dictionariesService;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		approveTypeMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		approveTypeMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		approveTypeMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return approveTypeMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return approveTypeMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return approveTypeMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		approveTypeMapper.deleteAll(ArrayDATA_IDS);
	}

	@Override
	public List<PageData> listAllApproveType(PageData pageData) throws Exception {
		String APP_TYPE=pageData.getString("APP_TYPE");
		String TYPE=""; //用来表示 行政和年审 查询  1 行政 2 年审
		if(StringUtils.isNotBlank(APP_TYPE)){
			if(APP_TYPE.equals("examination")){
				pageData.put("TYPE","2");
				TYPE="2";
			}else if(APP_TYPE.equals("government")){
				pageData.put("TYPE","1");
				TYPE="1";
			}
		}else{
			throw new Exception("审批总类型为空");
		}
		List<PageData> approveTypeList = approveTypeMapper.listAllApproveType(pageData);
		PageData node=new PageData();
		String type= (String) pageData.get("type");
//		String tPage=pageData.getString("tPage");
		if(!StringUtils.isNotBlank(type)){
			throw new Exception("类型为空");
		}
		String  url="";
		if(type.equals("approvetype")){
			url="approvetype_list.html?aId=";
		}else if(type.equals("fulldata")){
			url="fulldata_list.html?aId=";
		}
		List<PageData> all=new ArrayList<>();

		String aTy="&aTy=";
		List<Dictionaries> organization_types = dictionariesService.listSubDictByParentNameEn("ORGANIZATION_TYPE");
		//只有当行政审批的时候才会自动添加
		if(TYPE.equals("1")){   //类型为行政审批
			for (Dictionaries organization_type : organization_types) {
				PageData oneNode=new PageData();
				oneNode.put("id",organization_type.getDICTIONARIES_ID());
				oneNode.put("name",organization_type.getNAME());
				oneNode.put("pId","-1");
				oneNode.put("url",url+organization_type.getDICTIONARIES_ID()+aTy+"1");
				oneNode.put("target","treeFrame");
				all.add(oneNode);
			}
		}else if(TYPE.equals("2")){  //类型为年度审批
			for (Dictionaries organization_type : organization_types) {
				PageData oneNode=new PageData();
				oneNode.put("id",organization_type.getDICTIONARIES_ID());
				oneNode.put("name",organization_type.getNAME());
				oneNode.put("pId","-1");
				oneNode.put("url",url+organization_type.getDICTIONARIES_ID()+aTy+"2");
				oneNode.put("target","treeFrame");
				all.add(oneNode);
			}
			/*PageData oneNode=new PageData();
			oneNode.put("id","123");
			oneNode.put("name","年审顶级类型");
			oneNode.put("pId","-1");
			oneNode.put("url",url+"123"+"&aTy="+TYPE);
			oneNode.put("target","treeFrame");
			all.add(oneNode);*/
		}




//		all.add(node);
		for (PageData approveType : approveTypeList) {
			PageData pd=new PageData();
			pd.put("id",approveType.get("APPROVETYPE_ID"));
			pd.put("name",approveType.get("NAME"));
			pd.put("pId",approveType.get("PARENT_ID"));
			pd.put("url",url+approveType.get("APPROVETYPE_ID")+"&aTy="+TYPE);
			pd.put("target","treeFrame");
			all.add(pd);
		}
		return all;
	}

	@Override
	public List<PageData> listAllTree(PageData pageData) throws Exception {
		List<PageData> allApprove = approveTypeMapper.listAll(pageData);
		List<PageData> all=new ArrayList<>();
		for (PageData data : allApprove) {
			PageData deTree=new PageData();
			deTree.put("id",data.get("APPROVETYPE_ID"));
			deTree.put("name",data.get("NAME"));
			deTree.put("pId",data.get("PARENT_ID"));
			deTree.put("url","approvetype_list.html?oId="+data.get("APPROVETYPE_ID"));
			deTree.put("target","treeFrame");
			all.add(deTree);
		}
		return all;
	}

	@Override
	public List<PageData> listSubApproveTypeByParentId(Page page) throws Exception {
		return approveTypeMapper.listSublistPage(page);
	}

	@Override
	public String getAllPathByApproveTypeId(PageData pd) {
		String allPath="";
		PageData parentApprove = approveTypeMapper.findById(pd);
		while (null!=parentApprove&&StringUtils.isNotBlank(parentApprove.getString("PARENT_ID"))){
			PageData findParent=new PageData();
			findParent.put("APPROVETYPE_ID",parentApprove.get("PARENT_ID"));
			allPath+=(parentApprove.getString("NAME_EN")+"/");
			parentApprove= approveTypeMapper.findById(findParent);
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


	@Override
	public PageData getTopApproveTypeAndAllPath(PageData pd) throws Exception {  //pd 中需要有一个审批类型APPROVETYPE_ID
		PageData info=new PageData();
		String allPath="";
		String topApproveTypeId="";
		String topApproveType=pd.getString("FTYPE");  // 表单类型   行政  1或者是年检   2
		boolean isFirstApproveType=false;

		PageData parentApprove = approveTypeMapper.findById(pd);
		if(null==parentApprove){
			topApproveTypeId=pd.getString("APPROVETYPE_ID");
			isFirstApproveType=true;
		}
		while (null!=parentApprove&&StringUtils.isNotBlank(parentApprove.getString("PARENT_ID"))){
			PageData findParent=new PageData();
			findParent.put("APPROVETYPE_ID",parentApprove.get("PARENT_ID"));
			allPath+=(parentApprove.getString("NAME_EN")+"/");
			topApproveTypeId=parentApprove.getString("APPROVETYPE_ID");
			parentApprove= approveTypeMapper.findById(findParent);
		}
		String[] paths = allPath.split("/");
		allPath="";
		for (int i = paths.length - 1; i >= 0; i--) {
			if(StringUtils.isNotBlank(paths[i])){
				allPath+=(paths[i]+"/");
			}
		}

		if(!isFirstApproveType){
			PageData findTopApproveType=new PageData();
			findTopApproveType.put("APPROVETYPE_ID",topApproveTypeId);
			PageData secondApprove = approveTypeMapper.findById(findTopApproveType);
			topApproveTypeId=secondApprove.getString("PARENT_ID");
			secondApprove.getString("TYPE");
		}
		if(topApproveTypeId.equals("d3a942ecd3f84b55b04d31f8bf3c3c79")&&topApproveType.equals("1")){  //民办培训学校
				allPath="../../approvefulldata/government/mbpeixun/"+allPath;
			}else if(topApproveTypeId.equals("2720bf3c064a4f0a8209398a75802d16")&&topApproveType.equals("1")){  //民办幼儿园
				allPath="../../approvefulldata/government/mbyoueryuan/"+allPath;
			}else if(topApproveTypeId.equals("6cda9246c400406c941064ec88ff1944")&&topApproveType.equals("1")){  //公办幼儿园
				allPath="../../approvefulldata/government/gbyoueryuan/"+allPath;
			}else if(topApproveTypeId.equals("55fce1c46df1450eac670bcb5a621fb9")&&topApproveType.equals("1")){  //寄宿部审批
				allPath="../../approvefulldata/government/jsbshenpi/"+allPath;
			}else if(topApproveTypeId.equals("fe9248c3eb984e94b6071fb381b4e02b")&&topApproveType.equals("1")){  //民办中小学
				allPath="../../approvefulldata/government/mbzhongxiaoxue/"+allPath;
			}else if(topApproveTypeId.equals("d3a942ecd3f84b55b04d31f8bf3c3c79")&&topApproveType.equals("2")){//民办培训学校
				allPath="../../approvefulldata/examination/mbpeixun/"+allPath;
			}else if(topApproveTypeId.equals("2720bf3c064a4f0a8209398a75802d16")&&topApproveType.equals("2")){//民办幼儿园
				allPath="../../approvefulldata/examination/mbyoueryuan/"+allPath;
			}else if(topApproveTypeId.equals("6cda9246c400406c941064ec88ff1944")&&topApproveType.equals("2")){//公办幼儿园
				allPath="../../approvefulldata/examination/gbyoueryuan/"+allPath;
			}else if(topApproveTypeId.equals("55fce1c46df1450eac670bcb5a621fb9")&&topApproveType.equals("2")){//寄宿部审批
				allPath="../../approvefulldata/examination/jsbshenpi/"+allPath;
			}else if(topApproveTypeId.equals("fe9248c3eb984e94b6071fb381b4e02b")&&topApproveType.equals("2")){//民办中小学
				allPath="../../approvefulldata/examination/mbzhongxiaoxue/"+allPath;
			}









		info.put("allPath",allPath);  //html全路径
		info.put("topApproveType",topApproveTypeId);  //顶层的approveType id
		return info;
	}


}

