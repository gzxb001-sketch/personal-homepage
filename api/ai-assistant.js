/**
 * Vercel Serverless Function - AI助手API代理
 *
 * 功能：
 * 1. 代理前端请求到智谱AI
 * 2. 隐藏API Key（在环境变量中配置）
 * 3. 处理对话历史和系统提示词
 *
 * 环境变量配置（在Vercel Dashboard中设置）：
 * ZHIPU_API_KEY: 你的智谱AI API Key
 */

export default async function handler(req, res) {
    // 只允许POST请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 获取请求参数
        const { messages } = req.body;

        // 验证参数
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages parameter' });
        }

        // 获取API Key（从环境变量）
        const API_KEY = process.env.ZHIPU_API_KEY;

        if (!API_KEY) {
            console.error('❌ ZHIPU_API_KEY环境变量未设置');
            return res.status(500).json({
                error: 'API configuration error',
                message: '服务器端API配置有问题，请联系管理员'
            });
        }

        // 调用智谱AI API
        const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'glm-4-flash',  // 使用GLM-4-Flash（性价比高）
                messages: messages,
                temperature: 0.7,
                top_p: 0.9,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('❌ 智谱AI API调用失败:', response.status, errorData);
            return res.status(500).json({
                error: 'AI service error',
                message: 'AI服务暂时不可用，请稍后再试'
            });
        }

        const data = await response.json();

        // 返回AI回复
        return res.status(200).json(data);

    } catch (error) {
        console.error('❌ AI助手API错误:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: '服务器内部错误，请稍后再试'
        });
    }
}
