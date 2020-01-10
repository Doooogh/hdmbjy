package org.fh.mapper.dsno1.attachment;

import org.fh.entity.PageData;

import java.util.List;

public interface AttachmentMapper {

    List<PageData> listPage(PageData pageData);

    int save(PageData pageData);

    int delete(PageData pageData);

    int deleteAll(String[] IDS);

    List<PageData> findAttachmentByIds(PageData pd);

    PageData getOneById(PageData pageData);
}
