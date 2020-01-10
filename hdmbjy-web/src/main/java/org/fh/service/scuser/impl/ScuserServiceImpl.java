package org.fh.service.scuser.impl;

import java.util.Date;
import java.util.List;
import java.util.Set;

import org.fh.mapper.dsno1.inform.InformMapper;
import org.fh.mapper.dsno1.informdetail.InformDetailMapper;
import org.fh.service.inform.InformService;
import org.fh.service.informdetail.InformDetailService;
import org.fh.util.UuidUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.scuser.ScuserMapper;
import org.fh.service.scuser.ScuserService;

/** 
 * 说明： 民办机构用户接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-09-27
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class ScuserServiceImpl implements ScuserService{

	@Autowired
	private ScuserMapper scuserMapper;

	@Autowired
	private InformMapper informMapper;

	@Autowired
	private InformDetailMapper informDetailMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		scuserMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		scuserMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		scuserMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return scuserMapper.datalistPage(page);
	}

	@Override
	public PageData getData(PageData page) throws Exception {
		return scuserMapper.getData(page);
	}

	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return scuserMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return scuserMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		scuserMapper.deleteAll(ArrayDATA_IDS);
	}

	@Override
	public PageData findByHeadmanInfo(PageData pd) {
		return scuserMapper.findByHeadmanInfo(pd);
	}

	@Override
	public PageData findOrganizationByScuser(PageData pd) {
		return scuserMapper.findOrganizationByScuser(pd);
	}

	@Override
	public List<PageData> findByName(PageData pd) {
		return scuserMapper.findByName(pd);
	}

	@Override
	public List<PageData> defaultTeacherDataAnalysis(PageData pd) {
		return null;
	}

	@Override
	public void findExpirescUser(PageData pd) {
		List<PageData> expirescUserList = scuserMapper.findExpirescUser(pd);
		PageData inform =new PageData();

		inform.put("TITLE","合同到期教师");
		inform.put("TYPE","合同到期类型");
		inform.put("INITIATOR","1");  //发起人
		inform.put("INITIATOR_NAME","系统管理员");
		inform.put("CONTENT","合同已经到期");  //通知内容
		inform.put("CREATE_DATE",new Date());
		PageData informDetail=new PageData();
		if(expirescUserList.size()!=0){
			for (PageData pageData : expirescUserList) {
				String informId=UuidUtil.get32UUID();
				inform.put("INFORM_ID", informId);
				if(null!=pageData.get("NAME")){
					inform.put("CONTENT",pageData.get("NAME")+"合同已经到期");  //通知内容
					informMapper.save(inform);
					informDetail.put("INFORMDETAIL",UuidUtil.get32UUID());
					informDetail.put("INFORMDETAIL_ID",UuidUtil.get32UUID());
					informDetail.put("INFORM_ID",informId);
					if(null!=pageData.get("HEADMAN_ID")){
						informDetail.put("INFORMANT",pageData.get("HEADMAN_ID"));
					}else{
						continue;
					}
					informDetailMapper.save(informDetail);
				}else{
					continue;
				}
			}
		}
	}

	@Override
	public int findExpirescUserCount(PageData pd) {
		List<PageData> expirescUser = scuserMapper.findExpirescUser(pd);
		if(expirescUser.size()!=0){
			return expirescUser.size();
		}
		return 0;
	}

	@Override
	public long findByEducation(PageData pd) {
		return scuserMapper.findByEducation(pd);
	}

	@Override
	public int countScuserNum(PageData pd) {
		return scuserMapper.countScuserNum(pd);
	}

	@Override
	public PageData findOrganizationTypeName(PageData pageData) {

		return null;
	}


}

