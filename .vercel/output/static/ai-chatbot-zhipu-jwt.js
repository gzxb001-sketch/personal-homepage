/**
 * AI数字分身 - 聊天组件（智谱API JWT版本 - 修复版）
 * 公子小白智能对话助手
 *
 * 版本：v2.2 (JWT Token 修复版)
 * 修复：JWT生成逻辑、时间戳格式
 */

class AIAvatarChat {
    constructor(options) {
        this.apiKey = options.apiKey;
        this.model = options.model || 'glm-4-flash';
        this.apiUrl = options.apiUrl || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
        this.isOpen = false;

        // 从localStorage加载对话历史（跨页面同步）
        this.conversationHistory = this.loadHistory();

        // 解析API Key
        this.apiKeyId = this.apiKey.split('.')[0];
        this.apiKeySecret = this.apiKey.split('.')[1];

        // System Prompt
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
        this.bindOutsideClick();
        this.makeDraggable(); // 添加拖拽功能
        this.loadButtonPosition(); // 加载按钮位置
        this.loadPosition(); // 加载窗口位置
    }

    // 从localStorage加载对话历史
    loadHistory() {
        try {
            const saved = localStorage.getItem('aiAvatarConversation');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('加载对话历史失败:', error);
            return [];
        }
    }

    // 保存对话历史到localStorage
    saveHistory() {
        try {
            localStorage.setItem('aiAvatarConversation', JSON.stringify(this.conversationHistory));
        } catch (error) {
            console.error('保存对话历史失败:', error);
        }
    }

    // 绑定点击外部关闭
    bindOutsideClick() {
        document.addEventListener('click', (e) => {
            if (this.isOpen) {
                const window = document.getElementById('ai-avatar-window');
                const button = document.getElementById('ai-avatar-button');

                // 如果点击的不是窗口内部，也不是按钮
                if (!window.contains(e.target) && !button.contains(e.target)) {
                    this.close();
                }
            }
        });
    }

    // Base64Url编码（修复版）
    base64UrlEncode(str) {
        // 将字符串转换为UTF-8字节数组
        const utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            (match, p1) => String.fromCharCode('0x' + p1)
        );

        // 转换为Base64
        const base64 = btoa(utf8Bytes);

        // 转换为Base64Url格式
        return base64
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    // 生成JWT Token（修复版 - 异步函数）
    async generateToken() {
        try {
            const header = {
                alg: 'HS256',
                sign_type: 'SIGN'
            };

            const now = Date.now();
            const timestamp = Math.floor(now / 1000); // 转换为秒级时间戳

            const payload = {
                api_key: this.apiKeyId,
                exp: timestamp + 3600, // 1小时后过期（秒级）
                timestamp: timestamp
            };

            const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
            const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));

            const dataToSign = `${encodedHeader}.${encodedPayload}`;

