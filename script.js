document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const ui = {
        pets: document.querySelectorAll('.pet-watcher'),
        scenes: {
            intro: document.getElementById('scene-intro'),
            cake: document.getElementById('scene-cake'),
            blast: document.getElementById('scene-blast'),
            wish: document.getElementById('scene-wish')
        },
        btnStart: document.getElementById('btn-start'),
        cakeContainer: document.getElementById('cake-interaction'),
        cakeBody: document.querySelector('.cake-body'),
        fireCanvas: document.getElementById('firework-canvas'),
        yearText: document.getElementById('year-text'),
        btnRestart: document.getElementById('btn-restart')
    };

    // --- STATE ---
    let state = {
        cakeCut: false
    };

    // --- MOUSE TRACKING (Pets) ---
    document.addEventListener('mousemove', (e) => {
        ui.pets.forEach(pet => {
            const eyes = pet.querySelectorAll('.pet-eye');
            eyes.forEach(eye => {
                const pupil = eye.querySelector('.pet-pupil');
                const rect = eye.getBoundingClientRect();
                const eyeCenterX = rect.left + rect.width / 2;
                const eyeCenterY = rect.top + rect.height / 2;

                // Angle to pointer
                const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);

                // Limit movement distance (keep inside eye)
                const distance = Math.min(3, 3); // 3px radius

                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;

                pupil.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
            });
        });
    });

    // --- SCENE NAV ---
    function switchScene(name) {
        Object.values(ui.scenes).forEach(s => {
            s.classList.remove('active');
            setTimeout(() => { if (!s.classList.contains('active')) s.style.display = 'none'; }, 1000);
        });

        const next = ui.scenes[name];
        next.style.display = 'flex';
        void next.offsetWidth;
        next.classList.add('active');
    }

    // Scene 1 -> 2
    ui.btnStart.addEventListener('click', () => {
        switchScene('cake');
    });

    // --- SCENE 2: CAKE CUTTING ---
    // Simple drag detection
    let isDragging = false;
    ui.cakeContainer.addEventListener('mousedown', () => isDragging = true);
    ui.cakeContainer.addEventListener('touchstart', () => isDragging = true);

    ['mouseup', 'touchend'].forEach(evt =>
        document.addEventListener(evt, () => {
            if (isDragging && !state.cakeCut) {
                cutCake();
            }
            isDragging = false;
        })
    );

    function cutCake() {
        state.cakeCut = true;
        ui.cakeBody.classList.add('cut');

        // Wait for animation then go to blast
        setTimeout(() => {
            switchScene('blast');
            startFireworks();
        }, 2000);
    }

    // --- SCENE 3: FIREWORKS ---
    function startFireworks() {
        const ctx = ui.fireCanvas.getContext('2d');
        let width, height;

        function resize() {
            width = ui.fireCanvas.width = window.innerWidth;
            height = ui.fireCanvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        let particles = [];

        function Particle(x, y, color) {
            this.x = x; this.y = y;
            this.color = color;
            this.velocity = { x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 8 };
            this.alpha = 1;
            this.friction = 0.95;
            this.gravity = 0.05;
        }

        Particle.prototype.draw = function () {
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
        };

        Particle.prototype.update = function () {
            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;
            this.velocity.y += this.gravity;
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.alpha -= 0.01;
        };

        function explode(x, y) {
            const colors = ['#FF00FF', '#FFD700', '#00FFFF', '#FF5722'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle(x, y, color));
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.fillStyle = 'rgba(18, 10, 42, 0.2)'; // Trail effect
            ctx.fillRect(0, 0, width, height);

            particles.forEach((p, i) => {
                if (p.alpha > 0) {
                    p.update();
                    p.draw();
                } else {
                    particles.splice(i, 1);
                }
            });

            // Random auto explosions
            if (Math.random() < 0.05) {
                explode(Math.random() * width, Math.random() * height * 0.5);
            }
        }

        animate();

        // Reveal Year Text
        setTimeout(() => { ui.yearText.style.opacity = 1; }, 500);

        // Move to Wish after 5 seconds
        setTimeout(() => {
            switchScene('wish');
        }, 5000);
    }

    // --- RESET ---
    ui.btnRestart.addEventListener('click', () => {
        location.reload();
    });

});
