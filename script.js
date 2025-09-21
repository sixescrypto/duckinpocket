// Duck in Pocket Interactive Experience
class DuckInPocket {
    constructor() {
        this.duck = document.getElementById('duck');
        this.duckContainer = document.getElementById('duckContainer');
        this.pocket = document.getElementById('pocket');
        this.instruction = document.getElementById('instruction');
        this.successState = document.getElementById('successState');
        this.resetBtn = document.getElementById('resetBtn');
        
        this.isDragging = false;
        this.duckInPocket = false;
        
        this.init();
    }
    
    init() {
        this.setupDragAndDrop();
        this.setupEvents();
        this.startFloatingCoins();
    }
    
    setupDragAndDrop() {
        // Mouse events
        this.duck.addEventListener('mousedown', this.startDrag.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.endDrag.bind(this));
        
        // Touch events for mobile
        this.duck.addEventListener('touchstart', this.startDrag.bind(this));
        document.addEventListener('touchmove', this.drag.bind(this));
        document.addEventListener('touchend', this.endDrag.bind(this));
        
        // Prevent default drag behavior
        this.duck.addEventListener('dragstart', e => e.preventDefault());
    }
    
    setupEvents() {
        this.resetBtn.addEventListener('click', this.reset.bind(this));
        
        // Pocket hover effects
        this.pocket.addEventListener('mouseenter', () => {
            if (this.isDragging) {
                this.pocket.classList.add('hover');
            }
        });
        
        this.pocket.addEventListener('mouseleave', () => {
            this.pocket.classList.remove('hover');
        });
    }
    
    startDrag(e) {
        if (this.duckInPocket) return;
        
        this.isDragging = true;
        this.duckContainer.classList.add('dragging');
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        const rect = this.duckContainer.getBoundingClientRect();
        this.offsetX = clientX - rect.left - rect.width / 2;
        this.offsetY = clientY - rect.top - rect.height / 2;
        
        // Hide instruction
        this.instruction.style.opacity = '0.3';
        
        e.preventDefault();
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        if (!clientX || !clientY) return;
        
        const x = clientX - this.offsetX;
        const y = clientY - this.offsetY;
        
        this.duckContainer.style.left = x + 'px';
        this.duckContainer.style.top = y + 'px';
        this.duckContainer.style.position = 'fixed';
        this.duckContainer.style.zIndex = '1000';
        
        // Check if duck is over pocket
        const duckRect = this.duckContainer.getBoundingClientRect();
        const pocketRect = this.pocket.getBoundingClientRect();
        
        if (this.isOverlapping(duckRect, pocketRect)) {
            this.pocket.classList.add('hover');
        } else {
            this.pocket.classList.remove('hover');
        }
        
        e.preventDefault();
    }
    
    endDrag(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.duckContainer.classList.remove('dragging');
        
        // Check if duck was dropped on pocket
        const duckRect = this.duckContainer.getBoundingClientRect();
        const pocketRect = this.pocket.getBoundingClientRect();
        
        if (this.isOverlapping(duckRect, pocketRect)) {
            this.duckGoesInPocket();
        } else {
            this.returnDuckToStart();
        }
        
        this.pocket.classList.remove('hover');
        this.instruction.style.opacity = '1';
    }
    
    isOverlapping(rect1, rect2) {
        return !(rect1.right < rect2.left || 
                rect1.left > rect2.right || 
                rect1.bottom < rect2.top || 
                rect1.top > rect2.bottom);
    }
    
    duckGoesInPocket() {
        this.duckInPocket = true;
        
        // Keep baby duck image for peeking effect
        // Don't change to adult duck image
        
        // Position duck behind pocket with head peeking out above - INSTANTLY
        const pocketRect = this.pocket.getBoundingClientRect();
        const pocketCenterX = pocketRect.left + (pocketRect.width / 2) - (135); // Center of pocket minus half duck width (270px/2 = 135px)
        const pocketTopY = pocketRect.top - 5; // Position 5px lower than before
        
        // Remove any existing transition for instant positioning
        this.duckContainer.style.transition = 'none';
        this.duckContainer.style.left = pocketCenterX + 'px';
        this.duckContainer.style.top = pocketTopY + 'px';
        this.duckContainer.style.zIndex = '10'; // Behind pocket
        
        // Make duck bigger and stop floating animation
        this.duck.classList.add('success');
        
        // Change title to success message
        const mainTitle = document.querySelector('.main-title');
        mainTitle.textContent = 'The pocket stays on!';
        
        // Pocket glow effect
        this.pocket.classList.add('pocket-success');
        
        // Hide instruction
        this.instruction.style.opacity = '0';
        
        // Show success state immediately
        this.showSuccess();
        
        // Play success sound (if you want to add audio)
        this.playSuccessSound();
    }
    
