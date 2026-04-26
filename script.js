// === Навигация по слайдам ===
const slides = document.querySelectorAll('.slide');
const navLinks = document.querySelectorAll('.nav-link');
const dotsContainer = document.getElementById('slideDots');
let currentSlide = 0;

// Создаём точки навигации
slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
});

function updateNav() {
    const dots = document.querySelectorAll('.slide-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
    navLinks.forEach((link, i) => {
        link.classList.toggle('active', i === currentSlide);
    });
}

function goToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    currentSlide = index;
    slides[index].scrollIntoView({ behavior: 'smooth' });
    updateNav();
}

function nextSlide() {
    goToSlide(Math.min(currentSlide + 1, slides.length - 1));
}

function prevSlide() {
    goToSlide(Math.max(currentSlide - 1, 0));
}

// Навигация по ссылкам
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const slideIndex = parseInt(link.dataset.slide);
        goToSlide(slideIndex);
    });
});

// Определение текущего слайда при скролле
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
};

const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const index = Array.from(slides).indexOf(entry.target);
            currentSlide = index;
            updateNav();
        }
    });
}, observerOptions);

slides.forEach(slide => slideObserver.observe(slide));

// Клавиатурная навигация
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prevSlide();
    }
});

// === Галерея с котиками (Cat API) ===
let catCount = 0;

function loadRandomCat() {
    const img = document.getElementById('catImage');
    const placeholder = document.getElementById('catPlaceholder');
    const loader = document.getElementById('catLoader');

    placeholder.style.display = 'none';
    loader.style.display = 'flex';
    img.style.display = 'none';

    fetch('https://api.thecatapi.com/v1/images/search')
        .then(response => response.json())
        .then(data => {
            img.src = data[0].url;
            img.onload = () => {
                loader.style.display = 'none';
                img.style.display = 'block';
                catCount++;
                document.getElementById('catCounter').textContent = catCount;
            };
            img.onerror = () => {
                loader.style.display = 'none';
                placeholder.style.display = 'block';
                placeholder.querySelector('p').textContent = 'Не удалось загрузить котика 😿 Попробуй ещё раз!';
            };
        })
        .catch(() => {
            loader.style.display = 'none';
            placeholder.style.display = 'block';
            placeholder.querySelector('p').textContent = 'Ошибка сети 😿 Попробуй ещё раз!';
        });
}

// === Викторина ===
const quizQuestions = [
    {
        question: '🐱 Сколько часов в сутки спят кошки?',
        options: ['4-6 часов', '8-10 часов', '12-16 часов', '20-22 часа'],
        correct: 2,
        explanation: 'Кошки спят 12-16 часов в сутки — настоящие сони!'
    },
    {
        question: '🏃 С какой максимальной скоростью может бегать домашняя кошка?',
        options: ['20 км/ч', '30 км/ч', '50 км/ч', '70 км/ч'],
        correct: 2,
        explanation: 'Домашняя кошка может разгоняться до 50 км/ч!'
    },
    {
        question: '👂 Сколько мышц в каждом ухе кошки?',
        options: ['12', '20', '32', '44'],
        correct: 2,
        explanation: 'В каждом ухе кошки 32 мышцы, позволяющие поворачивать его на 180°!'
    },
    {
        question: '🥛 Какой продукт НЕ рекомендуется давать кошкам?',
        options: ['Курица', 'Молоко', 'Рыба', 'Говядина'],
        correct: 1,
        explanation: 'Молоко вредно для большинства взрослых кошек — у них непереносимость лактозы!'
    },
    {
        question: '🌍 Сколько примерно домашних кошек в мире?',
        options: ['100 миллионов', '300 миллионов', '600 миллионов', '1 миллиард'],
        correct: 2,
        explanation: 'В мире более 600 миллионов домашних кошек!'
    }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

function loadQuestion() {
    const q = quizQuestions[currentQuestion];
    document.getElementById('quizQuestion').textContent = q.question;
    document.getElementById('quizFeedback').textContent = '';
    document.getElementById('quizFeedback').style.color = '';
    answered = false;

    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';

    q.options.forEach((option, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = option;
        btn.addEventListener('click', () => checkAnswer(i));
        optionsContainer.appendChild(btn);
    });

    const progress = ((currentQuestion) / quizQuestions.length) * 100;
    document.getElementById('quizProgressFill').style.width = progress + '%';
    document.getElementById('quizProgressText').textContent =
        `Вопрос ${currentQuestion + 1} из ${quizQuestions.length}`;
}

function checkAnswer(selected) {
    if (answered) return;
    answered = true;

    const q = quizQuestions[currentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    const feedback = document.getElementById('quizFeedback');

    options.forEach((opt, i) => {
        opt.classList.add('disabled');
        if (i === q.correct) opt.classList.add('correct');
        if (i === selected && selected !== q.correct) opt.classList.add('wrong');
    });

    if (selected === q.correct) {
        score++;
        feedback.textContent = '✅ Правильно! ' + q.explanation;
        feedback.style.color = '#4caf50';
    } else {
        feedback.textContent = '❌ Неверно. ' + q.explanation;
        feedback.style.color = '#f44336';
    }

    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < quizQuestions.length) {
            loadQuestion();
        } else {
            showResult();
        }
    }, 2500);
}

function showResult() {
    document.getElementById('quizContainer').style.display = 'none';
    const resultDiv = document.getElementById('quizResult');
    resultDiv.style.display = 'block';

    const percentage = (score / quizQuestions.length) * 100;
    let emoji, title, text;

    if (percentage === 100) {
        emoji = '🏆';
        title = 'Превосходно!';
        text = `Ты ответил правильно на все ${quizQuestions.length} вопросов! Ты настоящий эксперт по кошкам!`;
    } else if (percentage >= 60) {
        emoji = '😸';
        title = 'Хороший результат!';
        text = `Ты ответил правильно на ${score} из ${quizQuestions.length} вопросов. Ты хорошо знаешь кошек!`;
    } else {
        emoji = '😿';
        title = 'Можно лучше!';
        text = `Ты ответил правильно на ${score} из ${quizQuestions.length} вопросов. Попробуй ещё раз!`;
    }

    document.getElementById('resultEmoji').textContent = emoji;
    document.getElementById('resultTitle').textContent = title;
    document.getElementById('resultText').textContent = text;
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    document.getElementById('quizContainer').style.display = 'block';
    document.getElementById('quizResult').style.display = 'none';
    loadQuestion();
}

// Инициализация викторины при загрузке
loadQuestion();
