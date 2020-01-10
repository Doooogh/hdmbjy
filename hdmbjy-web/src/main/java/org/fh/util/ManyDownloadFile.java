package org.fh.util;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.fh.entity.PageData;

public class ManyDownloadFile {
	
	
	public static void main(String[] args) {
		try {
			List<String> filePaths = new ArrayList<String>();
			String aa = "E:\\hdmbjy\\123.xls";
			String bb = "E:\\hdmbjy\\file\\rotaryImg\\4d63cadd44aa476c99ff397387f66e72.jpg";
			String cc = "D:\\hdmbjy\\file\\wordpath\\270508ec65274b309bba8929d350bec8.doc";
			filePaths.add(aa.replace("\\\\", "/"));
			filePaths.add(bb.replace("\\\\", "/"));
			filePaths.add(cc.replace("\\\\", "/"));
			zipFileAll(Const.ZIP_PATH, "qwe.zip", filePaths);
			//toZip(filePaths, Const.ZIP_PATH+"qwe.zip");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

    /**
     * -普通java文件下载方法，适用于所有框架 
     * -注意：
     *     1.  response.setContentType设置下载内容类型，常用下载类型：
     *         application/octet-stream（二进制流，未知文件类型）；
     *         application/vnd.ms-excel（excel）；
     *         text/plain（纯文本）； text/xml（xml）；text/html（html）；image/gif（GIF）；image/jpeg（JPG）等
     *         如果不写，则匹配所有；
     *     2.  response.setHeader("Content-Disposition","attachment; filename="+fileName +".zip"); 设置下载文件名；
     *         文件名可能会出现乱码，解决名称乱码：fileName  = new String(fileName.getBytes(), "iso8859-1");
     */ 
	public static String downloadFilesTest(HttpServletRequest request,HttpServletResponse res,String zipBasePath, String zipName, List<String> filePaths) throws IOException {
	    try{
		    //获取文件名称（包括文件格式）  
		    String fileName = "20191017101243421d87-3.jpg";  
	
		    res.setCharacterEncoding("UTF-8"); //设置编码字符
		    res.setContentType("application/octet-stream;charset=UTF-8"); //设置下载内容类型
		    res.setHeader("Content-disposition", "attachment;filename="+fileName);//设置下载的文件名称  
		    OutputStream out = res.getOutputStream();   //创建页面返回方式为输出流，会自动弹出下载框   
	
		    mkdirsmy(zipBasePath, zipName);
		    String zipFilePath = zipBasePath+File.separator+zipName;  
		    //压缩文件
		    File zip = new File(zipFilePath);  
		    if (!zip.exists()){     
		        zip.createNewFile();     
		    }
		    //创建zip文件输出流  
		    ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(zip));
		    zipFile(zipBasePath,zipName, zipFilePath,filePaths,zos);
		    zos.close();
		    res.setHeader("Content-disposition", "attachment;filename="+zipName);//设置下载的压缩文件名称
		    //将打包后的文件写到客户端，输出的方法同上，使用缓冲流输出  
		    BufferedInputStream bis = new BufferedInputStream(new FileInputStream(zipFilePath));  
		    byte[] buff = new byte[bis.available()];  
		    bis.read(buff);
		    bis.close();
			out.write(buff);//输出数据文件
			out.flush();//释放缓存
			out.close();//关闭输出流
	    }catch(Exception e) {
			e.printStackTrace();
			res.reset();
			res.setCharacterEncoding("UTF-8");
			res.setContentType("text/html;charset=UTF-8"); 
			res.getWriter().print("<div align=\"center\" style=\"font-size: 30px;font-family: serif;color: red;\">系统内部错误，下载未成功，请联系管理员！</div>"
					+ "<div>错误信息："+e.getMessage()+"</div>");
			res.getWriter().flush();
			res.getWriter().close();
		}
		return null;
	}
	
	/**
	 * pd 属性 
	 * @param request
	 * @param res
	 * @param zipBasePath
	 * @param zipName
	 * @param filePaths
	 * @return
	 * @throws IOException
	 */
	public static String downloadFilesPd(HttpServletRequest request,HttpServletResponse res,String zipBasePath, String zipName, List<PageData> filePaths) throws IOException {
	    try{
		    //获取文件名称（包括文件格式）  
		    res.setCharacterEncoding("UTF-8"); //设置编码字符
		    res.setContentType("application/octet-stream;charset=UTF-8"); //设置下载内容类型
		    res.setHeader("Content-disposition", "attachment;filename="+zipName);//设置下载的文件名称  
		    OutputStream out = res.getOutputStream();   //创建页面返回方式为输出流，会自动弹出下载框   
	
		    mkdirsmy(zipBasePath, zipName);
		    String zipFilePath = zipBasePath+File.separator+zipName;  
		    //压缩文件
		    File zip = new File(zipFilePath);  
		    if (!zip.exists()){     
		        zip.createNewFile();     
		    }
		    //创建zip文件输出流  
		    ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(zip));
		    zipFilePd(zipBasePath,zipName, zipFilePath,filePaths,zos);
		    zos.close();
		    res.setHeader("Content-disposition", "attachment;filename="+zipName);//设置下载的压缩文件名称
		    //将打包后的文件写到客户端，输出的方法同上，使用缓冲流输出  
		    BufferedInputStream bis = new BufferedInputStream(new FileInputStream(zipFilePath));  
		    byte[] buff = new byte[bis.available()];  
		    bis.read(buff);
		    bis.close();
			out.write(buff);//输出数据文件
			out.flush();//释放缓存
			out.close();//关闭输出流
	    }catch(Exception e) {
			e.printStackTrace();
			res.reset();
			res.setCharacterEncoding("UTF-8");
			res.setContentType("text/html;charset=UTF-8"); 
			res.getWriter().print("<div align=\"center\" style=\"font-size: 30px;font-family: serif;color: red;\">系统内部错误，下载未成功，请联系管理员！</div>"
					+ "<div>错误信息："+e.getMessage()+"</div>");
			res.getWriter().flush();
			res.getWriter().close();
		}
		return null;
	}
	
	
	/**
	 * 压缩文件
	 * @param zipBasePath 临时压缩文件基础路径
	 * @param zipName 临时压缩文件名称
	 * @param zipFilePath 临时压缩文件完整路径
	 * @param filePaths 需要压缩的文件路径集合
	 * @throws IOException
	 */
	private static String zipFile(String zipBasePath, String zipName, String zipFilePath, List<String> filePaths,ZipOutputStream zos) throws IOException {

	    //循环读取文件路径集合，获取每一个文件的路径  
	    for(String filePath : filePaths){  
	        File inputFile = new File(filePath);  //根据文件路径创建文件  
	        if(inputFile.exists()) { //判断文件是否存在  
                if (inputFile.isFile()) {  //判断是否属于文件，还是文件夹  
                    //创建输入流读取文件  
                    BufferedInputStream bis = new BufferedInputStream(new FileInputStream(inputFile));  

                    //将文件写入zip内，即将文件进行打包  
                    zos.putNextEntry(new ZipEntry(inputFile.getName()));  

                    //写入文件的方法，同上                  
                    int size = 0;  
                    byte[] buffer = new byte[1024];  //设置读取数据缓存大小
                    while ((size = bis.read(buffer)) > 0) {  
                    	zos.write(buffer, 0, size);  
                    }
					File newfile=new File(inputFile.getParent()+File.separator+"");//创建新名字的抽象文件
                    //关闭输入输出流  
                    zos.closeEntry();  
                    bis.close(); 
                    
                } else {  //如果是文件夹，则使用穷举的方法获取文件，写入zip  
                    try {  
                        File[] files = inputFile.listFiles();  
                        List<String> filePathsTem = new ArrayList<String>();  
                        for (File fileTem:files) {  
                        	filePathsTem.add(fileTem.toString());
                        }  
                        return zipFile(zipBasePath, zipName, zipFilePath, filePathsTem,zos);
                    } catch (Exception e) {  
                        e.printStackTrace();  
                    }  
                }  
            }  
	    }  
	    return null;
	}

