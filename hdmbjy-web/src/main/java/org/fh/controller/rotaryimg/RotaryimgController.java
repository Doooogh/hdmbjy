package org.fh.controller.rotaryimg;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.service.rotaryimg.RotaryimgService;
import org.fh.util.Const;
import org.fh.util.DateUtil;
import org.fh.util.DelFileUtil;
import org.fh.util.FileUpload;
import org.fh.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

/**
 * 说明：轮播图管理 作者：FH Admin QQ313596790 时间：2019-08-02 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/rotaryimg")
public class RotaryimgController extends BaseController {

	@Autowired
	private RotaryimgService rotaryimgService;

	/**
	 * 保存
	 * 
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value = "/add")
	@RequiresPermissions("rotaryimg:add")
	@ResponseBody
	public Object add(@RequestParam(value = "FIMG", required = false) MultipartFile file) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("ROTARYIMG_ID", this.get32UUID()); // 主键
		pd.put("CREATOR_DATE", DateUtil.date2Str(new Date()));
		String fileName = ""; // 文件名称
		if (null != file && !file.isEmpty()) {
			String filePath = Const.ROTARYPATH; // 文件上传路径
			fileName = FileUpload.fileUp(file, filePath, this.get32UUID());
			pd.put("IMG_PATH", "rotaryImg/" + fileName);
			pd.put("IMG_URL", "rotaryImg/" + fileName);
		}

		pd.put("SPARE1", 0); // 审核 0,未审核 1,已审核
		// pd.put("SPARE2", ""); //备用字段
		// pd.put("SPARE3", ""); //备用字段
		rotaryimgService.save(pd);
		map.put("result", errInfo);
		return map;
	}

	/**
	 * 删除
	 * 
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value = "/delete")
	@RequiresPermissions("rotaryimg:del")
	@ResponseBody
	public Object delete() throws Exception {
		Map<String, String> map = new HashMap<String, String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		if (Tools.notEmpty(pd.getString("PATH").trim())) { // 图片路径
			DelFileUtil.delFolder(Const.ROTARYPATH + pd.getString("PATH")); // 删除硬盘中的图片
		}
		rotaryimgService.delete(pd);
		map.put("result", errInfo); // 返回结果
		return map;
	}

	/**
	 * 修改
	 * 
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value = "/edit")
	@RequiresPermissions("rotaryimg:edit")
	@ResponseBody
	public Object edit(@RequestParam(value = "FIMG", required = false) MultipartFile file) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String fileName = ""; // 文件名称
		if (null != file && !file.isEmpty()) {
			String filePath = Const.ROTARYPATH; // 文件上传路径
			fileName = FileUpload.fileUp(file, filePath, this.get32UUID());
			pd.put("IMG_PATH", "rotaryImg/" + fileName);
			pd.put("IMG_URL", "rotaryImg/" + fileName);
		}
		pd.put("SPARE1", 0); // 审核 0,未审核 1,已审核
		pd.put("CREATOR_DATE", DateUtil.date2Str(new Date()));
		rotaryimgService.edit(pd);
		map.put("result", errInfo);
		return map;
	}

	/**
	 * 列表
	 * 
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value = "/list")
	@RequiresPermissions("rotaryimg:list")
	@ResponseBody
	public Object list(Page page) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS"); // 关键词检索条件
		if (Tools.notEmpty(KEYWORDS))
			pd.put("KEYWORDS", KEYWORDS.trim());
		String SPARE1 = pd.getString("SPARE1");

		if (Tools.notEmpty(SPARE1))
			pd.put("SPARE1", SPARE1.trim());
		page.setPd(pd);
		List<PageData> varList = rotaryimgService.list(page); // 列出Rotaryimg列表
		map.put("varList", varList);
		map.put("page", page);
		map.put("result", errInfo);
		return map;
	}

	/**
	 * 去修改页面获取数据
	 * 
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value = "/goEdit")
	@RequiresPermissions("rotaryimg:edit")
	@ResponseBody
	public Object goEdit() throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = rotaryimgService.findById(pd); // 根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}

	/**
	 * 批量删除
	 * 
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value = "/deleteAll")
	@RequiresPermissions("rotaryimg:del")
	@ResponseBody
	public Object deleteAll() throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if (Tools.notEmpty(DATA_IDS)) {
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			
			for (int i = 0; i < ArrayDATA_IDS.length; i++) {
				try {
					PageData pd2 = new PageData();
					pd2.put("ROTARYIMG_ID", ArrayDATA_IDS[i]);
					PageData pd1 = rotaryimgService.findById(pd2); // 根据ID读取
					DelFileUtil.delFolder(Const.ROTARYPATH
							+ pd1.getString("IMG_PATH").substring(pd1.getString("IMG_PATH").indexOf("/")));
				} catch (Exception e) {
					e.printStackTrace();
				}

			}
			
			/*
			 * new Thread(new Runnable() {
			 * 
			 * @Override public void run() {
			 * 
			 * 
			 * } }).start();
			 */

			rotaryimgService.deleteAll(ArrayDATA_IDS);
			errInfo = "success";

		} else {
			errInfo = "error";
		}
		map.put("result", errInfo); // 返回结果
		return map;
	}

	/**
	 * 导出到excel
	 * 
	 * @param
	 * @throws Exception
	 * 
	 * @RequestMapping(value="/excel") @RequiresPermissions("toExcel") public
	 *                                 ModelAndView exportExcel() throws Exception{
	 *                                 ModelAndView mv = new ModelAndView();
	 *                                 PageData pd = new PageData(); pd =
	 *                                 this.getPageData(); Map<String,Object>
	 *                                 dataMap = new HashMap<String,Object>();
	 *                                 List<String> titles = new
	 *                                 ArrayList<String>(); titles.add("标题"); //1
	 *                                 titles.add("类型"); //2 titles.add("图片路径"); //3
	 *                                 titles.add("图片链接"); //4 titles.add("备注"); //5
	 *                                 titles.add("创建日期"); //6 titles.add("备用字段");
	 *                                 //7 titles.add("备用字段"); //8
	 *                                 titles.add("备用字段"); //9 dataMap.put("titles",
	 *                                 titles); List<PageData> varOList =
	 *                                 rotaryimgService.listAll(pd); List<PageData>
	 *                                 varList = new ArrayList<PageData>(); for(int
	 *                                 i=0;i<varOList.size();i++){ PageData vpd =
	 *                                 new PageData(); vpd.put("var1",
	 *                                 varOList.get(i).getString("TITLE")); //1
	 *                                 vpd.put("var2",
	 *                                 varOList.get(i).getString("TYPE")); //2
	 *                                 vpd.put("var3",
	 *                                 varOList.get(i).getString("IMG_PATH")); //3
	 *                                 vpd.put("var4",
	 *                                 varOList.get(i).getString("IMG_URL")); //4
	 *                                 vpd.put("var5",
	 *                                 varOList.get(i).getString("BZ")); //5
	 *                                 vpd.put("var6",
	 *                                 varOList.get(i).getString("CREATOR_DATE"));
	 *                                 //6 vpd.put("var7",
	 *                                 varOList.get(i).getString("SPARE1")); //7
	 *                                 vpd.put("var8",
	 *                                 varOList.get(i).getString("SPARE2")); //8
	 *                                 vpd.put("var9",
	 *                                 varOList.get(i).getString("SPARE3")); //9
	 *                                 varList.add(vpd); } dataMap.put("varList",
	 *                                 varList); ObjectExcelView erv = new
	 *                                 ObjectExcelView(); mv = new
	 *                                 ModelAndView(erv,dataMap); return mv; }
	 */

	/**
	 * 删除图片
	 * 
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value = "/delImg")
	@ResponseBody
	public Object delImg() throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String PATH = pd.getString("PATH");
		if (Tools.notEmpty(pd.getString("PATH").trim())) { // 图片路径
			DelFileUtil.delFolder(Const.ROTARYPATH + pd.getString("PATH")); // 删除硬盘中的图片
		}
		if (PATH != null) {
			rotaryimgService.delTp(pd);// 删除数据库中图片数据
		}
		map.put("result", errInfo); // 返回结果
		return map;
	}

	/**
	 * 审核
	 * 
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value = "/examine")
	@RequiresPermissions("rotaryimg:edit")
	@ResponseBody
	public Object v() throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = rotaryimgService.findById(pd); // 根据ID读取
		pd.put("SPARE1", 1);// 0:未审核 1:已审核
		pd.put("CREATOR_DATE", DateUtil.date2Str(new Date()));
		rotaryimgService.edit(pd);
		map.put("result", errInfo);
		return map;
	}

}
