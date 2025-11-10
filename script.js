const canvas = document.getElementById('trailCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Grid settings
const gridSize = 10; // Size of each grid square in pixels
const trailPixels = [];
const maxTrailLength = 50;

// Snap position to grid
function snapToGrid(x, y) {
    return {
        x: Math.floor(x / gridSize) * gridSize,
        y: Math.floor(y / gridSize) * gridSize
    };
}

// Track mouse position
let lastGridPos = null;

document.addEventListener('mousemove', (e) => {
    const snapped = snapToGrid(e.clientX, e.clientY);
    
    // Only add if position changed (moved to new grid cell)
    if (!lastGridPos || lastGridPos.x !== snapped.x || lastGridPos.y !== snapped.y) {
        trailPixels.push({
            x: snapped.x,
            y: snapped.y,
            alpha: 1.0
        });
        
        // Keep trail length limited
        if (trailPixels.length > maxTrailLength) {
            trailPixels.shift();
        }
        
        lastGridPos = snapped;
    }
});

// Animation loop
function animate() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw trail pixels
    for (let i = trailPixels.length - 1; i >= 0; i--) {
        const pixel = trailPixels[i];
        
        // Fade out
        pixel.alpha -= 0.02;
        
        // Remove if fully faded
        if (pixel.alpha <= 0) {
            trailPixels.splice(i, 1);
            continue;
        }
        
        // Draw pixel
        ctx.fillStyle = `rgba(0, 0, 0, ${pixel.alpha})`;
        ctx.fillRect(pixel.x, pixel.y, gridSize, gridSize);
    }
    
    requestAnimationFrame(animate);
}

animate();
