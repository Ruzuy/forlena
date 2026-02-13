const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const buttonsWrap = document.getElementById("buttonsWrap");
const finalText = document.getElementById("finalText");

let yesClicks = 0;
let noClicks = 0;

const noTexts = [
    "Нет.",
    "Подумай еще раз.",
    "Точно?",
    "Последний шанс..."
];

// Увеличение зеленой: 4 итерации (каждый клик растет)
function updateYesSize() {
    // ступеньки роста
    const scaleSteps = [1, 1.15, 1.32, 1.55, 1.85]; // 4 роста после кликов
    const s = scaleSteps[Math.min(yesClicks, scaleSteps.length - 1)];
    yesBtn.style.transform = `scale(${s})`;
}

function setNoText() {
    const idx = Math.min(noClicks, noTexts.length - 1);
    noBtn.textContent = noTexts[idx];
}

function moveNoButton() {
    // Перемещаем в пределах visible viewport (чтобы "убегала", но оставалась видимой)
    const padding = 10;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // размеры кнопки (если еще видно)
    const rect = noBtn.getBoundingClientRect();
    const bw = rect.width || 120;
    const bh = rect.height || 44;

    // ограничим область, чтобы не улетала под браузерные панели на мобилке
    const minX = padding;
    const maxX = vw - bw - padding;
    const minY = padding;
    const maxY = vh - bh - padding;

    const x = Math.floor(minX + Math.random() * Math.max(1, maxX - minX));
    const y = Math.floor(minY + Math.random() * Math.max(1, maxY - minY));

    // absolute относительно страницы — проще
    noBtn.style.position = "fixed";
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
    noBtn.style.transform = "translate(0, 0)";
}

function sendNoOffScreen() {
    // красиво "убегает" за экран и исчезает
    noBtn.style.position = "fixed";
    noBtn.style.left = "110vw";
    noBtn.style.top = "-20vh";
    noBtn.style.opacity = "0";
    noBtn.style.pointerEvents = "none";

    // чтобы место не мешало — можно потом скрыть полностью
    setTimeout(() => {
        noBtn.style.display = "none";
    }, 350);
}

function finish() {
    // Зеленая превращается в текст с анимацией
    yesBtn.classList.add("yes-disappear");
    yesBtn.disabled = true;

    setTimeout(() => {
        yesBtn.style.display = "none";
        finalText.textContent = "Ура, люблю тебя!";
        finalText.classList.remove("fade-pop"); // перезапуск анимации
        void finalText.offsetWidth;             // reflow
        finalText.classList.add("fade-pop");
    }, 520);
}

/* ====== События ====== */

yesBtn.addEventListener("click", () => {
    // Если красная уже исчезла — финал
    const noGone = (noBtn.style.display === "none");
    if (noGone) {
        finish();
        return;
    }

    yesClicks += 1;
    updateYesSize();
});

noBtn.addEventListener("click", () => {
    noClicks += 1;

    // 1..4: меняем текст и "убегаем"
    setNoText();
    moveNoButton();

    // после 4-й итерации: улетает за экран навсегда
    if (noClicks >= 4) {
        sendNoOffScreen();
    }
});

// Инициализация
setNoText();
updateYesSize();

// На мобилке/при ресайзе, чтобы не зависла за краем:
window.addEventListener("resize", () => {
    if (noBtn.style.display !== "none") {
        // слегка поправим положение, если надо
        // (ничего страшного, если останется как есть)
    }
});