            // 等待HMAC-SHA256签名完成
            const signature = await this.hmacSHA256(dataToSign, this.apiKeySecret);
            const encodedSignature = signature
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=/g, '');

            return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
        } catch (error) {
            console.error('JWT生成失败:', error);
            throw error;
        }
    }

    // HMAC-SHA256签名
    async hmacSHA256(message, secret) {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secret);
        const messageData = encoder.encode(message);

        const key = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );

        const signature = await crypto.subtle.sign('HMAC', key, messageData);
        return btoa(String.fromCharCode(...new Uint8Array(signature)));
    }

    // 创建聊天按钮
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
        // 按钮点击事件已移除 - 现在集成在拖拽功能中（智能区分点击和拖拽）

        document.getElementById('ai-avatar-close').addEventListener('click', () => {
            this.close();
        });

        document.getElementById('ai-avatar-send').addEventListener('click', () => {
            this.sendMessage();
        });

        document.getElementById('ai-avatar-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        const window = document.getElementById('ai-avatar-window');
        const button = document.getElementById('ai-avatar-button');

        if (this.isOpen) {
            window.classList.add('ai-avatar-open');
            button.classList.add('ai-avatar-hidden');

            // 每次打开都重新加载最新的历史记录
            this.conversationHistory = this.loadHistory();
            this.loadHistoryMessages();
        } else {
            window.classList.remove('ai-avatar-open');
            button.classList.remove('ai-avatar-hidden');
        }
    }

    // 加载并显示历史消息
    loadHistoryMessages() {
        const messagesContainer = document.getElementById('ai-avatar-messages');

        // 清空现有消息（保留欢迎消息）
        const welcomeMsg = messagesContainer.querySelector('.ai-avatar-welcome');
        messagesContainer.innerHTML = '';
        if (welcomeMsg) {
            messagesContainer.appendChild(welcomeMsg);
        }

        // 显示历史对话
        this.conversationHistory.forEach(msg => {
            if (msg.role === 'user') {
                this.addMessageToDOM(msg.content, 'user');
            } else if (msg.role === 'assistant') {
                this.addMessageToDOM(msg.content, 'ai');
            }
        });

        // 滚动到底部
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // 添加消息到DOM（不更新历史记录，用于加载历史消息）
    addMessageToDOM(text, type) {
        const messagesContainer = document.getElementById('ai-avatar-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-avatar-message ai-avatar-${type}`;

        const bubble = document.createElement('div');
        bubble.className = 'ai-avatar-bubble';
        bubble.innerHTML = text.replace(/\n/g, '<br>');

        messageDiv.appendChild(bubble);
        messagesContainer.appendChild(messageDiv);
    }

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

        this.addMessage(message, 'user');
        input.value = '';

        this.conversationHistory.push({
            role: 'user',
            content: message
        });

        // 保存到localStorage（跨页面同步）
        this.saveHistory();

        this.showTyping();

        try {
            console.log('正在生成JWT Token...');
            // 生成JWT Token
            const token = await this.generateToken();
            console.log('JWT Token生成成功');

            console.log('正在调用智谱API...');
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
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

            console.log('API响应状态:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API错误详情:', errorData);
                throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            console.log('API响应成功');
            this.hideTyping();

            const aiReply = data.choices[0].message.content;
            this.conversationHistory.push({
                role: 'assistant',
                content: aiReply
            });

            // 保存到localStorage（跨页面同步）
            this.saveHistory();

            this.addMessage(aiReply, 'ai');

        } catch (error) {
            this.hideTyping();
            console.error('智谱API调用失败:', error);

            let errorMsg = '抱歉，我遇到了一些问题。请稍后再试~ 😅';

            if (error.message.includes('401')) {
                errorMsg = 'API密钥验证失败，请检查配置。';
            } else if (error.message.includes('429')) {
                errorMsg = 'API调用次数超限，请稍后再试。';
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                errorMsg = '网络连接失败，请检查网络。';
            }

            this.addMessage(errorMsg, 'ai');
        }
    }

    addMessage(text, type) {
        const messagesContainer = document.getElementById('ai-avatar-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-avatar-message ai-avatar-${type}`;

        const bubble = document.createElement('div');
        bubble.className = 'ai-avatar-bubble';
        bubble.innerHTML = text.replace(/\n/g, '<br>');

        messageDiv.appendChild(bubble);
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

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

    hideTyping() {
        const typing = document.getElementById('ai-avatar-typing');
        if (typing) {
            typing.remove();
        }
    }

    clearHistory() {
        this.conversationHistory = [];
        localStorage.removeItem('aiAvatarConversation'); // 清除localStorage
    }

    // ========== 拖拽功能 ==========

    // 从localStorage加载窗口位置
    loadPosition() {
        try {
            const savedPosition = localStorage.getItem('aiAvatarWindowPosition');
            if (savedPosition) {
                const { left, bottom } = JSON.parse(savedPosition);
                const chatWindow = document.getElementById('ai-avatar-window');
                const button = document.getElementById('ai-avatar-button');

                // 应用保存的位置
                chatWindow.style.left = left + 'px';
                chatWindow.style.right = 'auto';
                chatWindow.style.bottom = bottom + 'px';

                // 同步按钮位置（按钮紧跟在窗口下方）
                button.style.left = left + 'px';
                button.style.right = 'auto';

                // 验证位置是否在可视区域内，如果不在则重置
                const rect = chatWindow.getBoundingClientRect();
                if (rect.right < 0 || rect.left > window.innerWidth ||
                    rect.bottom < 0 || rect.top > window.innerHeight) {
                    this.resetPosition();
                }
            }
        } catch (error) {
            console.error('加载窗口位置失败:', error);
            this.resetPosition();
        }
    }

    // 保存窗口位置到localStorage
    savePosition(left, bottom) {
        try {
            localStorage.setItem('aiAvatarWindowPosition', JSON.stringify({ left, bottom }));
        } catch (error) {
            console.error('保存窗口位置失败:', error);
        }
    }

    // 重置到默认位置
    resetPosition() {
        const chatWindow = document.getElementById('ai-avatar-window');
        const button = document.getElementById('ai-avatar-button');

        chatWindow.style.left = 'auto';
        chatWindow.style.right = '30px';
        chatWindow.style.bottom = '170px'; // 更新为新的默认位置

        button.style.left = 'auto';
        button.style.right = '30px';
        button.style.bottom = '100px'; // 更新为新的默认位置

        localStorage.removeItem('aiAvatarWindowPosition');
        localStorage.removeItem('aiAvatarButtonPosition');
    }

    // 实现拖拽功能
    makeDraggable() {
        const chatWindow = document.getElementById('ai-avatar-window');
        const button = document.getElementById('ai-avatar-button');
        const header = chatWindow.querySelector('.ai-avatar-header');

        // ========== 按钮拖拽 ==========
        let isButtonDragging = false;
        let buttonStartX, buttonStartY;
        let buttonStartLeft, buttonStartBottom;
        let buttonClickStartX, buttonClickStartY; // 用于区分点击和拖拽

        const startButtonDrag = (e) => {
            isButtonDragging = true;
            buttonClickStartX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            buttonClickStartY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

            const clientX = buttonClickStartX;
            const clientY = buttonClickStartY;

            buttonStartX = clientX;
            buttonStartY = clientY;

            // 获取按钮当前位置
            const rect = button.getBoundingClientRect();
            buttonStartLeft = rect.left;
            buttonStartBottom = window.innerHeight - rect.bottom;

            // 添加拖拽状态
            button.classList.add('dragging');
            button.style.transition = 'none';

            e.preventDefault();
        };

        const onButtonDrag = (e) => {
            if (!isButtonDragging) return;

            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

            // 计算新位置
            const deltaX = clientX - buttonStartX;
            const deltaY = clientY - buttonStartY;

            let newLeft = buttonStartLeft + deltaX;
            let newBottom = buttonStartBottom - deltaY;

            // 边界检查（按钮是60px）
            const buttonSize = 60;
            const maxX = window.innerWidth - buttonSize - 20;
            const maxY = window.innerHeight - buttonSize - 20;

            // 限制在屏幕内
            newLeft = Math.max(20, Math.min(newLeft, maxX));
            newBottom = Math.max(20, Math.min(newBottom, maxY));

            // 应用新位置
            button.style.left = newLeft + 'px';
            button.style.right = 'auto';
            button.style.bottom = newBottom + 'px';

            // 如果聊天窗口也同步移动（可选）
            if (chatWindow.classList.contains('ai-avatar-open')) {
                const windowWidth = chatWindow.offsetWidth;
                chatWindow.style.left = newLeft + 'px';
                chatWindow.style.right = 'auto';
            }

            e.preventDefault();
        };

        const endButtonDrag = (e) => {
            if (!isButtonDragging) return;

            isButtonDragging = false;
            button.classList.remove('dragging');
            button.style.transition = '';

            // 检查是否是点击（移动距离小于5px）
            const clientX = e.type.includes('mouse') ? e.clientX : (e.changedTouches ? e.changedTouches[0].clientX : buttonClickStartX);
            const clientY = e.type.includes('mouse') ? e.clientY : (e.changedTouches ? e.changedTouches[0].clientY : buttonClickStartY);

            const distance = Math.sqrt(
                Math.pow(clientX - buttonClickStartX, 2) +
                Math.pow(clientY - buttonClickStartY, 2)
            );

            // 如果移动距离小于5px，视为点击，打开聊天窗口
            if (distance < 5) {
                this.toggle();
            } else {
                // 否则保存按钮位置
                const currentLeft = parseInt(button.style.left);
                const currentBottom = parseInt(button.style.bottom);

                // 🔍 在控制台输出当前位置（方便你查看）
                console.log('🎯 AI数字分身按钮当前位置：');
                console.log('   left:', currentLeft, 'px');
                console.log('   bottom:', currentBottom, 'px');
                console.log('💡 复制这两个数字，告诉我，我帮你设为默认位置');

                this.saveButtonPosition(currentLeft, currentBottom);
            }
        };

        // 按钮事件
        button.addEventListener('mousedown', startButtonDrag);
        document.addEventListener('mousemove', onButtonDrag);
        document.addEventListener('mouseup', endButtonDrag);

        // 按钮触摸事件
        button.addEventListener('touchstart', startButtonDrag, { passive: false });
        document.addEventListener('touchmove', onButtonDrag, { passive: false });
        document.addEventListener('touchend', endButtonDrag);

        // ========== 聊天窗口拖拽 ==========
        let isWindowDragging = false;
        let startX, startY;
        let startLeft, startBottom;
        let windowWidth, windowHeight;

        const startWindowDrag = (e) => {
            // 只有点击头部区域才能拖拽
            if (!header.contains(e.target) || e.target.closest('.ai-avatar-close')) {
                return;
            }

            isWindowDragging = true;

            // 获取鼠标/触摸位置
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

            startX = clientX;
            startY = clientY;

            // 获取窗口当前位置
            const rect = chatWindow.getBoundingClientRect();
            startLeft = rect.left;
            startBottom = window.innerHeight - rect.bottom;

            // 获取窗口尺寸
            windowWidth = chatWindow.offsetWidth;
            windowHeight = chatWindow.offsetHeight;

            // 添加拖拽状态样式
            chatWindow.style.transition = 'none';
            chatWindow.style.cursor = 'grabbing';
            header.style.cursor = 'grabbing';

            e.preventDefault();
        };

        const onWindowDrag = (e) => {
            if (!isWindowDragging) return;

            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

            // 计算新位置
            const deltaX = clientX - startX;
            const deltaY = clientY - startY;

            let newLeft = startLeft + deltaX;
            let newBottom = startBottom - deltaY;

            // 边界检查
            const maxX = window.innerWidth - windowWidth - 20;
            const maxY = window.innerHeight - windowHeight - 20;

            // 限制在屏幕内
            newLeft = Math.max(20, Math.min(newLeft, maxX));
            newBottom = Math.max(20, Math.min(newBottom, maxY));

            // 应用新位置
            chatWindow.style.left = newLeft + 'px';
            chatWindow.style.right = 'auto';
            chatWindow.style.bottom = newBottom + 'px';

            // 同步按钮位置
            button.style.left = newLeft + 'px';
            button.style.right = 'auto';

            e.preventDefault();
        };

        const endWindowDrag = () => {
            if (!isWindowDragging) return;

            isWindowDragging = false;

            // 恢复过渡动画
            chatWindow.style.transition = '';
            chatWindow.style.cursor = '';
            header.style.cursor = 'move';

            // 保存位置
            const currentLeft = parseInt(chatWindow.style.left);
            const currentBottom = parseInt(chatWindow.style.bottom);
            this.savePosition(currentLeft, currentBottom);
            this.saveButtonPosition(currentLeft, currentBottom); // 同时保存按钮位置
        };

        // 窗口鼠标事件
        header.addEventListener('mousedown', startWindowDrag);
        document.addEventListener('mousemove', onWindowDrag);
        document.addEventListener('mouseup', endWindowDrag);

        // 窗口触摸事件
        header.addEventListener('touchstart', startWindowDrag, { passive: false });
        document.addEventListener('touchmove', onWindowDrag, { passive: false });
        document.addEventListener('touchend', endWindowDrag);
    }

    // 保存按钮位置
    saveButtonPosition(left, bottom) {
        try {
            localStorage.setItem('aiAvatarButtonPosition', JSON.stringify({ left, bottom }));
        } catch (error) {
            console.error('保存按钮位置失败:', error);
        }
    }

    // 加载按钮位置
    loadButtonPosition() {
        try {
            const savedPosition = localStorage.getItem('aiAvatarButtonPosition');
            if (savedPosition) {
                const { left, bottom } = JSON.parse(savedPosition);
                const button = document.getElementById('ai-avatar-button');

                // 验证位置是否在可视区域内
                const buttonSize = 60;
                if (left < -buttonSize || left > window.innerWidth ||
                    bottom < -buttonSize || bottom > window.innerHeight) {
                    // 位置无效，使用默认值
                    return;
                }

                // 应用保存的位置
                button.style.left = left + 'px';
                button.style.right = 'auto';
                button.style.bottom = bottom + 'px';
            }
        } catch (error) {
            console.error('加载按钮位置失败:', error);
        }
    }
}
