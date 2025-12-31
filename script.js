document.addEventListener('DOMContentLoaded', () => {

    // --- SETUP & STATE ---
    const state = {
        name: "Friend"
    };

    const ui = {
        body: document.body,
        scenes: {
            past: document.getElementById('scene-past'),
            future: document.getElementById('scene-future')
        },
        elements: {
            burdenGrid: document.getElementById('burden-grid'),
            taskBox: document.querySelector('.release-task'),
            inputName: document.getElementById('inp-real-name'),
            btnRelease: document.getElementById('btn-final-release')
        },
        letter: {
            paper: document.getElementById('letter-paper-el'),
            text: document.getElementById('letter-text')
        }
    };

    // --- TASK: SIGN & RELEASE ---
    ui.elements.btnRelease.addEventListener('click', handleRelease);
    // Allow 'Enter' key
    ui.elements.inputName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleRelease();
    });

    function handleRelease() {
        // Validation: Allow simple names, trim
        const val = ui.elements.inputName.value.trim();

        if (val.length > 0) {
            state.name = val;

            // 1. UI: Disable input to prevent double clicks
            ui.elements.inputName.disabled = true;
            ui.elements.btnRelease.style.transform = "scale(0.95)";

            // 2. Animate Heaviness Away
            ui.elements.burdenGrid.classList.add('fly-away-words');
            ui.elements.taskBox.style.opacity = '0';
            ui.elements.taskBox.style.transform = 'translateY(20px)';
            ui.elements.taskBox.style.transition = 'all 1s ease';

            // 3. Audio & Vibe
            playReleaseSound();

            setTimeout(() => {
                ui.body.classList.add('sunrise-vibe');
                spawnMarigoldShower();
            }, 800);

            // 4. Transition to Wish
            setTimeout(() => {
                ui.scenes.past.classList.remove('active');
                ui.scenes.future.classList.add('active');

                ui.letter.paper.classList.add('letter-enter');
                // Start typing shortly after paper appears
                setTimeout(typeWriterParams, 1000);
            }, 1200);

        } else {
            // Visual Shake for Empty Input
            ui.elements.inputName.focus();
            ui.elements.inputName.style.borderBottom = "2px solid #FF5252";
            setTimeout(() => ui.elements.inputName.style.borderBottom = "2px solid #FFF", 500);
        }
    }


    // --- TYPEWRITER WISH (Emotional & Friendly) ---
    function typeWriterParams() {
        const lines = [
            `Namaskaram ${state.name}! ✨`,
            `You just released the heavy past. Super asalu!`,
            `2025 lo enno chusam... Silent ga barincham.`,
            `But ninnu nuvvu nammukunnav (You believed in yourself).`,
            `Anduke you are here... Stronger than ever! 💪`,
            `2026 is Yours. "Thaggedhe Le" attitude tho vellu.`,
            `Be Real. Be Happy. Nuvvu Keka anthe!`,
            `Have a Crazy New Year! ❤️`,
            `- Shiva`
        ];

        let line = 0;
        let char = 0;
        ui.letter.text.innerHTML = "";

        // Auto-scroll logic for mobile if text gets long
        const paper = ui.letter.paper;

        function type() {
            if (line < lines.length) {
                if (char === 0) {
                    const p = document.createElement('p');
                    ui.letter.text.appendChild(p);
                }
                const str = lines[line];
                const p = ui.letter.text.lastElementChild;
                p.innerHTML += str[char];
                char++;

                // Ensure visibility on mobile
                // paper.scrollTop = paper.scrollHeight; 

                if (char >= str.length) {
                    line++; char = 0;
                    setTimeout(type, 600);
                } else {
                    setTimeout(type, 40);
                }
            }
        }
        type();
    }


    // --- CANVAS & FX ---
    let canvas, ctx;
    let petals = [];

    // Init Canvas
    function initCanvas() {
        canvas = document.getElementById('particles');
        ctx = canvas.getContext('2d');
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    initCanvas();

    function spawnMarigoldShower() {
        // Create 100 petals
        petals = Array.from({ length: 100 }).map(() => ({
            x: Math.random() * canvas.width,
            y: -Math.random() * 500,
            vy: Math.random() * 3 + 2,
            size: 5 + Math.random() * 5,
            color: ['#FF6F00', '#FFD600', '#D50000'][Math.floor(Math.random() * 3)],
            angle: Math.random() * 360,
            spin: (Math.random() - 0.5) * 5
        }));
        requestAnimationFrame(loop);
    }

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let active = false;
        petals.forEach(p => {
            p.y += p.vy;
            p.x += Math.sin(p.y * 0.02);
            p.angle += p.spin;

            if (p.y < canvas.height + 20) {
                active = true;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        });

        if (active) requestAnimationFrame(loop);
    }

    // --- AUDIO SIMULATION ---
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playReleaseSound() {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.connect(g); g.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.5);
        g.gain.setValueAtTime(0.2, audioCtx.currentTime);
        g.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
        osc.start(); osc.stop(audioCtx.currentTime + 0.5);
    }
});
