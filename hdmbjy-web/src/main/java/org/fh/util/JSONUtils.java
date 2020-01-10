package org.fh.util;

import com.alibaba.druid.util.StringUtils;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import net.sf.json.JSONArray;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class JSONUtils {

	/**
	 * map转json字符串
	 * @param map
	 * @return
	 */
	public static String Map2JsonStr(Map map){
		if (map.isEmpty()){
			return null;
		}
		JSONObject jsonObject= JSONObject.parseObject(JSON.toJSONString(map));
		return jsonObject.toJSONString();
	}

	/**
	 * Bean对象转JSON
	 * 
	 * @param object
	 * @param dataFormatString
	 * @return
	 */
	public static String beanToJson(Object object, String dataFormatString) {
		if (object != null) {
			if (StringUtils.isEmpty(dataFormatString)) {
				return JSONObject.toJSONString(object);
			}
			return JSON.toJSONStringWithDateFormat(object, dataFormatString);
		} else {
			return null;
		}
	}

	/**
	 * Bean对象转JSON
	 * 
	 * @param object
	 * @return
	 */
	public static String beanToJson(Object object) {
		if (object != null) {
			return JSON.toJSONString(object);
		} else {
			return null;
		}
	}

	/**
	 * String转JSON字符串
	 * 
	 * @param key
	 * @param value
	 * @return
	 */
	public static String stringToJsonByFastjson(String key, String value) {
		if (StringUtils.isEmpty(key) || StringUtils.isEmpty(value)) {
			return null;
		}
		Map<String, String> map = new HashMap<String, String>(16);
		map.put(key, value);
		return beanToJson(map, null);
	}

	/**
	 * 将json字符串转换成对象
	 * 
	 * @param json
	 * @param clazz
	 * @return
	 */
	public static Object jsonToBean(String json, Object clazz) {
		if (StringUtils.isEmpty(json) || clazz == null) {
			return null;
		}
		return JSON.parseObject(json, clazz.getClass());
	}

	/**
	 * json字符串转map
	 * 
	 * @param json
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static Map<String, Object> jsonToMap(String json) {
		if (StringUtils.isEmpty(json)) {
			return null;
		}
		return JSON.parseObject(json, Map.class);
	}


	/**
	 * JSON 类型的字符串转换成 Map
	 */
	public static void parseJSON2Map(Map jsonMap,String jsonStr,String parentKey){
		//字符串转换成JSON对象
		net.sf.json.JSONObject json = net.sf.json.JSONObject.fromObject(jsonStr);
		//最外层JSON解析
		for(Object k : json.keySet()){
			//JSONObject 实际上相当于一个Map集合，所以我们可以通过Key值获取Value
			Object v = json.get(k);
			//构造一个包含上层keyName的完整keyName
			String fullKey = (null == parentKey || parentKey.trim().equals("") ? k.toString() : parentKey + "." + k);

			if(v instanceof JSONArray){
				//如果内层还是数组的话，继续解析
				Iterator it = ((JSONArray) v).iterator();
				while(it.hasNext()){
					JSONObject json2 = (JSONObject)it.next();
					parseJSON2Map(jsonMap,json2.toString(),fullKey);
				}
			} else if(isNested(v)){
				parseJSON2Map(jsonMap,v.toString(),fullKey);
			}
			else{
				jsonMap.put(fullKey, v);
			}
		}
	}
	public static boolean isNested(Object jsonObj){

		return jsonObj.toString().contains("{");
	}

}
