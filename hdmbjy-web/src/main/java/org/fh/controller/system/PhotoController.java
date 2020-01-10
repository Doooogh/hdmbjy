package org.fh.controller.system;

import java.util.HashMap;
import java.util.Map;

import org.fh.controller.base.BaseController;
import org.fh.entity.PageData;
import org.fh.service.system.PhotoService;
import org.fh.util.DelFileUtil;
import org.fh.util.ImageAnd64Binary;
import org.fh.util.Jurisdiction;
import org.fh.util.PathUtil;
import org.fh.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 说明：头像编辑处理类
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/photo")
public class PhotoController extends BaseController {
	
	@Autowired
	private PhotoService photoService;
	
	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/save")
	@ResponseBody
	public Object save() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("USERNAME", Jurisdiction.getUsername());	//用户名
		String type = pd.getString("type");				//类型，1：带原图的。2不带原图
		String strphotos = pd.getString("strphotos");	//图片路径拼接
		String[] arrayStr = strphotos.split(",fh,");
		if("1".equals(type)){
			String tu0 = arrayStr[0].split("angle=")[0];
			tu0 = tu0.substring(0, tu0.length()-1);
			pd.put("PHOTO0", tu0);			//原图
			pd.put("PHOTO1", arrayStr[1]);	//头像1
			pd.put("PHOTO2", arrayStr[2]);	//头像2
			pd.put("PHOTO3", arrayStr[3]);	//头像3
		}else{
			pd.put("PHOTO0", "");			//原图
			pd.put("PHOTO1", arrayStr[0]);	//头像1
			pd.put("PHOTO2", arrayStr[1]);	//头像2
			pd.put("PHOTO3", arrayStr[2]);	//头像3
		}
		PageData ypd = photoService.findById(pd);
		if(null == ypd){			//没有数据就新增，否则就修改
			pd.put("USERPHOTO_ID", this.get32UUID());		//主键
			photoService.save(pd);
		}else{
			photoService.edit(pd);
			String PHOTO0 = ypd.getString("PHOTO0");
			String PHOTO1 = ypd.getString("PHOTO1");
			String PHOTO2 = ypd.getString("PHOTO2");
			String PHOTO3 = ypd.getString("PHOTO3");
			if(Tools.notEmpty(PHOTO0)){
				DelFileUtil.delFolder(PathUtil.getProjectpath()+ PHOTO0); //删除原图
			}
			DelFileUtil.delFolder(PathUtil.getProjectpath()+ PHOTO1); //删除图1
			DelFileUtil.delFolder(PathUtil.getProjectpath()+ PHOTO2); //删除图2
			DelFileUtil.delFolder(PathUtil.getProjectpath()+ PHOTO3); //删除图3
		}
		map.put("userPhoto",pd.getString("PHOTO2"));
		map.put("result", errInfo);
		return map;
	}
	
	/**保存用户头像(手机端)
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/saveUserPhoto")
	@ResponseBody
	public Object saveUserPhoto() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String USERNAME = Jurisdiction.getUsername();//用户名
		String userphoto = "uploadFiles/photo/"+USERNAME+"_photo.jpg";
		String imgData = pd.getString("PHOTODATA").replace("data:image/jpeg;base64,", "");
		String pathimg = PathUtil.getProjectpath()+userphoto;
		ImageAnd64Binary.generateImage(imgData, pathimg);
		pd.put("USERNAME", USERNAME);	
		pd.put("PHOTO0", "");			//原图
		pd.put("PHOTO1", userphoto);	//头像1
		pd.put("PHOTO2", userphoto);	//头像2
		pd.put("PHOTO3", userphoto);	//头像3
		map.put("userPhoto",pd.getString("PHOTO2"));
		PageData ypd = photoService.findById(pd);
		if(null == ypd){				//没有数据就新增，否则就修改
			pd.put("USERPHOTO_ID", this.get32UUID());		//主键
			photoService.save(pd);
		}else{
			photoService.edit(pd);
			String PHOTO0 = ypd.getString("PHOTO0");
			String PHOTO1 = ypd.getString("PHOTO1");
			String PHOTO2 = ypd.getString("PHOTO2");
			String PHOTO3 = ypd.getString("PHOTO3");
			if(!userphoto.equals(PHOTO1)){
				if(Tools.notEmpty(PHOTO0)){
					DelFileUtil.delFolder(PathUtil.getProjectpath()+ PHOTO0); //删除原图
				}
				DelFileUtil.delFolder(PathUtil.getProjectpath()+ PHOTO1); //删除图1
				DelFileUtil.delFolder(PathUtil.getProjectpath()+ PHOTO2); //删除图2
				DelFileUtil.delFolder(PathUtil.getProjectpath()+ PHOTO3); //删除图3
			}
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}

}
