package org.fh.entity;


import lombok.Data;
import org.fh.entity.system.Menu;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
public class Category  implements Serializable {
    private static final long serialVersionUID = 1L;


    private String id;

    private String parentId;

    private String parentIds;

    private String officeId;

    private String order;
    private String name;
    private String image;
    private String url;
    private String iscont;
    private String type;
    private String visible;
    private String description;
    private Date createDate;
    private Date updateDate;
    private String target;
    private List<Category> subCategory;
    private Menu parentMenu;
    private boolean hasCategory = false;


    public Category() {
    }

    @Override
    public String toString() {
        return "Category{" +
                "id='" + id + '\'' +
                ", parentId='" + parentId + '\'' +
                ", parentIds='" + parentIds + '\'' +
                ", officeId='" + officeId + '\'' +
                ", order='" + order + '\'' +
                ", name='" + name + '\'' +
                ", image='" + image + '\'' +
                ", url='" + url + '\'' +
                ", type='" + type + '\'' +
                ", visible='" + visible + '\'' +
                ", description='" + description + '\'' +
                ", createDate=" + createDate +
                ", updateDate=" + updateDate +
                ", target='" + target + '\'' +
                ", subCategory=" + subCategory +
                ", parentMenu=" + parentMenu +
                ", hasCategory=" + hasCategory +
                '}';
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getParentIds() {
        return parentIds;
    }

    public void setParentIds(String parentIds) {
        this.parentIds = parentIds;
    }

    public String getOfficeId() {
        return officeId;
    }

    public void setOfficeId(String officeId) {
        this.officeId = officeId;
    }

    public String getOrder() {
        return order;
    }

    public void setOrder(String order) {
        this.order = order;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getVisible() {
        return visible;
    }

    public void setVisible(String visible) {
        this.visible = visible;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public List<Category> getSubCategory() {
        return subCategory;
    }

    public void setSubCategory(List<Category> subCategory) {
        this.subCategory = subCategory;
    }

    public Menu getParentMenu() {
        return parentMenu;
    }

    public void setParentMenu(Menu parentMenu) {
        this.parentMenu = parentMenu;
    }

    public boolean isHasCategory() {
        return hasCategory;
    }

    public void setHasCategory(boolean hasCategory) {
        this.hasCategory = hasCategory;
    }

	public String getIscont() {
		return iscont;
	}

	public void setIscont(String iscont) {
		this.iscont = iscont;
	}

	
    
}