	/**
	 * 压缩文件
	 * @param zipBasePath 临时压缩文件基础路径
	 * @param zipName 临时压缩文件名称
	 * @param zipFilePath 临时压缩文件完整路径
	 * @param filePaths 需要压缩的文件路径集合
	 * @throws IOException
	 */
	private static String zipFile2(String zipBasePath, String zipName, String zipFilePath, List<PageData> filePaths,ZipOutputStream zos) throws IOException {


		//循环读取文件路径集合，获取每一个文件的路径
		for(PageData file : filePaths){
			File inputFile = new File(file.getString("URL"));  //根据文件路径创建文件
			if(inputFile.exists()) { //判断文件是否存在
				if (inputFile.isFile()) {  //判断是否属于文件，还是文件夹
					//创建输入流读取文件
					BufferedInputStream bis = new BufferedInputStream(new FileInputStream(inputFile));

					//将文件写入zip内，即将文件进行打包
					zos.putNextEntry(new ZipEntry(file.getString("ORIGINAL_NAME")));

					//写入文件的方法，同上
					int size = 0;
					byte[] buffer = new byte[1024];  //设置读取数据缓存大小
					while ((size = bis.read(buffer)) > 0) {
						zos.write(buffer, 0, size);
					}
					/*File newfile=new File(inputFile.getParent()+File.separator+file.getString("ORIGINAL_NAME"));//创建新名字的抽象文件
					inputFile.renameTo(newfile);*/
					//关闭输入输出流
					zos.closeEntry();
					bis.close();

				} else {  //如果是文件夹，则使用穷举的方法获取文件，写入zip
					try {
						File[] files = inputFile.listFiles();
						List<String> filePathsTem = new ArrayList<String>();
						for (File fileTem:files) {
							filePathsTem.add(fileTem.toString());
						}
						return zipFile(zipBasePath, zipName, zipFilePath, filePathsTem,zos);
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}
		}
		return null;
	}


	private static String zipFilePd(String zipBasePath, String zipName, String zipFilePath, List<PageData> filePaths,ZipOutputStream zos) throws IOException {

	    //循环读取文件路径集合，获取每一个文件的路径  
	    for(PageData filePath : filePaths){  
	        File inputFile = new File(filePath.getString("path"));  //根据文件路径创建文件  
	        if(inputFile.exists()) { //判断文件是否存在  
                if (inputFile.isFile()) {  //判断是否属于文件，还是文件夹  
                    //创建输入流读取文件  
                    BufferedInputStream bis = new BufferedInputStream(new FileInputStream(inputFile));  

                    //将文件写入zip内，即将文件进行打包  
                    zos.putNextEntry(new ZipEntry(filePath.getString("name")));  

                    //写入文件的方法，同上                  
                    int size = 0;  
                    byte[] buffer = new byte[1024];  //设置读取数据缓存大小
                    while ((size = bis.read(buffer)) > 0) {  
                    	zos.write(buffer, 0, size);  
                    }  
                    //关闭输入输出流  
                    zos.closeEntry();  
                    bis.close(); 
                    
                } else {  //如果是文件夹，则使用穷举的方法获取文件，写入zip  
                    try {  
                        File[] files = inputFile.listFiles();  
                        List<String> filePathsTem = new ArrayList<String>();  
                        for (File fileTem:files) {  
                        	filePathsTem.add(fileTem.toString());
                        }  
                        return zipFile(zipBasePath, zipName, zipFilePath, filePathsTem,zos);
                    } catch (Exception e) {  
                        e.printStackTrace();  
                    }  
                }  
            }  
	    }  
	    return null;
	} 
	
	/**
	 * 打包
	 * @param zipBasePath 存储路径
	 * @param zipName 压缩包名
	 * @param zipFilePath
	 * @param filePaths 压缩集合
	 * @param zos
	 * @return
	 * @throws IOException
	 */
	public static String zipFileAll(String zipBasePath, String zipName,List<String> filePaths) throws IOException {
		mkdirsmy(zipBasePath, zipName);
		String zipFilePath = zipBasePath+File.separator+zipName;
		File zip = new File(zipFilePath);  
	    if (!zip.exists()){     
	        zip.createNewFile();     
	    }
		ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(zip));
		//循环读取文件路径集合，获取每一个文件的路径  
		for(String filePath : filePaths){  
			File inputFile = new File(filePath);  //根据文件路径创建文件  
			if(inputFile.exists()) { //判断文件是否存在  
				if (inputFile.isFile()) {  //判断是否属于文件，还是文件夹  
					//创建输入流读取文件  
					BufferedInputStream bis = new BufferedInputStream(new FileInputStream(inputFile));  
					//将文件写入zip内，即将文件进行打包  
					zos.putNextEntry(new ZipEntry(inputFile.getName()));  
					
					//写入文件的方法，同上                  
					int size = 0;  
					byte[] buffer = new byte[1024];  //设置读取数据缓存大小
					while ((size = bis.read(buffer)) > 0) {  
						zos.write(buffer, 0, size);  
					}  
					//关闭输入输出流  
					bis.close(); 
				} else {  //如果是文件夹，则使用穷举的方法获取文件，写入zip  
					try {  
						File[] files = inputFile.listFiles();  
						List<String> filePathsTem = new ArrayList<String>();  
						for (File fileTem:files) {  
							filePathsTem.add(fileTem.toString());
						}  
						return zipFile(zipBasePath, zipName, zipFilePath, filePathsTem,zos);
					} catch (Exception e) {  
						e.printStackTrace();  
					}  
				}  
			}  
			
		}  
		
		
		zos.closeEntry();  
		return null;
	} 
	
	/**
	 * 判断文件是否存在
	 * @param dir
	 * @param realName
	 * @return
	 * @throws IOException
	 */
	public static File mkdirsmy(String dir, String realName) throws IOException{
		File file = new File(dir, realName);
		if (!file.exists()) {
			if (!file.getParentFile().exists()) {
				file.getParentFile().mkdirs();
			}
			file.createNewFile();
		}
		return file;
	}
	
	
	
	public static String downloadAll(HttpServletRequest request,HttpServletResponse res,String zipBasePath, String zipName, List<String> filePaths) throws IOException {
	    try{
		    //获取文件名称（包括文件格式）  
		    String fileName = "20191017101243421d87-3.jpg";  
	
		    res.setCharacterEncoding("UTF-8"); //设置编码字符
		    res.setContentType("application/octet-stream;charset=UTF-8"); //设置下载内容类型
		    res.setHeader("Content-disposition", "attachment;filename="+fileName);//设置下载的文件名称  
		    //OutputStream out = res.getOutputStream();   //创建页面返回方式为输出流，会自动弹出下载框   
	
		    mkdirsmy(zipBasePath, zipName);
		    String zipFilePath = zipBasePath+File.separator+zipName;  
		    //压缩文件
		    File zip = new File(zipFilePath);  
		    if (!zip.exists()){     
		        zip.createNewFile();     
		    }
		    //创建zip文件输出流  
		    ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(zip));
		    zipFile(zipBasePath,zipName, zipFilePath,filePaths,zos);
		    zos.close();
		    res.setHeader("Content-disposition", "attachment;filename="+zipName);//设置下载的压缩文件名称
		    //将打包后的文件写到客户端，输出的方法同上，使用缓冲流输出  
		    //BufferedInputStream bis = new BufferedInputStream(new FileInputStream(zipFilePath));  
		    //byte[] buff = new byte[bis.available()];  
		    //bis.read(buff);
		    //bis.close();
			//out.write(buff);//输出数据文件
			//out.flush();//释放缓存
			//out.close();//关闭输出流
	    }catch(Exception e) {
			e.printStackTrace();
			/*
			 * res.reset(); res.setCharacterEncoding("UTF-8");
			 * res.setContentType("text/html;charset=UTF-8"); res.getWriter().
			 * print("<div align=\"center\" style=\"font-size: 30px;font-family: serif;color: red;\">系统内部错误，下载未成功，请联系管理员！</div>"
			 * + "<div>错误信息："+e.getMessage()+"</div>"); res.getWriter().flush();
			 * res.getWriter().close();
			 */
		}
		return null;
	}

