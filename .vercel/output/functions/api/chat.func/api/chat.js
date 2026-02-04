"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handler;
/**
 * Vercel Serverless Function - AI数字分身API代理
 *
 * 功能：隐藏智谱AI的API Key，提供安全的API端点
 * 部署：自动部署到 /api/chat
 */

async function handler(req, res) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }
  try {
    // CORS设置（允许所有域名访问，生产环境建议限制）
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 处理OPTIONS预检请求
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    const {
      messages,
      temperature = 0.7,
      top_p = 0.9,
      max_tokens = 500
    } = req.body;

    // 验证请求参数
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Invalid messages format'
      });
    }

    // 📌 从环境变量读取API Key（安全！）
    const API_KEY = process.env.ZHIPU_API_KEY;
    if (!API_KEY) {
      console.error('ZHIPU_API_KEY环境变量未设置');
      return res.status(500).json({
        error: 'API配置错误'
      });
    }

    // 解析API Key
    const [apiKeyId, apiKeySecret] = API_KEY.split('.');

    // 生成JWT Token
    const header = {
      alg: 'HS256',
      sign_type: 'SIGN'
    };
    const now = Date.now();
    const timestamp = Math.floor(now / 1000);
    const payload = {
      api_key: apiKeyId,
      exp: timestamp + 3600,
      timestamp: timestamp
    };

    // Base64Url编码
    const base64UrlEncode = str => {
      const utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1));
      const base64 = btoa(utf8Bytes);
      return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    };
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const dataToSign = `${encodedHeader}.${encodedPayload}`;

    // HMAC-SHA256签名
    const encoder = new TextEncoder();
    const keyData = encoder.encode(apiKeySecret);
    const messageData = encoder.encode(dataToSign);
    const cryptoKey = await crypto.subtle.importKey('raw', keyData, {
      name: 'HMAC',
      hash: 'SHA-256'
    }, false, ['sign']);
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    const token = `${encodedHeader}.${encodedPayload}.${encodedSignature}`;

    // 调用智谱AI API
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: messages,
        temperature: temperature,
        top_p: top_p,
        max_tokens: max_tokens
      })
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('智谱API错误:', errorData);
      return res.status(response.status).json({
        error: 'AI服务返回错误',
        details: errorData
      });
    }
    const data = await response.json();

    // 返回结果
    return res.status(200).json(data);
  } catch (error) {
    console.error('API代理错误:', error);
    return res.status(500).json({
      error: '服务器内部错误',
      message: error.message
    });
  }
}
//# sourceMappingURL=chat.js.map