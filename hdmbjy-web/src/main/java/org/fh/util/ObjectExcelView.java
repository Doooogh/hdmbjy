package org.fh.util;

import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.fh.entity.PageData;
import org.springframework.web.servlet.view.document.AbstractXlsView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.*;

/**
 * 说明：导出到EXCEL
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
public class ObjectExcelView extends AbstractXlsView{
	
	@Override
	protected void buildExcelDocument(Map<String, Object> model,
			Workbook workbook, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		// TODO Auto-generated method stub
		Date date = new Date();
		String filename = DateUtil.date2Str(date, "yyyyMMddHHmmss");
		HSSFSheet sheet;
		response.setContentType("application/octet-stream");
		response.setHeader("Content-Disposition", "attachment;filename="+filename+".xls");
		
		HSSFWorkbook book = (HSSFWorkbook) workbook;
		sheet = book.createSheet("sheet1");
		
		List<String> titles = (List<String>) model.get("titles");
		int len = titles.size();
		HSSFCellStyle headerStyle = book.createCellStyle(); //标题样式
		headerStyle.setAlignment(HorizontalAlignment.CENTER);
		headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
		HSSFFont headerFont = book.createFont();			//标题字体
		headerFont.setBold(true);
		headerFont.setFontHeightInPoints((short)11);
		headerStyle.setFont(headerFont);
		short height=25*20;
		HSSFRow row = sheet.createRow(0);
		for(int i=0; i<len; i++){ //设置标题
			String title = titles.get(i);
			row.setRowStyle(headerStyle);
			row.createCell(i).setCellValue(title);  
		}
		sheet.getRow(0).setHeight(height);
		
		HSSFCellStyle contentStyle = book.createCellStyle(); //内容样式
		contentStyle.setAlignment(HorizontalAlignment.CENTER);
		List<PageData> varList = (List<PageData>) model.get("varList");
		int varCount = varList.size();
		for(int i=0; i<varCount; i++){
			PageData vpd = varList.get(i);
			HSSFRow rows = sheet.createRow(i+1); 
			for(int j=0;j<len;j++){
				String varstr = vpd.getString("var"+(j+1)) != null ? vpd.getString("var"+(j+1)) : "";
				rows.setRowStyle(contentStyle);
				rows.createCell(j).setCellValue(varstr);
			}
			
		}
		
	}


	public static Map exportExcelToLocal(List<String> titles, List<Map> values, String path){
		Map<String,Object> res=new HashMap();
		String result="success";
		File file=new File(path);
		if(file.exists()){
			file.delete();
		}
		//第一步，创建一个workbook对应一个excel文件
		HSSFWorkbook workbook = new HSSFWorkbook();
		//第二部，在workbook中创建一个sheet对应excel中的sheet
		HSSFSheet sheet = workbook.createSheet("机构系统用户说明");
		//第三部，在sheet表中添加表头第0行，老版本的poi对sheet的行列有限制
		HSSFRow row = sheet.createRow(0);
		//第四步，创建单元格，设置表头
		HSSFCell cell=null;
		//第五步，写入实体数据，实际应用中这些数据从数据库得到,对象封装数据，集合包对象。对象的属性值对应表的每行的值
		for (int i = 0; i < titles.size(); i++) {
			cell = row.createCell(i);
			cell.setCellValue(titles.get(i));
		}
		for (int i = 0; i < values.size(); i++) {
			Map<String,Object> value = values.get(i);
			HSSFRow row1 = sheet.createRow(i + 1);
			for (int i1 = 0; i1 < titles.size(); i1++) {
				row1.createCell(i1).setCellValue((String)value.get(titles.get(i1)));
			}

		}

		//将文件保存到指定的位置
		try {
			file.createNewFile();
			workbook.write(file);
			System.out.println("写入成功");
			workbook.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		res.put("result",result);
		return res;
	}


	public static void main(String[] args) {
		List<String> titles=new ArrayList<>();
		titles.add("序号");
		titles.add("姓名");
		titles.add("密码");
		List<Map> values=new ArrayList<>();
		for (int i = 0; i <10 ; i++) {
			Map<String,Object> value=new HashMap<>();
			value.put("序号",String.valueOf(i+1));
			value.put("姓名","test"+i);
			value.put("密码","password"+i);
			values.add(value);
		}
		Map map = exportExcelToLocal(titles, values, "C:\\Users\\Public\\user.xls");
		System.out.println(map);
	}
}
