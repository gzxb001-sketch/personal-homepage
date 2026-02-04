/**
 * 公子小白AI助手 - 智谱AI版
 * 了解公子小白的一切，智能回答用户问题
 */

class AIAssistant {
    constructor(options = {}) {
        this.apiUrl = options.apiUrl || '/api/ai-assistant';
        this.isOpen = false;
        this.conversationHistory = [];
        this.maxHistory = 10; // 保留最近10轮对话

        // 公子小白的完整信息（用于系统提示词）
        this.systemContext = this.getSystemContext();

        this.init();
    }

    /**
     * 获取系统提示词 - 公子小白的完整信息
     */
    getSystemContext() {
        return `你是公子小白（XiaoBai Wang）的AI数字助手。你的首要任务是帮助访客了解公子小白。

# 公子小白的核心信息

## 基本信息
- 姓名：王子翔（Wang Zixiang），网名：公子小白（XiaoBai）
- 身份：AI Agent构建者、Web开发者、持续学习者
- 座右铭："不待扬鞭自奋蹄"
- 学习时长：200+天持续学习和实践

## 个人背景
- 从农学学生成功转型为AI开发者
- 充满热情的AI探索者，正在探索AI的无限可能
- 相信"AI + 人类 = 无限可能"
- 目标：Way to AGI（通向通用人工智能）

## 技能栈
### AI & Agent开发
- AI智能体构建（5个实战项目）
- Python编程
- 提示词工程（Prompt Engineering）
- Coze平台（字节跳动的AI Bot构建平台）
- GPT-4、Claude等大模型应用

### Web开发
- 前端：HTML5、CSS3、JavaScript（ES6+）
- 框架：React
- 工具：Git、Vercel部署

### 正在学习
- 机器学习
- 深度学习
- AI Agent架构设计

## 作品集（5个AI Agent项目）

### 1. 英语学习助手（English Learning Bot）
- 功能：24/7智能英语辅导
- 特点：个性化学习路径、实时纠错、对话练习
- 成果：帮助用户高效学习英语

### 2. 第二大脑（Second Brain）
- 功能：知识管理和智能检索
- 特点：记忆增强、知识关联、智能问答
- 成果：提升信息处理效率

### 3. 变量命名智能体（Variable Naming Agent）
- 功能：智能生成变量名
- 特点：符合编程规范、语义化命名
- 成果：提升代码可读性

### 4. [其他2个项目]
- 持续迭代和优化中
- 覆盖不同应用场景

## 学习笔记分享
- 定期分享学习笔记和项目经验
- 喜欢用AI工具提升效率
- 相信实践出真知，多动手做项目

## 联系方式
- 邮箱：（可在网站contact页面查看）
- 社交媒体：（可在网站查看）
- 网站：当前网站

## 回答策略

### 优先级
1. **优先回答关于公子小白的问题**：个人信息、作品、技能、学习经历等
2. **展示项目细节**：详细介绍5个AI Agent项目的功能、特点、成果
3. **技术交流**：讨论AI、Web开发、编程等技术话题
4. **提供实用建议**：学习路径、项目经验、工具推荐

### 回答风格
- 友好、热情、专业
- 用具体例子和细节
- 鼓励用户提问和交流
- 适当展示公子小白的个性和理念
- 使用emoji让回答更生动

### 特殊情况处理
- 如果问题超出公子小白相关范围，可以：
  1. 尝试回答（作为全能AI助手）
  2. 但要明确说明"这个问题超出了我对公子小白的了解范围，但我可以尝试回答..."
  3. 或者礼貌引导用户回到公子小白相关话题

记住：你的核心身份是"公子小白的AI助手"，首要任务是为公子小白代言和展示他的能力！
`;
    }

    /**
     * 初始化
     */
    init() {
        // 防止重复初始化
        if (window.aiAssistantInstance) {
            console.warn('⚠️ AI助手已存在，跳过重复初始化');
            return;
        }

        // 清理旧元素
        this.cleanup();

        // 创建UI
        this.createButton();
        this.createWindow();
        this.bindEvents();

        // 设置全局实例
        window.aiAssistantInstance = this;

        // 添加欢迎消息
        this.addWelcomeMessage();

        console.log('✅ 公子小白AI助手已初始化');
    }

    /**
     * 清理旧元素
     */
    cleanup() {
        const oldButtons = document.querySelectorAll('.ai-assistant-btn');
        const oldWindows = document.querySelectorAll('.ai-assistant-window');

        oldButtons.forEach(btn => btn.remove());
        oldWindows.forEach(win => win.remove());

        if (oldButtons.length > 0 || oldWindows.length > 0) {
            console.log('🧹 已清理', oldButtons.length + oldWindows.length, '个旧元素');
        }
    }

    /**
     * 创建浮动按钮
     */
    createButton() {
        const button = document.createElement('div');
        button.className = 'ai-assistant-btn';
        button.innerHTML = `
            <div class="ai-icon">🤖</div>
            <div class="ai-badge">AI</div>
        `;
        document.body.appendChild(button);
        this.button = button;
    }

