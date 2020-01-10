package org.fh.entity.fhoa;

import lombok.Data;

import java.util.List;

@Data
public class Organization {


    private String  ORGANIZATION_ID;

    private String NAME;

    private String target;

    private Organization organization;

    //子级机构
    private List<Organization> subOrganization;

    private boolean hasDepartment = false;
    //url
    private String treeurl;

    private boolean isChecked;

    private String PARENT_ID;

    private String pIds;
}
