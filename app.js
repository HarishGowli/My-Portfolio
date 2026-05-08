// ==============================
// Load Skills from JSON
// ==============================
async function loadSkills() {
    try {
        const res = await fetch('skills.json');
        const skills = await res.json();
        const container = document.getElementById('skill-grid-container');
        if (!container) return;

        container.innerHTML = skills.map(skill => `
            <div class="skill-card reveal">
                <div class="skill-top">
                    <span class="skill-name"><i class="fa-brands ${skill.icon}"></i> ${skill.name}</span>
                    <span class="skill-pct">${skill.percent}%</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="--pct: ${skill.percent}%"></div>
                </div>
            </div>
        `).join('');

        // Observe skill cards for scroll reveal + progress animation
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    const fill = e.target.querySelector('.progress-fill');
                    if (fill) fill.classList.add('animate');
                    skillObserver.unobserve(e.target);
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));

    } catch (err) {
        console.error('Skills load error:', err);
        const container = document.getElementById('skill-grid-container');
        if (container) container.innerHTML = '<p style="color:#f87171">Failed to load skills.</p>';
    }
}

// ==============================
// Load Projects from JSON
// ==============================

// Default placeholder icons for projects without images
const projectIcons = ['💼', '📇', '🌐'];

async function loadProjects() {
    try {
        const res = await fetch('projects.json');
        const projects = await res.json();
        const container = document.getElementById('project-grid-container');
        if (!container) return;

        container.innerHTML = projects.map((proj, i) => `
            <div class="project-card reveal" data-category="${proj.category}">
                ${proj.image && proj.image !== './assets/project1.png' && proj.image !== './assets/project2.png' && proj.image !== './assets/project3.png'
                    ? `<div class="project-img" style="background-image: url('${proj.image}')"></div>`
                    : `<div class="project-img-placeholder">${projectIcons[i] || '🚀'}</div>`
                }
                <div class="project-info">
                    <h4>${proj.title}</h4>
                    <p class="project-desc">${proj.description}</p>
                    <p class="project-stack">${proj.stack}</p>
                    <div class="project-links">
                        <a href="${proj.live}" class="btn-live" ${proj.live !== '#' ? 'target="_blank" rel="noopener"' : ''}>
                            <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo
                        </a>
                        <a href="${proj.code}" class="btn-code" ${proj.code !== '#' ? 'target="_blank" rel="noopener"' : ''}>
                            <i class="fa-brands fa-github"></i> Code
                        </a>
                    </div>
                </div>
            </div>
        `).join('');

        attachFilterListeners();

        // Observe new project cards
        document.querySelectorAll('.project-card').forEach(card => {
            card.classList.add('reveal');
            revealObserver.observe(card);
        });

    } catch (err) {
        console.error('Projects load error:', err);
        const container = document.getElementById('project-grid-container');
        if (container) container.innerHTML = '<p style="color:#f87171">Failed to load projects.</p>';
    }
}

// ==============================
// Filter Logic
// ==============================
function attachFilterListeners() {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
        btn.removeEventListener('click', btn._listener);
        const handler = () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            document.querySelectorAll('.project-card').forEach(card => {
                card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
            });
        };
        btn.addEventListener('click', handler);
        btn._listener = handler;
    });
}

// ==============================
// Hamburger Menu
// ==============================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

