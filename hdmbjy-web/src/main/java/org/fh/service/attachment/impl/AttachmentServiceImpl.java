package org.fh.service.attachment.impl;

import org.fh.entity.PageData;
import org.fh.mapper.dsno1.attachment.AttachmentMapper;
import org.fh.service.attachment.AttachmentService;
import org.fh.util.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AttachmentServiceImpl implements AttachmentService {

    @Autowired
    private AttachmentMapper attachmentMapper;


    @Override
    public List<PageData> listPage(PageData pageData) {
        return attachmentMapper.listPage(pageData);
    }

    @Override
    public int save(PageData pageData) {
        return attachmentMapper.save(pageData);
    }

    @Override
    public int delete(PageData pageData) {
        return attachmentMapper.delete(pageData);
    }

    @Override
    public int deleteAll(String[] IDS) {
        return attachmentMapper.deleteAll(IDS);
    }

    @Override
    public PageData getOneById(PageData pageData) {
        return attachmentMapper.getOneById(pageData);
    }

    @Override
    public List<PageData> findAttachmentByIds(PageData pageData) {
        return attachmentMapper.findAttachmentByIds(pageData);
    }

    @Override
    public void deleteAttachment(PageData pageData) {
        PageData oneById = getOneById(pageData);
        if(null!=oneById) {
            try{
               delete(pageData);
                FileUtil.delFile((String) oneById.get("URL"));
            }catch (Exception e){
                e.printStackTrace();
            }
        }
    }
}
