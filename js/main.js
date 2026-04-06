// ==================== 页面导航和路由 ====================

// 页面切换功能
function navigateToPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });

    // 显示目标页面
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 更新导航状态
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    const activeLink = document.querySelector(`[data-page="${pageId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // 关闭移动菜单
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.add('hidden');
    }

    // 更新移动菜单按钮状态
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
}

// 绑定导航链接
document.addEventListener('DOMContentLoaded', () => {
    // 桌面导航
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            navigateToPage(pageId);
        });
    });

    // 处理URL hash
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        navigateToPage(hash);
    }
});

// ==================== 移动菜单切换 ====================
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

    if (mobileMenu && mobileMenuBtn) {
        const isHidden = mobileMenu.classList.contains('hidden');
        mobileMenu.classList.toggle('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    }
}

// ==================== 回到顶部按钮 ====================
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 监听滚动显示/隐藏回到顶部按钮
let backToTopButton;
window.addEventListener('scroll', () => {
    if (!backToTopButton) {
        backToTopButton = document.getElementById('backToTop');
    }

    if (backToTopButton) {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }
});

// ==================== 打字机效果 ====================
class Typewriter {
    constructor(elementId, texts, options = {}) {
        this.element = document.getElementById(elementId);
        this.texts = texts;
        this.typeSpeed = options.typeSpeed || 100;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.pauseTime = options.pauseTime || 2000;
        this.loop = options.loop !== false;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.start();
    }

    start() {
        if (!this.element) return;
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];

        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeDelay = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeDelay = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            if (!this.loop && this.textIndex === 0) {
                return;
            }
        }

        setTimeout(() => this.type(), typeDelay);
    }
}

// ==================== 页面加载动画 ====================
window.addEventListener('load', () => {
    const pageLoader = document.getElementById('pageLoader');
    if (pageLoader) {
        setTimeout(() => {
            pageLoader.classList.add('hidden');
        }, 500);
    }

    // 初始化打字机效果
    const typewriter = new Typewriter('typewriter', [
        '用AI探索无限可能',
        '用代码构建美好未来',
        'Vibe Coding实践者'
    ], {
        typeSpeed: 100,
        deleteSpeed: 50,
        pauseTime: 2000,
        loop: true
    });

    // 初始化reveal动画
    initRevealAnimations();
});

// ==================== Reveal动画 ====================
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

// ==================== 技能进度条动画 ====================
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetWidth = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = targetWidth;
                    entry.target.classList.add('animated');
                }, 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
}

document.addEventListener('DOMContentLoaded', animateSkillBars);

// ==================== 社交分享功能 ====================
const shareConfig = {
    title: '公子小白 | AI爱好者 & Agent搭建者',
    text: '查看我的AI项目和学习笔记 - 从农学学生到AI开发者的跨界之旅',
    url: window.location.href
};

function shareToTwitter() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareConfig.text)}&url=${encodeURIComponent(shareConfig.url)}`;
    window.open(url, '_blank', 'width=600,height=400');
}

function shareToWeChat() {
    // 微信分享需要使用微信SDK，这里简单复制链接
    copyLink();
    alert('链接已复制，可以在微信中粘贴分享');
}

function copyLink() {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareConfig.url).then(() => {
            showToast('链接已复制到剪贴板！');
        });
    } else {
        // 降级方案
        const input = document.createElement('input');
        input.value = shareConfig.url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast('链接已复制到剪贴板！');
    }
}

// ==================== Toast通知 ====================
function showToast(message, duration = 3000) {
    // 移除已存在的toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: var(--gradient-neon);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ==================== AI欢迎对话框 ====================
class AIWelcomeDialog {
    constructor() {
        this.overlay = document.getElementById('aiWelcomeOverlay');
        this.closeBtn = document.getElementById('aiWelcomeClose');
        this.typingText = document.getElementById('aiTypingText');

        if (this.overlay) {
            this.init();
        }
    }

    init() {
        // 检查是否已显示过
        const hasShown = localStorage.getItem('aiWelcomeShown');
        if (!hasShown) {
            // 延迟显示
            setTimeout(() => this.show(), 1000);
        }

        // 绑定关闭事件
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.hide());
        }

        // 点击背景关闭
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.hide();
                }
            });
        }

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay?.classList.contains('active')) {
                this.hide();
            }
        });
    }

    show() {
        if (this.overlay) {
            this.overlay.classList.add('active');
            this.typeText();
        }
    }

    hide() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
            localStorage.setItem('aiWelcomeShown', 'true');
        }
    }

    typeText() {
        if (!this.typingText) return;

        const message = '欢迎来到我的AI主页！👋 我是公子小白，一名AI爱好者和Agent搭建者。在这里，你可以看到我的AI项目、学习笔记和技术探索。让我们一起用AI探索无限可能！';
        let index = 0;

        this.typingText.textContent = '';

        const timer = setInterval(() => {
            if (index < message.length) {
                this.typingText.textContent += message[index];
                index++;
            } else {
                clearInterval(timer);
            }
        }, 50);
    }
}