	public static String downloadAll2(HttpServletRequest request,HttpServletResponse res,String zipBasePath, String zipName, List<PageData> filePaths) throws IOException {
		try{
			//获取文件名称（包括文件格式）
			String fileName = "20191017101243421d87-3.jpg";

			res.setCharacterEncoding("UTF-8"); //设置编码字符
			res.setContentType("application/octet-stream;charset=UTF-8"); //设置下载内容类型
			res.setHeader("Content-disposition", "attachment;filename="+fileName);//设置下载的文件名称
			//OutputStream out = res.getOutputStream();   //创建页面返回方式为输出流，会自动弹出下载框

			mkdirsmy(zipBasePath, zipName);
			String zipFilePath = zipBasePath+File.separator+zipName;
			//压缩文件
			File zip = new File(zipFilePath);
			if (!zip.exists()){
				zip.createNewFile();
			}
			//创建zip文件输出流
			ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(zip));
			zipFile2(zipBasePath,zipName, zipFilePath,filePaths,zos);
			zos.close();
			res.setHeader("Content-disposition", "attachment;filename="+zipName);//设置下载的压缩文件名称
			//将打包后的文件写到客户端，输出的方法同上，使用缓冲流输出
			//BufferedInputStream bis = new BufferedInputStream(new FileInputStream(zipFilePath));
			//byte[] buff = new byte[bis.available()];
			//bis.read(buff);
			//bis.close();
			//out.write(buff);//输出数据文件
			//out.flush();//释放缓存
			//out.close();//关闭输出流
		}catch(Exception e) {
			e.printStackTrace();
			/*
			 * res.reset(); res.setCharacterEncoding("UTF-8");
			 * res.setContentType("text/html;charset=UTF-8"); res.getWriter().
			 * print("<div align=\"center\" style=\"font-size: 30px;font-family: serif;color: red;\">系统内部错误，下载未成功，请联系管理员！</div>"
			 * + "<div>错误信息："+e.getMessage()+"</div>"); res.getWriter().flush();
			 * res.getWriter().close();
			 */
		}
		return null;
	}










}
