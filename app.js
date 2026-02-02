const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;
const downloadResume = document.getElementById("downloadResume");

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light" || savedTheme === "dark") {
  root.setAttribute("data-theme", savedTheme);
}

const setToggleLabel = () => {
  const current = root.getAttribute("data-theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const isDark = current ? current === "dark" : systemPrefersDark;
  themeToggle.textContent = isDark ? "Switch to light" : "Switch to dark";
  themeToggle.setAttribute("aria-pressed", isDark);
};

setToggleLabel();

if (!savedTheme) {
  const systemMedia = window.matchMedia("(prefers-color-scheme: dark)");
  systemMedia.addEventListener("change", () => setToggleLabel());
}

themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  setToggleLabel();
});

if (downloadResume) {
  downloadResume.addEventListener("click", async (event) => {
    event.preventDefault();
    const url = downloadResume.getAttribute("href");
    const filename = downloadResume.getAttribute("download") || "resume.pdf";
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const tempLink = document.createElement("a");
      tempLink.href = objectUrl;
      tempLink.download = filename;
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      window.location.href = url;
    }
  });
}


const copyButtons = document.querySelectorAll("[data-copy]");
copyButtons.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const value = btn.getAttribute("data-copy");
    try {
      await navigator.clipboard.writeText(value);
      btn.textContent = "Copied";
      setTimeout(() => {
        btn.textContent = btn.getAttribute("data-copy-label") || "Copy";
      }, 1800);
    } catch (err) {
      const temp = document.createElement("textarea");
      temp.value = value;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
    }
  });
});

const observerOptions = {
  threshold: 0.2,
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const navLinks = document.querySelectorAll(".site-nav a");
const sections = Array.from(document.querySelectorAll("main section")).map(
  (section) => ({
    id: section.id,
    el: section,
  })
);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((section) => sectionObserver.observe(section.el));
