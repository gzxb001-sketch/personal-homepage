/**
 * 音乐和音效系统
 * 让网站活起来！🎵
 */

class AudioSystem {
    constructor() {
        // 音频状态
        this.musicEnabled = false;
        this.soundEffectsEnabled = true;
        this.volume = 0.3; // 音乐音量 0-1
        this.sfxVolume = 0.5; // 音效音量 0-1

        // 初始化背景音乐
        this.initBackgroundMusic();

        // 初始化音效
        this.initSoundEffects();

        // 创建音乐控制按钮
        this.createMusicControl();

        // 加载用户偏好
        this.loadPreferences();
    }

    /**
     * 初始化背景音乐
     */
    initBackgroundMusic() {
        this.bgMusic = new Audio();
        // 使用免费的 Lo-fi 音乐（来自 Pixabay 或其他免费资源）
        // 选项1: Lo-fi Hip Hop
        this.bgMusic.src = 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3';
        // 备选源（可以替换）:
        // this.bgMusic.src = 'https://cdn.pixabay.com/audio/2022/02/10/audio_fc8c8387ba.mp3';

        this.bgMusic.loop = true;
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
     * 初始化音效
     */
    initSoundEffects() {
        // 使用 Web Audio API 生成简单的音效（无需外部文件）
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    /**
     * 生成简单的点击音效
     */
    playClickSound() {
        if (!this.soundEffectsEnabled) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // 清脆的点击声
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);

            gainNode.gain.setValueAtTime(this.sfxVolume * 0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        } catch (e) {
            console.log('AudioContext not ready');
        }
    }

    /**
     * 生成悬停音效
     */
    playHoverSound() {
        if (!this.soundEffectsEnabled) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // 轻柔的悬停声
            oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.05);

            gainNode.gain.setValueAtTime(this.sfxVolume * 0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.05);
        } catch (e) {
            // 忽略错误
        }
    }

    /**
     * 生成成功音效
     */
    playSuccessSound() {
        if (!this.soundEffectsEnabled) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // 愉悦的成功声
            oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2); // G5

            gainNode.gain.setValueAtTime(this.sfxVolume * 0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
        } catch (e) {
            // 忽略错误
        }
    }

    /**
     * 切换背景音乐
     */
    toggleMusic() {
        if (this.musicEnabled) {
            this.bgMusic.pause();
            this.musicEnabled = false;
            this.updateMusicButton(false);
        } else {
            // 首次播放需要用户交互
            this.bgMusic.play().then(() => {
                this.musicEnabled = true;
                this.updateMusicButton(true);
            }).catch(err => {
                console.log('无法播放音乐:', err);
                // 显示提示
                this.showMusicTip();
            });
        }

        this.savePreferences();
    }

    /**
     * 更新音乐按钮状态
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
     * 切换音效
     */
    toggleSoundEffects() {
        this.soundEffectsEnabled = !this.soundEffectsEnabled;
        this.savePreferences();
        return this.soundEffectsEnabled;
    }

    /**
     * 设置音乐音量
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

        // 绑定点击和悬停音效
        this.bindSoundEffects();
    }

    /**
     * 绑定音效到所有交互元素
     */
    bindSoundEffects() {
        // 点击音效 - 所有链接和按钮
        setTimeout(() => {
            document.querySelectorAll('a, button, .card').forEach(el => {
                el.addEventListener('click', () => this.playClickSound());
                el.addEventListener('mouseenter', () => this.playHoverSound());
            });
        }, 100);
    }

    /**
     * 显示音乐提示
     */
    showMusicTip() {
        const tip = document.createElement('div');
        tip.className = 'music-tip';
        tip.textContent = '🎵 点击播放背景音乐';
        document.body.appendChild(tip);

        setTimeout(() => tip.remove(), 3000);
    }

    /**
     * 保存用户偏好
     */
    savePreferences() {
        localStorage.setItem('musicEnabled', this.musicEnabled);
        localStorage.setItem('soundEffectsEnabled', this.soundEffectsEnabled);
        localStorage.setItem('musicVolume', this.volume);
    }

    /**
     * 加载用户偏好
     */
    loadPreferences() {
        const musicEnabled = localStorage.getItem('musicEnabled');
        const soundEffectsEnabled = localStorage.getItem('soundEffectsEnabled');
        const volume = localStorage.getItem('musicVolume');

        if (musicEnabled === 'true') {
            this.musicEnabled = false; // 需要用户交互才能播放
        }
        if (soundEffectsEnabled !== null) {
            this.soundEffectsEnabled = soundEffectsEnabled === 'true';
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
