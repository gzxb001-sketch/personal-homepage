// ==================== 公子小白AI助手 ====================

class AIAssistant {
    constructor() {
        this.container = null;
        this.toggleBtn = null;
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;

        this.init();
    }

    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createUI());
        } else {
            this.createUI();
        }
    }

    createUI() {
        // 创建容器
        this.container = document.createElement('div');
        this.container.className = 'ai-assistant-container';
        this.container.innerHTML = `
            <!-- 切换按钮 -->
            <button id="aiAssistantToggle" class="ai-assistant-toggle" aria-label="打开AI助手">
                <span class="ai-icon">🤖</span>
                <span class="ai-badge">AI</span>
            </button>

            <!-- 聊天窗口 -->
            <div id="aiAssistantChat" class="ai-assistant-chat hidden" role="dialog" aria-modal="true" aria-label="AI助手对话">
                <!-- 头部 -->
                <div class="ai-chat-header">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background: var(--gradient-neon);">
                            <span class="text-xl">🤖</span>
                        </div>
                        <div>
                            <h3 class="font-bold" style="color: var(--text-primary);">公子小白AI助手</h3>
                            <p class="text-xs" style="color: var(--text-muted);">随时为您服务</p>
                        </div>
                    </div>
                    <button id="aiAssistantClose" class="ai-chat-close" aria-label="关闭AI助手">×</button>
                </div>

                <!-- 消息区域 -->
                <div id="aiChatMessages" class="ai-chat-messages" role="log" aria-live="polite" aria-atomic="false">
                    <!-- 欢迎消息 -->
                    <div class="ai-message ai-message-assistant">
                        <div class="ai-message-content">
                            <p>你好！👋 我是公子小白的AI助手。我可以帮你：</p>
                            <ul class="mt-2 space-y-1">
                                <li>📂 介绍我的项目</li>
                                <li>🛠️ 解答技术问题</li>
                                <li>📝 分享学习经验</li>
                                <li>💬 聊聊天、提供建议</li>
                            </ul>
                            <p class="mt-2">有什么想问的吗？</p>
                        </div>
                        <div class="ai-message-avatar">🤖</div>
                    </div>
                </div>

                <!-- 输入区域 -->
                <div class="ai-chat-input-area">
                    <div class="ai-chat-input-wrapper">
                        <input
                            type="text"
                            id="aiChatInput"
                            class="ai-chat-input"
                            placeholder="输入消息..."
                            aria-label="输入消息"
                        >
                        <button id="aiChatSend" class="ai-chat-send" aria-label="发送消息">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                            </svg>
                        </button>
                    </div>
                    <div class="ai-chat-suggestions">
                        <button class="ai-suggestion-btn" data-message="介绍一下你的项目">介绍一下你的项目</button>
                        <button class="ai-suggestion-btn" data-message="你擅长什么技术？">你擅长什么技术？</button>
                        <button class="ai-suggestion-btn" data-message="如何学习AI开发？">如何学习AI开发？</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.container);
        this.bindEvents();
    }

    bindEvents() {
        this.toggleBtn = document.getElementById('aiAssistantToggle');
        const chatWindow = document.getElementById('aiAssistantChat');
        const closeBtn = document.getElementById('aiAssistantClose');
        const sendBtn = document.getElementById('aiChatSend');
        const input = document.getElementById('aiChatInput');

        // 切换按钮
        this.toggleBtn?.addEventListener('click', () => this.toggle());

        // 关闭按钮
        closeBtn?.addEventListener('click', () => this.close());

        // 发送按钮
        sendBtn?.addEventListener('click', () => this.sendMessage());

        // 输入框回车发送
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // 建议按钮
        document.querySelectorAll('.ai-suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.dataset.message;
                if (input) {
                    input.value = message;
                    this.sendMessage();
                }
            });
        });

        // 点击外部关闭
        document.addEventListener('click', (e) => {
            if (this.isOpen &&
                !this.container.contains(e.target) &&
                !e.target.closest('.ai-assistant-container')) {
                this.close();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        const chatWindow = document.getElementById('aiAssistantChat');
        if (chatWindow) {
            chatWindow.classList.remove('hidden');
            chatWindow.classList.add('active');
            this.isOpen = true;

            // 聚焦输入框
            setTimeout(() => {
                const input = document.getElementById('aiChatInput');
                if (input) {
                    input.focus();
                }
            }, 300);
        }
    }

    close() {
        const chatWindow = document.getElementById('aiAssistantChat');
        if (chatWindow) {
            chatWindow.classList.remove('active');
            chatWindow.classList.add('hidden');
            this.isOpen = false;
        }
    }

    sendMessage() {
        const input = document.getElementById('aiChatInput');
        const message = input?.value.trim();

        if (!message || this.isTyping) return;

        // 添加用户消息
        this.addMessage(message, 'user');

        // 清空输入框
        if (input) {
            input.value = '';
        }

        // 模拟AI回复
        this.isTyping = true;
        this.showTypingIndicator();

        // 模拟思考时间
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessage(response, 'assistant');
            this.isTyping = false;
        }, 1000 + Math.random() * 1000);
    }

    addMessage(text, type) {
        const messagesContainer = document.getElementById('aiChatMessages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ai-message-${type}`;

        if (type === 'assistant') {
            messageDiv.innerHTML = `
                <div class="ai-message-content">
                    <p>${text}</p>
                </div>
                <div class="ai-message-avatar">🤖</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="ai-message-avatar">👤</div>
                <div class="ai-message-content">
                    <p>${text}</p>
                </div>
            `;
        }

        messagesContainer.appendChild(messageDiv);

        // 滚动到底部
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('aiChatMessages');
        if (!messagesContainer) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message ai-message-assistant ai-typing-indicator';
        typingDiv.innerHTML = `
            <div class="ai-message-avatar">🤖</div>
            <div class="ai-message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.querySelector('.ai-typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();

        // 项目相关
        if (lowerMessage.includes('项目') || lowerMessage.includes('做')) {
            return `我目前有7个项目，主要包括：

🤖 **AI Agent项目**（5个）：
- 英语学习助手：提供24/7个性化学习辅导
- 第二大脑：智能知识管理工具
- 变量命名智能体：帮助开发者智能生成变量名
- 每日AI资讯：自动抓取推送行业动态
- AI面试助手：求职面试全流程辅导

💻 **Web开发**：
- 羽生结弦粉丝主页：粉丝互动专题网站

📱 **微信小程序**：
- 蛋指标测量者：AI视觉自动测量工具

想了解哪个项目的详细信息呢？`;
        }

        // 技术栈相关
        if (lowerMessage.includes('技术') || lowerMessage.includes('擅长') || lowerMessage.includes('栈')) {
            return `我的技术栈主要包括：

🤖 **AI & LLM**：
- Coze平台（熟练度85%）
- Claude API（70%）
- GPT-4（75%）
- Prompt工程（80%）

💻 **前端开发**：
- HTML/CSS（90%）
- JavaScript（80%）
- React（60%）
- Tailwind CSS（75%）

⚙️ **后端开发**：
- Python（70%）
- Node.js（50%）
- Flask（60%）

🛠️ **开发工具**：
- Git（75%）
- VS Code（85%）
- Figma（65%）

我对AI辅助编程特别感兴趣，目前正在深入学习中！`;
        }

        // 学习相关
        if (lowerMessage.includes('学习') || lowerMessage.includes('怎么') || lowerMessage.includes('如何')) {
            return `我的学习经验分享：

📚 **学习路径**：
1. 基础知识：HTML/CSS/JavaScript → Python基础
2. AI入门：学习Prompt工程、了解LLM原理
3. 实战项目：从Coze平台开始，逐步构建AI Agent
4. 持续迭代：在实践中学习，在项目中成长

💡 **学习建议**：
- 保持每日学习（我已坚持200+天）
- 做中学：项目驱动学习
- 记录笔记：建立知识体系
- 分享交流：加入技术社区

🎯 **推荐资源**：
- Way to AGI训练营
- Claude官方文档
- GitHub开源项目
- 技术博客和社区

有具体想了解的方向吗？我可以详细分享！`;
        }

        // 个人相关
        if (lowerMessage.includes('你是') || lowerMessage.includes('介绍') || lowerMessage.includes('谁')) {
            return `我是公子小白，一名AI爱好者和Agent搭建者！👋

🎓 **背景**：
- 农学专业学生 → AI开发者（跨界转型）
- Way to AGI Coze训练营学员
- 200+天持续学习实践者

💡 **理念**：
- "不待扬鞭自奋蹄" - 主动学习，持续进步
- Vibe Coding实践者 - 相信AI+代码的力量
- 用AI探索无限可能，用代码构建美好未来

🎯 **当前目标**：
- 深入学习AI技术
- 构建更多有价值的AI Agent
- 分享经验，帮助更多人入门AI

很高兴认识你！有什么想聊的吗？`;
        }

        // 联系方式
        if (lowerMessage.includes('联系') || lowerMessage.includes('微信') || lowerMessage.includes('github')) {
            return `你可以通过以下方式联系我：

🔗 **GitHub**：github.com/gzxb001-sketch
💬 **微信**：查看主页的"联系我"页面
📧 **邮箱**：可以在GitHub联系我

期待与你的交流！😊`;
        }

        // 默认回复
        const defaultResponses = [
            '有趣的问题！作为AI学习者和实践者，我正在不断探索和成长。你想了解我的项目、技术栈，还是学习经验呢？',
            '感谢你的提问！我目前主要专注在AI Agent开发和Web开发方面。有什么具体想聊的吗？',
            '好问题！我虽然还在学习阶段，但很乐意分享我的经验和想法。你对我哪个方面比较感兴趣呢？',
            '让我想想...作为一个正在成长的AI开发者，我相信持续学习和实践是最重要的。你有具体想了解的吗？'
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
}

// ==================== AI助手样式 ====================
const aiAssistantStyles = `
    .ai-assistant-container {
        position: fixed;
        bottom: 100px;
        right: 30px;
        z-index: 9999;
    }

    .ai-assistant-toggle {
        position: relative;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: var(--gradient-neon);
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .ai-assistant-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
    }

    .ai-icon {
        font-size: 28px;
    }

    .ai-badge {
        position: absolute;
        top: -2px;
        right: -2px;
        background: #fff;
        color: var(--accent);
        font-size: 10px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 10px;
    }

    .ai-assistant-chat {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 380px;
        max-width: calc(100vw - 60px);
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        transition: all 0.3s ease;
        pointer-events: none;
    }

    .ai-assistant-chat.active {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: all;
    }

    .ai-chat-header {
        padding: 16px;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--bg-secondary);
    }

    .ai-chat-close {
        background: none;
        border: none;
        font-size: 24px;
        color: var(--text-muted);
        cursor: pointer;
        padding: 4px 8px;
        line-height: 1;
        transition: color 0.2s ease;
    }

    .ai-chat-close:hover {
        color: var(--text-primary);
    }

    .ai-chat-messages {
        height: 400px;
        max-height: 60vh;
        overflow-y: auto;
        padding: 16px;
        background: var(--bg-primary);
    }

    .ai-message {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
        animation: fadeIn 0.3s ease;
    }

    .ai-message-user {
        flex-direction: row-reverse;
    }

    .ai-message-content {
        max-width: 80%;
        padding: 12px 16px;
        border-radius: 12px;
        line-height: 1.6;
    }

    .ai-message-assistant .ai-message-content {
        background: var(--bg-secondary);
        color: var(--text-primary);
        border-bottom-left-radius: 4px;
    }

    .ai-message-user .ai-message-content {
        background: var(--gradient-neon);
        color: white;
        border-bottom-right-radius: 4px;
    }

    .ai-message-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        background: var(--bg-secondary);
        flex-shrink: 0;
    }

    .typing-dots {
        display: flex;
        gap: 4px;
        padding: 8px;
    }

    .typing-dots span {
        width: 8px;
        height: 8px;
        background: var(--text-muted);
        border-radius: 50%;
        animation: bounce 1.4s infinite ease-in-out both;
    }

    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

    .ai-chat-input-area {
        padding: 16px;
        border-top: 1px solid var(--border-color);
        background: var(--bg-secondary);
    }

    .ai-chat-input-wrapper {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
    }

    .ai-chat-input {
        flex: 1;
        padding: 12px 16px;
        border: 1px solid var(--border-color);
        border-radius: 24px;
        background: var(--bg-primary);
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s ease;
    }

    .ai-chat-input:focus {
        border-color: var(--accent);
    }

    .ai-chat-send {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: var(--gradient-neon);
        border: none;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }

    .ai-chat-send:hover {
        transform: scale(1.05);
    }

    .ai-chat-suggestions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }

    .ai-suggestion-btn {
        padding: 8px 12px;
        background: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        font-size: 12px;
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .ai-suggestion-btn:hover {
        background: var(--gradient-subtle);
        border-color: var(--accent);
        color: var(--accent);
    }

    @media (max-width: 480px) {
        .ai-assistant-chat {
            width: calc(100vw - 40px);
            right: -110px;
        }

        .ai-chat-messages {
            height: 300px;
        }
    }
`;

// 注入样式
const styleSheet = document.createElement('style');
styleSheet.textContent = aiAssistantStyles;
document.head.appendChild(styleSheet);

// ==================== 初始化AI助手 ====================
let aiAssistant;
document.addEventListener('DOMContentLoaded', () => {
    aiAssistant = new AIAssistant();
});

// 导出到全局
window.aiAssistant = aiAssistant;
