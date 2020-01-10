package org.fh.util;



import com.aliyuncs.CommonRequest;
import com.aliyuncs.CommonResponse;
import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.http.MethodType;
import com.aliyuncs.profile.DefaultProfile;


public class SmsServiceUtil {

	// 产品名称:云通信短信API产品,开发者无需替换
	static final String product = "Dysmsapi";
	// 产品域名,开发者无需替换
	static final String domain = "dysmsapi.aliyuncs.com";

	// TODO 此处需要替换成开发者自己的AK(在阿里云访问控制台寻找)
	static final String accessKeyId = "LTAI4Fm5ye6ZBeav9oBDNrzV";
	static final String accessKeySecret = "Y5Npj276o9Tukto8tUPRygoNF9UfSE";

	/*
	 * public static void main(String[] args) throws ClientException,
	 * InterruptedException {
	 * // 发短信 CommonResponse response = sendSms("这是类型","这是内容","");
	 * System.out.println(response);
	 * 
	 * 
	 * }
	 */
	public static CommonResponse sendSms(String type,String content, String phoneNumber) throws ClientException{
		    DefaultProfile profile = DefaultProfile.getProfile("cn-hangzhou", accessKeyId, accessKeySecret);
	        IAcsClient client = new DefaultAcsClient(profile);
	        CommonResponse response = null ;
	        CommonRequest request = new CommonRequest();
	        request.setMethod(MethodType.POST);
	        request.setDomain(domain);
	        request.setVersion("2017-05-25");
	        request.setAction("SendSms");
	        request.putQueryParameter("RegionId", "cn-hangzhou");
	        request.putQueryParameter("PhoneNumbers", phoneNumber);
	        request.putQueryParameter("SignName", "新晨阳光");
	        request.putQueryParameter("TemplateCode", "SMS_175295288");
	        request.putQueryParameter("TemplateParam", "{ 	\"type\": \""+type+"\", 	\"content\": \""+content+"\" }");
	        try {
	        	response  = client.getCommonResponse(request);
	            System.out.println(response.getData());
	        } catch (ServerException e) {
	            e.printStackTrace();
	        } catch (ClientException e) {
	            e.printStackTrace();
	        }
	        return response;
	}
	/*
	 * public static void main(String[] args) throws ClientException,
	 * InterruptedException {
	 * // 发短信验证码 CommonResponse response = sendSms("这是类型","这是内容","");
	 * System.out.println(response);
	 *
	 *
	 * }
	 */
	public static CommonResponse sendSmsCode(String code, String phoneNumber) throws ClientException{
		DefaultProfile profile = DefaultProfile.getProfile("cn-hangzhou", accessKeyId, accessKeySecret);
		IAcsClient client = new DefaultAcsClient(profile);
		CommonResponse response = null ;
		CommonRequest request = new CommonRequest();
		request.setMethod(MethodType.POST);
		request.setDomain(domain);
		request.setVersion("2017-05-25");
		request.setAction("SendSms");
		request.putQueryParameter("RegionId", "cn-hangzhou");
		request.putQueryParameter("PhoneNumbers", phoneNumber);
		request.putQueryParameter("SignName", "新晨阳光");
		request.putQueryParameter("TemplateCode", "SMS_177539797");
		request.putQueryParameter("TemplateParam", "{ 	\"code\": \""+code+"\" }");
		try {
			response  = client.getCommonResponse(request);
			System.out.println(response.getData());
		} catch (ServerException e) {
			e.printStackTrace();
		} catch (ClientException e) {
			e.printStackTrace();
		}
		return response;
	}
}
