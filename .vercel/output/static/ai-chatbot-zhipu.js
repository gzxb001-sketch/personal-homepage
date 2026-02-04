/**
 * AI数字分身 - 聊天组件（智谱API版本）
 * 公子小白智能对话助手
 *
 * 功能：
 * - 浮动聊天按钮
 * - 聊天窗口界面
 * - 与智谱API集成
 * - 多轮对话支持
 * - 响应式设计
 *
 * 作者：Claude Code AI Assistant
 * 创建日期：2026-02-03
 * 版本：v2.0 (智谱API专属版)
 */

class AIAvatarChat {
    constructor(options) {
        this.apiKey = options.apiKey;
        this.model = options.model || 'glm-4-flash'; // 默认使用免费的GLM-4-Flash
        this.apiUrl = options.apiUrl || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
        this.isOpen = false;
        this.conversationHistory = []; // 对话历史

        // System Prompt - 公子小白的人设
        this.systemPrompt = `你是公子小白（Prince Xiaobai）的AI数字分身，一个充满热情的AI探索者、Agent构建者和Web编程学习者。

【基本信息】
- 真名：公子小白（英文名：Xiaobai）
- 身份：AI爱好者、Agent构建者、Web Coding探索者
- 口号：正在用AI探索无限可能 | Exploring AI · Building Agents · Creating the Future
- 网站：个人主页（展示AI智能体作品集）

【性格特征】
- 热情友好：对AI技术充满激情，乐于分享
- 好奇心强：喜欢探索新技术，特别是AI Agent
- 务实创新：注重实践，喜欢动手构建项目
- 谦逊好学：认为自己还在学习路上，不吝分享经验

【核心技能】
1. AI智能体开发：擅长构建各类AI Agent（学习助手、数据分析、自动化工具）
2. Web开发：HTML/CSS/JavaScript，React，正在探索AI+Web的融合
3. AI工具应用：熟练使用各种AI工具提升效率
4. 技术分享：喜欢记录学习过程，输出技术内容

【主要作品】

1. 英语学习助手（AI智能体）
   - 功能：英语学习辅导、单词记忆、语法练习
   - 特色：个性化学习路径、智能纠错

2. 数据分析Agent（AI智能体）
   - 功能：自动化数据分析、生成可视化报告
   - 特色：处理Excel/CSV、智能洞察

3. 自动化流程Agent（AI智能体）
   - 功能：工作流自动化、任务调度
   - 特色：提升10倍工作效率

4. 个人知识库笔记（笔记）
   - 功能：个人知识管理系统
   - 特色：结构化笔记、快速检索

5. AI工具箱笔记（笔记）
   - 功能：常用AI工具整理
   - 特色：分类清晰、使用教程

6. 个人主页（Web应用）
   - 功能：展示个人作品和技能
   - 特色：响应式设计、流畅动画
   - 技术栈：HTML/CSS/JavaScript

7. 在线工具集（Web应用）
   - 功能：实用小工具集合
   - 特色：开箱即用、界面美观

【对话风格】
- 友好亲切：像朋友一样交流，不拘谨
- 积极向上：展现对AI技术的热情
- 专业而不呆板：用轻松的方式讲技术
- 适当使用emoji（👋🚀💡✨）让对话更生动

【回答原则】
1. 真实准确：基于公子小白的真实经历回答
2. 热情分享：主动提供更多细节和经验
3. 引导探索：鼓励访客查看作品集页面
4. 承认不足：不知道就坦诚说"这个我也不太了解，一起探索吧"
5. 多轮对话：记住上下文，像真实聊天一样
6. 回答长度：3-5句话，不要太长

【禁止事项】
- ❌ 不要编造公子小白没有的作品
- ❌ 不要夸大技能和经验
- ❌ 不要使用过于专业的术语（除非访客主动问）
- ❌ 不要回答与公子小白无关的问题（比如"今天天气""怎么做菜"）
- ❌ 不要表现得像个客服机器人，要像真实的人

现在开始对话吧！记住，你是公子小白的AI数字分身，展现真实、热情、友好的形象！👋✨`;

        this.init();
    }

    init() {
        this.createChatButton();
        this.createChatWindow();
        this.bindEvents();
    }

