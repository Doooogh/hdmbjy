package org.fh.controller.attachment;

import org.fh.controller.base.BaseController;
import org.fh.entity.PageData;
import org.fh.service.attachment.AttachmentService;
import org.fh.util.Const;
import org.fh.util.FileUpload;
import org.fh.util.Jurisdiction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RequestMapping("/attachment")
@Controller
public class AttachmentController extends BaseController {

    @Autowired
    private AttachmentService attachmentService;

    /**
     *  单文件上传 附件接口
     * @return
     */
    @ResponseBody
    @RequestMapping("/upload")
    public Object upload(@RequestParam("file") MultipartFile file,@RequestParam("path")String path){
        Map<String,Object> map=new HashMap<>();
        String errInfo="success";
        PageData pageData=new PageData();
        pageData=this.getPageData();
        //文件的原名字
        String originalName = file.getOriginalFilename();
        //文件的现名字 当前时间精确到毫秒
        String fileName=(new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date()))+ UUID.randomUUID().toString().substring(5,10);
        //根据操作系统获取上传文件路径
        String filePath = path;
        try{
            fileName=FileUpload.fileUp(file, filePath, fileName);
            String url=filePath+fileName;
            pageData.put("URL",url);
            pageData.put("ORIGINAL_NAME",originalName);
            pageData.put("NAME",fileName);
            pageData.put("CREATE_DATE",new Date());
            pageData.put("CREATE_BY", Const.USER_NAME);
            attachmentService.save(pageData);
        }catch (Exception e){
            errInfo="exception";
            e.printStackTrace();
            map.put("result",errInfo);
            return map;
        }
        map.put("attInfo",pageData);
        map.put("result",errInfo);
        return map;
    }

    @ResponseBody
    @RequestMapping("/download")
    public  Object download(HttpServletRequest request, HttpServletResponse response) throws UnsupportedEncodingException {
        Map<String,Object> map = new HashMap<String,Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        PageData attachment = attachmentService.getOneById(pd);
        String fileName="";
        String url="";
        if(attachment!=null){
            url= (String) attachment.get("URL");
            fileName= (String) attachment.get("ORIGINAL_NAME");
        }else{
            errInfo="exception";
            map.put("result", errInfo);
            return map;
        }
        String userAgent = request.getHeader("User-Agent");
        if (/* IE 8 至 IE 10 */
                userAgent.toUpperCase().contains("MSIE") ||
                        userAgent.contains("Trident/7.0")) {
            try {
                fileName = URLEncoder.encode(fileName, "UTF-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        } else if (userAgent.toUpperCase().contains("MOZILLA") ||
                userAgent.toUpperCase().contains("CHROME")) {
                fileName = new String(fileName.getBytes(), "ISO-8859-1");
        } else {
            fileName = URLEncoder.encode(fileName, "UTF-8");
        }
        if (fileName != null) {
            //设置文件路径
            File file = new File(url);
            if (file.exists()) {
                response.setCharacterEncoding("UTF-8");
                response.setContentType("application/force-download");// 设置强制下载不打开
                response.setHeader("Content-Disposition", "attachment;fileName=" + fileName);// 设置文件名
                byte[] buffer = new byte[1024];
                FileInputStream fis = null;
                BufferedInputStream bis = null;
                try {
                    fis = new FileInputStream(file);
                    bis = new BufferedInputStream(fis);
                    OutputStream os = response.getOutputStream();
                    int i = bis.read(buffer);
                    while (i != -1) {
                        os.write(buffer, 0, i);
                        i = bis.read(buffer);
                    }
                    os.close();
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    if (bis != null) {
                        try {
                            bis.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                    if (fis != null) {
                        try {
                            fis.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        }
        return map;
    }
}
