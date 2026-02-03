/**
 * SPA 路由系统
 * 单页应用路由管理 - 无刷新页面切换
 */

class SPARouter {
    constructor() {
        this.routes = {
            '': 'page-home',
            '#home': 'page-home',
            '#about': 'page-about',
            '#portfolio': 'page-portfolio',
            '#contact': 'page-contact'
        };

        this.init();
    }

    init() {
        // 监听 hash 变化
        window.addEventListener('hashchange', () => this.handleRoute());

        // 监听页面加载
        window.addEventListener('load', () => this.handleRoute());

        // 拦截所有导航链接
        this.interceptLinks();
    }

    /**
     * 拦截所有导航链接，使用 hash 路由
     */
    interceptLinks() {
        document.addEventListener('click', (e) => {
            // 查找最近的 <a> 标签
            const link = e.target.closest('a.nav-link');

            if (!link) return;

            // 获取 href 属性
            const href = link.getAttribute('href');

            // 只拦截内部链接（以 # 开头）
            if (href && href.startsWith('#')) {
                e.preventDefault();

                // 更新 hash
                window.location.hash = href;
            }
        });
    }

    /**
     * 处理路由变化
     */
    handleRoute() {
        // 获取当前 hash（去掉 # 符号）
        const hash = window.location.hash.slice(1);

        // 获取对应的页面 ID
        const pageId = this.routes['#' + hash] || this.routes[''];

        // 切换页面
        this.switchPage(pageId);

        // 更新导航激活状态
        this.updateNavState('#' + hash);

        // 滚动到页面顶部
        this.scrollToTop();
    }

    /**
     * 切换页面
     */
    switchPage(pageId) {
        // 获取所有页面
        const pages = document.querySelectorAll('.page-section');

        // 隐藏所有页面
        pages.forEach(page => {
            page.classList.add('hidden');
            page.classList.remove('active');
        });

        // 显示目标页面
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.remove('hidden');
            targetPage.classList.add('active');

            // 触发页面动画
            this.animatePageIn(targetPage);
        }
    }

    /**
     * 页面进入动画
     */
    animatePageIn(page) {
        page.style.opacity = '0';
        page.style.transform = 'translateY(10px)';

        setTimeout(() => {
            page.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            page.style.opacity = '1';
            page.style.transform = 'translateY(0)';
        }, 50);
    }

    /**
     * 更新导航激活状态
     */
    updateNavState(hash) {
        // 移除所有激活状态
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // 添加激活状态到当前链接
        const currentLink = document.querySelector(`nav a[href="${hash}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        }
    }

    /**
     * 滚动到页面顶部
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// 初始化路由系统
const router = new SPARouter();

// 导出供全局使用
window.router = router;