// ==============================
// Sticky Navbar
// ==============================
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ==============================
// Scroll Reveal Observer
// ==============================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            revealObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('section, .stat-card, .timeline-card').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// ==============================
// Hero Particles
// ==============================
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = 28;
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: rgba(59, 130, 246, ${Math.random() * 0.4 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 8 + 6}s ease-in-out infinite;
            animation-delay: ${Math.random() * 4}s;
        `;
        container.appendChild(dot);
    }

    // Inject keyframes
    if (!document.getElementById('particle-style')) {
        const style = document.createElement('style');
        style.id = 'particle-style';
        style.textContent = `
            @keyframes particleFloat {
                0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
                33% { transform: translateY(-${Math.random() * 30 + 15}px) translateX(${Math.random() * 20 - 10}px); opacity: 0.8; }
                66% { transform: translateY(${Math.random() * 15}px) translateX(${Math.random() * 20 - 10}px); opacity: 0.3; }
            }
        `;
        document.head.appendChild(style);
    }
}

// ==============================
// Active Nav Link on Scroll
// ==============================
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });

    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = 'var(--accent)';
        }
    });
}
window.addEventListener('scroll', updateActiveNav);

// ==============================
// EmailJS Initialize
// ==============================
const EMAILJS_CONFIG = {
    publicKey: "3ZhsNMI6XmPvTD47J", // 🔁 Replace with your EmailJS public key
    serviceId: "service_wv3qz8m",         // 🔁 Replace with your EmailJS service ID
    templateId: "template_mp1b1m2"       // 🔁 Replace with your EmailJS template ID
};

// Initialize EmailJS immediately if configured
if (EMAILJS_CONFIG.publicKey !== "YOUR_EMAILJS_PUBLIC_KEY") {
    try {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log("EmailJS initialized successfully");
    } catch (e) {
        console.error("EmailJS initialization failed:", e);
    }
}

// ==============================
// Send Email
// ==============================
function sendEmail() {
    const btn = document.getElementById("send-btn");
    const status = document.getElementById("status-msg");

    const name = document.getElementById("user_name").value.trim();
    const email = document.getElementById("user_email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        status.style.display = "block";
        status.style.color = "#f87171";
        status.textContent = "Please fill in all fields.";
        return;
    }

    const emailPattern = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if (!emailPattern.test(email)) {
        status.style.display = "block";
        status.style.color = "#f87171";
        status.textContent = "Please enter a valid email address.";
        return;
    }

    btn.disabled = true;
    btn.textContent = "Sending...";

    const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
        to_name: "Harish Gowli", // Add recipient name
        reply_to: email // Add reply-to email
    };

    const isEmailJsConfigured = EMAILJS_CONFIG.publicKey !== "YOUR_EMAILJS_PUBLIC_KEY"
        && EMAILJS_CONFIG.serviceId !== "service_XXXXXXX"
        && EMAILJS_CONFIG.templateId !== "template_XXXXXXX";

    console.log("EmailJS Configuration Check:");
    console.log("Public Key set:", EMAILJS_CONFIG.publicKey !== "YOUR_EMAILJS_PUBLIC_KEY");
    console.log("Service ID set:", EMAILJS_CONFIG.serviceId !== "service_XXXXXXX");
    console.log("Template ID set:", EMAILJS_CONFIG.templateId !== "template_XXXXXXX");
    console.log("isEmailJsConfigured:", isEmailJsConfigured);
    console.log("Template Params:", templateParams);

    const resetButton = () => {
        btn.disabled = false;
        btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
    };

    if (!isEmailJsConfigured) {
        status.style.display = "block";
        status.style.color = "#fbbf24";
        status.textContent = "EmailJS is not configured yet. Opening your email client as a fallback.";

        const subject = encodeURIComponent(`Contact from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
        window.location.href = `mailto:gowliharish321@gmail.com?subject=${subject}&body=${body}`;

        resetButton();
        return;
    }

    if (typeof emailjs === 'undefined') {
        status.style.display = "block";
        status.style.color = "#f87171";
        status.textContent = "EmailJS library failed to load. Please check your internet connection.";
        resetButton();
        return;
    }

    if (EMAILJS_CONFIG.publicKey !== "YOUR_EMAILJS_PUBLIC_KEY") {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    }

    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams)
        .then((response) => {
            console.log("EmailJS Success:", response);
            status.style.display = "block";
            status.style.color = "#4ade80";
            status.textContent = "Message sent successfully! I'll get back to you soon.";
            document.getElementById("user_name").value = "";
            document.getElementById("user_email").value = "";
            document.getElementById("message").value = "";
            resetButton();
            setTimeout(() => { status.style.display = "none"; }, 5000);
        })
        .catch((error) => {
            console.error("EmailJS Error Details:", error);
            console.error("Error status:", error.status);
            console.error("Error text:", error.text);

            status.style.display = "block";
            status.style.color = "#f87171";

            // Provide more specific error messages
            if (error.status === 400) {
                status.textContent = "Bad request - check template parameters or EmailJS template configuration.";
            } else if (error.status === 401) {
                status.textContent = "EmailJS authentication failed. Please check your public key.";
            } else if (error.status === 403) {
                status.textContent = "EmailJS access denied. Your account might need verification or check your plan limits.";
            } else if (error.status === 404) {
                status.textContent = "EmailJS service or template not found. Please check your service ID and template ID.";
            } else if (error.status === 429) {
                status.textContent = "Too many requests. Please wait a moment and try again.";
            } else {
                status.textContent = `Something went wrong (Error ${error.status}). Please try again.`;
            }

            resetButton();
        });
}

// ==============================
// Test EmailJS Configuration (call testEmailJS() in browser console)
// ==============================
function testEmailJS() {
    console.log("Testing EmailJS Configuration:");
    console.log("Public Key:", EMAILJS_CONFIG.publicKey);
    console.log("Service ID:", EMAILJS_CONFIG.serviceId);
    console.log("Template ID:", EMAILJS_CONFIG.templateId);

    const testParams = {
        from_name: "Test User",
        from_email: "test@example.com",
        message: "This is a test message from the portfolio contact form.",
        to_name: "Harish Gowli",
        reply_to: "test@example.com"
    };

    console.log("Test parameters:", testParams);

    return emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, testParams)
        .then(response => {
            console.log("✅ EmailJS Test Successful:", response);
            return response;
        })
        .catch(error => {
            console.error("❌ EmailJS Test Failed:", error);
            console.error("Error status:", error.status);
            console.error("Error text:", error.text);
            return error;
        });
}

// Make test function available globally for console testing
window.testEmailJS = testEmailJS;

// ==============================
// Init on DOM Load
// ==============================
document.addEventListener('DOMContentLoaded', () => {
    loadSkills();
    loadProjects();
    createParticles();
});
