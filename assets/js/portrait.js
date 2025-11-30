  // Set year in footer
  function setYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  // ===== IMAGE-BASED PARTICLE PORTRAIT (ROBUST) =====
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setYear();
      initParticleSystem();
    });
  } else {
    setYear();
    initParticleSystem();
  }

  function initParticleSystem() {
    const canvas = document.getElementById("portraitCanvas");
    if (!canvas) {
      console.error("Canvas element 'portraitCanvas' not found!");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Could not get 2D context from canvas!");
      return;
    }

    const W = canvas.width;
    const H = canvas.height;

    // Mobile detection and performance optimization
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    const isLowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    
    // Dynamic configuration based on device capabilities
    const particles = [];
    const density = isMobile ? 8 : (isLowPower ? 7 : 6);
    const particleSize = isMobile ? 1.0 : 1.5;
    const rgbOffset = isMobile ? 0.8 : 1.2;
    const mouse = { x: null, y: null, radius: isMobile ? 120 : 200 };
    let animationStarted = false;
    let frameCount = 0;
    const targetFPS = isMobile ? 30 : 60;
    const frameInterval = 1000 / targetFPS;

    console.log(`Canvas initialized: ${W}x${H}`);

    const img = new Image();
    img.src = "assets/img/me.jpg"; // JPG for better quality and transparency

    img.onload = () => {
      console.log(`Portrait image loaded successfully: ${img.width}x${img.height}`);
      try {
        createParticlesFromImage(img);
      } catch (err) {
        console.error("Error creating particles:", err);
      }
      console.log(`Starting animation with ${particles.length} particles (${isMobile ? 'mobile' : 'desktop'} mode)`);
      animationStarted = true;
      requestAnimationFrame(animate);
    };

    img.onerror = (e) => {
      console.warn("Image failed to load (likely CORS with file:// protocol).");
      console.log("Attempted to load:", img.src);
      console.log(`Starting animation with ${particles.length} particles (${isMobile ? 'mobile' : 'desktop'} mode)`);
      animationStarted = true;
      requestAnimationFrame(animate);
    };

    function createParticlesFromImage(image) {
      const off = document.createElement("canvas");
      const octx = off.getContext("2d");
      off.width = W;
      off.height = H;

      // Clear the offscreen canvas
      octx.fillStyle = "black";
      octx.fillRect(0, 0, W, H);

      // Resize image to fit canvas better - use more of the available space
      const scale = Math.min(W / image.width, H / image.height) * 0.95;
      const drawW = image.width * scale;
      const drawH = image.height * scale;
      const dx = (W - drawW) / 2;
      const dy = (H - drawH) / 2;

      // Draw image to offscreen canvas with high-quality smoothing
      octx.imageSmoothingEnabled = true;
      octx.imageSmoothingQuality = 'high';
      octx.drawImage(image, dx, dy, drawW, drawH);
      
      console.log(`Image drawn: ${drawW}x${drawH} at (${dx}, ${dy}), scale: ${scale.toFixed(2)}`);

      let imageData;
      try {
        imageData = octx.getImageData(0, 0, W, H);
      } catch (err) {
        // This usually means CORS / tainted canvas
        console.error("getImageData failed (likely CORS / tainted canvas):", err);
        throw err;
      }

      const data = imageData.data;
      let particleCount = 0;
      let sampledPixels = 0;
      let validPixels = 0;

      // Sample pixels with random offsets to break the grid pattern
      for (let y = 0; y < H; y += density) {
        for (let x = 0; x < W; x += density) {
          // Add random offset to break perfect grid
          const randomOffsetX = Math.floor(Math.random() * density) - Math.floor(density / 2);
          const randomOffsetY = Math.floor(Math.random() * density) - Math.floor(density / 2);
          const sampleX = Math.max(0, Math.min(W - 1, x + randomOffsetX));
          const sampleY = Math.max(0, Math.min(H - 1, y + randomOffsetY));
          
          sampledPixels++;
          const idx = (sampleY * W + sampleX) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];

          // Optimized detection for RGB separation effect
          const brightness = (r + g + b) / 3;
          const hasColor = r > 20 || g > 20 || b > 20; // avoid pure black
          const hasContrast = Math.abs(r - g) > 10 || Math.abs(g - b) > 10 || Math.abs(r - b) > 10;
          
          // Simplified particle creation for better RGB effect
          const shouldCreate = a > 50 && (brightness > 30 || hasContrast) && hasColor;
          
          if (shouldCreate) {
            // Optimized positioning for RGB separation
            const randomX = sampleX + (Math.random() - 0.5) * density;
            const randomY = sampleY + (Math.random() - 0.5) * density;
            
            particles.push({
              x: randomX,
              y: randomY,
              baseX: randomX,
              baseY: randomY,
              vx: 0,
              vy: 0,
              color: { r, g, b, brightness }
            });
            particleCount++;
          }
          
          if (brightness > 8) {
            validPixels++;
          }
        }
      }

      console.log(`Particles created from image: ${particleCount}/${validPixels} valid pixels out of ${sampledPixels} sampled`);
    }

    // Mouse event listeners
    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Touch support for mobile
    canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
    });

    canvas.addEventListener("touchend", () => {
      mouse.x = null;
      mouse.y = null;
    });

    let lastFrameTime = 0;

    function animate(currentTime) {
      if (!animationStarted) return;
      
      // Frame rate limiting for mobile
      if (isMobile && currentTime - lastFrameTime < frameInterval) {
        requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = currentTime;
      frameCount++;

      // Clear canvas
      ctx.clearRect(0, 0, W, H);

      // Draw background
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, W, H);

      // Animate particles
      for (const p of particles) {
        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force * 1.2;
            p.vy += Math.sin(angle) * force * 1.2;
          }
        }

        // Return to base position
        const dxBase = p.baseX - p.x;
        const dyBase = p.baseY - p.y;
        p.vx += dxBase * 0.08;
        p.vy += dyBase * 0.08;

        // Apply friction
        p.vx *= 0.92;
        p.vy *= 0.92;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Optimized rendering based on device capabilities
        const { r, g, b } = p.color || { r: 148, g: 163, b: 184 };
        const opacity = isMobile ? 0.8 : 0.65;
        
        if (isMobile) {
          // Simplified single particle rendering for mobile (using original colors)
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Full RGB separation for desktop
          ctx.shadowBlur = 1;
          
          // Red component (shifted left/up)
          ctx.fillStyle = `rgba(${r}, 0, 0, ${opacity})`;
          ctx.shadowColor = `rgba(${r}, 0, 0, 0.2)`;
          ctx.beginPath();
          ctx.arc(p.x - rgbOffset, p.y - rgbOffset * 0.5, particleSize, 0, Math.PI * 2);
          ctx.fill();
          
          // Green component (centered)
          ctx.fillStyle = `rgba(0, ${g}, 0, ${opacity})`;
          ctx.shadowColor = `rgba(0, ${g}, 0, 0.2)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
          ctx.fill();
          
          // Blue component (shifted right/down)
          ctx.fillStyle = `rgba(0, 0, ${b}, ${opacity})`;
          ctx.shadowColor = `rgba(0, 0, ${b}, 0.2)`;
          ctx.beginPath();
          ctx.arc(p.x + rgbOffset, p.y + rgbOffset * 0.5, particleSize, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.shadowBlur = 0;
        }
      }

      requestAnimationFrame(animate);
    }

  } // End of initParticleSystem function