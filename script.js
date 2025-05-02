const GITHUB_USERNAME = 'BVBFuchs';

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
let isMatrixActive = false;

const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
const container = document.querySelector('.container');
const profilePic = document.getElementById('profile-pic');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops.length = 0;
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -100);
    }
}

const chars = 'BVBFuchs';
const fontSize = 14;
let columns = Math.floor(canvas.width / fontSize);
const drops = [];
let fadeOutStartTime = 0;
const effectDuration = 4000;
const fadeOutDuration = 1000;

for (let i = 0; i < columns; i++) {
    drops[i] = Math.floor(Math.random() * -100);
}

let animationId;

const header = document.querySelector('header');
const hero = document.querySelector('.hero');

let lastScroll = 0;

const drawerToggle = document.getElementById('drawer-toggle');
const projectsDrawer = document.querySelector('.projects-drawer');

drawerToggle.addEventListener('click', () => {
    projectsDrawer.classList.toggle('open');
    const icon = drawerToggle.querySelector('i');
    if (projectsDrawer.classList.contains('open')) {
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    } else {
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    }
});

function draw(timestamp) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let opacity = 1;
    if (fadeOutStartTime > 0) {
        const elapsed = timestamp - fadeOutStartTime;
        if (elapsed > effectDuration) {
            opacity = Math.max(0, 1 - ((elapsed - effectDuration) / fadeOutDuration));
        }
    }
    
    ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        drops[i]++;
    }

    if (timestamp - fadeOutStartTime > effectDuration + fadeOutDuration && fadeOutStartTime > 0) {
        cancelAnimationFrame(animationId);
        isMatrixActive = false;
        canvas.classList.remove('visible');
        canvas.classList.add('hidden');
        container.style.display = 'block';
        setTimeout(() => {
            container.style.opacity = '1';
        }, 100);
        return;
    }

    animationId = requestAnimationFrame(draw);
}

function animate() {
    fadeOutStartTime = performance.now();
    draw(fadeOutStartTime);
}

function startMatrixEffect() {
    if (!isMatrixActive) {
        isMatrixActive = true;
        container.style.opacity = '0';
        setTimeout(() => {
            container.style.display = 'none';
            canvas.classList.remove('hidden');
            canvas.classList.add('visible');
            resizeCanvas();
            animate();
        }, 500);
    } else {
        isMatrixActive = false;
        cancelAnimationFrame(animationId);
        canvas.classList.remove('visible');
        canvas.classList.add('hidden');
        container.style.display = 'block';
        setTimeout(() => {
            container.style.opacity = '1';
        }, 100);
    }
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const heroHeight = hero.offsetHeight;
    
    console.log('Current Scroll:', currentScroll);
    console.log('Hero Height:', heroHeight);
    
    if (currentScroll > heroHeight) {
        header.classList.add('show');
    } else {
        header.classList.remove('show');
    }
    
    lastScroll = currentScroll;
});

const skillBars = document.querySelectorAll('.skill-progress');
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.width = entry.target.getAttribute('data-width');
        }
    });
}, observerOptions);

skillBars.forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0';
    bar.setAttribute('data-width', width);
    observer.observe(bar);
});

const cards = document.querySelectorAll('.stat-card, .achievement-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
}); 