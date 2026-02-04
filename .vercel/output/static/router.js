/**
 * 动态路由系统 - 实现伪SPA体验
 * 功能：页面无刷新切换，保持聊天窗口状态
 */

class Router {
    constructor() {
        this.pages = {
            'index.html': '首页',
            'about.html': '关于我 - 王晓宇 | AI探索者',
            'portfolio.html': '作品集 - 王晓宇 | AI智能体作品',
            'contact.html': '联系我 - 王晓宇 | AI交流与合作'
        };

        this.init();
    }

    init() {
        // 确保DOM完全加载后再初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                // 延迟一点，确保所有元素都已渲染
                setTimeout(() => this.setupRouter(), 100);
            });
        } else {
            // DOM已经加载完成，延迟执行确保元素就绪
            setTimeout(() => this.setupRouter(), 100);
        }
    }

    setupRouter() {
        console.log('初始化路由系统...');

        // 拦截所有导航链接点击
        this.interceptLinks();

        // 监听浏览器后退/前进按钮
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.loadPage(e.state.page, false);
            }
        });

        console.log('路由系统初始化完成');
    }

    // 拦截导航链接
    interceptLinks() {
        const navLinks = document.querySelectorAll('nav a');

        console.log(`找到 ${navLinks.length} 个导航链接`);

        navLinks.forEach((link, index) => {
            const href = link.getAttribute('href');
            console.log(`链接 ${index}: ${href}`);

            link.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`点击链接: ${href}`);

                if (href && this.pages[href]) {
                    this.navigate(href);
                } else {
                    console.warn(`未知的页面: ${href}`);
                    // 降级处理：直接跳转
                    window.location.href = href;
                }
            });
        });
    }

    // 导航到指定页面
    navigate(page) {
        // 更新浏览器历史
        history.pushState({ page }, '', page);

        // 加载页面内容
        this.loadPage(page, true);
    }

    // 加载页面内容
    async loadPage(page, updateState = true) {
        console.log(`正在加载页面: ${page}`);

        // 检查是否是本地文件协议（fetch在file://协议下不可用）
        const isFileProtocol = window.location.protocol === 'file:';

        if (isFileProtocol) {
            console.warn('检测到file://协议，降级到普通跳转');
            // 降级：使用普通跳转
            if (updateState) {
                window.location.href = page;
            }
            return;
        }

        try {
            // 显示加载状态
            this.showLoading();

            // 获取页面内容
            const content = await this.fetchPageContent(page);

            // 更新页面内容
            this.updatePageContent(content);

            // 更新页面标题
            document.title = this.pages[page] || '王晓宇 | 公子小白';

            // 更新导航激活状态
            this.updateActiveNav(page);

            // 隐藏加载状态
            this.hideLoading();

            // 滚动到顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });

            console.log(`页面加载完成: ${page}`);

        } catch (error) {
            console.error('页面加载失败:', error);
            this.hideLoading();

            // 如果加载失败，直接跳转（降级处理）
            if (updateState) {
                console.log('降级到普通跳转');
                window.location.href = page;
            }
        }
    }

    // 获取页面内容
    async fetchPageContent(page) {
        try {
            const response = await fetch(page);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const html = await response.text();

            // 解析HTML，提取#page-content内容
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const mainContent = doc.querySelector('#page-content');

            if (!mainContent) {
                throw new Error('未找到 #page-content 元素');
            }

            return mainContent.innerHTML;
        } catch (error) {
            console.error('fetch失败:', error);
            throw error;
        }
    }

    // 更新页面内容
    updatePageContent(content) {
        const pageContent = document.getElementById('page-content');

        if (pageContent) {
            // 添加淡出动画
            pageContent.style.opacity = '0';
            pageContent.style.transform = 'translateY(10px)';

            setTimeout(() => {
                // 更新内容
                pageContent.innerHTML = content;

                // 淡入动画
                pageContent.style.transition = 'all 0.3s ease';
                pageContent.style.opacity = '1';
                pageContent.style.transform = 'translateY(0)';
            }, 150);
        } else {
            console.error('未找到 #page-content 容器');
        }
    }

    // 更新导航激活状态
    updateActiveNav(page) {
        // 移除所有激活状态
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // 添加当前页面的激活状态
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === page) {
                link.classList.add('active');
            }
        });
    }

    // 显示加载状态
    showLoading() {
        const pageContent = document.getElementById('page-content');
        if (pageContent) {
            pageContent.style.pointerEvents = 'none';
            pageContent.style.opacity = '0.5';
        }
    }

    // 隐藏加载状态
    hideLoading() {
        const pageContent = document.getElementById('page-content');
        if (pageContent) {
            pageContent.style.pointerEvents = 'auto';
            pageContent.style.opacity = '1';
        }
    }
}

// 初始化路由（在AI聊天组件之前初始化）
const router = new Router();
