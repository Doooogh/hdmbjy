package org.fh.service.archive.impl;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.archive.ArchiveMapper;
import org.fh.mapper.dsno1.organization.OrganizationMapper;
import org.fh.mapper.dsno1.system.DictionariesMapper;
import org.fh.service.archive.ArchiveService;
import org.fh.util.DateUtil;
import org.fh.util.Jurisdiction;
import org.fh.util.ManyDownloadFile;
import org.fh.util.UuidUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aliyuncs.http.HttpRequest;

/** 
 * 说明： 文件系统接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-09-04
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class ArchiveServiceImpl implements ArchiveService{

	@Autowired
	private ArchiveMapper archiveMapper;
	/**
	 *机构
	 */
	@Autowired
	private OrganizationMapper organizationMapper;
	/**
	 * 数据字典
	 */
	@Autowired
	private DictionariesMapper dictionariesMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		archiveMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		archiveMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		archiveMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return archiveMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return archiveMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return archiveMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		archiveMapper.deleteAll(ArrayDATA_IDS);
	}

	@Override
	public void delWj(PageData pd) throws Exception {
		archiveMapper.delWj(pd);
	}

	@Override
	public boolean examineZip(PageData pd,HttpServletRequest request,HttpServletResponse res) {
		try {
			//User user= (User) pd.get("user");
			String type= pd.getString("TYPE");
			String zipBasePath = pd.getString("zipBasePath");
			String zipName = pd.getString("zipName")+".zip";
			List<PageData> filePaths = (List<PageData>) pd.get("filePaths");
			/**
			 * @param zipBasePath 存储路径
			 * @param zipName 压缩包名
			 * @param filePaths 压缩集合
			 */
			String zipFilePath = zipBasePath+zipName;
			ManyDownloadFile.downloadAll2(request, res, zipBasePath, zipName, filePaths);
			String[] strArr = zipFilePath.split("\\/");
			String p = strArr[strArr.length-3] +"/"+strArr[strArr.length-2] +"/"+strArr[strArr.length-1];
			List<PageData> pdor = organizationMapper.findByUserId(Jurisdiction.getUser().getUSER_ID());
			
			PageData pdall = new PageData();
			pdall.put("ELSE_ID", pd.getString("ELSE_ID"));
			pdall.put("TITLE", pd.getString("zipName"));
			pdall.put("UPLOAD_USERNAME", pd.getString("UPLOAD_USERNAME"));
			pdall.put("ARCHIVE_ID", UuidUtil.get32UUID());
			pdall.put("NAME", Jurisdiction.getName());
			pdall.put("PATH", p);
			pdall.put("USER_ID", Jurisdiction.getUser().getUSER_ID());
			pdall.put("TYPE",type);
			pdall.put("DEPARTMENT_ID", pdor.get(0).getString("ORGANIZATION_ID"));
			pdall.put("CREATOR_DATE", DateUtil.date2Str(new Date()));
			pdall.put("FIND_TYPE", "1");
			pdall.put("FILE_NAME", zipName);
			archiveMapper.save(pdall);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		
	}
	
	
	
	/**
	 * id in 查询
	 */
	@Override
	public List<PageData> findInById(String[] ArrayDATA_IDS) throws Exception {
		return archiveMapper.findInById(ArrayDATA_IDS);
	}

	
}

