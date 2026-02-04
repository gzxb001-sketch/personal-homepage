/**
 * AI数字分身 - 安全版本（Vercel API代理）
 *
 * 版本：v3.0 (安全版)
 * 特点：API Key不暴露在前端，通过Vercel Serverless Function代理
 */

class AIAvatarChatSecure {
    constructor(options) {
        this.apiUrl = options.apiUrl || '/api/chat'; // 使用本地API端点
        this.isOpen = false;
        this.conversationHistory = this.loadHistory();

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
        console.log('%c🚀 开始初始化AI数字分身...', 'color: #667eea; font-size: 16px; font-weight: bold;');

        this.createChatButton();
        this.createChatWindow();
        this.bindEvents();
        // 禁用点击外部关闭功能 - 用户希望只有点叉号才关闭
        // this.bindOutsideClick();
        this.makeDraggable();
        // 暂时禁用加载保存的位置，使用默认的右下角位置
        // this.loadButtonPosition();
        // this.loadPosition();
        // 恢复聊天窗口打开状态(页面跳转后自动打开)
        this.restoreState();

        // 清除旧的位置数据，确保使用新的正确位置
        try {
            localStorage.removeItem('aiAvatarWindowPosition');
            localStorage.removeItem('aiAvatarButtonPosition');
            console.log('%c🧹 已清除旧的AI数字分身位置数据', 'color: #FFA500; font-size: 12px;');
        } catch (error) {
            // 忽略错误
        }

        // 先设置默认位置，确保按钮立即可见
        setTimeout(() => {
            const aiButton = document.getElementById('ai-avatar-button');
            if (aiButton) {
                // 先设置为默认可见位置
                aiButton.style.top = '90px';
                aiButton.style.right = '30px';
                aiButton.style.display = 'flex';
                aiButton.style.visibility = 'visible';
                aiButton.style.opacity = '1';
                aiButton.style.zIndex = '99998';

                console.log('%c✅ AI数字分身按钮已设置到默认位置', 'color: #10B981; font-size: 14px; font-weight: bold;');

                // 检查按钮的实际渲染情况
                const rect = aiButton.getBoundingClientRect();
                console.log('📍 按钮实际尺寸和位置:', {
                    width: rect.width,
                    height: rect.height,
                    top: rect.top,
                    left: rect.left,
                    right: rect.right,
                    bottom: rect.bottom,
                    isVisible: rect.width > 0 && rect.height > 0
                });
            }
        }, 100);

        // 然后再动态计算"测试AI"按钮位置，将AI数字分身精确放在它下方
        setTimeout(() => {
            const testButton = document.querySelector('button[title="测试AI欢迎对话框"]');
            const aiButton = document.getElementById('ai-avatar-button');
            const chatWindow = document.getElementById('ai-avatar-window');

            console.log('🔍 开始精确定位AI数字分身...');
            console.log('   测试按钮:', testButton);
            console.log('   AI按钮:', aiButton);
            console.log('   聊天窗口:', chatWindow);

            if (testButton && aiButton) {
                const testButtonRect = testButton.getBoundingClientRect();
                const spacing = 20; // 按钮之间的间距

                // 计算AI数字分身按钮的位置（在测试按钮正下方）
                const newTop = testButtonRect.bottom + spacing;
                const newRight = window.innerWidth - testButtonRect.right;

                aiButton.style.top = newTop + 'px';
                aiButton.style.bottom = 'auto';
                aiButton.style.left = 'auto';
                aiButton.style.right = newRight + 'px';

                console.log('%c✅ AI数字分身已精确定位到"测试AI"按钮下方', 'color: #10B981; font-size: 14px; font-weight: bold;');
                console.log(`   测试按钮位置: bottom=${testButtonRect.bottom}px, right=${newRight}px`);
                console.log(`   AI数字分身位置: top=${newTop}px, right=${newRight}px`);
            } else {
                console.warn('⚠️ 找不到"测试AI"按钮，保持默认位置');
                if (!testButton) console.warn('   "测试AI"按钮未找到');
            }

            // 设置聊天窗口位置（在AI数字分身按钮下方）
            if (aiButton && chatWindow) {
                const aiButtonRect = aiButton.getBoundingClientRect();
                const windowSpacing = 90;

                chatWindow.style.top = (aiButtonRect.top + windowSpacing) + 'px';
                chatWindow.style.bottom = 'auto';
                chatWindow.style.left = 'auto';
                chatWindow.style.right = aiButton.style.right;

                console.log('%c✅ AI聊天窗口已设置到AI数字分身下方', 'color: #10B981; font-size: 14px; font-weight: bold;');
            }
        }, 500); // 延迟500ms，确保DOM完全加载
    }

