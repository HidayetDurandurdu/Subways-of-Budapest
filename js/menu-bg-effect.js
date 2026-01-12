// Optimized Glossy Rainbow Background with Stars - Pure JavaScript
// Optimized for performance - no lag, must have Hardware Acceleration turned on in Chrome!

(function() {
    const colors = [
        '#FF6B9D', '#C44569', '#FFA07A', '#FFD93D', 
        '#6BCB77', '#4D96FF', '#9D84B7', '#FF1744',
        '#00E5FF', '#FFEA00', '#B388FF', '#FF6E40'
    ];

    const style = document.createElement('style');
    style.textContent = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            overflow: hidden;
            width: 100vw;
            height: 100vh;
        }

        .rainbow-background-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1a0b2e 0%, #16213e 100%);
            overflow: hidden;
            z-index: -1;
        }

        .rainbow-blob {
            position: absolute;
            width: 120vw;
            height: 120vh;
            border-radius: 50%;
            filter: blur(150px);
            opacity: 0.7;
            transform: translate(-50%, -50%);
            will-change: transform;
        }

        .rainbow-glossy-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                180deg,
                rgba(255, 255, 255, 0.1) 0%,
                transparent 50%,
                transparent 100%
            );
            pointer-events: none;
        }

        .stars-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }

        .star {
            position: absolute;
            background: white;
            border-radius: 50%;
            will-change: opacity, transform;
        }

        .star.small {
            width: 1px;
            height: 1px;
            box-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
        }

        .star.medium {
            width: 2px;
            height: 2px;
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
        }

        .star.large {
            width: 3px;
            height: 3px;
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.9);
        }

        @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }

        .star.twinkle {
            animation: twinkle var(--duration) ease-in-out infinite;
            animation-delay: var(--delay);
        }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.className = 'rainbow-background-container';
    
    const blobSizes = [
        { width: '120vw', height: '120vh', opacity: 0.7 },
        { width: '140vw', height: '140vh', opacity: 0.6 },
        { width: '120vw', height: '120vh', opacity: 0.7 },
        { width: '130vw', height: '130vh', opacity: 0.65 }
    ];

    const blobs = [];
    
    for (let i = 0; i < 4; i++) {
        const blob = document.createElement('div');
        blob.className = 'rainbow-blob';
        blob.style.width = blobSizes[i].width;
        blob.style.height = blobSizes[i].height;
        blob.style.opacity = blobSizes[i].opacity;
        
        const pos = getRandomPosition();
        blob.style.left = `${pos.x}%`;
        blob.style.top = `${pos.y}%`;
        
        const color = getRandomColor();
        blob.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
        
        container.appendChild(blob);
        blobs.push({
            element: blob,
            currentColor: color,
            targetColor: color
        });
    }

    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    
    for (let i = 0; i < 30; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const rand = Math.random();
        let size;
        if (rand < 0.6) size = 'small';
        else if (rand < 0.9) size = 'medium';
        else size = 'large';
        star.classList.add(size);
        
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        if (Math.random() > 0.5) {
            star.classList.add('twinkle');
            star.style.setProperty('--duration', `${3 + Math.random() * 4}s`);
            star.style.setProperty('--delay', `${Math.random() * 3}s`);
        } else {
            star.style.opacity = 0.3 + Math.random() * 0.4;
        }
        
        starsContainer.appendChild(star);
    }
    
    container.appendChild(starsContainer);

    const overlay = document.createElement('div');
    overlay.className = 'rainbow-glossy-overlay';
    container.appendChild(overlay);

    document.body.insertBefore(container, document.body.firstChild);

    function getRandomPosition() {
        return {
            x: Math.random() * 100,
            y: Math.random() * 100
        };
    }

    function getRandomColor() {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1);
    }

    function interpolateColor(color1, color2, factor) {
        const c1 = hexToRgb(color1);
        const c2 = hexToRgb(color2);
        
        const r = c1.r + factor * (c2.r - c1.r);
        const g = c1.g + factor * (c2.g - c1.g);
        const b = c1.b + factor * (c2.b - c1.b);
        
        return rgbToHex(r, g, b);
    }

    function transitionColors() {
        blobs.forEach(blobData => {
            blobData.targetColor = getRandomColor();
            
            let progress = 0;
            const duration = 3000;
            const startTime = Date.now();
            const startColor = blobData.currentColor;
            
            function animate() {
                const elapsed = Date.now() - startTime;
                progress = Math.min(elapsed / duration, 1);
                
                const eased = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                
                const currentColor = interpolateColor(startColor, blobData.targetColor, eased);
                blobData.element.style.background = `radial-gradient(circle, ${currentColor} 0%, transparent 70%)`;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    blobData.currentColor = blobData.targetColor;
                }
            }
            
            animate();
        });
    }

    function moveBlobs() {
        blobs.forEach(blobData => {
            const pos = getRandomPosition();
            blobData.element.style.transition = 'all 4s cubic-bezier(0.4, 0, 0.2, 1)';
            blobData.element.style.left = `${pos.x}%`;
            blobData.element.style.top = `${pos.y}%`;
        });
    }

    setInterval(moveBlobs, 5000);
    setInterval(transitionColors, 6000);

    setTimeout(moveBlobs, 1000);
    setTimeout(transitionColors, 2000);

})();