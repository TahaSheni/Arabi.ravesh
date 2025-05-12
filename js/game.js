// آرایه‌ای از جملات نهج‌البلاغه برای نمایش در صفحه لودینگ
// هر جمله شامل متن عربی، ترجمه فارسی و منبع است

// متغیرهای اصلی بازی
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let timerInterval;
let shuffledQuestions = [];
let shownQuestions = [];

// تنظیمات سطح سختی
const difficultySettings = {
  easy: { timeLimit: 30, options: 3 },
  hard: { timeLimit: 30, options: 5 },
};

// انتخاب سطح سختی
let currentDifficulty = "easy";

// بازیابی تنظیمات سختی از URL
function getDifficultyFromURL() {
  // ابتدا از پارامترهای URL بررسی می‌کنیم
  const urlParams = new URLSearchParams(window.location.search);
  const difficultyParam = urlParams.get("difficulty");
  if (difficultyParam && difficultySettings[difficultyParam]) {
    return difficultyParam;
  }

  // سپس از مسیر URL بررسی می‌کنیم
  const path = window.location.pathname;
  if (path.includes("/game/easy")) {
    return "easy";
  } else if (path.includes("/game/hard")) {
    return "hard";
  }

  // اگر هیچ کدام نبود، پیش‌فرض آسان است
  return "easy";
}

// تنظیم سطح سختی از URL
currentDifficulty = getDifficultyFromURL();
console.log("سطح سختی تنظیم شد:", currentDifficulty);

// انتخاب المان‌های مورد نیاز
const gameScreen = document.getElementById("game-screen");
const loadingScreen = document.getElementById("loading-screen");
const startButton = document.getElementById("start-button");
const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options-container");
const timerElement = document.getElementById("game-timer");
const scoreElement = document.getElementById("game-score");
const endGameForm = document.getElementById("end-game-form");
const finalScoreElement = document.getElementById("final-score");
const playerInfoForm = document.getElementById("player-info-form");

