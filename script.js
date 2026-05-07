const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
const scrollTopButton = document.getElementById("scrollTop");
const typedText = document.getElementById("typed-text");
const customCursor = document.getElementById("cursor");
const githubUsername = document.getElementById("github-username");
const fetchGithubButton = document.getElementById("fetch-github-btn");
const githubLoading = document.getElementById("github-loading");
const githubError = document.getElementById("github-error");
const githubProfile = document.getElementById("github-profile");
const githubRepos = document.getElementById("github-repos");
const quoteLoading = document.getElementById("quote-loading");
const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const newQuoteButton = document.getElementById("new-quote-btn");


const typingPhrases = [
  "Développement Web",
  "Programmation en C",
  "Leadership associatif",
  "Analyse et résolution de problèmes"
];

const fallbackQuotes = [
  {
    content: "La réussite appartient à celles et ceux qui avancent avec rigueur, curiosité et constance.",
    author: "Portfolio Meryem"
  },
  {
    content: "Chaque projet bien construit commence par une idée claire et une exécution disciplinée.",
    author: "Inspiration"
  }
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
    setTimeout(typeLoop, 72);
    return;
  }

  if (!isDeleting) {
    isDeleting = true;
    setTimeout(typeLoop, 1200);
    return;
  }

  if (charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeLoop, 36);
    return;
  }

  isDeleting = false;
  phraseIndex = (phraseIndex + 1) % typingPhrases.length;
  setTimeout(typeLoop, 260);
}

function animateCounter(counter) {
  if (counter.dataset.done === "true") {
    return;
  }

  counter.dataset.done = "true";
  const target = Number(counter.dataset.target);
  const duration = 900;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    counter.textContent = String(Math.round(progress * target));

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(dateString));
}

function setGithubLoading(isLoading) {
  githubLoading.classList.toggle("active", isLoading);
  fetchGithubButton.disabled = isLoading;
}

function showGithubError(message) {
  githubError.textContent = `⚠️ ${message}`;
  githubError.classList.add("active");
}

function clearGithub() {
  githubError.textContent = "";
  githubError.classList.remove("active");
  githubProfile.classList.remove("active");
  githubProfile.innerHTML = "";
  githubRepos.innerHTML = "";
}

async function fetchGithubData() {
  const username = githubUsername.value.trim();

  if (!username) {
    showGithubError("Veuillez saisir un nom d'utilisateur GitHub.");
    return;
  }

  clearGithub();
  setGithubLoading(true);

  try {
    const [profileResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}`),
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`)
    ]);

    if (!profileResponse.ok) {
      throw new Error("Profil GitHub introuvable.");
    }

    if (!reposResponse.ok) {
      throw new Error("Impossible de récupérer les dépôts GitHub.");
    }

    const profile = await profileResponse.json();
    const repos = await reposResponse.json();
    renderGithubProfile(profile);
    renderRepos(repos);
  } catch (error) {
    showGithubError(error.message || "Une erreur est survenue pendant le chargement.");
  } finally {
    setGithubLoading(false);
  }
}

function renderGithubProfile(profile) {
  githubProfile.innerHTML = `
    <img src="${profile.avatar_url}" alt="${profile.login}">
    <div class="profile-meta">
      <h3>${profile.name || profile.login}</h3>
      <p>${profile.bio || "Profil GitHub public"}</p>
      <div class="profile-stats">
        <span>Repos: ${profile.public_repos}</span>
        <span>Followers: ${profile.followers}</span>
        <span>Following: ${profile.following}</span>
      </div>
    </div>
  `;
  githubProfile.classList.add("active");
}

function renderRepos(repos) {
  if (!repos.length) {
    githubRepos.innerHTML = '<article class="repo-card"><p>Aucun dépôt public trouvé.</p></article>';
    return;
  }

  githubRepos.innerHTML = repos.map((repo) => `
    <article class="repo-card">
      <div class="repo-top">
        <a class="repo-name" href="${repo.html_url}" target="_blank" rel="noreferrer">${repo.name}</a>
        <span class="language-badge">${repo.language || "Code"}</span>
      </div>
      <p>${repo.description || "Dépôt public GitHub sans description."}</p>
      <div class="repo-bottom">
        <span>⭐ ${repo.stargazers_count}</span>
        <span>🍴 ${repo.forks_count}</span>
        <span>Mis à jour: ${formatDate(repo.updated_at)}</span>
      </div>
    </article>
  `).join("");
}

async function fetchQuote() {
  quoteLoading.classList.add("active");
  quoteText.classList.add("fade");
  quoteAuthor.textContent = "";

  try {
    const response = await fetch("https://api.quotable.io/random?maxLength=130");

    if (!response.ok) {
      throw new Error("Quote API unavailable");
    }

    const quote = await response.json();
    updateQuote(quote.content, quote.author);
  } catch {
    const quote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    updateQuote(quote.content, quote.author);
  } finally {
    quoteLoading.classList.remove("active");
  }
}

function updateQuote(content, author) {
  setTimeout(() => {
    quoteText.textContent = content;
    quoteAuthor.textContent = `— ${author}`;
    quoteText.classList.remove("fade");
  }, 240);
}



function animateSkillBars(card) {
  card.querySelectorAll(".skill-fill").forEach((fill) => {
    fill.style.width = fill.dataset.width;
  });
}

function animateRing(card) {
  const ring = card.querySelector(".ring-fill");
  const percent = Number(ring.dataset.percent);
  const circumference = 314.16;
  ring.style.strokeDashoffset = String(circumference - (circumference * percent) / 100);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    entry.target.classList.add("visible");

    if (entry.target.classList.contains("skill-card")) {
      animateSkillBars(entry.target);
    }

    if (entry.target.classList.contains("about-card")) {
      entry.target.querySelectorAll(".stat-number").forEach(animateCounter);
    }

    if (entry.target.classList.contains("language-card")) {
      animateRing(entry.target);
    }

    observer.unobserve(entry.target);
  });
}, { threshold: 0.2 });

document.querySelectorAll(".fade-in, .fade-in-left, .fade-in-right").forEach((element) => {
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

document.querySelectorAll("a, button, input, textarea").forEach((element) => {
  element.addEventListener("mouseenter", () => customCursor.classList.add("hovering"));
  element.addEventListener("mouseleave", () => customCursor.classList.remove("hovering"));
});

document.addEventListener("mousemove", (event) => {
  customCursor.style.left = `${event.clientX}px`;
  customCursor.style.top = `${event.clientY}px`;
});

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

window.addEventListener("scroll", updateScrollState, { passive: true });

scrollTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

fetchGithubButton.addEventListener("click", fetchGithubData);
githubUsername.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    fetchGithubData();
  }
});

newQuoteButton.addEventListener("click", fetchQuote);
refreshWeatherButton.addEventListener("click", fetchWeather);

document.querySelector(".contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  event.currentTarget.querySelector("#contact-submit").textContent = "Message prêt à envoyer ✓";
  setTimeout(() => {
    document.getElementById("contact-submit").textContent = "Envoyer le message ✉️";
  }, 1800);
});

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

document.querySelectorAll("main section").forEach((section) => {
  navObserver.observe(section);
});

updateScrollState();
typeLoop();
fetchGithubData();
fetchQuote();
fetchWeather();
