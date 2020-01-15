package org.fh.util;

import java.util.UUID;

/**
 * 说明：生成UUID(32位不重复的字符串)
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
public class UuidUtil {

	public static String get32UUID() {
		String uuid = UUID.randomUUID().toString().trim().replaceAll("-", "");
		return uuid;
	}


	public static String getUUID(int length){
		String uuid=get32UUID();
		return uuid.substring(0,5).replaceAll("1","k").replaceAll("o","u")
				.replaceAll("l","k").replaceAll("0","u").replaceAll("O","u");
	}
	public static void main(String[] args) {
		System.out.println(getUUID(3));
	}
}
