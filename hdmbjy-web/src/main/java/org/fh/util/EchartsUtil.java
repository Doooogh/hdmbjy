package org.fh.util;

import java.util.ArrayList;
import java.util.List;

import org.fh.entity.EchartsEntity;
import org.fh.entity.PageData;


public class EchartsUtil {
	
	/**
	 * 
	 * @param seriesData 图形数据 类型 List<String []>
	 * @param xData x轴数据
	 * @param legendData legend 数据
	 * @return
	 */
	public static EchartsEntity echartsList(List<String []> seriesData,String [] xData,String [] legendData){
		EchartsEntity ee = new EchartsEntity();
		String [] color = {"#ff7f50", "#87cefa", "#da70d6", "#32cd32", "#6495ed","#ff69b4", "#ba55d3", "#cd5c5c", "#ffa500", "#40e0d0", "#1e90ff", "#ff6347", "#7b68ee", "#00fa9a", "#ffd700","#6b8e23", "#ff00ff", "#3cb371", "#b8860b", "#30e0e0"};
		ee.setColor(color);
		//点击显示
		PageData tooltip = new PageData();
		tooltip.put("trigger", "axis");
		List<PageData> tooltiplist = new ArrayList<PageData>();
		PageData tooltiplistpageData = new PageData();
		tooltiplistpageData.put("type","cross");
		tooltiplist.add(tooltiplistpageData);
		tooltip.put("axisPointer",tooltiplist);
		ee.setTooltip(tooltip);
		//工具栏
		
		List<PageData> toolbox = new ArrayList<PageData>(); 
		
		PageData toolboxlist = new PageData();
		PageData toolboxlistpageData = new PageData();
		
		//List<PageData> dataViewList = new ArrayList<PageData>(); 
		PageData dataView = new PageData(); 
		dataView.put("show", true); 
		dataView.put("readOnly", false);
		//dataViewList.add(dataView); 
		toolboxlistpageData.put("dataView",dataView);
		
		
		//List<PageData> magicTypeList = new ArrayList<PageData>();
		PageData magicType = new PageData(); 
		magicType.put("show", true); 
		String [] type = new String[2]; 
		type[0] ="line"; 
		type[1] ="bar";
		magicType.put("type",type); 
		//magicTypeList.add(magicType);
		toolboxlistpageData.put("magicType", magicType); 
		
		
		PageData restore = new PageData(); 
		restore.put("show", true); 
		toolboxlistpageData.put("restore",restore); 
		PageData saveAsImage = new PageData(); 
		saveAsImage.put("show",true); 
		toolboxlistpageData.put("saveAsImage", saveAsImage);
		toolboxlist.put("feature",toolboxlistpageData); 
		
		//toolbox.add(toolboxlist);
		
		ee.setToolbox(toolboxlist);
		
		//标题
		PageData legend = new PageData();
		legend.put("data", legendData);
		ee.setLegend(legend);
		//x轴数据
		PageData xAxis = new PageData();
		xAxis.put("type", "category");
		xAxis.put("interval", 0);
		xAxis.put("data", xData);
		//PageData axisPointer = new PageData();
		//axisPointer.put(type, "shadow");
		//xAxis.put("axisPointer", axisPointer);
		
		//y轴数据
		ee.setxAxis(xAxis);
		List <PageData> yAxisList = new ArrayList<PageData>();
		PageData yAxis = new PageData();
		yAxis.put("type", "value");
		yAxis.put("name", "数量");
		yAxisList.add(yAxis);
		ee.setyAxis(yAxisList);
		//图表数据
		List <PageData> seriesList = new ArrayList<PageData>();
		
		for (int i = 0; i < seriesData.size(); i++) {
			String[] val = seriesData.get(i);
			PageData series = new PageData();
			series.put("name", legendData[i]);
			series.put("type", "bar");
			series.put("data", val);
			seriesList.add(series);
		}
		ee.setSeries(seriesList);
		return ee;
	}

}
