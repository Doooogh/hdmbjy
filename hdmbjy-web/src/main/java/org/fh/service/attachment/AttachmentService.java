package org.fh.service.attachment;

import org.fh.entity.PageData;

import java.util.List;

public interface AttachmentService {
    List<PageData> listPage(PageData pageData);

    int save(PageData pageData);

    int delete(PageData pageData);

    int deleteAll(String[] IDS);

    PageData getOneById(PageData pageData);

    List<PageData> findAttachmentByIds(PageData pageData);

    /**
     * 删除数据库中数据以及本地的附件
     * @param pageData
     */
    public void deleteAttachment(PageData pageData);
}
