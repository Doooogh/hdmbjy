package org.fh.controller.index;

import org.fh.entity.PageData;
import org.fh.service.archive.ArchiveService;
import org.fh.util.Const;
import org.fh.util.FileDownload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;

@Controller
@RequestMapping("/indexDownload")
public class IndexDownloadController {

    @Autowired
    private ArchiveService archiveService;

    @GetMapping("/download")
    @ResponseBody
    public void download(HttpServletResponse response) throws Exception {
        PageData find=new PageData();
        find.put("ARCHIVE_ID",Const.INDEX_DOWNLOAD_ID);
        PageData findRes = archiveService.findById(find);
//        String extName = findRes.getString("PATH").substring(findRes.getString("PATH").lastIndexOf("."));
        FileDownload.fileDownload(response, Const.NGINX_PATH + findRes.getString("PATH"),findRes.getString("FILE_NAME"));
    }
}
