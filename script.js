const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const finalText = document.getElementById("finalText");

// ====== Stages ======
let yesClicks = 0;
let noStage = 0;

const noTexts = ["Нет.", "Подумай еще раз.", "Точно?", "Последний шанс..."];
const scaleSteps = [1, 1.10, 1.24, 1.42, 1.70];

// ====== Helpers ======
function updateYesSize() {
    const s = scaleSteps[Math.min(yesClicks, scaleSteps.length - 1)];
    yesBtn.style.transform = `scale(${s})`;
}

function updateNoText() {
    noBtn.textContent = noTexts[Math.min(noStage, noTexts.length - 1)];
}

function shakeNo() {
    noBtn.classList.remove("shake");
    void noBtn.offsetWidth; // restart anim
    noBtn.classList.add("shake");
}

function moveNoSomewhere() {
    noBtn.classList.add("is-running");

    const padding = 12;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const rect = noBtn.getBoundingClientRect();
    const bw = rect.width || 120;
    const bh = rect.height || 44;

    const minX = padding;
    const maxX = Math.max(minX, vw - bw - padding);
    const minY = padding;
    const maxY = Math.max(minY, vh - bh - padding);

    // Пытаемся избегать центра (чтобы реально "убегало")
    let x, y;
    for (let i = 0; i < 8; i++) {
        const tx = Math.floor(minX + Math.random() * (maxX - minX));
        const ty = Math.floor(minY + Math.random() * (maxY - minY));
        const dx = Math.abs(tx - vw / 2);
        const dy = Math.abs(ty - vh / 2);
        if (dx + dy > Math.min(vw, vh) * 0.35) {
            x = tx; y = ty; break;
        }
        x = tx; y = ty;
    }

    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
}

function sendNoOffScreen() {
    noBtn.classList.add("is-running");
    noBtn.style.left = "120vw";
    noBtn.style.top = "-30vh";
    noBtn.style.opacity = "0";
    noBtn.style.pointerEvents = "none";
    setTimeout(() => (noBtn.style.display = "none"), 320);
}

function showConfetti() {
    const layer = document.createElement("div");
    layer.className = "confetti-layer";
    document.body.appendChild(layer);

    // Не задаём цвета в CSS по просьбе? (это не график, тут можно)
    // Сделаю набор пастельных, чтобы было мило.
    const colors = ["#ff5a7a", "#ffb3c1", "#ffd166", "#8ecae6", "#b7e4c7", "#cdb4db"];

    const count = 28;
    for (let i = 0; i < count; i++) {
        const c = document.createElement("div");
        c.className = "confetti";
        c.style.left = `${Math.random() * 100}vw`;
        c.style.animationDelay = `${Math.random() * 120}ms`;
        c.style.background = colors[Math.floor(Math.random() * colors.length)];
        c.style.transform = `translateY(-20vh) rotate(${Math.random() * 120}deg)`;
        layer.appendChild(c);
    }

    setTimeout(() => layer.remove(), 1100);
}

function finish() {
    yesBtn.classList.remove("pulse");
    yesBtn.classList.add("yes-disappear");
    yesBtn.disabled = true;

    setTimeout(() => {
        yesBtn.style.display = "none";
        finalText.textContent = "Ура, люблю тебя!";
        finalText.classList.remove("fade-pop");
        void finalText.offsetWidth;
        finalText.classList.add("fade-pop");
        showConfetti();
    }, 560);
}

// ====== “No attempt” logic ======
function handleNoAttempt(e) {
    e.preventDefault();

    if (noBtn.style.display === "none") return;

    // визуально "сопротивляется"
    shakeNo();

    noStage += 1;
    updateNoText();

    if (noStage >= 4) {
        sendNoOffScreen();
    } else {
        moveNoSomewhere();
    }

    // При каждом “Нет” слегка увеличиваем “Да”, чтобы подсознательно вело к нужному
    yesClicks = Math.min(yesClicks + 1, 4);
    updateYesSize();
}

// ====== Events ======
yesBtn.addEventListener("click", () => {
    if (noBtn.style.display === "none") return finish();
    yesClicks += 1;
    updateYesSize();
});

noBtn.addEventListener("mouseenter", handleNoAttempt);
noBtn.addEventListener("click", handleNoAttempt);
noBtn.addEventListener("touchstart", handleNoAttempt, { passive: false });

// ====== Hearts background ======
function initHearts() {
    // создаём слой сердечек
    const wrap = document.createElement("div");
    wrap.className = "hearts";
    document.body.querySelector(".valentine")?.appendChild(wrap);

    const colors = ["#ff5a7a", "#ff8fab", "#ffd1dc", "#ffffff"];

    for (let i = 0; i < 14; i++) {
        const h = document.createElement("div");
        h.className = "heart";
        h.style.left = `${Math.random() * 100}%`;
        h.style.bottom = `${-10 - Math.random() * 30}%`;
        h.style.color = colors[Math.floor(Math.random() * colors.length)];
        h.style.animationDuration = `${6 + Math.random() * 6}s`;
        h.style.animationDelay = `${Math.random() * 4}s`;
        h.style.opacity = `${0.10 + Math.random() * 0.22}`;
        h.style.transform = `rotate(45deg) scale(${0.8 + Math.random() * 0.9})`;
        wrap.appendChild(h);
    }
}

// ====== Init ======
updateNoText();
updateYesSize();
yesBtn.classList.add("pulse");
initHearts();