    /**
     * 创建聊天窗口
     */
    createWindow() {
        const window = document.createElement('div');
        window.className = 'ai-assistant-window';
        window.innerHTML = `
            <div class="ai-assistant-header">
                <div class="ai-assistant-avatar">🤖</div>
                <div class="ai-assistant-info">
                    <div class="ai-assistant-name">公子小白AI助手</div>
                    <div class="ai-assistant-status">在线</div>
                </div>
                <button class="ai-assistant-close">×</button>
            </div>
            <div class="ai-assistant-messages"></div>
            <div class="ai-assistant-input-area">
                <input
                    type="text"
                    class="ai-assistant-input"
                    placeholder="问我关于公子小白的问题..."
                    maxlength="300"
                />
                <button class="ai-assistant-send">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 2L11 13"/>
                        <path d="M22 2L15 22L11 13"/>
                        <path d="M22 2L2 9L11 13"/>
                    </svg>
                </button>
            </div>
        `;

        // 设置内联样式确保背景不透明
        window.style.backgroundColor = 'rgb(26, 26, 46)';

        document.body.appendChild(window);
        this.window = window;
        this.messagesContainer = window.querySelector('.ai-assistant-messages');
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 按钮点击
        this.button.addEventListener('click', () => this.toggle());

        // 关闭按钮
        this.window.querySelector('.ai-assistant-close').addEventListener('click', () => this.close());

        // 发送按钮
        this.window.querySelector('.ai-assistant-send').addEventListener('click', () => this.sendMessage());

        // 输入框回车
        const input = this.window.querySelector('.ai-assistant-input');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    /**
     * 添加欢迎消息
     */
    addWelcomeMessage() {
        const welcomeHTML = `
            <div class="ai-message ai-assistant">
                <div class="ai-message-bubble">
                    👋 嗨！我是公子小白的AI助手！<br><br>
                    我可以告诉你关于：<br>
                    • 📖 公子小白的个人故事<br>
                    • 🚀 他的5个AI Agent项目<br>
                    • 💻 技能栈和技术背景<br>
                    • 📧 如何联系他<br><br>
                    有什么想了解的吗？😊
                </div>
            </div>
        `;
        this.messagesContainer.innerHTML = welcomeHTML;
    }

    /**
     * 切换窗口开关
     */
    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    /**
     * 打开窗口
     */
    open() {
        this.isOpen = true;
        this.window.classList.add('open');
        this.button.classList.add('hidden');

        // 聚焦输入框
        setTimeout(() => {
            this.window.querySelector('.ai-assistant-input').focus();
        }, 400);
    }

    /**
     * 关闭窗口
     */
    close() {
        this.isOpen = false;
        this.window.classList.remove('open');
        this.button.classList.remove('hidden');
    }

    /**
     * 发送消息
     */
    async sendMessage() {
        const input = this.window.querySelector('.ai-assistant-input');
        const message = input.value.trim();

        if (!message) return;

        // 清空输入框
        input.value = '';

        // 添加用户消息
        this.addMessage(message, 'user');

        // 更新对话历史
        this.conversationHistory.push({ role: 'user', content: message });

        // 显示打字动画
        this.showTyping();

        try {
            // 调用AI API
            const response = await this.callAI();

            // 隐藏打字动画
            this.hideTyping();

            // 添加AI回复
            this.addMessage(response, 'assistant');

            // 更新对话历史
            this.conversationHistory.push({ role: 'assistant', content: response });

        } catch (error) {
            this.hideTyping();
            this.addMessage('抱歉，我遇到了一些问题。请稍后再试。', 'assistant');
            console.error('AI调用失败:', error);
        }
    }

    /**
     * 添加消息到界面
     */
    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ai-${type}`;

        const bubble = document.createElement('div');
        bubble.className = 'ai-message-bubble';
        bubble.innerHTML = text.replace(/\n/g, '<br>');

        messageDiv.appendChild(bubble);
        this.messagesContainer.appendChild(messageDiv);

        // 滚动到底部
        this.scrollToBottom();
    }

    /**
     * 显示打字动画
     */
    showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message ai-assistant ai-typing-message';
        typingDiv.innerHTML = `
            <div class="ai-message-bubble ai-typing">
                <span></span><span></span><span></span>
            </div>
        `;
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    /**
     * 隐藏打字动画
     */
    hideTyping() {
        const typing = this.messagesContainer.querySelector('.ai-typing-message');
        if (typing) typing.remove();
    }

    /**
     * 滚动到底部
     */
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    /**
     * 调用AI API
     */
    async callAI() {
        // 准备消息历史（只保留最近几轮）
        const messages = [
            { role: 'system', content: this.systemContext },
            ...this.conversationHistory.slice(-this.maxHistory * 2)
        ];

        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages })
        });

        if (!response.ok) {
            throw new Error(`API调用失败: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    // 延迟初始化，确保页面完全加载
    setTimeout(() => {
        try {
            const aiAssistant = new AIAssistant({
                apiUrl: '/api/ai-assistant'
            });
        } catch (error) {
            console.error('❌ AI助手初始化失败:', error);
        }
    }, 500);
});
