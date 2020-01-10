package org.fh.entity;

import java.io.Serializable;

import org.apache.shiro.session.Session;
import org.fh.entity.PageData;
import org.fh.util.Const;
import org.fh.util.Jurisdiction;

/**
 * 说明：分页类
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
public class Page implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	private int showCount; 				//每页显示记录数
	private int totalPage;				//总页数
	private int totalResult;			//总记录数
	private int currentPage;			//当前页
	private int currentResult;			//当前记录起始索引
	private boolean entityOrField;		//true:需要分页的地方，传入的参数就是Page实体；false:需要分页的地方，传入的参数所代表的实体拥有Page属性
	private String pageStr;				//最终页面显示的底部翻页导航，详细见：getPageStr();
	private String pageStrSimplify;		//最终页面显示的底部翻页导航，详细见：getPageStrSimplify();
	private String pageStrSimplify2;	//最终页面显示的底部翻页导航，详细见：getPageStrSimplify2();
	private PageData pd = new PageData();
	
	public Page(){
		try {
			Session session = Jurisdiction.getSession();
			this.showCount = null != session.getAttribute(Const.SHOWCOUNT)?Integer.parseInt(session.getAttribute(Const.SHOWCOUNT).toString()):10;
		} catch (Exception e) {
			this.showCount = 10;
		}
	}
	
	public int getTotalPage() {
		if(totalResult%showCount==0)
			totalPage = totalResult/showCount;
		else
			totalPage = totalResult/showCount+1;
		return totalPage;
	}
	
	public void setTotalPage(int totalPage) {
		this.totalPage = totalPage;
	}
	
	public int getTotalResult() {
		return totalResult;
	}
	
	public void setTotalResult(int totalResult) {
		this.totalResult = totalResult;
	}
	
	public int getCurrentPage() {
		if(currentPage<=0)
			currentPage = 1;
		if(currentPage>getTotalPage())
			currentPage = getTotalPage();
		return currentPage;
	}
	
	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}
	
	//拼接分页 页面及JS函数
	public String getPageStr() {
		StringBuffer sb = new StringBuffer();
		if(totalResult>0){
			sb.append("	<ul class=\"pagination pull-right no-margin\">\n");
			if(currentPage==1){
				sb.append("	<li style=\"padding-top:10px;\"><a>共"+totalResult+"条&nbsp;</a></li>\n");
				sb.append("	<li><input type=\"number\" value=\"\" id=\"toGoPage\" style=\"width:36px;padding-top:5px;border-left-width:0px;border-top-width:0px;border-right-width:0px;border-bottom: 1px solid #dbdbdb\" /></li>\n");
				sb.append("	<li style=\"cursor:pointer;padding-top:10px;\"><a onclick=\"vm.toTZ();\" >&nbsp;跳转&nbsp;</a></li>\n");
				sb.append("	<li style=\"padding-top:10px;\"><a>&nbsp;首页 &nbsp;</a></li>\n");
				sb.append("	<li style=\"padding-top:10px;\"><a>&nbsp;上页&nbsp;</a></li>\n");
			}else{
				sb.append("	<li style=\"padding-top:10px;\"><a>&nbsp;共"+totalResult+"条&nbsp;</a></li>\n");
				sb.append("	<li><input type=\"number\" value=\"\" id=\"toGoPage\" style=\"width:36px;padding-top:5px;border-left-width:0px;border-top-width:0px;border-right-width:0px;border-bottom: 1px solid #dbdbdb\" /></li>\n");
				sb.append("	<li style=\"cursor:pointer;padding-top:10px;\"><a onclick=\"vm.toTZ();\" >&nbsp;跳转&nbsp;</a></li>\n");
				sb.append("	<li style=\"cursor:pointer;padding-top:10px;\"><a onclick=\"vm.nextPage(1)\">&nbsp;首页&nbsp;</a></li>\n");
				sb.append("	<li style=\"cursor:pointer;padding-top:10px;\"><a onclick=\"vm.nextPage("+(currentPage-1)+")\">&nbsp;上页&nbsp;</a></li>\n");
			}
			int showTag = 5;//分页标签显示数量
			int startTag = 1;
			if(currentPage>showTag){
				startTag = currentPage-1;
			}
			int endTag = startTag+showTag-1;
			for(int i=startTag; i<=totalPage && i<=endTag; i++){
				if(currentPage==i)
					sb.append("<li style=\"padding-top:10px;\" class=\"active\"><a><font color=\"#3F4D67\">&nbsp;<b>"+i+"</b></font></a></li>\n");
				else
					sb.append("	<li style=\"padding-top:10px;\" style=\"cursor:pointer;\"><a style=\"cursor:pointer;\" onclick=\"vm.nextPage("+i+")\">&nbsp;"+i+"</a></li>\n");
			}
			if(currentPage==totalPage){
				sb.append("	<li style=\"padding-top:10px;\"><a>&nbsp;下页&nbsp;</a></li>\n");
				sb.append("	<li style=\"padding-top:10px;\"><a>&nbsp;尾页&nbsp;</a></li>\n");
			}else{
				sb.append("	<li style=\"cursor:pointer;padding-top:10px;\"><a onclick=\"vm.nextPage("+(currentPage+1)+")\">&nbsp;下页&nbsp;</a></li>\n");
				sb.append("	<li style=\"cursor:pointer;padding-top:10px;\"><a onclick=\"vm.nextPage("+totalPage+")\">&nbsp;尾页&nbsp;</a></li>\n");
			}
			sb.append("	<li style=\"padding-top:10px;\"><a>&nbsp;共"+totalPage+"页&nbsp;</a></li>\n");
			sb.append("	<li style=\"padding-top:10px;\"><select title='显示条数' style=\"cursor:pointer;width:39px;float:left;margin-top:0px;border:none;background-color: rgba(255,255,255,0.6);\" onchange=\"vm.changeCount(this.value)\">\n");
			sb.append("	<option value='"+showCount+"'>"+showCount+"</option>\n");
			if(10 != showCount) {
				sb.append("	<option value='10'>10</option>\n");
			}
			sb.append("	<option value='20'>20</option>\n");
			sb.append("	<option value='30'>30</option>\n");
			sb.append("	<option value='40'>40</option>\n");
			sb.append("	<option value='50'>50</option>\n");
			sb.append("	<option value='60'>60</option>\n");
			sb.append("	<option value='70'>70</option>\n");
			sb.append("	<option value='80'>80</option>\n");
			sb.append("	<option value='90'>90</option>\n");
			sb.append("	<option value='99'>99</option>\n");
			sb.append("	</select>\n");
			sb.append("	</li>\n");
			sb.append("</ul>\n");
		}
		pageStr = sb.toString();
		return pageStr;
	}
	
	public void setPageStr(String pageStr) {
		this.pageStr = pageStr;
	}
	
	//拼接分页 页面及JS函数
	public String getPageStrSimplify() {
		StringBuffer sb = new StringBuffer();
		if(totalResult>0){
			sb.append("	<ul class=\"pagination pull-right no-margin\">\n");
			if(currentPage==1){
				sb.append("	<li><a>共"+totalResult+"条&nbsp;</a></li>\n");
				sb.append("	<li><a>&nbsp;首页 &nbsp;</a></li>\n");
				sb.append("	<li><a>&nbsp;上页&nbsp;</a></li>\n");
			}else{
				sb.append("	<li><a>&nbsp;共"+totalResult+"条&nbsp;</a></li>\n");
				sb.append("	<li style=\"cursor:pointer;\"><a onclick=\"vm.nextPage(1)\">&nbsp;首页&nbsp;</a></li>\n");
				sb.append("	<li style=\"cursor:pointer;\"><a onclick=\"vm.nextPage("+(currentPage-1)+")\">&nbsp;上页&nbsp;</a></li>\n");
			}
			int showTag = 2;//分页标签显示数量
			int startTag = 1;
			if(currentPage>showTag){
				startTag = currentPage-1;
			}
			int endTag = startTag+showTag-1;
			for(int i=startTag; i<=totalPage && i<=endTag; i++){
				if(currentPage==i)
					sb.append("<li class=\"active\"><a><font color=\"#3F4D67\">&nbsp;<b>"+i+"</b></font></a></li>\n");
				else
					sb.append("	<li style=\"cursor:pointer;\"><a style=\"cursor:pointer;\" onclick=\"vm.nextPage("+i+")\">&nbsp;"+i+"</a></li>\n");
			}
			if(currentPage==totalPage){
				sb.append("	<li><a>&nbsp;下页&nbsp;</a></li>\n");
				sb.append("	<li><a>&nbsp;尾页&nbsp;</a></li>\n");
			}else{
				sb.append("	<li style=\"cursor:pointer;\"><a onclick=\"vm.nextPage("+(currentPage+1)+")\">&nbsp;下页&nbsp;</a></li>\n");
				sb.append("	<li style=\"cursor:pointer;\"><a onclick=\"vm.nextPage("+totalPage+")\">&nbsp;尾页&nbsp;</a></li>\n");
			}
			sb.append("	<li><a>&nbsp;共"+totalPage+"页&nbsp;</a></li>\n");
			sb.append("</ul>\n");
		}
		pageStrSimplify = sb.toString();
		return pageStrSimplify;
	}
	
	public void setPageStrSimplify(String pageStrSimplify) {
		this.pageStrSimplify = pageStrSimplify;
	}
	
	//拼接分页 页面及JS函数
	public String getPageStrSimplify2() {
		StringBuffer sb = new StringBuffer();
		if(totalResult>0){
			sb.append("	<ul class=\"pagination pull-right no-margin\">\n");
			if(currentPage==1){
				sb.append("	<li><a>共"+totalResult+"条&nbsp;</a></li>\n");
				sb.append("	<li><a>&nbsp;首页 &nbsp;</a></li>\n");
				sb.append("	<li><a>&nbsp;上页&nbsp;</a></li>\n");
			}else{
				sb.append("	<li><a>&nbsp;共"+totalResult+"条&nbsp;</a></li>\n");
				sb.append("	<li style=\"cursor:pointer;\"><a onclick=\"nextPage(1)\">&nbsp;首页&nbsp;</a></li>\n");
				sb.append("	<li style=\"cursor:pointer;\"><a onclick=\"nextPage("+(currentPage-1)+")\">&nbsp;上页&nbsp;</a></li>\n");
			}
			int showTag = 2;//分页标签显示数量
			int startTag = 1;
			if(currentPage>showTag){
				startTag = currentPage-1;
			}
			int endTag = startTag+showTag-1;
			for(int i=startTag; i<=totalPage && i<=endTag; i++){
				if(currentPage==i)
					sb.append("<li class=\"active\"><a><font color=\"#3F4D67\">&nbsp;<b>"+i+"</b></font></a></li>\n");
				else
					sb.append("	<li style=\"cursor:pointer;\"><a style=\"cursor:pointer;\" onclick=\"nextPage("+i+")\">&nbsp;"+i+"</a></li>\n");
			}
			if(currentPage==totalPage){
				sb.append("	<li><a>&nbsp;下页&nbsp;</a></li>\n");
				sb.append("	<li><a>&nbsp;尾页&nbsp;</a></li>\n");
			}else{
				sb.append("	<li style=\"cursor:pointer;\"><a onclick=\"nextPage("+(currentPage+1)+")\">&nbsp;下页&nbsp;</a></li>\n");
				sb.append("	<li style=\"cursor:pointer;\"><a onclick=\"nextPage("+totalPage+")\">&nbsp;尾页&nbsp;</a></li>\n");
			}
			sb.append("	<li><a>&nbsp;共"+totalPage+"页&nbsp;</a></li>\n");
			sb.append("</ul>\n");
		}
		pageStrSimplify2 = sb.toString();
		return pageStrSimplify2;
	}
	public void setPageStrSimplify2(String pageStrSimplify2) {
		this.pageStrSimplify2 = pageStrSimplify2;
	}
	
	public int getShowCount() {
		return showCount;
	}
	
	public void setShowCount(int showCount) {
		if(-1 == showCount) {
			try {
				Session session = Jurisdiction.getSession();
				this.showCount = null != session.getAttribute(Const.SHOWCOUNT)?Integer.parseInt(session.getAttribute(Const.SHOWCOUNT).toString()):10;
			} catch (Exception e) {
				this.showCount = 10;
			}
		}else {
			this.showCount = showCount;
		}
	}
	
	public int getCurrentResult() {
		currentResult = (getCurrentPage()-1)*getShowCount();
		if(currentResult<0)
			currentResult = 0;
		return currentResult;
	}
	
	public void setCurrentResult(int currentResult) {
		this.currentResult = currentResult;
	}
	
	public boolean isEntityOrField() {
		return entityOrField;
	}
	
	public void setEntityOrField(boolean entityOrField) {
		this.entityOrField = entityOrField;
	}
	
	public PageData getPd() {
		return pd;
	}

	public void setPd(PageData pd) {
		this.pd = pd;
	}
	
}
