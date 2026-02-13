const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const runArea = document.getElementById("runArea");
const finalText = document.getElementById("finalText");

let yesClicks = 0;
let noStage = 0;
let cooldown = false;

const noTexts = ["Нет.", "Подумай еще раз.", "Точно?", "Последний шанс..."];
const scaleSteps = [1, 1.10, 1.24, 1.42, 1.70];

function updateYesSize() {
    const s = scaleSteps[Math.min(yesClicks, scaleSteps.length - 1)];
    yesBtn.style.transform = `scale(${s})`;
}

function updateNoText() {
    noBtn.textContent = noTexts[Math.min(noStage, noTexts.length - 1)];
}

function shakeNo() {
    noBtn.classList.remove("shake");
    void noBtn.offsetWidth;
    noBtn.classList.add("shake");
}

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

// Двигаем "Нет" строго внутри run-area
function moveNoInsideRunArea() {
    const padding = 10;

    const areaW = runArea.clientWidth;
    const areaH = runArea.clientHeight;

    const bw = noBtn.offsetWidth || 120;
    const bh = noBtn.offsetHeight || 44;

    const minX = padding;
    const minY = padding;
    const maxX = Math.max(minX, areaW - bw - padding);
    const maxY = Math.max(minY, areaH - bh - padding);

    // Дополнительно избегаем зоны центра (где "Да"), чтобы не наезжало
    const centerX = areaW / 2;
    const centerY = areaH / 2;

    let x = minX, y = minY;

    for (let i = 0; i < 10; i++) {
        const tx = minX + Math.random() * (maxX - minX);
        const ty = minY + Math.random() * (maxY - minY);

        // расстояние от центра
        const dx = Math.abs(tx + bw / 2 - centerX);
        const dy = Math.abs(ty + bh / 2 - centerY);

        // чем больше — тем лучше (хотим подальше от центра)
        if (dx + dy > Math.min(areaW, areaH) * 0.35) {
            x = tx; y = ty;
            break;
        }
        x = tx; y = ty;
    }

    x = clamp(Math.floor(x), minX, maxX);
    y = clamp(Math.floor(y), minY, maxY);

    noBtn.style.left = `${x}px`;
    noBtn.style.top  = `${y}px`;
}

function hideNo() {
    noBtn.style.opacity = "0";
    noBtn.style.pointerEvents = "none";
    setTimeout(() => (noBtn.style.display = "none"), 260);
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
    }, 560);
}

// Один обработчик для "Нет" (без двойных срабатываний)
function handleNoAttempt(e) {
    e.preventDefault();

    if (noBtn.style.display === "none") return;
    if (cooldown) return;

    cooldown = true;
    setTimeout(() => (cooldown = false), 260);

    shakeNo();

    noStage += 1;
    updateNoText();

    // каждый "нет" делает "да" более заманчивой :)
    yesClicks = Math.min(yesClicks + 1, 4);
    updateYesSize();

    if (noStage >= 4) hideNo();
    else moveNoInsideRunArea();
}

// События: pointerdown + (только для мыши) pointerenter
noBtn.addEventListener("pointerdown", handleNoAttempt);
noBtn.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse") handleNoAttempt(e);
});

yesBtn.addEventListener("click", () => {
    if (noBtn.style.display === "none") return finish();
    yesClicks += 1;
    updateYesSize();
});

// Плавающие сердечки на фоне
function initHearts() {
    const container = document.querySelector(".valentine");
    if (!container) return;

    const wrap = document.createElement("div");
    wrap.className = "hearts";
    container.appendChild(wrap);

    const colors = ["rgba(255,255,255,.9)", "rgba(255,90,122,.6)", "rgba(255,209,220,.7)"];

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

// init
updateNoText();
updateYesSize();
yesBtn.classList.add("pulse");
initHearts();

// стартовая позиция "Нет" (внутри run-area)
setTimeout(() => {
    noBtn.style.left = "60%";
    noBtn.style.top = "18%";
}, 0);
