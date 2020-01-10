package org.fh.util;

/**
* FileName: AddressUtils
* Author:   Administrator
* Date:     2019-04-18 14:36
* Description: 通过ip地址获取访问地区
* History:
* <author>          <time>          <version>          <desc>
* 作者姓名:wxz       修改时间:       版本号:           描述:
*/

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;

import org.activiti.engine.impl.util.json.JSONObject;
import org.apache.commons.lang.StringUtils;

/**
 * 根据IP地址获取详细的地域信息 淘宝API :
 * http://ip.taobao.com/service/getIpInfo.php?ip=218.192.3.42 新浪API :
 * http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=218.192.3.42
 */
public class AddressUtils {
	/**
	 * @param content 请求的参数 格式为：ip=""
	 * @return
	 * @throws UnsupportedEncodingException @param//encoding 服务器端请求编码。如GBK,UTF-8等
	 */
	public static String getAddresses(String content, String encodingString) throws UnsupportedEncodingException {
		// 这里调用淘宝API
		String urlStr = "http://ip.taobao.com/service/getIpInfo.php";
		// 从http://whois.pconline.com.cn取得IP所在的省市区信息
		String returnStr = getResult(urlStr, content, encodingString);
		if (returnStr != null) {
			// 处理返回的省市区信息
//			System.out.println("(1) unicode转换成中文前的returnStr : " + returnStr);
			returnStr = decodeUnicode(returnStr);
//			System.out.println("(2) unicode转换成中文后的returnStr : " + returnStr);
			String[] temp = returnStr.split(",");
			if (temp.length < 3) {
				return "0";// 无效IP，局域网测试
			}
			return returnStr;
		}
		return null;
	}

	/**
	 * @param urlStr   请求的地址
	 * @param content  请求的参数 格式为：name=xxx&pwd=xxx
	 * @param encoding 服务器端请求编码。如GBK,UTF-8等
	 * @return
	 */
	private static String getResult(String urlStr, String content, String encoding) {
		URL url = null;
		HttpURLConnection connection = null;
		try {
			url = new URL(urlStr);
			connection = (HttpURLConnection) url.openConnection();// 新建连接实例
			connection.setConnectTimeout(8000);// 设置连接超时时间，单位毫秒
			connection.setReadTimeout(8000);// 设置读取数据超时时间，单位毫秒
			connection.setDoOutput(true);// 是否打开输出流 true|false
			connection.setDoInput(true);// 是否打开输入流true|false
			connection.setRequestMethod("POST");// 提交方法POST|GET
			connection.setUseCaches(false);// 是否缓存true|false
			connection.connect();// 打开连接端口
			DataOutputStream out = new DataOutputStream(connection.getOutputStream());// 打开输出流往对端服务器写数据
			out.writeBytes(content);// 写数据,也就是提交你的表单 name=xxx&pwd=xxx
			out.flush();// 刷新
			out.close();// 关闭输出流
			BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), encoding));// 往对端写完数据对端服务器返回数据
			// ,以BufferedReader流来读取
			StringBuffer buffer = new StringBuffer();
			String line = "";
			while ((line = reader.readLine()) != null) {
				buffer.append(line);
			}
			reader.close();
			return buffer.toString();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (connection != null) {
				connection.disconnect();// 关闭连接
			}
		}
		return null;
	}

	/**
	 * unicode 转换成 中文
	 *
	 * @param theString
	 * @return
	 */
	public static String decodeUnicode(String theString) {
		char aChar;
		int len = theString.length();
		StringBuffer outBuffer = new StringBuffer(len);
		for (int x = 0; x < len;) {
			aChar = theString.charAt(x++);
			if (aChar == '\\') {
				aChar = theString.charAt(x++);
				if (aChar == 'u') {
					int value = 0;
					for (int i = 0; i < 4; i++) {
						aChar = theString.charAt(x++);
						switch (aChar) {
						case '0':
						case '1':
						case '2':
						case '3':
						case '4':
						case '5':
						case '6':
						case '7':
						case '8':
						case '9':
							value = (value << 4) + aChar - '0';
							break;
						case 'a':
						case 'b':
						case 'c':
						case 'd':
						case 'e':
						case 'f':
							value = (value << 4) + 10 + aChar - 'a';
							break;
						case 'A':
						case 'B':
						case 'C':
						case 'D':
						case 'E':
						case 'F':
							value = (value << 4) + 10 + aChar - 'A';
							break;
						default:
							throw new IllegalArgumentException("Malformed      encoding.");
						}
					}
					outBuffer.append((char) value);
				} else {
					if (aChar == 't') {
						aChar = '\t';
					} else if (aChar == 'r') {
						aChar = '\r';
					} else if (aChar == 'n') {
						aChar = '\n';
					} else if (aChar == 'f') {
						aChar = '\f';
					}
					outBuffer.append(aChar);
				}
			} else {
				outBuffer.append(aChar);
			}
		}
		return outBuffer.toString();
	}

	public static String getAddressToString(String ip) {
		AddressUtils addressUtils = new AddressUtils();
//        String ip = "222.221.10.111";
		String address = "";
		try {
			address = addressUtils.getAddresses("ip=" + ip, "utf-8");
			if(StringUtils.isBlank(address)) {
				address = "{\"code\":0,\"data\":{\"ip\":\"0.0.0.0\",\"country\":\"XX\",\"area\":\"\",\"region\":\"XX\",\"city\":\"内网IP\",\"county\":\"内网IP\",\"isp\":\"内网IP\",\"country_id\":\"xx\",\"area_id\":\"\",\"region_id\":\"xx\",\"city_id\":\"local\",\"county_id\":\"local\",\"isp_id\":\"local\"}}";
			}
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		JSONObject jsonObject = new JSONObject(address);
		jsonObject = jsonObject.getJSONObject("data");
		// 通过相应的get方法,获取相应的属性
		String county = jsonObject.getString("country_id");// 国家
		String region = jsonObject.getString("region");// 省份
		String city = jsonObject.getString("city");// 城市
		String telecom = jsonObject.getString("isp");// 运营商
		String addressToString = county + "," + region + "省;" + city + "市," + telecom;
//		System.out.println("获取的地址为：" + address);
//		System.out.println("解析得到的地址为：" + county + "," + region + "省;" + city + "市," + telecom);
		return addressToString;
	}
}