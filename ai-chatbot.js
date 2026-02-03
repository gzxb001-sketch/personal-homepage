/**
 * AI数字分身 - 聊天组件
 * 公子小白智能对话助手
 *
 * 功能：
 * - 浮动聊天按钮
 * - 聊天窗口界面
 * - 与Dify API集成
 * - 多轮对话支持
 * - 响应式设计
 */

class AIAvatarChat {
    constructor(options) {
        this.apiKey = options.apiKey;
        this.apiUrl = options.apiUrl || 'https://api.dify.ai/v1/chat-messages';
        this.isOpen = false;
        this.conversationId = null;
        this.messages = [];

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

        // 显示加载动画
        this.showTyping();

        try {
            // 调用Dify API
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: {},
                    query: message,
                    response_mode: 'blocking',
                    conversation_id: this.conversationId || '',
                    user: 'web-visitor-' + Date.now()
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            // 保存conversation_id用于多轮对话
            if (data.conversation_id) {
                this.conversationId = data.conversation_id;
            }

            // 移除加载动画
            this.hideTyping();

            // 添加AI回复
            this.addMessage(data.answer, 'ai');

        } catch (error) {
            this.hideTyping();
            this.addMessage('抱歉，我遇到了一些问题。请稍后再试~ 😅', 'ai');
            console.error('AI Chat Error:', error);
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
}

// 初始化（需要替换YOUR_API_KEY）
const aiAvatar = new AIAvatarChat({
    apiKey: 'YOUR_API_KEY', // ⚠️ 替换为你的Dify API Key
    apiUrl: 'https://api.dify.ai/v1/chat-messages'
});
