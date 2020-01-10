package org.fh.service.booking.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.booking.BookingMapper;
import org.fh.service.booking.BookingService;

/** 
 * 说明： 预约接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-08-30
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class BookingServiceImpl implements BookingService{

	@Autowired
	private BookingMapper bookingMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		bookingMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		bookingMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		bookingMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return bookingMapper.data2listPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return bookingMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return bookingMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		bookingMapper.deleteAll(ArrayDATA_IDS);
	}

	@Override
	public Map<String,Object> offlineSuccss(PageData pageData) {
		Map<String,Object> map=new HashMap<>();
		synchronized(this){
			PageData booking=bookingMapper.findById(pageData);
//			int alreadyNum=(int)booking.get("ALREADY_NUM");
			int remainNum=(int)booking.get("REMAIN_NUM");
			if(remainNum>0){
				/*booking.put("ALREADY_NUM",String.valueOf(alreadyNum+1));
				booking.put("REMAIN_NUM",String.valueOf(remainNum-1));*/
				try{
					booking.put("TYPE","+");
					bookingMapper.edit(booking);
					map.put("result","SUCCESS");
				}catch (Exception e){
					e.printStackTrace();
				}
			}else{
				map.put("result","NO_REAMIN"); //如果剩余量小于等于0 就返回没有余量
			}
		}
		return map;
	}

	@Override
	public  Map<String,Object> offlineFailure(PageData pageData) {
		Map<String,Object> map=new HashMap<>();
		synchronized(this){
			PageData booking=bookingMapper.findById(pageData);
		/*	int alreadyNum=(int)booking.get("ALREADY_NUM");
			int remainNum=(int)booking.get("REMAIN_NUM");
			booking.put("ALREADY_NUM",String.valueOf(alreadyNum-1));
			booking.put("REMAIN_NUM",String.valueOf(remainNum+1));*/
			booking.put("TYPE","-");
			bookingMapper.edit(booking);
		}
		return map;
	}

}

