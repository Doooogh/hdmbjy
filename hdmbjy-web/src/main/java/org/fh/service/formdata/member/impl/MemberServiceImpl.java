package org.fh.service.formdata.member.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.formdata.member.MemberMapper;
import org.fh.service.formdata.member.MemberService;

/** 
 * 说明： 决策机构成员接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-11-04
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class MemberServiceImpl implements MemberService{

	@Autowired
	private MemberMapper memberMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		memberMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		memberMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		memberMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return memberMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return memberMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return memberMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		memberMapper.deleteAll(ArrayDATA_IDS);
	}

	@Override
	public int batchSave(List<PageData> list) {
		return memberMapper.batchSave(list);
	}

	@Override
	public List<PageData> findByPolicymakingId(PageData pd) {
		return memberMapper.findByPolicymakingId(pd);
	}

	@Override
	public int deleteByPolicymakingId(PageData pd) {
		return memberMapper.deleteByPolicymakingId(pd);
	}

}

