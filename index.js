class MatrixRain {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.matrixChars = '01ᔑリ੮ヒ丂ㄒ尺∪匚ㄒ╰ㄩ尺乇ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()'.split('');
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        this.animationId = null;
        this.isRunning = false;
        this.frameCount = 0;
        this.frameSkip = 8;

        this.init();
    }

    init() {
        this.canvas = document.getElementById('matrix-bg');
        if (!this.canvas) {
            console.error('Canvas element with id "matrix-bg" not found');
            return false;
        }

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Could not get 2D context from canvas');
            return false;
        }

        this.resizeCanvas();
        this.start();

        // Handle window resize
        window.addEventListener('resize', () => this.resizeCanvas());

        return true;
    }

    resizeCanvas() {
        if (!this.canvas) return;

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);

        // Reinitialize drops array
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.random() * (this.canvas.height / this.fontSize);
        }
    }

    draw() {
        if (!this.ctx || !this.canvas) return;

        // Create fade effect
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.04)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Set font
        this.ctx.font = `${this.fontSize}px monospace`;

        // Draw falling characters
        for (let i = 0; i < this.drops.length; i++) {
            const char = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            // Vary opacity for depth effect
            const opacity = Math.random() * 0.5 + 0.3;
            this.ctx.fillStyle = `rgba(0, 255, 255, ${opacity})`;

            this.ctx.fillText(char, x, y);

            // Reset drop when it goes off screen
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }

            this.drops[i]++;
        }
    }

    animate() {
        this.frameCount++;

        // Only draw every frameSkip+1 frames
        if (this.frameCount % (this.frameSkip + 1) === 0) {
            this.draw();
        }

        if (this.isRunning) {
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    setSpeed(speed) {
        this.frameskip = Math.max(0, speed - 1);
    }
}

// Research Network Text Overlay Functionality
class ResearchOverlays {
    constructor() {
        this.researchData = {
            'img1': 'Brain-Computer interfaces promise unprecedented cognitive enhancement. We would lose valuable human characteristics such as our creativity and ingenuity',
            'img2': 'Highly experimental synthetic organs are prone to failure or planned obsolescence',
            'img3': 'On a fundamental level, if we replace all of our human parts with synthetic ones, are we still biological beings or are we machine?',
            'img4': 'If we were to upload our consciousness to a machine to live forever, then there is no need for companionship. We would be kept in cold storage for eternity.',
            'img5': 'Augmenting our brains would have a profound effect on the human psyche. Our outlook on the world would be inherently changed forever as we cross the point of no return.',
            'img6': 'Augmented brains would be susceptible to malicious attacks from criminal organisations. Invasive advertisement would not only invade your online presence, it would invade your home.'
        };

        this.containerStates = {};
        this.init();
    }

    init() {
        Object.keys(this.researchData).forEach(id => {
            this.containerStates[id] = false;

            const container = document.getElementById(id);
            if (container) {
                this.setupContainer(container, id);
            }
        });
    }

    setupContainer(container, id) {
        // Create overlay element
        const overlay = document.createElement('div');
        overlay.className = 'text-overlay';
        overlay.innerHTML = `<div class="research-text">${this.researchData[id]}</div>`;

        // Add overlay to container
        container.appendChild(overlay);

        // Add click listener
        container.addEventListener('click', () => this.toggleContent(id));
        container.style.cursor = 'pointer';
    }

    toggleContent(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const overlay = container.querySelector('.text-overlay');
        if (!overlay) return;

        const isShowingText = this.containerStates[containerId];

        if (isShowingText) {
            overlay.classList.remove('active');
            this.containerStates[containerId] = false;
        } else {
            overlay.classList.add('active');
            this.containerStates[containerId] = true;
        }
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure canvas is properly rendered
    setTimeout(() => {
        const matrixRain = new MatrixRain();
        const overlays = new ResearchOverlays();

        // Make matrixRain globally accessible for debugging
        window.matrixRain = matrixRain;
    }, 100);
});