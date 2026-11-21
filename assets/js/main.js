// Set your Upwork profile link here to show the "Hire me on Upwork" buttons.
const LINKS = { upwork: "" };
const STATS_BASE = "https://raw.githubusercontent.com/omerfarooqBM/omerfarooqBM/main/assets/badges";

const root = document.documentElement;
const media = matchMedia("(prefers-color-scheme: dark)");
const effectiveTheme = () => root.dataset.theme || (media.matches ? "dark" : "light");

function applyThemedImages() {
  const theme = effectiveTheme();
  document.querySelectorAll("img.themed").forEach((img) => {
    const next = img.dataset[theme];
    if (next && img.getAttribute("src") !== next) img.setAttribute("src", next);
  });
}

document.getElementById("theme-toggle").addEventListener("click", () => {
  const next = effectiveTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch {}
  applyThemedImages();
});
media.addEventListener("change", applyThemedImages);
applyThemedImages();

if (LINKS.upwork) {
  document.querySelectorAll('[data-link="upwork"]').forEach((a) => { a.href = LINKS.upwork; a.hidden = false; a.rel = "noopener"; });
  document.querySelectorAll('[data-link="upwork-or-contact"]').forEach((a) => { a.href = LINKS.upwork; a.rel = "noopener"; });
}

const filters = document.querySelectorAll(".filter");
filters.forEach((button) => button.addEventListener("click", () => {
  filters.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
  const value = button.dataset.filter;
  document.querySelectorAll(".project").forEach((card) => { card.hidden = value !== "all" && card.dataset.category !== value; });
}));

const dialog = document.getElementById("project-dialog");
const $ = (id) => document.getElementById(id);
document.querySelectorAll(".project-open").forEach((button) => button.addEventListener("click", () => {
  const p = window.PROJECTS[button.dataset.project];
  if (!p) return;
  $("dialog-image").src = p.image;
  $("dialog-image").alt = p.title;
  $("dialog-label").textContent = p.label;
  $("dialog-title").textContent = p.title;
  $("dialog-role").textContent = p.role;
  $("dialog-desc").textContent = p.description;
  $("dialog-skills").replaceChildren(...p.skills.map((s) => Object.assign(document.createElement("span"), { className: "chip", textContent: s })));
  if (typeof dialog.showModal === "function") dialog.showModal();
}));
$("dialog-close").addEventListener("click", () => dialog.close());
$("dialog-cta").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });

$("copy-email").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  try {
    await navigator.clipboard.writeText($("email").textContent.trim());
    button.textContent = "Copied";
  } catch {
    button.textContent = "Press Ctrl+C";
    getSelection().selectAllChildren($("email"));
  }
  setTimeout(() => { button.textContent = "Copy"; }, 1800);
});

$("year").textContent = new Date().getFullYear();

async function loadStats() {
  try {
    const [all, year] = await Promise.all(
      ["contributions", "this-year"].map((name) => fetch(`${STATS_BASE}/${name}.json`, { cache: "no-store" }).then((r) => (r.ok ? r.json() : null))),
    );
    if (all?.message) document.querySelector('[data-stat="contributions"]').textContent = all.message;
    if (year?.message) {
      document.querySelector('[data-stat="this-year"]').textContent = year.message;
      const label = year.label?.replace(/^in /, "") || "";
      if (label) document.querySelector('[data-stat-label="this-year"]').textContent = `contributions in ${label}`;
    }
  } catch {}
}
loadStats();
