package org.fh.service.scuser.impl;

import org.apache.shiro.crypto.hash.SimpleHash;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.inform.InformMapper;
import org.fh.mapper.dsno1.informdetail.InformDetailMapper;
import org.fh.mapper.dsno1.scuser.ScuserMapper;
import org.fh.mapper.dsno1.system.UsersMapper;
import org.fh.service.scuser.ScuserService;
import org.fh.util.GetPinyin;
import org.fh.util.UuidUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

	@Autowired
	private UsersMapper usersMapper;
	
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

	@Override
	public Map resetPS(PageData pd) {
		Map<String,Object> map=new HashMap<>();
		String res="success";
		pd.put("USER_ID",pd.get("SCUSER_ID"));
		PageData user=usersMapper.findById(pd);
		if(null==user){
			res="error";
			map.put("res",res);
			return map;
		}
		try{
			PageData editUser=new PageData();
			editUser.put("USER_ID",pd.get("SCUSER_ID"));
			String NAME=user.getString("NAME");
			NAME=GetPinyin.getPingYin(NAME.substring(0,1));
			String USERNAME=user.getString("USERNAME");
			//重置的密码为 用户名后三位 +姓氏全拼
			editUser.put("PASSWORD", new SimpleHash("SHA-1", user.getString("USERNAME"), USERNAME.substring(USERNAME.length()-4,USERNAME.length())+NAME).toString());
			editUser.put("BZ","");
			usersMapper.editUser(editUser);
		}catch (Exception e){
			e.printStackTrace();
			res="error";
			map.put("res",res);
			return map;
		}
		map.put("res",res);
		return map;
	}

	@Override
	public List<PageData> findDelete(PageData pd) {
		return scuserMapper.findDelete(pd);
	}


}