// ==================== 技能页面数据 ====================
// 基于项目使用的技能统计
const skillsData = {
    ai: [
        {
            name: 'Coze平台',
            icon: '🤖',
            status: 'daily-use',  // daily-use | exploring | learning
            duration: '150+天',
            projects: ['project1', 'project2', 'project3', 'project4'],
            projectNames: ['英语学习助手', '第二大脑', '变量命名智能体', 'AI资讯推送']
        },
        {
            name: 'Claude API',
            icon: '🧠',
            status: 'exploring',
            duration: '60+天',
            projects: ['project7'],
            projectNames: ['AI面试助手']
        },
        {
            name: 'GPT-4',
            icon: '💬',
            status: 'daily-use',
            duration: '150+天',
            projects: ['project1'],
            projectNames: ['英语学习助手']
        },
        {
            name: 'Prompt工程',
            icon: '✨',
            status: 'daily-use',
            duration: '150+天',
            projects: ['project1', 'project2', 'project3', 'project4'],
            projectNames: ['多个AI项目']
        }
    ],
    frontend: [
        {
            name: 'HTML/CSS',
            icon: '🎨',
            status: 'daily-use',
            duration: '120+天',
            projects: ['project5', 'project6'],
            projectNames: ['羽生结弦粉丝主页', '蛋指标测量者']
        },
        {
            name: 'JavaScript',
            icon: '💛',
            status: 'daily-use',
            duration: '120+天',
            projects: ['project1', 'project5'],
            projectNames: ['英语学习助手', '羽生结弦粉丝主页']
        },
        {
            name: 'React',
            icon: '⚛️',
            status: 'learning',
            duration: '30+天',
            projects: ['project5', 'project7'],
            projectNames: ['羽生结弦粉丝主页', 'AI面试助手']
        },
        {
            name: 'Vue.js',
            icon: '💚',
            status: 'exploring',
            duration: '60+天',
            projects: ['project2'],
            projectNames: ['第二大脑']
        }
    ],
    backend: [
        {
            name: 'Python',
            icon: '🐍',
            status: 'daily-use',
            duration: '150+天',
            projects: ['project3', 'project4', 'project6', 'project7'],
            projectNames: ['变量命名智能体', 'AI资讯推送', '蛋指标测量者', 'AI面试助手']
        },
        {
            name: 'Flask',
            icon: '🌶️',
            status: 'exploring',
            duration: '60+天',
            projects: ['project3', 'project7'],
            projectNames: ['变量命名智能体', 'AI面试助手']
        },
        {
            name: 'Node.js',
            icon: '💚',
            status: 'exploring',
            duration: '60+天',
            projects: ['project2'],
            projectNames: ['第二大脑']
        }
    ],
    tools: [
        {
            name: 'Git',
            icon: '📦',
            status: 'daily-use',
            duration: '180+天',
            projects: ['all'],
            projectNames: ['所有项目']
        },
        {
            name: 'VS Code',
            icon: '💻',
            status: 'daily-use',
            duration: '180+天',
            projects: ['all'],
            projectNames: ['所有项目']
        },
        {
            name: 'Figma',
            icon: '🎨',
            status: 'exploring',
            duration: '90+天',
            projects: [],
            projectNames: ['UI设计']
        }
    ]
};

