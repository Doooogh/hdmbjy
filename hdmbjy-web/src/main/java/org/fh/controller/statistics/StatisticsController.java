package org.fh.controller.statistics;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.fh.controller.base.BaseController;
import org.fh.entity.PageData;
import org.fh.entity.system.Dictionaries;
import org.fh.entity.system.User;
import org.fh.service.organization.OrganizationService;
import org.fh.service.scuser.ScuserService;
import org.fh.service.system.DictionariesService;
import org.fh.util.Const;
import org.fh.util.Jurisdiction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/** 
 * 说明：数据统计
 * 作者：FH Admin QQ313596790
 * 时间：2019-09-27
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/statistics")
public class StatisticsController extends BaseController {
	
	/**
	 * 民办机构管理
	 */
	@Autowired
	private OrganizationService organizationService;
	/**
	 * 数据字典
	 */
	@Autowired
	private DictionariesService dictionariesService;
	/**
	 * 人员管理
	 */
	@Autowired
	private ScuserService scuserService;
	
	
		
	/**机构类型数据统计（如：幼儿园等）
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/schoolList")
	@ResponseBody
	public Object list() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		List<Dictionaries> dictionaries = dictionariesService.listSubDictByParentNameEn("ORGANIZATION_TYPE");
		String [] xAxis = new String[dictionaries.size()];
		String [] serie = new String[dictionaries.size()];
		for (int i = 0; i < dictionaries.size(); i++) {
			xAxis[i] = dictionaries.get(i).getNAME();
			long count = organizationService.findCountType(dictionaries.get(i).getBIANMA());
			serie[i] = String.valueOf(count);
		}
		List <PageData> seriesList = new ArrayList<PageData>();
		PageData series = new PageData();
		
		series.put("type", "bar");
		series.put("barWidth", 20);
		series.put("data", serie);
		seriesList.add(series);
		
		List<Dictionaries> pieDictionaries = dictionariesService.listSubDictByParentNameEn("DISTRICT");
		String [] pieXAxis = new String[pieDictionaries.size()];
		List<PageData> pieseries = new ArrayList<PageData>(); 
		for (int i = 0; i < pieDictionaries.size(); i++) {
			pieXAxis[i] = pieDictionaries.get(i).getNAME();
			PageData pd = new PageData();
			long count = organizationService.findByTypeXQ(pieDictionaries.get(i).getDICTIONARIES_ID());
			pd.put("value", count);
			pd.put("name", pieDictionaries.get(i).getNAME());
			pieseries.add(pd);
		}
		map.put("result", errInfo);
		map.put("legendArr", null);
		map.put("xAxisArr", xAxis);
		map.put("seriesArr", series);
		
		map.put("piexAxis", pieXAxis);
		map.put("pieseriesArr", pieseries);
		
		
		return map;
	}
	
	/**
	 * 学历统计
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/xlList")
	@ResponseBody
	public Object xlList() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		
		List<Dictionaries> liste = dictionariesService.listSubDictByParentNameEn("EDUCATION_TYPE");
		String[] xAxis = new String[liste.size()]; 
		String[] yAxis1 = new String[liste.size()]; 
		String[] yAxis2 = new String[liste.size()]; 
		
		for (int i = 0; i < liste.size(); i++) {
			xAxis[i] = liste.get(i).getNAME();
			PageData pd = new PageData();
			pd =this.getPageData();
			pd.put("TYPE", "1");
			pd.put("EDUCATION", liste.get(i).getBIANMA());

			if(!Const.ADMIN_USERNAME.contains(Jurisdiction.getUsername())){
				User user=Jurisdiction.getUser();
				if(null!=user){
					PageData findScuser=new PageData();
					findScuser.put("SCUSER_ID",user.getUSER_ID());
					PageData organization = scuserService.findOrganizationByScuser(findScuser);
					pd.put("ORGANIZATION_ID",organization.get("ORGANIZATION_ID"));
				}
			}
			long count = scuserService.findByEducation(pd);
			yAxis1[i] =String.valueOf(count);
			
			PageData pd2 = new PageData();
			pd2 =this.getPageData();
			if(!Const.ADMIN_USERNAME.contains(Jurisdiction.getUsername())){
				User user=Jurisdiction.getUser();
				if(null!=user){
					PageData findScuser=new PageData();
					findScuser.put("SCUSER_ID",user.getUSER_ID());
					PageData organization = scuserService.findOrganizationByScuser(findScuser);
					pd2.put("ORGANIZATION_ID",organization.get("ORGANIZATION_ID"));
				}
			}
			
			pd2.put("TYPE", "2");
			pd2.put("EDUCATION", liste.get(i).getBIANMA());
			long count2 = scuserService.findByEducation(pd2);
			yAxis2[i] =String.valueOf(count2);
		}
		map.put("xAxis", xAxis);
		map.put("yAxis1", yAxis1);
		map.put("yAxis2", yAxis2);
		map.put("result", errInfo);
		return map;
	}

	
}










