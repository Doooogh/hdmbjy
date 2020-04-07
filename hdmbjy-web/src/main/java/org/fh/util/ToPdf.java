package org.fh.util;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.cert.Certificate;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.fh.entity.PageData;
import org.fh.entity.SignatureInfo;
import org.springframework.web.multipart.MultipartFile;

import com.aspose.words.Document;
import com.aspose.words.SaveFormat;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfSignatureAppearance;
import com.itextpdf.text.pdf.PdfStamper;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.security.BouncyCastleDigest;
import com.itextpdf.text.pdf.security.DigestAlgorithms;
import com.itextpdf.text.pdf.security.ExternalDigest;
import com.itextpdf.text.pdf.security.ExternalSignature;
import com.itextpdf.text.pdf.security.MakeSignature;
import com.itextpdf.text.pdf.security.PrivateKeySignature;

/**
 * 转换成pdf文档
 * @author mlh
 *
 */
public class ToPdf {
	
	private static final char[] PASSWORD="123456".toCharArray();
	
	public static void main(String[] args) {
		 try {
			 PageData pd = new PageData();
			 pd.put("name", "李四");
			 pd.put("process", "行政审批");
			 pd.put("stage", "一");
			 pd.put("state", "通过");
			String filename = writeinWord(Const.APPROVAL_PATH, pd);
			System.out.println(filename);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
	
	/**
	 * 调用存储转换方法
	 * @param file 上传文本
	 * @param filePath 上传存储源文件路径
	 * @param pdfPath 转化pdf存储路径
	 * @param fileName 文件名称 uuid
	 * @return
	 */
	public static Map<String,Object> fileUp(MultipartFile file,String fileName){
		String filePath = Const.WORD_PATH;
		String pdfpath =  Const.PDF_PATH;
		Map<String,Object> map = new HashMap<String,Object>();
		String extName = ""; // 扩展名格式：
		try {
			if (file.getOriginalFilename().lastIndexOf(".") >= 0){
				extName = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
			}
			copyFile(file.getInputStream(), filePath,pdfpath, fileName+extName,fileName,extName).replaceAll("-", "");
		} catch (IOException e) {
			System.out.println(e);
		}
		//原文件路径
		map.put("source", "wordpath/"+fileName+extName);
		//生产pdf路径
		if (extName.equals(".rar") || extName.equals(".zip")||extName.equals(".xls")||extName.equals(".xlsx")) {
			map.put("pdf", null);
		}else if(extName.equals(".pdf")){
			map.put("pdf","wordpath/"+fileName+".pdf");
		}else {
			map.put("pdf", "pdfpath/"+fileName+".pdf");
		}
		
		
		return map;
	}
	
	/**
	 *  直接转换pdf
	 * @param filepdf
	 * @return
	 */
	public static String fileUpPdf(String filepdf){
		String pathPdf = Const.TEM_PDF_PATH;
		String fileName = UuidUtil.get32UUID();
		String extName = ""; // 扩展名格式：
		String name = ""; // 扩展名格式：
		
		try {
			if (filepdf.lastIndexOf(".") >= 0){
				extName = filepdf.substring(filepdf.lastIndexOf("."));
			}
		   name = copyFilePdf(filepdf,fileName,extName,pathPdf).replaceAll("-", "");
		} catch (Exception e) {
			System.out.println(e);
		}
		
		String[] strArr = pathPdf.split("\\/");
		return strArr[strArr.length-1]+"/"+ name;
	}
	
	
	
	
	
	
	
	
	
	/**
	 *  不存储文件 直接转换
	 * @param filepdf
	 * @param fileName
	 * @param extName
	 * @param pathPdf
	 * @return
	 */
	public static String copyFilePdf(String filepdf,String fileName,String extName,String pathPdf){
		
		FileOutputStream os =null;
		try {
			if (".png".equals(extName) || ".gif".equals(extName) || ".png".equals(extName) || ".jpg".equals(extName) || ".jpeg".equals(extName)) {
				List<String> list = new ArrayList<String>();
				list.add(filepdf);
				String name = imgOfPdf(list, fileName,pathPdf);
				Thread.sleep(1000);	
				return name;
			} else if(".docx".equals(extName) || ".doc".equals(extName)){
				File file1 = mkdirsmy(pathPdf,fileName+".pdf");// 新建一个空白pdf文档        
				os = new FileOutputStream(file1);           
				Document doc = new Document(filepdf);
	            doc.save(os, SaveFormat.PDF);
	            Thread.sleep(1000);
	            return fileName+".pdf";
			}else if(".txt".equals(extName)) {
				File file2 = mkdirsmy(pathPdf,fileName+".pdf");// 新建一个空白pdf文档        
				boolean type = text2pdf(filepdf, file2);
				if (type) {
					Thread.sleep(1000);
				}
				return fileName+".pdf";
			}
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			if (os != null) {
				 try {
					os.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			
			
		}
		return null;
		
		
	}
	
	
	
	
	/**
	 *  转换文件并存储
	 * @param in
	 * @param dir 源文件上传路径
	 * @param pdf pdf文件存储路径
	 * @param realName 源文件名称
	 * @param pdfName pdf文件名称
	 * @param extName 上传数据的类型 如 图片.png 等
	 * @return
	 * @throws IOException
	 */
	public static String copyFile(InputStream in, String dir,String pdf, String realName,String pdfName,String extName)
			throws IOException {
		
		
		Thread th = new Thread(new Runnable() {
			@Override
			public void run() {
				try {
					//源文件存储
					File file = mkdirsmy(dir,realName);
					FileUtils.copyInputStreamToFile(in, file);
					in.close();
					//转换pdf并存储
					FileOutputStream os =null;
					try {
						if (".png".equals(extName) || ".gif".equals(extName) || ".png".equals(extName) || ".jpg".equals(extName) || ".jpeg".equals(extName)) {
							List<String> list = new ArrayList<String>();
							list.add(dir+realName);
							imgOfPdf(list, pdfName,pdf);
						} else if(".docx".equals(extName) || ".doc".equals(extName)){
							File file1 = mkdirsmy(pdf,pdfName+".pdf");// 新建一个空白pdf文档        
							os = new FileOutputStream(file1);           
							Document doc = new Document(dir+realName);
							/*
							 * System.out.println(doc.getFontInfos());
							 * 
							 * PdfSaveOptions pdfSaveOptions = new PdfSaveOptions();
							 * pdfSaveOptions.setEmbedFullFonts(true);
							 */
				            doc.save(os, SaveFormat.PDF);
				           // doc.save(os, pdfSaveOptions);
						}else if(".txt".equals(extName)) {
							File file2 = mkdirsmy(pdf,pdfName+".pdf");// 新建一个空白pdf文档        
							text2pdf(dir+realName, file2);
						}
			            
					} catch (Exception e) {
						e.printStackTrace();
					}finally {
						if (os!=null) {
							try {
								os.close();
							} catch (Exception e2) {
								e2.printStackTrace();
							}
						}
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
				
			}
			
		});
		th.start();
		
		
		
		
		return realName;
	}
	
	/**
	 * 判断是否有路径 没有新建
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
	
	public static File mkdir(String dir) throws IOException{
		File file = new File(dir);
		if (!file.exists()) {
			if (!file.getParentFile().exists()) {
				file.getParentFile().mkdirs();
			}
			file.createNewFile();
		}
		return file;
	}
	
	
	/**
	 * 图片转pdf
	 * @param imageUrllist
	 * @param mOutputPdfFileName
	 * @return
	 */
	public static File Pdf(List<String> imageUrllist,File file3) {  
        com.itextpdf.text.Document doc = new com.itextpdf.text.Document(PageSize.A4, 20, 20, 20, 20); //new一个pdf文档 
        try {  
            PdfWriter.getInstance(doc, new FileOutputStream(file3)); //pdf写入 
            doc.open();//打开文档  
            for (int i = 0; i < imageUrllist.size(); i++) {  //循环图片List，将图片加入到pdf中
                doc.newPage();  //在pdf创建一页
                Image png1 = Image.getInstance(imageUrllist.get(i)); //通过文件路径获取image 
                float heigth = png1.getHeight();  
                float width = png1.getWidth();  
                int percent = getPercent2(heigth, width);  
                png1.setAlignment(Image.MIDDLE);  
                png1.scalePercent(percent+3);// 表示是原来图像的比例;  
                doc.add(png1);  
            }  
            doc.close();  
        } catch (FileNotFoundException e) {  
            e.printStackTrace();  
        } catch (DocumentException e) {  
            e.printStackTrace();  
        } catch (IOException e) {  
            e.printStackTrace();  
        }  
  
        //File mOutputPdfFile = new File(mOutputPdfFileName);  //输出流
        if (!file3.exists()) {  
        	file3.deleteOnExit();  
            return null;  
        }  
        return file3; //反回文件输出流
    }  
  
    public static int getPercent(float h, float w) {  
        int p = 0;  
        float p2 = 0.0f;  
        if (h > w) {  
            p2 = 297 / h * 100;  
        } else {  
            p2 = 210 / w * 100;  
        }  
        p = Math.round(p2);  
        return p;  
    }  
    public static int getPercent2(float h, float w) {  
        int p = 0;  
        float p2 = 0.0f;  
        p2 = 530 / w * 100;  
        p = Math.round(p2);  
        return p;  
    }  
   public static String imgOfPdf(List<String> imageUrllist,String pdfName,String pdfPath) {
        boolean result = false;
        try {
              //String pdfUrl = Const.PDF_PATH+pdfName+".pdf";  //输出pdf文件路径          
              File file3 = mkdirsmy(pdfPath,pdfName+".pdf");// 新建一个空白pdf文档
            result = true;
            if (result == true) {
               File file = Pdf(imageUrllist, file3);//生成pdf  
               file.createNewFile();  
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return pdfName+".pdf";
       
    }
	
   /**
    * text 文本转换为pdf
    * @param text
    * @param pdf
    * @throws DocumentException
    * @throws IOException
    */
	public  static boolean text2pdf(String text, File file2) throws DocumentException, IOException {
		BaseFont bfChinese = BaseFont.createFont("STSong-Light", "UniGB-UCS2-H", BaseFont.NOT_EMBEDDED);
		Font FontChinese = new Font(bfChinese, 14, Font.NORMAL);

		FileOutputStream out = new FileOutputStream(file2);

		//Rectangle rect = new Rectangle(PageSize.A4.rotate());
		
		com.itextpdf.text.Document doc = new com.itextpdf.text.Document(PageSize.A4, 20, 20, 20, 20);

		PdfWriter.getInstance(doc, out);
		doc.open();
		Paragraph p = new Paragraph();
		p.setFont(FontChinese);
		//文件编码
		String fileEncode=EncodingDetect.getJavaEncode(text);
		InputStreamReader isr = new InputStreamReader(new FileInputStream(text), fileEncode);
		BufferedReader read = new BufferedReader(isr);

		String line = read.readLine();
		while (line != null) {
			p.add(line + "\n");
			line = read.readLine();
		}
		read.close();

		doc.add(p);

		doc.close();
		return true;
	}
	
	
	/**
	 * 审批流程确认模板
	 * @param destdoc 文档存储路径
	 * @param file2
	 * @return
	 * @throws DocumentException
	 * @throws IOException
	 */
	public  static String writeinWord(String destdocPath,PageData pd) {
		FileOutputStream os = null;
		try {
			
			String fileName = UuidUtil.get32UUID();
			String newFileName = UuidUtil.get32UUID();
			
			//模板word
	        String template = PathUtil.getProjectpath() + Const.FILEPATHFILE +"template.docx";
	        //目标word
	        //定义文档接口
	        Document doc = new Document(template);
	        //文本域
	        String[] Flds = new String[]{"name","process", "stage", "state","time"};
			/*
			 * String name = "李四"; String process = "行政审批"; String stage = "一"; String state
			 * = "通过";
			 */
	        String name = pd.getString("name");
	        String process = pd.getString("process");
	        String stage = pd.getString("stage");
	        String state = pd.getString("state");
	        String time = DateUtil.date3Str(new Date());
	        //值
	        Object[] Vals = new Object[]{name,process,stage,state, time};
	        
	        //调用接口
	        doc.getMailMerge().execute(Flds, Vals);
	        doc.save(destdocPath+fileName+".docx");
	        
	        
	        File file1 = mkdirsmy(destdocPath,fileName+".pdf");// 新建一个空白pdf文档        
	        os = new FileOutputStream(file1);           
			Document doc1 = new Document(destdocPath+fileName+".docx");
			doc1.save(os, SaveFormat.PDF);
			
			ToPdf app = new ToPdf();
			String pkPath = PathUtil.getProjectpath() + Const.FILEPATHFILE +"03mqkey.p12";
			//String pkPath = "/signature/03mqkey.p12";
			/*
			 * KeyStore ks = KeyStore.getInstance("PKCS12");
			 * ks.load(ToPdf.class.getResourceAsStream(pkPath), PASSWORD); String alias =
			 * ks.aliases().nextElement(); PrivateKey pk = (PrivateKey) ks.getKey(alias,
			 * PASSWORD);
			 */
            KeyStore ks = KeyStore.getInstance("PKCS12");
            ks.load(new FileInputStream(pkPath), PASSWORD);
            String alias = ks.aliases().nextElement();
            PrivateKey pk = (PrivateKey) ks.getKey(alias, PASSWORD);
            
            
            // 得到证书链
            Certificate[] chain = ks.getCertificateChain(alias);
            //需要进行签章的pdf
            String path = destdocPath+fileName+".pdf";
            // 封装签章信息
            SignatureInfo signInfo = new SignatureInfo();
            signInfo.setPk(pk);
            signInfo.setChain(chain);
            signInfo.setCertificationLevel(PdfSignatureAppearance.NOT_CERTIFIED);
            signInfo.setDigestAlgorithm(DigestAlgorithms.SHA1);
            signInfo.setFieldName(fileName);
            signInfo.setOwnerpwd("ownerpwd");//所有者密码
            // 签章图片
            signInfo.setImagePath(PathUtil.getProjectpath() + Const.FILEPATHFILE + "zhangsan.png");
            signInfo.setRenderingMode(PdfSignatureAppearance.RenderingMode.GRAPHIC);
            signInfo.setRectllx(390);  // 值越大，代表向x轴坐标平移 缩小 （反之，值越小，印章会放大）
            signInfo.setRectlly(595);  // 值越大，代表向y轴坐标向上平移（大小不变）
            signInfo.setRecturx(510);  // 值越大   代表向x轴坐标向右平移  （大小不变）
            signInfo.setRectury(555);  // 值越大，代表向y轴坐标向上平移（大小不变）
            //签章后的pdf路径
            boolean type = app.sign(path, destdocPath+newFileName+".pdf", signInfo);
			if (type) {
				String[] strArr = destdocPath.split("\\/");
				return strArr[strArr.length-1]+"/"+newFileName+".pdf";
			}
			
		} catch (Exception e) {
			e.getSuppressed();
		}finally {
			try {
				os.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
	
        
        
		return null;
	}
	
	
	
	@SuppressWarnings("resource")
	public boolean sign(String src,String target,SignatureInfo signatureInfo){
		InputStream inputStream=null;
		FileOutputStream outputStream=null;
		ByteArrayOutputStream result=new ByteArrayOutputStream();
		try {
			inputStream=new FileInputStream(src);
			ByteArrayOutputStream tempArrayOutputStream = new ByteArrayOutputStream();
			PdfReader reader=new PdfReader(inputStream,signatureInfo.getOwnerpwd().getBytes());//要求提交所有者密码
			
			// 创建签章工具PdfStamper ，最后一个boolean参数是否允许被追加签名
            // false的话，pdf文件只允许被签名一次，多次签名，最后一次有效
            // true的话，pdf可以被追加签名，验签工具可以识别出每次签名之后文档是否被修改
			PdfStamper stamper=PdfStamper.createSignature(reader, tempArrayOutputStream,'\0', null, true);
			
			// 获取数字签章属性对象
            PdfSignatureAppearance appearance = stamper.getSignatureAppearance();
            appearance.setReason(signatureInfo.getReason());//签名的原因，显示在pdf签名属性中
            appearance.setLocation(signatureInfo.getLocation());//签名的地点，显示在pdf签名属性中
			
            // 设置签名的位置，页码，签名域名称，多次追加签名的时候，签名预名称不能一样 图片大小受表单域大小影响（过小导致压缩）
            // 签名的位置，是图章相对于pdf页面的位置坐标，原点为pdf页面左下角
            // 四个参数的分别是，图章左下角x，图章左下角y，图章右上角x，图章右上角y
            appearance.setVisibleSignature(
                    new Rectangle(signatureInfo.getRectllx(), signatureInfo.getRectlly(), 
                    		signatureInfo.getRecturx(),signatureInfo.getRectury()), 
                    		1, signatureInfo.getFieldName());
            
            // 读取图章图片
            Image image = Image.getInstance(signatureInfo.getImagePath());
            appearance.setSignatureGraphic(image);
            appearance.setCertificationLevel(signatureInfo.getCertificationLevel());
            
            // 设置图章的显示方式，如下选择的是只显示图章（还有其他的模式，可以图章和签名描述一同显示）
            appearance.setRenderingMode(signatureInfo.getRenderingMode());
            // 摘要算法
            ExternalDigest digest = new BouncyCastleDigest();
            // 签名算法
            ExternalSignature signature = new PrivateKeySignature(signatureInfo.getPk(), signatureInfo.getDigestAlgorithm(),null);
            
            //关键点：调用签名算法进行签名
            //这里可以改成调用格尔的java签名API进行操作
            // 调用itext签名方法完成pdf签章 //数字签名格式，CMS,CADE
            MakeSignature.signDetached(appearance, digest, signature,
                    signatureInfo.getChain(), null, null, null, 0,
                    MakeSignature.CryptoStandard.CADES);

            inputStream = new ByteArrayInputStream(tempArrayOutputStream.toByteArray());
            // 定义输入流为生成的输出流内容，以完成多次签章的过程
            result = tempArrayOutputStream;

            outputStream = new FileOutputStream(new File(target));
            outputStream.write(result.toByteArray());
            outputStream.flush();
            return true;
		}catch (Exception e) {
			e.printStackTrace();
		} finally {
            try {
                if (null != outputStream) {
                    outputStream.close();
                }
                if (null != inputStream) {
                    inputStream.close();
                }
                if (null != result) {
                    result.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
		return false;
	}

}
