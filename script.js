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
    // важно: сохраняем translate(-50%, -50%) из CSS, добавляем scale
    yesBtn.style.transform = `translate(-50%, -50%) scale(${s})`;
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

/**
 * Двигаем "Нет" в пределах runArea.
 * Координаты считаем так, чтобы кнопка целиком помещалась.
 */
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

    // избегаем зоны центра (где "Да")
    const centerX = areaW / 2;
    const centerY = areaH / 2;

    let x = minX, y = minY;

    for (let i = 0; i < 12; i++) {
        const tx = minX + Math.random() * (maxX - minX);
        const ty = minY + Math.random() * (maxY - minY);

        const dx = Math.abs((tx + bw / 2) - centerX);
        const dy = Math.abs((ty + bh / 2) - centerY);

        if (dx + dy > Math.min(areaW, areaH) * 0.33) {
            x = tx; y = ty;
            break;
        }
        x = tx; y = ty;
    }

    x = clamp(Math.floor(x), minX, maxX);
    y = clamp(Math.floor(y), minY, maxY);

    // абсолютные координаты внутри runArea
    noBtn.style.left = `${x + bw / 2}px`;
    noBtn.style.top  = `${y + bh / 2}px`;
    noBtn.style.transform = "translate(-50%, -50%)";
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

function handleNoAttempt(e) {
    e.preventDefault();

    if (noBtn.style.display === "none") return;
    if (cooldown) return;

    cooldown = true;
    setTimeout(() => (cooldown = false), 260);

    shakeNo();

    noStage += 1;
    updateNoText();

    // каждый "нет" усиливает "да"
    yesClicks = Math.min(yesClicks + 1, 4);
    updateYesSize();

    if (noStage >= 4) hideNo();
    else moveNoInsideRunArea();
}

// единые события без дублей
noBtn.addEventListener("pointerdown", handleNoAttempt);
noBtn.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse") handleNoAttempt(e);
});

yesBtn.addEventListener("click", () => {
    if (noBtn.style.display === "none") return finish();
    yesClicks += 1;
    updateYesSize();
});

// init
updateNoText();
yesBtn.classList.add("pulse");
updateYesSize();

// стартовая позиция "Нет" ровно справа от "Да"
setTimeout(() => {
    noBtn.style.left = "calc(50% + 110px)";
    noBtn.style.top = "50%";
    noBtn.style.transform = "translate(-50%, -50%)";
}, 0);