// ==================== 渲染技能页面 ====================
function renderSkillsPage() {
    const skillsContainer = document.getElementById('skillsContainer');
    if (!skillsContainer) return;

    const categories = [
        { id: 'ai', name: '🤖 AI & LLM', items: skillsData.ai },
        { id: 'frontend', name: '💻 前端开发', items: skillsData.frontend },
        { id: 'backend', name: '⚙️ 后端开发', items: skillsData.backend },
        { id: 'tools', name: '🛠️ 开发工具', items: skillsData.tools }
    ];

    // 获取状态标签
    const getStatusLabel = (status) => {
        const labels = {
            'daily-use': '<span class="skill-badge skill-badge-daily"><span class="pulse-dot"></span>🔥 日常使用</span>',
            'exploring': '<span class="skill-badge skill-badge-exploring">✨ 正在探索</span>',
            'learning': '<span class="skill-badge skill-badge-learning"><span class="pulse-dot"></span>🌱 学习中</span>'
        };
        return labels[status] || labels['exploring'];
    };

    skillsContainer.innerHTML = categories.map(cat => `
        <div class="skill-category mb-12">
            <h3 class="text-2xl font-bold mb-6" style="color: var(--text-primary);">${cat.name}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${cat.items.map(skill => `
                    <div class="skill-card" onclick="filterProjectsBySkill('${skill.name}')">
                        <div class="skill-header">
                            <span class="skill-icon">${skill.icon}</span>
                            <div class="skill-info">
                                <h4 class="skill-name">${skill.name}</h4>
                                ${getStatusLabel(skill.status)}
                            </div>
                        </div>
                        <div class="skill-stats">
                            <span class="skill-stat-item">⏱️ ${skill.duration}</span>
                            <span class="skill-stat-item">📊 ${skill.projects.length}个项目</span>
                        </div>
                        ${skill.projectNames.length > 0 ? `
                            <div class="skill-projects">
                                <div class="skill-projects-title">相关项目：</div>
                                <div class="skill-projects-list">
                                    ${skill.projects[0] === 'all'
                                        ? '<span class="skill-project-tag">所有项目</span>'
                                        : skill.projectNames.map(name =>
                                            `<span class="skill-project-tag">${name}</span>`
                                        ).join('')
                                    }
                                </div>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// 根据技能筛选项目
function filterProjectsBySkill(skillName) {
    // 切换到作品集页面
    const portfolioLink = document.querySelector('a[href="#portfolio"]');
    if (portfolioLink) {
        portfolioLink.click();
    }

    // 等待页面切换完成后，设置搜索词
    setTimeout(() => {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = skillName;
            searchInput.dispatchEvent(new Event('input'));
        }
    }, 300);
}

// ==================== 博客数据 ====================
const blogPosts = [
    {
        id: 1,
        title: '从零开始构建AI Agent - Coze实战经验',
        date: '2025-11-20',
        category: 'AI开发',
        readTime: '8分钟',
        excerpt: '记录我用Coze平台开发第一个AI智能体的完整过程，包括项目构思、技术选型、实现难点和解决方案。',
        link: 'https://vcn4n9sm0ggv.feishu.cn/wiki/O23bwjfmDiNiDnkRzYfcn16HnOb?from=from_copylink',
        tags: ['Coze', 'AI Agent', '实战']
    },
    {
        id: 2,
        title: 'Vibe Coding：我的AI辅助编程实践',
        date: '2026-01-15',
        category: '编程实践',
        readTime: '6分钟',
        excerpt: '分享我使用Claude Code等AI工具进行日常开发的经验和技巧，以及如何提高AI辅助编程的效率。',
        link: 'https://vcn4n9sm0ggv.feishu.cn/docx/Nj4MduL5Oof14OxdGnhcpFh9nbc',
        tags: ['AI编程', 'Claude', '效率']
    }
];

// ==================== 渲染博客页面 ====================
function renderBlogPage() {
    const blogContainer = document.getElementById('blogContainer');
    if (!blogContainer) return;

    blogContainer.innerHTML = `
        <div class="blog-grid">
            ${blogPosts.map(post => `
                <article class="blog-card reveal" onclick="window.open('${post.link}', '_blank')">
                    <span class="blog-card-category">${post.category}</span>
                    <h3 class="blog-card-title">${post.title}</h3>
                    <p class="blog-card-excerpt">${post.excerpt}</p>
                    <div class="blog-card-meta">
                        <span>📅 ${post.date}</span>
                        <span>⏱️ ${post.readTime}</span>
                    </div>
                    <div class="flex flex-wrap gap-2 mt-4">
                        ${post.tags.map(tag => `
                            <span class="text-xs px-2 py-1 rounded" style="background: var(--bg-tertiary); color: var(--text-muted);">
                                #${tag}
                            </span>
                        `).join('')}
                    </div>
                </article>
            `).join('')}
        </div>
    `;

    // 触发reveal动画
    setTimeout(() => {
        document.querySelectorAll('.blog-card').forEach(card => {
            card.classList.add('active');
        });
    }, 100);
}

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    // 初始化AI欢迎对话框
    new AIWelcomeDialog();

    // 渲染技能页面（如果存在）
    if (document.getElementById('skillsContainer')) {
        renderSkillsPage();
    }

    // 渲染博客页面（如果存在）
    if (document.getElementById('blogContainer')) {
        renderBlogPage();
    }
});

// ==================== 微信二维码模态框 ====================
function openWeChatModal() {
    const modal = document.getElementById('wechatModal');
    if (modal) {
        modal.classList.add('active');
        // 禁止背景滚动
        document.body.style.overflow = 'hidden';
    }
}

function closeWeChatModal() {
    const modal = document.getElementById('wechatModal');
    if (modal) {
        modal.classList.remove('active');
        // 恢复背景滚动
        document.body.style.overflow = '';
    }
}

function closeWeChatModalOutside(event) {
    if (event.target.id === 'wechatModal') {
        closeWeChatModal();
    }
}

// ESC键关闭模态框
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeWeChatModal();
    }
});

// 导出到全局
window.navigateToPage = navigateToPage;
window.toggleMobileMenu = toggleMobileMenu;
window.scrollToTop = scrollToTop;
window.shareToTwitter = shareToTwitter;
window.shareToWeChat = shareToWeChat;
window.copyLink = copyLink;
window.openWeChatModal = openWeChatModal;
window.closeWeChatModal = closeWeChatModal;
window.closeWeChatModalOutside = closeWeChatModalOutside;