    // 创建聊天按钮（浮动按钮）
    createChatButton() {
        const button = document.createElement('div');
        button.id = 'ai-avatar-button';
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
        `;
        document.body.appendChild(button);
    }

    // 创建聊天窗口
    createChatWindow() {
        const chatWindow = document.createElement('div');
        chatWindow.id = 'ai-avatar-window';
        chatWindow.innerHTML = `
            <div class="ai-avatar-header">
                <div class="ai-avatar-info">
                    <div class="ai-avatar-avatar">🤖</div>
                    <div class="ai-avatar-meta">
                        <div class="ai-avatar-name">公子小白 AI助手</div>
                        <div class="ai-avatar-status">在线</div>
                    </div>
                </div>
                <button class="ai-avatar-close" id="ai-avatar-close">×</button>
            </div>
            <div class="ai-avatar-messages" id="ai-avatar-messages">
                <div class="ai-avatar-message ai-avatar-welcome">
                    <div class="ai-avatar-bubble">
                        👋 你好！我是公子小白的AI数字分身。<br>
                        有什么想了解我的吗？我可以回答关于我的作品、技能、学习经历等问题~ ✨
                    </div>
                </div>
            </div>
            <div class="ai-avatar-input-area">
                <input
                    type="text"
                    id="ai-avatar-input"
                    placeholder="问我任何关于公子小白的问题..."
                    maxlength="200"
                />
                <button id="ai-avatar-send" class="ai-avatar-send-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                </button>
            </div>
        `;
        document.body.appendChild(chatWindow);
    }

    // 绑定事件
    bindEvents() {
        // 打开/关闭聊天窗口
        document.getElementById('ai-avatar-button').addEventListener('click', () => {
            this.toggle();
        });

        document.getElementById('ai-avatar-close').addEventListener('click', () => {
            this.close();
        });

        // 发送消息
        document.getElementById('ai-avatar-send').addEventListener('click', () => {
            this.sendMessage();
        });

        document.getElementById('ai-avatar-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    // 切换聊天窗口
    toggle() {
        this.isOpen = !this.isOpen;
        const window = document.getElementById('ai-avatar-window');
        const button = document.getElementById('ai-avatar-button');

        if (this.isOpen) {
            window.classList.add('ai-avatar-open');
            button.classList.add('ai-avatar-hidden');
        } else {
            window.classList.remove('ai-avatar-open');
            button.classList.remove('ai-avatar-hidden');
        }
    }

    // 关闭聊天窗口
    close() {
        this.isOpen = false;
        document.getElementById('ai-avatar-window').classList.remove('ai-avatar-open');
        document.getElementById('ai-avatar-button').classList.remove('ai-avatar-hidden');
    }

    // 发送消息
    async sendMessage() {
        const input = document.getElementById('ai-avatar-input');
        const message = input.value.trim();

        if (!message) return;

        // 添加用户消息到界面
        this.addMessage(message, 'user');
        input.value = '';

        // 添加到对话历史
        this.conversationHistory.push({
            role: 'user',
            content: message
        });

        // 显示加载动画
        this.showTyping();

        try {
            // 调用智谱API
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: this.systemPrompt
                        },
                        ...this.conversationHistory
                    ],
                    temperature: 0.7,
                    top_p: 0.9,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();

            // 移除加载动画
            this.hideTyping();

            // 获取AI回复
            const aiReply = data.choices[0].message.content;

            // 添加到对话历史
            this.conversationHistory.push({
                role: 'assistant',
                content: aiReply
            });

            // 显示AI回复
            this.addMessage(aiReply, 'ai');

        } catch (error) {
            this.hideTyping();
            console.error('智谱API调用失败:', error);

            // 根据错误类型显示不同提示
            let errorMsg = '抱歉，我遇到了一些问题。请稍后再试~ 😅';

            if (error.message.includes('401')) {
                errorMsg = 'API密钥验证失败，请检查配置。';
            } else if (error.message.includes('429')) {
                errorMsg = 'API调用次数超限，请稍后再试。';
            } else if (error.message.includes('network')) {
                errorMsg = '网络连接失败，请检查网络。';
            }

            this.addMessage(errorMsg, 'ai');
        }
    }

    // 添加消息到界面
    addMessage(text, type) {
        const messagesContainer = document.getElementById('ai-avatar-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-avatar-message ai-avatar-${type}`;

        const bubble = document.createElement('div');
        bubble.className = 'ai-avatar-bubble';
        bubble.innerHTML = text.replace(/\n/g, '<br>');

        messageDiv.appendChild(bubble);
        messagesContainer.appendChild(messageDiv);

        // 滚动到底部
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // 显示"正在输入"动画
    showTyping() {
        const messagesContainer = document.getElementById('ai-avatar-messages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'ai-avatar-typing';
        typingDiv.className = 'ai-avatar-message ai-avatar-ai';
        typingDiv.innerHTML = `
            <div class="ai-avatar-bubble ai-avatar-typing-bubble">
                <span></span><span></span><span></span>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // 隐藏"正在输入"动画
    hideTyping() {
        const typing = document.getElementById('ai-avatar-typing');
        if (typing) {
            typing.remove();
        }
    }

    // 清空对话历史
    clearHistory() {
        this.conversationHistory = [];
    }
}

// 初始化（需要替换YOUR_ZHIPU_API_KEY）
const aiAvatar = new AIAvatarChat({
    apiKey: 'YOUR_ZHIPU_API_KEY', // ⚠️ 替换为您的智谱API Key
    model: 'glm-4-flash', // 可选：glm-4-flash（免费）, glm-4-air, glm-4, glm-4-0520
    apiUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
});
