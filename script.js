/* ============================================================
   UCAPAN ULANG TAHON — Annisa Shafa Aini
   Vanilla JavaScript — tanpa framework, tanpa CDN
   ============================================================ */

(function () {
    'use strict';

    /* ---------- Konstanta ---------- */
    const TOTAL_PHOTOS = 10;          // Slider sampai 10 foto
    const SLIDE_INTERVAL = 4000;      // 4 detik auto slide
    const QUOTE_INTERVAL = 4500;     // 4.5 detik ganti quote

    /* ---------- Quote romantis ---------- */
    const QUOTES = [
        "Kamu adalah alasan paling lembut untuk tersenyum.",
        "Setiap detik denganmu terasa seperti puisi yang tak usai.",
        "Dunia jadi lebih indah, karena ada kamu di dalamnya.",
        "Aku memilihmu, hari ini, esok, dan setiap hari setelahnya.",
        "Matamu adalah bintang yang paling ku suka jadikan tempat pulang.",
        "Tersenyumlah, hari ini seluruh alam semesta ikut merayakanmu.",
        "Cinta padamu bukan musim, melainkan iklim yang kupilih selamanya.",
        "Pada namamu, aku menemukan doa paling indah."
    ];

    /* ============================================================
       1. CANVAS BINTANG
       ============================================================ */
    const starCanvas = document.getElementById('starCanvas');
    const starCtx = starCanvas.getContext('2d');
    let stars = [];

    function resizeCanvas() {
        starCanvas.width = window.innerWidth;
        starCanvas.height = window.innerHeight;
        initStars();
    }

    function initStars() {
        const count = Math.floor((starCanvas.width * starCanvas.height) / 9000);
        stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * starCanvas.width,
                y: Math.random() * starCanvas.height,
                r: Math.random() * 1.4 + 0.3,
                a: Math.random(),
                speed: Math.random() * 0.02 + 0.005
            });
        }
    }

    function drawStars() {
        starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
        for (const s of stars) {
            s.a += s.speed;
            const alpha = 0.4 + Math.abs(Math.sin(s.a)) * 0.6;
            starCtx.beginPath();
            starCtx.fillStyle = 'rgba(217, 138, 163, ' + alpha.toFixed(2) + ')';
            starCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            starCtx.fill();
        }
        requestAnimationFrame(drawStars);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawStars();

    /* ============================================================
       2. EFEK BUNGA SAKURA (PETALS)
       ============================================================ */
    const petalsContainer = document.getElementById('petalsContainer');
    const petalChars = ['🌸', '🌷', '💮', '🌸'];

    function spawnPetal() {
        const petal = document.createElement('span');
        petal.className = 'petal';
        petal.textContent = petalChars[Math.floor(Math.random() * petalChars.length)];
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.fontSize = (14 + Math.random() * 16) + 'px';
        const duration = 8 + Math.random() * 8;
        petal.style.animationDuration = duration + 's';
        petal.style.opacity = (0.5 + Math.random() * 0.5).toString();
        petalsContainer.appendChild(petal);
        setTimeout(() => petal.remove(), duration * 1000);
    }
    setInterval(spawnPetal, 600);

    /* ============================================================
       3. EFEK HATI MELAYANG
       ============================================================ */
    const heartsContainer = document.getElementById('heartsContainer');
    const heartChars = ['❤', '♥', '💗', '💖'];

    function spawnHeart() {
        const heart = document.createElement('span');
        heart.className = 'heart';
        heart.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.bottom = '-40px';
        heart.style.fontSize = (12 + Math.random() * 14) + 'px';
        const duration = 7 + Math.random() * 6;
        heart.style.animationDuration = duration + 's';
        heartsContainer.appendChild(heart);
        setTimeout(() => heart.remove(), duration * 1000);
    }
    setInterval(spawnHeart, 900);

    /* ============================================================
       4. CONFETTI
       ============================================================ */
    const confettiContainer = document.getElementById('confettiContainer');
    const confettiColors = ['#e8b4c4', '#d98aa3', '#d4af7a', '#fdeef2', '#ffffff'];

    function launchConfetti(durationMs) {
        const end = Date.now() + durationMs;
        (function frame() {
            const remaining = end - Date.now();
            if (remaining <= 0) return;
            const count = remaining > durationMs * 0.7 ? 4 : 2;
            for (let i = 0; i < count; i++) {
                const piece = document.createElement('span');
                piece.className = 'confetti-piece';
                piece.style.left = Math.random() * 100 + 'vw';
                piece.style.top = '-20px';
                piece.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
                const dur = 3 + Math.random() * 2;
                piece.style.animationDuration = dur + 's';
                piece.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
                confettiContainer.appendChild(piece);
                setTimeout(() => piece.remove(), dur * 1000);
            }
            requestAnimationFrame(frame);
        })();
    }

    /* ============================================================
       5. GENERATE GALERI (10 FOTO OTOMATIS)
       ============================================================ */
    const galleryGrid = document.getElementById('galleryGrid');
    for (let i = 1; i <= TOTAL_PHOTOS; i++) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        const img = document.createElement('img');
        img.src = i + '.jpg';
        img.alt = 'Kenangan ' + i;
        img.loading = 'lazy';
        item.appendChild(img);
        galleryGrid.appendChild(item);
    }

    /* ============================================================
       6. SLIDER (10 FOTO) — FADE + ZOOM + LOOP + SWIPE
       ============================================================ */
    const sliderTrack = document.getElementById('sliderTrack');
    const sliderDots = document.getElementById('sliderDots');
    let slides = [];
    let dots = [];
    let currentSlide = 0;
    let slideTimer = null;

    // Generate 10 slide
    for (let i = 1; i <= TOTAL_PHOTOS; i++) {
        const slide = document.createElement('div');
        slide.className = 'slide';
        const img = document.createElement('img');
        img.src = 'Images/' + i + '.jpg';
        img.alt = 'Foto ' + i;
        slide.appendChild(img);
        sliderTrack.appendChild(slide);
        slides.push(slide);

        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.addEventListener('click', () => goToSlide(i - 1));
        sliderDots.appendChild(dot);
        dots.push(dot);
    }

    function showSlide(index) {
        slides.forEach((s, i) => s.classList.toggle('active', i === index));
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    function goToSlide(index) {
        // Loop tanpa henti
        currentSlide = (index + slides.length) % slides.length;
        showSlide(currentSlide);
        restartAutoSlide();
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function startAutoSlide() {
        stopAutoSlide();
        slideTimer = setInterval(nextSlide, SLIDE_INTERVAL);
    }
    function stopAutoSlide() {
        if (slideTimer) { clearInterval(slideTimer); slideTimer = null; }
    }
    function restartAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    document.getElementById('nextBtn').addEventListener('click', nextSlide);
    document.getElementById('prevBtn').addEventListener('click', prevSlide);

    // Swipe untuk HP
    let touchStartX = 0;
    let touchEndX = 0;
    const sliderEl = document.getElementById('slider');

    sliderEl.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
    }, { passive: true });

    sliderEl.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
            if (diff > 0) nextSlide();
            else prevSlide();
        } else {
            startAutoSlide();
        }
    }, { passive: true });

    // Tampilkan slide pertama & mulai auto slide (saat konten tampil)
    showSlide(0);

    /* ============================================================
       7. KATA-KATA ROMANTIS BERGANTI
       ============================================================ */
    const quoteEl = document.getElementById('rotatingQuote');
    let quoteIndex = 0;

    function rotateQuote() {
        quoteEl.classList.add('fading');
        setTimeout(() => {
            quoteIndex = (quoteIndex + 1) % QUOTES.length;
            quoteEl.textContent = QUOTES[quoteIndex];
            quoteEl.classList.remove('fading');
        }, 800);
    }
    setInterval(rotateQuote, QUOTE_INTERVAL);

    /* ============================================================
       8. SURAT CINTA — TOGGLE
       ============================================================ */
    const loveLetter = document.getElementById('loveLetter');
    const openLetterBtn = document.getElementById('openLetterBtn');
    openLetterBtn.addEventListener('click', () => {
        loveLetter.classList.toggle('hidden');
        openLetterBtn.textContent = loveLetter.classList.contains('hidden')
            ? '✉ Buka Surat'
            : '✉ Tutup Surat';
    });

    /* ============================================================
       9. MUSIK
       ============================================================ */
    const audio = document.getElementById('bgMusic');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeSlider = document.getElementById('volumeSlider');

    audio.volume = 0.6;

    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                playPauseBtn.textContent = '⏸ Pause Music';
            }).catch(() => {
                // Browser block autoplay — biarkan user coba lagi
                playPauseBtn.textContent = '▶ Play Music';
            });
        } else {
            audio.pause();
            playPauseBtn.textContent = '▶ Play Music';
        }
    });

    volumeSlider.addEventListener('input', (e) => {
        audio.volume = parseFloat(e.target.value);
    });

    /* ============================================================
       10. COUNTDOWN — menuju tanggal ulang tahun
       Target: 14 Juli (tanggal hari ini sebagai acuan demo)
       Jika sudah lewat tahun ini, otomatis ke tahun depan.
       ============================================================ */
    // Ganti tanggal di bawah sesuai hari ulang tahun sebenarnya
    const birthdayMonth = 7;  // 0 = Januari, jadi 6 = Juli
    const birthdayDay = 28;

    function getNextBirthday() {
        const now = new Date();
        let target = new Date(now.getFullYear(), birthdayMonth, birthdayDay, 0, 0, 0);
        if (target.getTime() <= now.getTime()) {
            target = new Date(now.getFullYear() + 1, birthdayMonth, birthdayDay, 0, 0, 0);
        }
        return target;
    }

    function pad(n) { return String(n).padStart(2, '0'); }

    function updateCountdown() {
        const target = getNextBirthday().getTime();
        const now = Date.now();
        const diff = target - now;

        if (diff <= 0) {
            document.getElementById('cdDays').textContent = '00';
            document.getElementById('cdHours').textContent = '00';
            document.getElementById('cdMinutes').textContent = '00';
            document.getElementById('cdSeconds').textContent = '00';
            return;
        }

        const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('cdDays').textContent    = pad(days);
        document.getElementById('cdHours').textContent   = pad(hours);
        document.getElementById('cdMinutes').textContent = pad(minutes);
        document.getElementById('cdSeconds').textContent = pad(seconds);
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();

    /* ============================================================
       11. TOMBOL "BUKA HADIAH" — buka cover, mulai semuanya
       ============================================================ */
    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('mainContent');
    const musicControls = document.getElementById('musicControls');
    const openGiftBtn = document.getElementById('openGiftBtn');

    openGiftBtn.addEventListener('click', () => {
        // Sembunyikan cover
        cover.classList.add('hidden');

        // Tampilkan konten utama & kontrol musik
        mainContent.classList.add('visible');
        musicControls.classList.remove('hidden');

        // Mulai musik (autoplay dengan user gesture)
        audio.play().then(() => {
            playPauseBtn.textContent = '⏸ Pause Music';
        }).catch(() => {
            playPauseBtn.textContent = '▶ Play Music';
        });

        // Mulai auto slide slider
        startAutoSlide();

        // Confetti saat website dibuka
        launchConfetti(5000);
    });

    /* ============================================================
       12. PAUSE AUTO SLIDE SAAT TAB TIDAK AKTIF (efisiensi)
       ============================================================ */
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoSlide();
        } else if (mainContent.classList.contains('visible')) {
            startAutoSlide();
        }
    });

})();
