const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
const scrollTopButton = document.getElementById("scroll-top");
const typedText = document.getElementById("typed-text");

const typingPhrases = [
  "Développement Web",
  "Programmation",
  "Leadership Associatif",
  "Organisation d'événements"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function updateScrollState() {
  navbar.classList.toggle("scrolled", window.scrollY > 24);
  scrollTopButton.classList.toggle("visible", window.scrollY > 520);
}

function typeLoop() {
  const currentPhrase = typingPhrases[phraseIndex];
  typedText.textContent = currentPhrase.slice(0, charIndex);

  if (!isDeleting && charIndex < currentPhrase.length) {
    charIndex += 1;
    setTimeout(typeLoop, 70);
    return;
  }

  if (!isDeleting) {
    isDeleting = true;
    setTimeout(typeLoop, 1350);
    return;
  }

  if (charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeLoop, 38);
    return;
  }

  isDeleting = false;
  phraseIndex = (phraseIndex + 1) % typingPhrases.length;
  setTimeout(typeLoop, 240);
}

function animateCounter(counter) {
  const target = Number(counter.dataset.target);
  const duration = 900;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    counter.textContent = Math.round(progress * target);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();
typeLoop();

hamburger.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  hamburger.classList.toggle("active", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
  });
});

scrollTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelector(".contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    entry.target.classList.add("visible");

    if (entry.target.classList.contains("skill-card")) {
      entry.target.querySelectorAll(".skill-item").forEach((skill) => {
        const fill = skill.querySelector(".skill-bar span");
        fill.style.width = `${skill.dataset.percent}%`;
      });
    }

    if (entry.target.classList.contains("about-card")) {
      entry.target.querySelectorAll(".stat-number").forEach(animateCounter);
    }

    if (entry.target.classList.contains("timeline")) {
      entry.target.classList.add("active");
    }

    observer.unobserve(entry.target);
  });
}, { threshold: 0.2 });

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});

document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = ((y / rect.height) - 0.5) * -10;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
});
