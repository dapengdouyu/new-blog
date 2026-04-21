#!/usr/bin/env node
/**
 * 获取知音楼访问令牌
 * 自动管理令牌缓存和刷新
 */

interface TokenResponse {
  access_token: string;
  expired_time?: number;
}

interface ApiResponse<T = any> {
  code: number;
  msg: string;
  obj?: T;
}

const baseUrl = 'https://yach-oapi.zhiyinlou.com';
let accessToken: string | null = null;
let tokenExpiryTime: number = 0;

/**
 * 获取访问令牌
 * @param appKey 应用密钥
 * @param appSecret 应用密钥
 * @returns 访问令牌，如果获取失败则返回 null
 */
export async function getAccessToken(
  appKey?: string,
  appSecret?: string
): Promise<string | null> {
  // 如果令牌未过期，直接返回缓存的令牌
  if (accessToken && Date.now() < tokenExpiryTime) {
    return accessToken;
  }

  const url = `${baseUrl}/gettoken`;

  const defaultAppKey = appKey || 'd2baad63490fbff7';
  const defaultAppSecret = appSecret || '356e7b6ea201996d0a3f05ba42b324b3';
  
  const params = new URLSearchParams({
    appkey: defaultAppKey,
    appsecret: defaultAppSecret,
  });

  try {
    const response = await fetch(`${url}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<TokenResponse> = await response.json() as ApiResponse<TokenResponse>;

    if (result.code === 200 && result.obj?.access_token) {
      accessToken = result.obj.access_token;
      // 设置过期时间（默认提前 5 分钟刷新）
      const expiredTime = result.obj.expired_time || 7200; // 默认 2 小时
      tokenExpiryTime = Date.now() + (expiredTime - 300) * 1000;
      return accessToken;
    }

    return null;
  } catch (error) {
    console.error('获取令牌时出错:', error);
    return null;
  }
}

// 命令行使用示例
if (import.meta.url === `file://${process.argv[1]}`) {

  const appKey = process.env.ZHIYINLOU_APP_KEY || process.argv[2] || 'd2baad63490fbff7';
  const appSecret = process.env.ZHIYINLOU_APP_SECRET || process.argv[3] || '356e7b6ea201996d0a3f05ba42b324b3';

  if (!appKey || !appSecret) {
    console.error('使用方法: node get-access-token.ts <appKey> <appSecret>');
    console.error('或设置环境变量: ZHIYINLOU_APP_KEY 和 ZHIYINLOU_APP_SECRET');
    process.exit(1);
  }

  getAccessToken(appKey, appSecret).then((token) => {
    if (token) {
      console.log(token);
    } else {
      console.error('获取令牌失败');
      process.exit(1);
    }
  });
}
