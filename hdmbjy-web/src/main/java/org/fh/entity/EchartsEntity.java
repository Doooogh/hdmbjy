package org.fh.entity;

import java.util.List;

public class EchartsEntity {
	
	private String [] color;
	
	private PageData tooltip;
	//工具栏
	private PageData toolbox;
	//头部菜单
	private PageData legend;
	//x轴数据
	private PageData xAxis;
	//y轴数据
	private List<PageData> yAxis;
	//图形数据
	private List<PageData> series;
	
	public PageData getTooltip() {
		return tooltip;
	}
	public void setTooltip(PageData tooltip) {
		this.tooltip = tooltip;
	}
	
	public PageData getLegend() {
		return legend;
	}
	public void setLegend(PageData legend) {
		this.legend = legend;
	}
	public PageData getxAxis() {
		return xAxis;
	}
	public void setxAxis(PageData xAxis) {
		this.xAxis = xAxis;
	}
	
	public List<PageData> getSeries() {
		return series;
	}
	public void setSeries(List<PageData> series) {
		this.series = series;
	}
	public List<PageData> getyAxis() {
		return yAxis;
	}
	public void setyAxis(List<PageData> yAxis) {
		this.yAxis = yAxis;
	}
	public String[] getColor() {
		return color;
	}
	public void setColor(String[] color) {
		this.color = color;
	}
	public PageData getToolbox() {
		return toolbox;
	}
	public void setToolbox(PageData toolbox) {
		this.toolbox = toolbox;
	}
	
}
