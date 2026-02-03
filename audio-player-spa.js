/**
 * 背景音乐播放器 - SPA版本
 * 简单优雅的音乐控制 🎵
 *
 * 功能说明：
 * - 播放/暂停背景音乐
 * - 音量控制（0-100）
 * - 用户偏好记忆（localStorage）
 */

class AudioSystem {
    constructor() {
        // 音频状态
        this.musicEnabled = false;
        this.volume = 0.3; // 音乐音量 0-1 (默认30%)

        // 初始化背景音乐
        this.initBackgroundMusic();

        // 创建音乐控制按钮
        this.createMusicControl();

        // 加载用户偏好
        this.loadPreferences();
    }

    /**
     * 初始化背景音乐
     *
     * 如何更换音乐：
     * 1. 将音乐文件放入 music/ 文件夹
     * 2. 修改下面的 this.bgMusic.src 路径
     * 3. 例如：this.bgMusic.src = 'music/my-music.mp3';
     */
    initBackgroundMusic() {
        this.bgMusic = new Audio();

        // ========== 🎵 在这里更换你的音乐 ==========
        // 当前使用：免费的 Lo-fi 音乐（来自 Pixabay）
        this.bgMusic.src = 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3';

        // 备选音乐源（取消注释即可使用）:
        // this.bgMusic.src = 'https://cdn.pixabay.com/audio/2022/02/10/audio_fc8c8387ba.mp3'; // Lo-fi 2
        // this.bgMusic.src = 'music/你的音乐文件.mp3'; // 本地音乐（推荐）
        // ===========================================

        this.bgMusic.loop = true; // 循环播放
        this.bgMusic.volume = this.volume;

        // 加载音频
        this.bgMusic.load();

        // 监听音乐结束（虽然设置了loop，但为了保险）
        this.bgMusic.addEventListener('ended', () => {
            this.bgMusic.currentTime = 0;
            this.bgMusic.play();
        });
    }

    /**
     * 切换背景音乐
     * 点击按钮时调用此方法
     */
    toggleMusic() {
        if (this.musicEnabled) {
            // 暂停音乐
            this.bgMusic.pause();
            this.musicEnabled = false;
            this.updateMusicButton(false);
        } else {
            // 播放音乐
            // 首次播放需要用户交互（浏览器限制）
            this.bgMusic.play().then(() => {
                this.musicEnabled = true;
                this.updateMusicButton(true);
            }).catch(err => {
                console.log('无法播放音乐:', err);
                // 显示提示
                this.showMusicTip();
            });
        }

        // 保存用户偏好
        this.savePreferences();
    }

    /**
     * 更新音乐按钮状态
     * @param {boolean} isPlaying - 是否正在播放
     */
    updateMusicButton(isPlaying) {
        const button = document.getElementById('musicControlBtn');
        const icon = document.getElementById('musicIcon');

        if (isPlaying) {
            button.classList.add('playing');
            icon.textContent = '🎵';
            // 添加跳动动画
            icon.style.animation = 'bounce 0.5s ease infinite';
        } else {
            button.classList.remove('playing');
            icon.textContent = '🔇';
            icon.style.animation = 'none';
        }
    }

    /**
     * 设置音乐音量
     * @param {number} volume - 音量值 (0-1)
     */
    setMusicVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.bgMusic.volume = this.volume;
        this.savePreferences();
    }

    /**
     * 创建音乐控制按钮
     */
    createMusicControl() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createMusicControl());
            return;
        }

        // 创建控制按钮
        const controlDiv = document.createElement('div');
        controlDiv.id = 'audioControl';
        controlDiv.innerHTML = `
            <button id="musicControlBtn" class="music-control-btn" onclick="audioSystem.toggleMusic()" title="播放/暂停背景音乐">
                <span id="musicIcon">🔇</span>
            </button>
            <div id="volumeControl" class="volume-control">
                <input type="range" min="0" max="100" value="30" onchange="audioSystem.setMusicVolume(this.value / 100)" title="音乐音量">
            </div>
        `;

        // 添加到页面
        document.body.appendChild(controlDiv);
    }

    /**
     * 显示音乐提示
     * 当无法自动播放时显示
     */
    showMusicTip() {
        const tip = document.createElement('div');
        tip.className = 'music-tip';
        tip.textContent = '🎵 点击播放背景音乐';
        document.body.appendChild(tip);

        setTimeout(() => tip.remove(), 3000);
    }

    /**
     * 保存用户偏好到 localStorage
     */
    savePreferences() {
        localStorage.setItem('musicEnabled', this.musicEnabled);
        localStorage.setItem('musicVolume', this.volume);
    }

    /**
     * 加载用户偏好
     */
    loadPreferences() {
        const musicEnabled = localStorage.getItem('musicEnabled');
        const volume = localStorage.getItem('musicVolume');

        if (musicEnabled === 'true') {
            // 需要用户交互才能播放，不自动播放
            this.musicEnabled = false;
        }
        if (volume !== null) {
            this.volume = parseFloat(volume);
            this.bgMusic.volume = this.volume;
        }
    }
}

// 初始化音频系统
let audioSystem;
window.addEventListener('DOMContentLoaded', () => {
    audioSystem = new AudioSystem();
});

// 导出供全局使用
window.audioSystem = audioSystem;