    // 从localStorage加载对话历史
    loadHistory() {
        try {
            const saved = localStorage.getItem('aiAvatarConversation');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            return [];
        }
    }

    // 保存对话历史到localStorage
    saveHistory() {
        try {
            localStorage.setItem('aiAvatarConversation', JSON.stringify(this.conversationHistory));
        } catch (error) {
            // 静默失败
        }
    }

    // 绑定点击外部关闭
    bindOutsideClick() {
        document.addEventListener('click', (e) => {
            if (this.isOpen) {
                const window = document.getElementById('ai-avatar-window');
                const button = document.getElementById('ai-avatar-button');

                if (!window.contains(e.target) && !button.contains(e.target)) {
                    this.close();
                }
            }
        });
    }

    // 创建聊天按钮
    createChatButton() {
        const button = document.createElement('div');
        button.id = 'ai-avatar-button';
        button.innerHTML = `
            <div class="ai-icon-container">
                <span class="ai-robot-icon">🤖</span>
            </div>
            <span class="ai-badge">AI</span>
        `;
        document.body.appendChild(button);

        // 调试信息
        console.log('%c✅ AI助手按钮已创建', 'color: #10B981; font-size: 14px; font-weight: bold;');
        console.log('📍 按钮位置: top=100px, right=30px');
        console.log('📍 按钮尺寸: 70px x 70px');

        // 验证按钮是否真的在DOM中
        setTimeout(() => {
            const checkButton = document.getElementById('ai-avatar-button');
            if (checkButton) {
                const rect = checkButton.getBoundingClientRect();
                console.log('%c✅ 按钮已成功添加到页面', 'color: #10B981; font-size: 12px;');
                console.log('📍 实际位置:', {
                    top: rect.top,
                    right: rect.right,
                    bottom: rect.bottom,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                    visible: rect.width > 0 && rect.height > 0
                });
            } else {
                console.error('%c❌ 按钮未找到！', 'color: #FF0000; font-size: 16px; font-weight: bold;');
            }
        }, 100);
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
        // 注意：AI数字分身按钮的点击/拖动事件在 makeDraggable() 中处理
        // 当移动距离 < 5px 时会自动调用 this.toggle()

        // 关闭按钮
        const closeBtn = document.getElementById('ai-avatar-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.close();
            });
        }

        // 发送按钮
        const sendBtn = document.getElementById('ai-avatar-send');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        // 输入框回车发送
        const input = document.getElementById('ai-avatar-input');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        console.log('✅ 所有AI聊天事件已绑定');
    }

    toggle() {
        console.log('🔄 toggle() 被调用，当前状态 isOpen =', this.isOpen);
        this.isOpen = !this.isOpen;
        const window = document.getElementById('ai-avatar-window');
        const button = document.getElementById('ai-avatar-button');

        console.log('🔄 新状态 isOpen =', this.isOpen);

        if (this.isOpen) {
            console.log('✅ 打开AI聊天窗口');
            window.classList.add('ai-avatar-open');
            button.classList.add('ai-avatar-hidden');
            this.conversationHistory = this.loadHistory();
            this.loadHistoryMessages();

            // 保存打开状态到localStorage
            localStorage.setItem('aiChatOpen', 'true');
        } else {
            console.log('❌ 关闭AI聊天窗口');
            window.classList.remove('ai-avatar-open');
            button.classList.remove('ai-avatar-hidden');

            // 清除打开状态
            localStorage.removeItem('aiChatOpen');
        }
    }

    // 恢复聊天窗口状态（用于页面跳转后）
    restoreState() {
        const wasOpen = localStorage.getItem('aiChatOpen');
        if (wasOpen === 'true' && !this.isOpen) {
            this.isOpen = false;
            this.toggle(); // 重新打开
        }
    }

    loadHistoryMessages() {
        const messagesContainer = document.getElementById('ai-avatar-messages');
        const welcomeMsg = messagesContainer.querySelector('.ai-avatar-welcome');
        messagesContainer.innerHTML = '';
        if (welcomeMsg) {
            messagesContainer.appendChild(welcomeMsg);
        }

        this.conversationHistory.forEach(msg => {
            if (msg.role === 'user') {
                this.addMessageToDOM(msg.content, 'user');
            } else if (msg.role === 'assistant') {
                this.addMessageToDOM(msg.content, 'ai');
            }
        });

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

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
        // 手动关闭时清除状态,不会在跳转后自动打开
        localStorage.removeItem('aiChatOpen');
    }

    // 发送消息（调用本地API）
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

        this.saveHistory();
        this.showTyping();

        try {
            // 调用本地API代理（安全！）
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
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
                throw new Error(errorData.error || 'API调用失败');
            }

            const data = await response.json();
            this.hideTyping();

            const aiReply = data.choices[0].message.content;
            this.conversationHistory.push({
                role: 'assistant',
                content: aiReply
            });

            this.saveHistory();
            this.addMessage(aiReply, 'ai');

        } catch (error) {
            this.hideTyping();

            let errorMsg = '抱歉，我遇到了一些问题。请稍后再试~ 😅';

            if (error.message.includes('API配置错误')) {
                errorMsg = 'AI服务配置错误，请联系管理员。';
            } else if (error.message.includes('服务返回错误')) {
                errorMsg = 'AI服务暂时不可用，请稍后再试。';
            } else if (error.message.includes('fetch')) {
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

    // ========== 拖拽功能 ==========
    loadPosition() {
        try {
            const savedPosition = localStorage.getItem('aiAvatarWindowPosition');
            if (savedPosition) {
                const position = JSON.parse(savedPosition);
                const chatWindow = document.getElementById('ai-avatar-window');
                const button = document.getElementById('ai-avatar-button');

                // 支持旧格式和新格式
                if (position.top !== undefined) {
                    // 新格式（使用top）
                    chatWindow.style.left = position.left + 'px';
                    chatWindow.style.right = 'auto';
                    chatWindow.style.top = position.top + 'px';
                    chatWindow.style.bottom = 'auto';

                    button.style.left = position.left + 'px';
                    button.style.right = 'auto';
                } else if (position.bottom !== undefined) {
                    // 旧格式（使用bottom），清除并使用默认位置
                    localStorage.removeItem('aiAvatarWindowPosition');
                    return;
                }

                const rect = chatWindow.getBoundingClientRect();
                if (rect.right < 0 || rect.left > window.innerWidth ||
                    rect.bottom < 0 || rect.top > window.innerHeight) {
                    this.resetPosition();
                }
            }
        } catch (error) {
            this.resetPosition();
        }
    }

    savePosition(left, top) {
        try {
            localStorage.setItem('aiAvatarWindowPosition', JSON.stringify({ left, top }));
        } catch (error) {
            // 静默失败
        }
    }

    resetPosition() {
        const chatWindow = document.getElementById('ai-avatar-window');
        const button = document.getElementById('ai-avatar-button');

        // 设置为右上角默认位置（在"🤖 测试AI"按钮下方）
        // 导航栏约70px高，按钮在导航栏内，所以AI数字分身在90px位置
        button.style.top = '90px';
        button.style.bottom = 'auto';
        button.style.left = 'auto';
        button.style.right = '30px';

        // 聊天窗口在AI数字分身按钮下方
        chatWindow.style.top = '180px'; // 90px按钮 + 90px间距
        chatWindow.style.bottom = 'auto';
        chatWindow.style.left = 'auto';
        chatWindow.style.right = '30px';

        localStorage.removeItem('aiAvatarWindowPosition');
        localStorage.removeItem('aiAvatarButtonPosition');

        console.log('%c✅ 位置已重置到右上角', 'color: #10B981; font-size: 14px; font-weight: bold;');
    }

    makeDraggable() {
        const chatWindow = document.getElementById('ai-avatar-window');
        const button = document.getElementById('ai-avatar-button');
        const header = chatWindow.querySelector('.ai-avatar-header');

        // ========== 按钮拖拽 ==========
        let isButtonDragging = false;
        let buttonStartX, buttonStartY;
        let buttonStartLeft, buttonStartTop;
        let buttonClickStartX, buttonClickStartY;

        const startButtonDrag = (e) => {
            isButtonDragging = true;
            buttonClickStartX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            buttonClickStartY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

            const clientX = buttonClickStartX;
            const clientY = buttonClickStartY;

            buttonStartX = clientX;
            buttonStartY = clientY;

            const rect = button.getBoundingClientRect();
            buttonStartLeft = rect.left;
            buttonStartTop = rect.top;

            button.classList.add('dragging');
            button.style.transition = 'none';

            e.preventDefault();
        };

        const onButtonDrag = (e) => {
            if (!isButtonDragging) return;

            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

            const deltaX = clientX - buttonStartX;
            const deltaY = clientY - buttonStartY;

            let newLeft = buttonStartLeft + deltaX;
            let newTop = buttonStartTop + deltaY;

            const buttonSize = 80; // 更新为新的按钮尺寸
            const maxX = window.innerWidth - buttonSize - 20;
            const maxY = window.innerHeight - buttonSize - 20;

            newLeft = Math.max(20, Math.min(newLeft, maxX));
            newTop = Math.max(20, Math.min(newTop, maxY));

            button.style.left = newLeft + 'px';
            button.style.right = 'auto';
            button.style.top = newTop + 'px';
            button.style.bottom = 'auto';

            if (chatWindow.classList.contains('ai-avatar-open')) {
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

            const clientX = e.type.includes('mouse') ? e.clientX : (e.changedTouches ? e.changedTouches[0].clientX : buttonClickStartX);
            const clientY = e.type.includes('mouse') ? e.clientY : (e.changedTouches ? e.changedTouches[0].clientY : buttonClickStartY);

            const distance = Math.sqrt(
                Math.pow(clientX - buttonClickStartX, 2) +
                Math.pow(clientY - buttonClickStartY, 2)
            );

            if (distance < 5) {
                this.toggle();
            } else {
                const currentLeft = parseInt(button.style.left);
                const currentTop = parseInt(button.style.top);
                this.saveButtonPosition(currentLeft, currentTop);
            }
        };

        button.addEventListener('mousedown', startButtonDrag);
        document.addEventListener('mousemove', onButtonDrag);
        document.addEventListener('mouseup', endButtonDrag);

        button.addEventListener('touchstart', startButtonDrag, { passive: false });
        document.addEventListener('touchmove', onButtonDrag, { passive: false });
        document.addEventListener('touchend', endButtonDrag);

        // ========== 聊天窗口拖拽 ==========
        let isWindowDragging = false;
        let startX, startY;
        let startLeft, startTop;
        let windowWidth, windowHeight;

        const startWindowDrag = (e) => {
            if (!header.contains(e.target) || e.target.closest('.ai-avatar-close')) {
                return;
            }

            isWindowDragging = true;
            console.log('🎯 开始拖动AI聊天窗口');

            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

            startX = clientX;
            startY = clientY;

            const rect = chatWindow.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;

            windowWidth = chatWindow.offsetWidth;
            windowHeight = chatWindow.offsetHeight;

            chatWindow.style.transition = 'none';
            chatWindow.style.cursor = 'grabbing';
            header.style.cursor = 'grabbing';

            e.preventDefault();
        };

        const onWindowDrag = (e) => {
            if (!isWindowDragging) return;

            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

            const deltaX = clientX - startX;
            const deltaY = clientY - startY;

            let newLeft = startLeft + deltaX;
            let newTop = startTop + deltaY;

            const maxX = window.innerWidth - windowWidth - 20;
            const maxY = window.innerHeight - windowHeight - 20;

            newLeft = Math.max(20, Math.min(newLeft, maxX));
            newTop = Math.max(20, Math.min(newTop, maxY));

            chatWindow.style.left = newLeft + 'px';
            chatWindow.style.right = 'auto';
            chatWindow.style.top = newTop + 'px';
            chatWindow.style.bottom = 'auto';

            button.style.left = newLeft + 'px';
            button.style.right = 'auto';

            e.preventDefault();
        };

        const endWindowDrag = () => {
            if (!isWindowDragging) return;

            isWindowDragging = false;

            chatWindow.style.transition = '';
            chatWindow.style.cursor = '';
            header.style.cursor = 'move';

            const currentLeft = parseInt(chatWindow.style.left);
            const currentTop = parseInt(chatWindow.style.top);
            this.savePosition(currentLeft, currentTop);
            this.saveButtonPosition(currentLeft, currentTop);

            console.log('✅ AI聊天窗口拖动完成，位置已保存');
        };

        header.addEventListener('mousedown', startWindowDrag);
        document.addEventListener('mousemove', onWindowDrag);
        document.addEventListener('mouseup', endWindowDrag);

        header.addEventListener('touchstart', startWindowDrag, { passive: false });
        document.addEventListener('touchmove', onWindowDrag, { passive: false });
        header.addEventListener('touchend', endWindowDrag);
    }

    saveButtonPosition(left, top) {
        try {
            localStorage.setItem('aiAvatarButtonPosition', JSON.stringify({ left, top }));
        } catch (error) {
            // 静默失败
        }
    }

    loadButtonPosition() {
        try {
            const savedPosition = localStorage.getItem('aiAvatarButtonPosition');
            if (savedPosition) {
                const position = JSON.parse(savedPosition);
                const button = document.getElementById('ai-avatar-button');

                // 支持旧格式和新格式
                if (position.top !== undefined) {
                    // 新格式（使用top）
                    const buttonSize = 80; // 更新为新的按钮尺寸
                    if (position.left < -buttonSize || position.left > window.innerWidth ||
                        position.top < -buttonSize || position.top > window.innerHeight) {
                        return;
                    }
                    button.style.left = position.left + 'px';
                    button.style.right = 'auto';
                    button.style.top = position.top + 'px';
                    button.style.bottom = 'auto';
                } else if (position.bottom !== undefined) {
                    // 旧格式（使用bottom），清除并使用默认位置
                    localStorage.removeItem('aiAvatarButtonPosition');
                }
            }
        } catch (error) {
            // 静默失败
        }
    }

    clearHistory() {
        this.conversationHistory = [];
        localStorage.removeItem('aiAvatarConversation');
    }
}