// گزینه‌های اضافی برای حالت سخت
const additionalOptions = [
  "فَعِلَ - یَفعَلُ",
  "فَعُلَ - یَفعُلُ",
  "فَعِلَ - یَفعِلُ",
  "فَعُلَ - یَفعَلُ",
  "فَعِلَ - یَفعُلُ",
];
// افعال مخصوص حالت سخت که فقط در حالت سخت نمایش داده می‌شوند
const hardOnlyQuestions = [
  // افعال پیچیده‌تر برای حالت سخت
  {
    past: "بَقِیَ",
    present: "یَبقَی",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "خَشِیَ",
    present: "یَخشَی",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "نَسِیَ",
    present: "یَنسَی",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "رَضِیَ",
    present: "یَرضَی",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "لَقِیَ",
    present: "یَلقَی",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "خَفِیَ",
    present: "یَخفَی",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "عَمِیَ",
    present: "یَعمَی",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "قَوِیَ",
    present: "یَقوَی",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },

  // افعال بر وزن فَعِلَ - یَفعَلُ با قاعده مضارع سَمِعَ - یَسمَعُ
  {
    past: "صَعِدَ",
    present: "یَصعَدُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "تَبِعَ",
    present: "یَتبَعُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "رَکِبَ",
    present: "یَرکَبُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "غَرِقَ",
    present: "یَغرَقُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "حَزِنَ",
    present: "یَحزَنُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "شَرِبَ",
    present: "یَشرَبُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "عَلِمَ",
    present: "یَعلَمُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "لَبِسَ",
    present: "یَلبَسُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "مَرِضَ",
    present: "یَمرَضُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "ضَحِکَ",
    present: "یَضحَکُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "غَضِبَ",
    present: "یَغضَبُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "فَرِحَ",
    present: "یَفرَحُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "فَهِمَ",
    present: "یَفهَمُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "جَهِلَ",
    present: "یَجهَلُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "عَمِلَ",
    present: "یَعمَلُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },

  // افعال با وزن فَعُلَ - یَفعُلُ
  {
    past: "حَسُنَ",
    present: "یَحسُنُ",
    correct: "فَعُلَ - یَفعُلُ",
    options: [
      "فَعُلَ - یَفعُلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعِلَ - یَفعَلُ",
    ],
  },
  {
    past: "کَبُرَ",
    present: "یَکبُرُ",
    correct: "فَعُلَ - یَفعُلُ",
    options: [
      "فَعُلَ - یَفعُلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعِلَ - یَفعَلُ",
    ],
  },
  {
    past: "صَغُرَ",
    present: "یَصغُرُ",
    correct: "فَعُلَ - یَفعُلُ",
    options: [
      "فَعُلَ - یَفعُلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعِلَ - یَفعَلُ",
    ],
  },
  {
    past: "کَثُرَ",
    present: "یَکثُرُ",
    correct: "فَعُلَ - یَفعُلُ",
    options: [
      "فَعُلَ - یَفعُلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعِلَ - یَفعَلُ",
    ],
  },
  {
    past: "صَعُبَ",
    present: "یَصعُبُ",
    correct: "فَعُلَ - یَفعُلُ",
    options: [
      "فَعُلَ - یَفعُلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعِلَ - یَفعَلُ",
    ],
  },
  {
    past: "بَعُدَ",
    present: "یَبعُدُ",
    correct: "فَعُلَ - یَفعُلُ",
    options: [
      "فَعُلَ - یَفعُلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعِلَ - یَفعَلُ",
    ],
  },
  {
    past: "ثَقُلَ",
    present: "یَثقُلُ",
    correct: "فَعُلَ - یَفعُلُ",
    options: [
      "فَعُلَ - یَفعُلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعِلَ - یَفعَلُ",
    ],
  },
  {
    past: "ضَعُفَ",
    present: "یَضعُفُ",
    correct: "فَعُلَ - یَفعُلُ",
    options: [
      "فَعُلَ - یَفعُلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعِلَ - یَفعَلُ",
    ],
  },
  {
    past: "قَرُبَ",
    present: "یَقرُبُ",
    correct: "فَعُلَ - یَفعُلُ",
    options: [
      "فَعُلَ - یَفعُلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعِلَ - یَفعَلُ",
    ],
  },
  {
    past: "عَظُمَ",
    present: "یَعظُمُ",
    correct: "فَعُلَ - یَفعُلُ",
    options: [
      "فَعُلَ - یَفعُلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعِلَ - یَفعَلُ",
    ],
  },
  {
    past: "لَطُفَ",
    present: "یَلطُفُ",
    correct: "فَعُلَ - یَفعُلُ",
    options: [
      "فَعُلَ - یَفعُلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعِلَ - یَفعَلُ",
    ],
  },
  {
    past: "قَبُحَ",
    present: "یَقبُحُ",
    correct: "فَعُلَ - یَفعُلُ",
    options: [
      "فَعُلَ - یَفعُلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعِلَ - یَفعَلُ",
    ],
  },

  // وزن فَعِلَ - یَفعِلُ
  {
    past: "حَسِبَ",
    present: "یَحسِبُ",
    correct: "فَعِلَ - یَفعِلُ",
    options: [
      "فَعِلَ - یَفعِلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "وَرِثَ",
    present: "یَرِثُ",
    correct: "فَعِلَ - یَفعِلُ",
    options: [
      "فَعِلَ - یَفعِلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "وَثِقَ",
    present: "یَثِقُ",
    correct: "فَعِلَ - یَفعِلُ",
    options: [
      "فَعِلَ - یَفعِلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "وَلِیَ",
    present: "یَلِی",
    correct: "فَعِلَ - یَفعِلُ",
    options: [
      "فَعِلَ - یَفعِلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "وَرِمَ",
    present: "یَرِمُ",
    correct: "فَعِلَ - یَفعِلُ",
    options: [
      "فَعِلَ - یَفعِلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
];

// اضافه کردن افعال بیشتر به hardOnlyQuestions
const additionalHardVerbs = [
  // افعال بیشتر بر وزن فَعِلَ - یَفعَلُ (سَمِعَ - یَسمَعُ)
  {
    past: "نَدِمَ",
    present: "یَندَمُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "قَدِمَ",
    present: "یَقدَمُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "حَفِظَ",
    present: "یَحفَظُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "قَبِلَ",
    present: "یَقبَلُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "قَلِقَ",
    present: "یَقلَقُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "تَعِبَ",
    present: "یَتعَبُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "أَذِنَ",
    present: "یَأذَنُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "ضَمِنَ",
    present: "یَضمَنُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "خَجِلَ",
    present: "یَخجَلُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "کَبِرَ",
    present: "یَکبَرُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "سَخِرَ",
    present: "یَسخَرُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "یَئِسَ",
    present: "یَیأَسُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "لَحِقَ",
    present: "یَلحَقُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "أَسِفَ",
    present: "یَأسَفُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "رَغِبَ",
    present: "یَرغَبُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "کَرِهَ",
    present: "یَکرَهُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "رَحِمَ",
    present: "یَرحَمُ",
    correct: "فَعِلَ - یَفعَلُ",
    options: [
      "فَعِلَ - یَفعَلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },

  // افعال بیشتر بر وزن فَعُلَ - یَفعُلُ
  {
    past: "شَرُفَ",
    present: "یَشرُفُ",
    correct: "فَعُلَ - یَفعُلُ",
    options: [
      "فَعُلَ - یَفعُلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعِلَ - یَفعَلُ",
    ],
  },
  {
    past: "خَشُنَ",
    present: "یَخشُنُ",
    correct: "فَعُلَ - یَفعُلُ",
    options: [
      "فَعُلَ - یَفعُلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعِلَ - یَفعَلُ",
    ],
  },
  {
    past: "عَمُقَ",
    present: "یَعمُقُ",
    correct: "فَعُلَ - یَفعُلُ",
    options: [
      "فَعُلَ - یَفعُلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعِلَ - یَفعَلُ",
    ],
  },
  {
    past: "قَصُرَ",
    present: "یَقصُرُ",
    correct: "فَعُلَ - یَفعُلُ",
    options: [
      "فَعُلَ - یَفعُلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعِلَ - یَفعَلُ",
    ],
  },
  {
    past: "سَهُلَ",
    present: "یَسهُلُ",
    correct: "فَعُلَ - یَفعُلُ",
    options: [
      "فَعُلَ - یَفعُلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعِلَ - یَفعَلُ",
    ],
  },
  {
    past: "جَبُنَ",
    present: "یَجبُنُ",
    correct: "فَعُلَ - یَفعُلُ",
    options: [
      "فَعُلَ - یَفعُلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعَلُ",
      "فَعِلَ - یَفعَلُ",
    ],
  },
];

// ترکیب دو آرایه hardOnlyQuestions و additionalHardVerbs
hardOnlyQuestions.push(...additionalHardVerbs);

// به‌روزرسانی گزینه‌های همه سوالات
function updateAllQuestionsOptions() {
  questions.forEach((question) => {
    // اگر سوال کمتر از 5 گزینه دارد، گزینه‌های اضافی را اضافه کن
    while (question.options.length < 5) {
      // انتخاب یک گزینه تصادفی از گزینه‌های اضافی که در گزینه‌های فعلی وجود ندارد
      const additionalOption = additionalOptions.find(
        (opt) => !question.options.includes(opt)
      );
      if (additionalOption) {
        question.options.push(additionalOption);
      } else {
        // اگر همه گزینه‌های اضافی قبلاً اضافه شده‌اند، یک گزینه تصادفی ایجاد کن
        const randomOption = `فَعَلَ - یَفعَلُ (${Math.floor(
          Math.random() * 100
        )})`;
        question.options.push(randomOption);
      }
    }
  });
}

// آرایه‌ای از سوالات بازی
// هر سوال شامل فعل ماضی، فعل مضارع، پاسخ صحیح و گزینه‌هاست
const questions = [
  // یَفعَلُ (قاعده: یَذهَبُ)
  {
    past: "ذَهَبَ",
    present: "یَذهَبُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: [
      "فَعَلَ - یَفعَلُ",
      "فَعَلَ - یَفعِلُ",
      "فَعَلَ - یَفعُلُ",
      "فَعِلَ - یَفعَلُ",
      "فَعُلَ - یَفعُلُ",
    ],
  },
  {
    past: "قَرَأَ",
    present: "یَقرَأُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "قَطَعَ",
    present: "یَقطَعُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "فَتَحَ",
    present: "یَفتَحُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "نَصَحَ",
    present: "یَنصَحُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "نَفَعَ",
    present: "یَنفَعُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "بَعَثَ",
    present: "یَبعَثُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "شَرَحَ",
    present: "یَشرَحُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "فَحَصَ",
    present: "یَفحَصُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "صَنَعَ",
    present: "یَصنَعُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "بَدَأَ",
    present: "یَبدَأُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "مَسَحَ",
    present: "یَمسَحُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "سَأَلَ",
    present: "یَسأَلُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "نَهَضَ",
    present: "یَنهَضُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "لَسَعَ",
    present: "یَلسَعُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "جَمَعَ",
    present: "یَجمَعُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "رَفَعَ",
    present: "یَرفَعُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "جَعَلَ",
    present: "یَجعَلُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "سَحَبَ",
    present: "یَسحَبُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },

  // یَفعَلُ (قاعده: یَسعی)
  {
    past: "سَعَی",
    present: "یَسعی",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "رَأیَ",
    present: "یَرَی",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "نَهَی",
    present: "یَنهَی",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "أَبَی",
    present: "یَأبی",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "طَغَی",
    present: "یَطغی",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "نَعَی",
    present: "یَنعی",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "رَعَی",
    present: "یَرعی",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },

  // یَفعَلُ (قاعده: یَخافُ)
  {
    past: "خافَ",
    present: "یَخافُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "زالَ",
    present: "یَزالُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "شاءَ",
    present: "یَشاءُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "نامَ",
    present: "یَنامُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "نالَ",
    present: "یَنالُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "کادَ",
    present: "یَکادُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "هابَ",
    present: "یَهابُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },

  // یَفعَلُ (قاعده: یَمَسُّ)
  {
    past: "مَسَّ",
    present: "یَمَسُّ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "عَضَّ",
    present: "یَعَضُّ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "لَذَّ",
    present: "یَلَذُّ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "مَلَّ",
    present: "یَمَلُّ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },

  // یَفعَلُ (قاعده: یَقَعُ)
  {
    past: "وَقَعَ",
    present: "یَقَعُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "وَضَعَ",
    present: "یَضَعُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "وَدَعَ",
    present: "یَدَعُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "وَهَبَ",
    present: "یَهبُ",
    correct: "فَعَلَ - یَفعَلُ",
    options: ["فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعُلُ"],
  },

  // یَفعِلُ (قاعده: فَعَلَ - یَفعِلُ)
  {
    past: "ضَرَبَ",
    present: "یَضرِبُ",
    correct: "فَعَلَ - یَفعِلُ",
    options: ["فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "جَلَسَ",
    present: "یَجلِسُ",
    correct: "فَعَلَ - یَفعِلُ",
    options: ["فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "رَجَعَ",
    present: "یَرجِعُ",
    correct: "فَعَلَ - یَفعِلُ",
    options: ["فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "غَسَلَ",
    present: "یَغسِلُ",
    correct: "فَعَلَ - یَفعِلُ",
    options: ["فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "حَمَلَ",
    present: "یَحمِلُ",
    correct: "فَعَلَ - یَفعِلُ",
    options: ["فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "عَرَفَ",
    present: "یَعرِفُ",
    correct: "فَعَلَ - یَفعِلُ",
    options: ["فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "قَصَدَ",
    present: "یَقصِدُ",
    correct: "فَعَلَ - یَفعِلُ",
    options: ["فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "ظَلَمَ",
    present: "یَظلِمُ",
    correct: "فَعَلَ - یَفعِلُ",
    options: ["فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "کَذَبَ",
    present: "یَکذِبُ",
    correct: "فَعَلَ - یَفعِلُ",
    options: ["فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعُلُ"],
  },
  {
    past: "نَزَلَ",
    present: "یَنزِلُ",
    correct: "فَعَلَ - یَفعِلُ",
    options: ["فَعَلَ - یَفعِلُ", "فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعُلُ"],
  },

  // یَفعُلُ (قاعده: فَعَلَ - یَفعُلُ)
  {
    past: "کَتَبَ",
    present: "یَکتُبُ",
    correct: "فَعَلَ - یَفعُلُ",
    options: ["فَعَلَ - یَفعُلُ", "فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ"],
  },
  {
    past: "نَصَرَ",
    present: "یَنصُرُ",
    correct: "فَعَلَ - یَفعُلُ",
    options: ["فَعَلَ - یَفعُلُ", "فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ"],
  },
  {
    past: "طَلَبَ",
    present: "یَطلُبُ",
    correct: "فَعَلَ - یَفعُلُ",
    options: ["فَعَلَ - یَفعُلُ", "فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ"],
  },
  {
    past: "خَلَقَ",
    present: "یَخلُقُ",
    correct: "فَعَلَ - یَفعُلُ",
    options: ["فَعَلَ - یَفعُلُ", "فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ"],
  },
  {
    past: "عَبَدَ",
    present: "یَعبُدُ",
    correct: "فَعَلَ - یَفعُلُ",
    options: ["فَعَلَ - یَفعُلُ", "فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ"],
  },
  {
    past: "خَذَلَ",
    present: "یَخذُلُ",
    correct: "فَعَلَ - یَفعُلُ",
    options: ["فَعَلَ - یَفعُلُ", "فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ"],
  },
  {
    past: "تَرَکَ",
    present: "یَترُکُ",
    correct: "فَعَلَ - یَفعُلُ",
    options: ["فَعَلَ - یَفعُلُ", "فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ"],
  },
  {
    past: "سَکَتَ",
    present: "یَسکُتُ",
    correct: "فَعَلَ - یَفعُلُ",
    options: ["فَعَلَ - یَفعُلُ", "فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ"],
  },
  {
    past: "دَخَلَ",
    present: "یَدخُلُ",
    correct: "فَعَلَ - یَفعُلُ",
    options: ["فَعَلَ - یَفعُلُ", "فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ"],
  },
  {
    past: "خَرَجَ",
    present: "یَخرُجُ",
    correct: "فَعَلَ - یَفعُلُ",
    options: ["فَعَلَ - یَفعُلُ", "فَعَلَ - یَفعَلُ", "فَعَلَ - یَفعِلُ"],
  },

  // ... (ادامه برای یَفعِلُ و یَفعُلُ طبق لیست شما) ...
];

// به‌روزرسانی گزینه‌های همه سوالات قبل از شروع بازی
updateAllQuestionsOptions();

// --- دسته‌بندی سوالات بر اساس وزن ---
const questions_faala = questions.filter(
  (q) => q.correct === "فَعَلَ - یَفعَلُ"
);
const questions_faalu = questions.filter(
  (q) => q.correct === "فَعَلَ - یَفعُلُ"
);
const questions_faailu = questions.filter(
  (q) => q.correct === "فَعَلَ - یَفعِلُ"
);
// اضافه کردن فیلترهای جدید برای الگوهای مورد نظر
const questions_faila = questions.filter(
  (q) => q.correct === "فَعِلَ - یَفعَلُ"
);
const questions_faulu = questions.filter(
  (q) => q.correct === "فَعُلَ - یَفعُلُ"
);

function getNextShuffledQuestions() {
  // تعداد سوالات هر وزن
  const minCount = Math.min(
    questions_faala.length,
    questions_faalu.length,
    questions_faailu.length
  );
  let selected = [];

  if (currentDifficulty === "hard") {
    // در حالت سخت، از تمام افعال به صورت رندوم استفاده کن
    // بدون محدودیت برای تعداد هر وزن
    const allQuestions = questions.filter((q) => !shownQuestions.includes(q));

    // اگر سوالات کافی داریم، از آنها استفاده کن
    if (allQuestions.length > 0) {
      selected = shuffleArray([...allQuestions]);
    } else {
      // در غیر این صورت، همه سوالات را ریست کن
      shownQuestions = [];
      selected = shuffleArray([...questions]);
    }
  } else {
    // در حالت آسان، همان منطق قبلی حفظ شود
    if (minCount > 0) {
      selected = selected.concat(
        shuffleArray(
          questions_faala.filter((q) => !shownQuestions.includes(q))
        ).slice(0, minCount),
        shuffleArray(
          questions_faalu.filter((q) => !shownQuestions.includes(q))
        ).slice(0, minCount),
        shuffleArray(
          questions_faailu.filter((q) => !shownQuestions.includes(q))
        ).slice(0, minCount)
      );
    } else {
      const unseen = questions.filter((q) => !shownQuestions.includes(q));
      selected = shuffleArray([...unseen]);
    }
  }

  // اگر selected خالی بود، ریست کن (برای حالت آسان)
  if (selected.length === 0) {
    shownQuestions = [];
    return shuffleArray([...questions]);
  }

  return shuffleArray(selected);
}

// تابع نمایش حدیث تصادفی در صفحه لودینگ
function showRandomQuote() {
  const quote =
    nahjAlBalaghaQuotes[Math.floor(Math.random() * nahjAlBalaghaQuotes.length)];
  const loadingText = document.querySelector(".loading-text");
  loadingText.innerHTML = `
    <div class="arabic-text">${quote.arabic}</div>
    <div class="persian-text">${quote.persian}</div>
    <div class="source-text">${quote.source}</div>
  `;
}

// تابع شروع بازی
function startGame() {
  // تنظیم زمان بر اساس سطح سختی
  timeLeft = difficultySettings[currentDifficulty].timeLimit;
  timerElement.innerText = timeLeft;

  // مخفی کردن همه صفحات
  gameScreen.classList.add("hidden");
  endGameForm.classList.add("hidden");
  startButton.classList.remove("hidden");

  // فقط یک بار سوالات را رندوم کن
  shuffledQuestions = shuffleArray([...questions]);
  currentQuestionIndex = 0;
  score = 0; // ریست کردن امتیاز
}

// شروع بازی با کلیک روی دکمه
startButton.addEventListener("click", () => {
  // مخفی کردن دکمه شروع
  startButton.classList.add("hidden");

  // نمایش صفحه بازی
  gameScreen.classList.remove("hidden");

  // ریست کردن متغیرهای بازی
  currentQuestionIndex = 0;
  score = 0;
  scoreElement.innerText = score;

  // اطمینان از وجود سوالات
  if (shuffledQuestions.length === 0) {
    shuffledQuestions = shuffleArray([...questions]);
  }

  // شروع بازی
  updateQuestion();
  startTimer();
});

// تابع به‌روزرسانی سوال
function updateQuestion() {
  // بررسی پایان بازی - فقط زمان پایان بازی را مشخص می‌کند
  if (timeLeft <= 0) {
    endGame();
    return;
  }

  // اطمینان از وجود سوال جاری
  if (!shuffledQuestions[currentQuestionIndex]) {
    // اگر سوالات تمام شدند، دوباره سوالات را بهم بریز
    shuffledQuestions = shuffleArray([...questions]);
    currentQuestionIndex = 0;
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  questionElement.innerHTML = `
    <div class="question-text">
      <p>فعل <span class="arabic-verb">${currentQuestion.past} - ${currentQuestion.present}</span> مطابق کدام وزن است؟</p>
    </div>
  `;
  optionsContainer.innerHTML = "";

  // تعیین تعداد گزینه‌ها بر اساس سطح سختی
  const optionsCount = difficultySettings[currentDifficulty].options;

  // اضافه کردن کلاس سختی به کانتینر گزینه‌ها
  optionsContainer.className = "options-container " + currentDifficulty;

  // مشخص کردن سه وزن اصلی
  const mainOptions = [
    "فَعَلَ - یَفعَلُ",
    "فَعَلَ - یَفعِلُ",
    "فَعَلَ - یَفعُلُ",
  ];

  let shuffledOptions = [];

  if (currentDifficulty === "easy") {
    // در حالت آسان فقط سه وزن اصلی را نمایش بده
    shuffledOptions = [...mainOptions];
  } else {
    // در حالت سخت، از گزینه‌های اصلی سوال استفاده کن
    shuffledOptions = shuffleArray([...currentQuestion.options]);

    // اطمینان از وجود گزینه صحیح در بین گزینه‌های نمایش داده شده
    if (!shuffledOptions.includes(currentQuestion.correct)) {
      // اگر گزینه صحیح در بین گزینه‌های انتخاب شده نبود، یکی از گزینه‌ها را با گزینه صحیح جایگزین کن
      const randomIndex = Math.floor(
        Math.random() * Math.min(shuffledOptions.length, optionsCount)
      );
      shuffledOptions[randomIndex] = currentQuestion.correct;
    }

    // اطمینان از داشتن تعداد کافی گزینه
    while (shuffledOptions.length < optionsCount) {
      // اضافه کردن گزینه‌های اضافی از لیست additionalOptions
      const additionalOption = additionalOptions.find(
        (opt) => !shuffledOptions.includes(opt)
      );
      if (additionalOption) {
        shuffledOptions.push(additionalOption);
      } else {
        // اگر همه گزینه‌های اضافی قبلاً اضافه شده‌اند، یک گزینه تصادفی ایجاد کن
        const randomOption = `فَعَلَ - یَفعَلُ (${Math.floor(
          Math.random() * 100
        )})`;
        shuffledOptions.push(randomOption);
      }
    }

    // محدود کردن تعداد گزینه‌ها بر اساس سطح سختی
    shuffledOptions = shuffledOptions.slice(0, optionsCount);
  }

  // اگر گزینه صحیح در حالت آسان در بین گزینه‌ها نیست، آن را اضافه کن
  if (
    currentDifficulty === "easy" &&
    !shuffledOptions.includes(currentQuestion.correct)
  ) {
    // یکی از گزینه‌ها را با پاسخ صحیح جایگزین کن
    const randomIndex = Math.floor(Math.random() * shuffledOptions.length);
    shuffledOptions[randomIndex] = currentQuestion.correct;
  }

  // بهم ریختن دوباره گزینه‌ها برای تصادفی بودن موقعیت گزینه صحیح
  shuffledOptions = shuffleArray(shuffledOptions);

  // ایجاد دکمه‌های گزینه
  shuffledOptions.forEach((option) => {
    const button = document.createElement("button");
    button.innerHTML = `<span class="arabic-verb">${option}</span>`;
    button.classList.add("option-btn");
    button.addEventListener("click", () =>
      checkAnswer(option, currentQuestion.correct)
    );
    optionsContainer.appendChild(button);
  });
}

// تابع نمایش انیمیشن امتیاز
function showScoreAnimation(points, isPositive) {
  // ایجاد المان انیمیشن
  const scoreAnimation = document.createElement("div");
  scoreAnimation.className = `score-animation ${
    isPositive ? "positive" : "negative"
  }`;
  scoreAnimation.textContent = isPositive ? `+${points}` : `-${points}`;

  // اضافه کردن به DOM
  const header = document.querySelector(".header");
  header.appendChild(scoreAnimation);

  // حذف المان بعد از پایان انیمیشن
  setTimeout(() => {
    scoreAnimation.remove();
  }, 1500);
}

// تابع بررسی پاسخ
function checkAnswer(selectedAnswer, correctAnswer) {
  const buttons = optionsContainer.getElementsByClassName("option-btn");

  // یافتن دکمه انتخاب شده و دکمه صحیح
  let selectedButton = null;
  let correctButton = null;

  Array.from(buttons).forEach((button) => {
    const buttonText = button.textContent.trim();
    if (buttonText === selectedAnswer) {
      selectedButton = button;
    }
    if (buttonText === correctAnswer) {
      correctButton = button;
    }
  });

  // اگر دکمه‌ها پیدا نشدند، خطا را در کنسول نمایش بده
  if (!selectedButton || !correctButton) {
    console.error("دکمه انتخاب شده یا دکمه صحیح پیدا نشد", {
      selectedAnswer,
      correctAnswer,
      buttons: Array.from(buttons).map((b) => b.textContent.trim()),
    });
  }

  // غیرفعال کردن همه دکمه‌ها
  Array.from(buttons).forEach((button) => {
    button.disabled = true;
  });

  if (selectedAnswer === correctAnswer) {
    if (selectedButton) selectedButton.classList.add("correct");
    score += 1;
    scoreElement.innerText = score;
  } else {
    if (selectedButton) selectedButton.classList.add("incorrect");
    if (correctButton) correctButton.classList.add("correct");
    score = Math.max(0, score - 1);
    scoreElement.innerText = score;
  }

  // نمایش سوال بعدی بعد از 1 ثانیه
  setTimeout(() => {
    currentQuestionIndex++;
    updateQuestion();
  }, 1000);
}

// تابع شروع تایمر
function startTimer() {
  // تنظیم زمان اولیه
  timeLeft = difficultySettings[currentDifficulty].timeLimit;
  timerElement.innerText = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

// تابع پایان بازی
function endGame() {
  // توقف تایمر
  clearInterval(timerInterval);

  // مخفی کردن صفحه بازی
  if (gameScreen) {
    gameScreen.classList.add("hidden");
  }

  // نمایش امتیاز نهایی
  if (finalScoreElement) {
    finalScoreElement.innerText = score;
  }

  // نمایش فرم پایان بازی
  if (endGameForm) {
    endGameForm.classList.remove("hidden");
  }

  console.log("بازی به پایان رسید. امتیاز: " + score);
}

// تبدیل کلید سختی به نام فارسی
function getDifficultyName(difficulty) {
  switch (difficulty) {
    case "easy":
      return "آسان";
    case "hard":
      return "سخت";
    default:
      return difficulty;
  }
}

// ذخیره اطلاعات بازیکن و بازگشت به صفحه اصلی
playerInfoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const playerName = document.getElementById("player-name").value;
  const playerSchool = document.getElementById("player-school").value;
  const playerClass = document.getElementById("player-class").value;

  // ساخت شیء داده برای ارسال به سرور
  const playerData = {
    name: playerName,
    school: playerSchool,
    class: playerClass,
    score: score,
    difficulty: currentDifficulty,
    date: new Date().toLocaleDateString("fa-IR"),
  };

  // ارسال داده به سرور با استفاده از fetch API
  fetch("/save_score.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(playerData),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("نتیجه ذخیره امتیاز:", result);

      // ذخیره در localStorage هم برای پشتیبانی (اختیاری)
      let highScores = JSON.parse(localStorage.getItem("players")) || [];
      highScores.push(playerData);
      highScores.sort((a, b) => b.score - a.score);
      highScores = highScores.slice(0, 10);
      localStorage.setItem("players", JSON.stringify(highScores));

      // بازگشت به صفحه اصلی
      window.location.href = "arabi.ravesh/home";
    })
    .catch((error) => {
      console.error("خطا در ذخیره امتیاز:", error);

      // اگر خطایی رخ داد، فقط در localStorage ذخیره کن
      let highScores = JSON.parse(localStorage.getItem("players")) || [];
      highScores.push(playerData);
      highScores.sort((a, b) => b.score - a.score);
      highScores = highScores.slice(0, 10);
      localStorage.setItem("players", JSON.stringify(highScores));

      // بازگشت به صفحه اصلی
      window.location.href = "arabi.ravesh/home";
    });
});

// تابع بهم ریختن آرایه (برای سوالات و گزینه‌ها)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
