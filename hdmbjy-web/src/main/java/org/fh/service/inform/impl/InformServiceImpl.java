package org.fh.service.inform.impl;

import org.apache.commons.lang3.StringUtils;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.attachment.AttachmentMapper;
import org.fh.mapper.dsno1.inform.InformMapper;
import org.fh.mapper.dsno1.informdetail.InformDetailMapper;
import org.fh.mapper.dsno1.system.UsersMapper;
import org.fh.service.inform.InformService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** 
 * 说明： 系统通知接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-08-22
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class InformServiceImpl implements InformService{

	@Autowired
	private InformMapper informMapper;

	@Autowired
	private AttachmentMapper attachmentMapper;

	@Autowired
	private UsersMapper usersMapper;

	@Autowired
	private InformDetailMapper informDetailMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		informMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		PageData inform= informMapper.findById(pd);
		if(null!=inform){
			informMapper.delete(pd);
			//删除与通知关联的通知详细
			pd.put("INFORM_ID",pd.get("ID"));
			informDetailMapper.deleteByInformId(pd);
			//删除与之关联的 附件"
			String ATTACHMENT=inform.getString("ATTACHMENT");
			if(StringUtils.isNotBlank(ATTACHMENT)){
				String[] split = ATTACHMENT.split(",");
				attachmentMapper.deleteAll(split);
			}
		}
	}

	public static void main(String[] args) {
		PageData pageData=new PageData();
		String s=pageData.getString("test");
		System.out.println(s);
	}

	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		informMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return informMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return informMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return informMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		informMapper.deleteAll(ArrayDATA_IDS);
	}

	@Override
	public void deleteFileById(PageData pd) throws Exception {
		attachmentMapper.delete(pd);
	}

	@Override
	public List<PageData> findAttachmentByIds(PageData pd) {
		return attachmentMapper.findAttachmentByIds(pd);
	}

	@Override
	public List<PageData> listNoInformByUserIdlistPage(Page page) {
		return informMapper.listNoInformByUserIdlistPage(page);
	}

	@Override
	public void removeUserIdFromNoInform(PageData pd) throws Exception {
		PageData pageData=informMapper.findById(pd);
		if(null!=pageData){
			String noInform= (String) pageData.get("NO_INFORM");
			String USER_ID= (String) pd.get("USER_ID");
			if(!noInform.endsWith(USER_ID)){
				noInform=noInform.replace(USER_ID+",","");
			}else{
				noInform=noInform.replace(USER_ID,"");
			}
			pageData.put("NO_INFORM",noInform);
			informMapper.edit(pageData);
		}else{
			throw new Exception("没有查询到数据");
		}
	}


	@Override
	public List<PageData> findInformUser(PageData pd) {
		String  recipient= (String) pd.get("RECIPIENT"); // 计划发送的人ids
		String noInform= (String) pd.get("NO_INFORM");
		List<String> listAll=new ArrayList<>();
		List<String> listNoInform=new ArrayList<>();
		String recipientIds[]=recipient.split(",");
		String noInformIds[]=noInform.split(",");
		for (String recipientId : recipientIds) {
			if(StringUtils.isNotEmpty(recipientId)){
				listAll.add(recipientId);
			}
		}
		for (String noInformId : noInformIds) {
			if(StringUtils.isNotEmpty(noInformId)){
				listNoInform.add(noInformId);
			}
		}
		pd.put("userIds",listAll);
		List<PageData> all=usersMapper.findByUserId(pd);
		pd.put("userIds",listNoInform);
		List<PageData> noInformUser=usersMapper.findByUserId(pd);
		for (PageData aUser : all) {
			aUser.put("isNot","0");
			for (PageData nUser : noInformUser) {
				if(((String)aUser.get("USER_ID")).equals((String)(nUser.get("USER_ID")))){
					aUser.put("isNot","1");
				}
			}

		}
		return all;
	}

}