    returnDuckToStart() {
        this.duckContainer.style.transition = 'all 0.5s ease-out';
        this.duckContainer.style.position = 'absolute';
        this.duckContainer.style.left = '';
        this.duckContainer.style.top = '';
        this.duckContainer.style.right = '50px';
        this.duckContainer.style.transform = 'translateY(-50%)';
        this.duckContainer.style.zIndex = '';
        
        setTimeout(() => {
            this.duckContainer.style.transition = '';
        }, 500);
    }
    
    showSuccess() {
        // Show success state overlay with banner animation
        this.successState.classList.add('active');
        // Add duck background to pocket
        this.pocket.classList.add('success-background');
        this.createConfetti();
    }
    
    reset() {
        this.duckInPocket = false;
        this.pocket.classList.remove('pocket-success');
        this.pocket.classList.remove('success-background');
        this.duck.classList.remove('duck-in-pocket');
        this.duck.classList.remove('success');
        this.instruction.style.opacity = '1';
        
        // Hide success state
        this.successState.classList.remove('active');
        
        // Reset title to original
        const mainTitle = document.querySelector('.main-title');
        mainTitle.textContent = 'Help put the Duck in the pocket!';
        
        // Show the duck container and keep baby duck image
        this.duckContainer.style.opacity = '1';
        // Baby duck stays as babyduck.png throughout
        
        // Reset duck position
        this.duckContainer.style.transition = 'all 0.5s ease-out';
        this.duckContainer.style.position = 'absolute';
        this.duckContainer.style.left = '';
        this.duckContainer.style.top = '';
        this.duckContainer.style.right = '';
        this.duckContainer.style.transform = 'translateY(-50%)';
        this.duckContainer.style.zIndex = '';
        
        setTimeout(() => {
            this.duckContainer.style.transition = '';
        }, 500);
    }
    
    startFloatingCoins() {
        setInterval(() => {
            const coins = document.querySelectorAll('.coin');
            coins.forEach((coin, index) => {
                setTimeout(() => {
                    coin.style.animationDelay = '0s';
                    coin.style.animation = 'none';
                    setTimeout(() => {
                        coin.style.animation = 'floatCoin 8s linear infinite';
                    }, 10);
                }, index * 1600);
            });
        }, 8000);
    }
    
    createConfetti() {
        const confettiCount = 50;
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10000;
        `;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${this.getRandomColor()};
                left: ${Math.random() * 100}%;
                animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
                animation-delay: ${Math.random() * 2}s;
            `;
            confettiContainer.appendChild(confetti);
        }
        
        document.body.appendChild(confettiContainer);
        
        // Remove confetti after animation
        setTimeout(() => {
            document.body.removeChild(confettiContainer);
        }, 5000);
    }
    
    getRandomColor() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    playSuccessSound() {
        // Create a simple success sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio not supported');
        }
    }
}

// Add confetti animation CSS
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// Initialize the experience when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DuckInPocket();
});

// Additional interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Title animation on load
    const title = document.querySelector('.main-title');
    const subtitle = document.querySelector('.subtitle');
    
    setTimeout(() => {
        title.style.animation = 'slideInFromTop 1s ease-out';
        subtitle.style.animation = 'slideInFromTop 1s ease-out 0.2s both';
    }, 100);
    
    // Add cursor trail effect
    let cursorTrail = [];
    document.addEventListener('mousemove', (e) => {
        if (cursorTrail.length > 5) {
            const oldTrail = cursorTrail.shift();
            document.body.removeChild(oldTrail);
        }
        
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            pointer-events: none;
            z-index: 9999;
            animation: fadeTrail 0.5s ease-out forwards;
        `;
        document.body.appendChild(trail);
        cursorTrail.push(trail);
    });
});

// Add additional CSS animations
const additionalStyle = document.createElement('style');
additionalStyle.textContent = `
    @keyframes slideInFromTop {
        from {
            transform: translateY(-50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeTrail {
        to {
            opacity: 0;
            transform: scale(0);
        }
    }
    
    .buy-btn, .community-btn {
        position: relative;
        overflow: hidden;
    }
    
    .buy-btn::before, .community-btn::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
    }
    
    .buy-btn:hover::before, .community-btn:hover::before {
        width: 300px;
        height: 300px;
    }
`;
document.head.appendChild(additionalStyle);

console.log('🦆 Duck in Pocket - Interactive Experience Loaded! 🚀');