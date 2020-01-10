package org.fh.entity.fhoa;

import java.util.List;

 /** 
 * 说明：组织机构实体类
 * 作者：FH Admin QQ313596790
 * 时间：2019-07-01
 * 官网：www.fhadmin.org
 */
public class Department{ 
	
	private String DEPARTMENT_ID;	//主键
	private String target;
	private Department department;
	private List<Department> subDepartment;
	private boolean hasDepartment = false;
	private String treeurl;
	private boolean isChecked;
	private String pIds;
	
	private boolean typeChoice;//菜单是否可选
	
	

	 public boolean isTypeChoice() {
		return typeChoice;
	}

	public void setTypeChoice(boolean typeChoice) {
		this.typeChoice = typeChoice;
	}

	public String getpIds() {
		 return pIds;
	 }

	 public void setpIds(String pIds) {
		 this.pIds = pIds;
	 }

	 public boolean isChecked() {
		 return isChecked;
	 }

	 public void setChecked(boolean checked) {
		 isChecked = checked;
	 }

	 private String NAME;			//名称
	public String getFNAME() {
		return NAME;
	}
	public void setFNAME(String NAME) {
		this.NAME = NAME;
	}
	private String NAME_EN;			//英文
	public String getFNAME_EN() {
		return NAME_EN;
	}
	public void setFNAME_EN(String NAME_EN) {
		this.NAME_EN = NAME_EN;
	}
	private String BIANMA;			//编码
	public String getFBIANMA() {
		return BIANMA;
	}
	public void setFBIANMA(String BIANMA) {
		this.BIANMA = BIANMA;
	}
	private String PARENT_ID;			//上级ID
	public String getFPARENT_ID() {
		return PARENT_ID;
	}
	public void setFPARENT_ID(String PARENT_ID) {
		this.PARENT_ID = PARENT_ID;
	}
	private String BZ;			//备注
	public String getFBZ() {
		return BZ;
	}
	public void setFBZ(String BZ) {
		this.BZ = BZ;
	}
	private String HEADMAN;			//负责人
	public String getFHEADMAN() {
		return HEADMAN;
	}
	public void setFHEADMAN(String HEADMAN) {
		this.HEADMAN = HEADMAN;
	}
	private String TEL;			//电话
	public String getFTEL() {
		return TEL;
	}
	public void setFTEL(String TEL) {
		this.TEL = TEL;
	}
	private String FUNCTIONS;			//部门职能
	public String getFFUNCTIONS() {
		return FUNCTIONS;
	}
	public void setFFUNCTIONS(String FUNCTIONS) {
		this.FUNCTIONS = FUNCTIONS;
	}
	private String ADDRESS;			//地址
	public String getFADDRESS() {
		return ADDRESS;
	}
	public void setFADDRESS(String ADDRESS) {
		this.ADDRESS = ADDRESS;
	}

	public String getDEPARTMENT_ID() {
		return DEPARTMENT_ID;
	}
	public void setDEPARTMENT_ID(String DEPARTMENT_ID) {
		this.DEPARTMENT_ID = DEPARTMENT_ID;
	}
	public String getNAME() {
		return NAME;
	}
	public void setNAME(String NAME) {
		this.NAME = NAME;
	}
	public String getPARENT_ID() {
		return PARENT_ID;
	}
	public void setPARENT_ID(String PARENT_ID) {
		this.PARENT_ID = PARENT_ID;
	}
	public String getTarget() {
		return target;
	}
	public void setTarget(String target) {
		this.target = target;
	}
	public Department getDepartment() {
		return department;
	}
	public void setDepartment(Department department) {
		this.department = department;
	}
	public List<Department> getSubDepartment() {
		return subDepartment;
	}
	public void setSubDepartment(List<Department> subDepartment) {
		this.subDepartment = subDepartment;
	}
	public boolean isHasDepartment() {
		return hasDepartment;
	}
	public void setHasDepartment(boolean hasDepartment) {
		this.hasDepartment = hasDepartment;
	}
	public String getTreeurl() {
		return treeurl;
	}
	public void setTreeurl(String treeurl) {
		this.treeurl = treeurl;
	}
	
}
