package org.fh.service.article.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.article.ArticleMapper;
import org.fh.mapper.dsno1.attachment.AttachmentMapper;
import org.fh.service.article.ArticleService;
import org.fh.util.Const;
import org.fh.util.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 
 * 说明： 文章管理接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-08-01
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class ArticleServiceImpl implements ArticleService{

	@Autowired
	private ArticleMapper articleMapper;

	@Autowired
	private AttachmentMapper attachmentMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		articleMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		articleMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		articleMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return articleMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return articleMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return articleMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		articleMapper.deleteAll(ArrayDATA_IDS);
	}

	@Override
	public PageData findMaxId(PageData pd) {
		return articleMapper.findMaxId(pd);
	}

	@Override
	public List<PageData> findAttachmentByIds(PageData pd) {
		return attachmentMapper.findAttachmentByIds(pd);
	}

	@Override
	public void deleteFileById(PageData pd) throws Exception {
		attachmentMapper.delete(pd);
	}

	@Override
	@Transactional
	public Map deleteAllAndAttachment(PageData pageData) {
		Map<String,Object> map=new HashMap<>();
		String result="success";
		map.put("result","success");
		String IDS= (String) pageData.get("IDS");
		String ids[]=IDS.split(",");
		for (String id : ids) {
			PageData pd=new PageData();
			pd.put("ID",id);
			try {
				PageData article = findById(pd);
				if(null!=article){
					articleMapper.delete(pd);
					if(null!=article.get("ATTACHMENT")&&article.get("ATTACHMENT").toString()!=""){
						String ATTACHMENT=article.get("ATTACHMENT").toString();
						pd.put("ATTACHMENT",ATTACHMENT);
						//查出所有该文章的附件
						List<PageData> attachments = attachmentMapper.findAttachmentByIds(pd);
						//查出来封面图
						for (PageData attachment : attachments) {
							//遍历删除附件
							String url= (String) attachment.get("URL");
							FileUtil.delFile(url);
						}
						String att[]=ATTACHMENT.split(",");
						attachmentMapper.deleteAll(att);
					}
					if(null!=article.get("COVER_IMAGE")&&article.get("COVER_IMAGE").toString()!=""){
						//删除封面图片
						String  coverImage = (String) article.get("COVER_IMAGE");
						FileUtil.delFile(Const.FILEPATH+coverImage);
					}
				}else{
					result="exception";
					map.put("result",result);
					break;
				}
			} catch (Exception e) {
				result="exception";
				map.put("result",result);
				e.printStackTrace();
				return map;
			}
		}
		return map;
	}
	/**
	 * 通过栏目id查询文章
	 */
	@Override
	public List<PageData> findBycategoryId(PageData pd) throws Exception {
		return articleMapper.findBycategoryId(pd);
	}

	@Override
	public List<PageData> findBycategoryIdOrDate(PageData pd) throws Exception {
		return  articleMapper.findBycategoryIdOrDate(pd);
	}

	@Override
	public List<PageData> listType(Page page) throws Exception {
		return  articleMapper.datalistPageType(page);
	}




}

