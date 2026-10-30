/* =================================================================
   JAVASCRIPT САЙТА ANZERO WEBSITE
   Один общий файл для всех страниц. Каждая часть сначала проверяет,
   есть ли на странице нужный блок, — поэтому на страницах, где блока
   нет (например, телефона на «Ценах»), ничего не ломается.
   ================================================================= */

// Включена ли в системе настройка «уменьшить движение»
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Есть ли у устройства мышь (на телефонах и планшетах — нет)
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Загрузились ли библиотеки GSAP и ScrollTrigger (без интернета их не будет —
// тогда сайт работает без них, просто без параллакса)
const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';


/* --- 0. Страница всегда открывается с самого начала ---
   Браузер сам запоминает место прокрутки и возвращает туда при F5,
   а адрес с #якорем открывает страницу на середине. Отключаем оба. */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Убираем #якорь из адреса (страница не «прыгнет» к разделу)
function clearHash() {
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

clearHash();
window.addEventListener('hashchange', clearHash);

function scrollToStart() {
  window.scrollTo(0, 0);
}

scrollToStart();
window.addEventListener('load', scrollToStart);
// Возврат на страницу кнопкой «Назад» из кэша браузера
window.addEventListener('pageshow', (event) => {
  if (event.persisted) scrollToStart();
});


/* --- 1. Мобильное меню (кнопка-бургер) --- */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

function setMenu(open) {
  nav.classList.toggle('nav--open', open);
  burger.classList.toggle('burger--open', open);
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
}

burger.addEventListener('click', () => setMenu(!nav.classList.contains('nav--open')));

// Когда выбрали пункт меню — закрываем меню
nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});


/* --- 2. Шапка, полоска прогресса и кнопка «Наверх» при прокрутке --- */
const header = document.getElementById('header');
const progress = document.getElementById('progress');
const toTop = document.getElementById('to-top');
let scrollTicking = false;

function onScroll() {
  const y = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  // Если прокрутили больше 20 пикселей — добавляем шапке фон
  header.classList.toggle('header--scrolled', y > 20);
  // Полоска сверху показывает, какая часть страницы уже прочитана
  progress.style.transform = 'scaleX(' + (maxScroll > 0 ? y / maxScroll : 0) + ')';
  // Кнопка «Наверх» появляется, когда прокрутили вниз
  toTop.classList.toggle('to-top--visible', y > 600);

  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(onScroll);
  }
}, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});


/* --- 3. Заголовки «по словам» ---
   Разбиваем заголовок на слова, каждое слово — отдельный <span class="word">.
   Дальше CSS (раздел «ОБЩИЙ ВИД РАЗДЕЛОВ») выводит их по очереди. */
function splitWords(element) {
  let index = 0;
  Array.from(element.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          fragment.appendChild(document.createTextNode(part));
        } else {
          const word = document.createElement('span');
          word.className = 'word';
          word.textContent = part;
          word.style.setProperty('--i', index++);
          fragment.appendChild(word);
        }
      });
      node.replaceWith(fragment);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Например, <span class="gradient-text">Никита</span> — одно «слово»
      node.classList.add('word');
      node.style.setProperty('--i', index++);
    }
  });
}

document.querySelectorAll('.section__title, .hero__title').forEach(splitWords);


/* --- 4. Появление блоков при прокрутке ---
   Следим за элементами с классом .reveal. Как только элемент
   показался на экране — добавляем ему класс .visible (см. style.css).
   Карточки, появившиеся одновременно, выезжают по очереди — «волной». */
const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries
      .filter((entry) => entry.isIntersecting)
      .forEach((entry, index) => {
        entry.target.style.transitionDelay = index * 0.12 + 's';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // анимируем только один раз
      });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealItems.forEach((item) => {
    observer.observe(item);
    // После появления убираем задержку, чтобы наведение срабатывало мгновенно
    item.addEventListener('transitionend', function clearDelay(event) {
      if (event.target !== item || event.propertyName !== 'opacity') return;
      item.style.transitionDelay = '';
      item.removeEventListener('transitionend', clearDelay);
    });
  });
} else {
  // Старый браузер или «уменьшить движение» — просто показываем всё сразу
  revealItems.forEach((item) => item.classList.add('visible'));
}


/* --- 5. 3D-наклон карточек и свечение за курсором ---
   Работает только с мышью: на телефонах и планшетах отключён. */
const MAX_TILT = 6; // максимальный наклон в градусах

if (canHover && !reduceMotion) {
  document.querySelectorAll('.work-card, .price-card').forEach((card) => {
    let frame = null;

    card.addEventListener('pointermove', (event) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;  // от -0.5 до 0.5
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--ry', (x * MAX_TILT * 2).toFixed(2) + 'deg');
        card.style.setProperty('--rx', (-y * MAX_TILT * 2).toFixed(2) + 'deg');
        // Положение светящегося пятна
        card.style.setProperty('--mx', ((x + 0.5) * 100).toFixed(1) + '%');
        card.style.setProperty('--my', ((y + 0.5) * 100).toFixed(1) + '%');
        card.classList.add('is-tilting');
        frame = null;
      });
    });

    card.addEventListener('pointerleave', () => {
      if (frame) cancelAnimationFrame(frame);
      frame = null;
      card.classList.remove('is-tilting');
      ['--rx', '--ry', '--mx', '--my'].forEach((name) => card.style.removeProperty(name));
    });
  });
}


/* --- 6. Главная: частицы на фоне и вступительная анимация --- */
const particles = document.getElementById('particles');

if (particles && !reduceMotion) {
  const count = window.innerWidth < 600 ? 10 : 18;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    const size = 2 + Math.random() * 3;
    const duration = 12 + Math.random() * 12;
    dot.className = 'particle';
    dot.style.left = Math.random() * 100 + '%';
    dot.style.width = dot.style.height = size + 'px';
    dot.style.animationDuration = duration + 's';
    dot.style.animationDelay = -Math.random() * duration + 's';
    dot.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
    particles.appendChild(dot);
  }
}

if (hasGSAP && !reduceMotion) {
  gsap.registerPlugin(ScrollTrigger);
  // ScrollTrigger не должен сам восстанавливать прокрутку — страница всегда с начала
  if (ScrollTrigger.clearScrollMemory) ScrollTrigger.clearScrollMemory('manual');

  // Вступление на главной: заголовок выезжает по словам, затем остальное по очереди
  if (document.querySelector('.hero__content')) {
    gsap.from('.hero__title .word', {
      yPercent: 70, opacity: 0, rotateX: -40,
      duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.1
    });
    gsap.from('.hero__content > :not(.hero__title)', {
      y: 26, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out', delay: 0.25,
      clearProps: 'transform,opacity'
    });
    gsap.from('.hero__visual', {
      y: 40, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.35,
      clearProps: 'transform,opacity'
    });
  }

  // Параллакс: фоновые пятна и предметы чуть отстают или обгоняют прокрутку.
  // data-parallax в HTML — сила и направление (минус — в другую сторону)
  document.querySelectorAll('[data-parallax]').forEach((element) => {
    const speed = parseFloat(element.dataset.parallax) || 0;
    gsap.fromTo(element, { y: -speed * 120 }, {
      y: speed * 120,
      ease: 'none',
      scrollTrigger: {
        trigger: element.closest('section'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8
      }
    });
  });

  // Пересчитываем позиции, когда загрузились шрифты и картинки
  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
}


/* --- 7. Главная: 3D-телефон с моими работами ---
   Внутри экрана по очереди показываются работы (блоки .phone__slide).
   Каждая работа плавно прокручивается, затем сменяется следующей, по кругу.
   Высокий (мобильный) скриншот едет сверху вниз, широкий — слева направо.

   ГДЕ МЕНЯТЬ скорость: числа ниже (в миллисекундах, 1000 = 1 секунда). */
const PHONE_PAUSE = 1200;   // пауза в начале и в конце прокрутки
const PHONE_SCROLL = 7000;  // сколько длится прокрутка одной работы
const PHONE_FADE = 900;     // плавная смена работ (как transition в style.css)

const phone = document.getElementById('phone');

if (phone) {
  const slides = Array.from(phone.querySelectorAll('.phone__slide'));
  const dotsBox = document.getElementById('phone-dots');
  const phoneTitle = document.getElementById('phone-title');
  const phoneType = document.getElementById('phone-type');
  const scene = document.getElementById('phone-scene');
  const tilt = document.getElementById('phone-tilt');
  const animations = new Map(); // текущая анимация прокрутки каждого слайда
  let current = 0;
  let nextTimer = null;
  let captionTimer = null;
  let isVisible = true;

  // Если указан мобильный скриншот (data-mobile) — показываем его вместо обычного
  slides.forEach((slide) => {
    const img = slide.querySelector('img');
    if (img.dataset.mobile) img.src = img.dataset.mobile;
  });

  // Точки-переключатели: по одной на каждую работу
  const dots = slides.map((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Показать работу «' + slide.dataset.title + '»');
    dot.addEventListener('click', () => show(index));
    dotsBox.appendChild(dot);
    return dot;
  });

  // Прокрутка картинки внутри экрана
  function scrollSlide(slide) {
    const img = slide.querySelector('img');
    const run = () => {
      if (!img.naturalWidth) return;
      const screenW = slide.clientWidth;
      const screenH = slide.clientHeight;
      const ratio = img.naturalHeight / img.naturalWidth;
      // Картинка «выше» экрана — едет вниз, иначе — вправо
      const tall = ratio > screenH / screenW;
      slide.classList.toggle('is-tall', tall);
      slide.classList.toggle('is-wide', !tall);
      const shiftX = tall ? 0 : screenH / ratio - screenW;
      const shiftY = tall ? screenW * ratio - screenH : 0;

      if (animations.has(slide)) animations.get(slide).cancel();
      if (reduceMotion || !img.animate) return;
      animations.set(slide, img.animate([
        { transform: 'translate3d(0, 0, 0)' },
        { transform: 'translate3d(' + (-shiftX) + 'px, ' + (-shiftY) + 'px, 0)' }
      ], {
        duration: PHONE_SCROLL,
        delay: PHONE_PAUSE,
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)',
        fill: 'both'
      }));
    };
    if (img.complete) run(); else img.addEventListener('load', run, { once: true });
  }

  function show(index) {
    const previous = slides[current];
    current = (index + slides.length) % slides.length;
    const slide = slides[current];

    slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === current);
      dot.setAttribute('aria-current', i === current ? 'true' : 'false');
    });

    // Подпись под телефоном меняется с мягким исчезновением
    clearTimeout(captionTimer);
    phoneTitle.parentElement.classList.add('is-swapping');
    captionTimer = setTimeout(() => {
      phoneTitle.textContent = slide.dataset.title;
      phoneType.textContent = slide.dataset.type;
      phoneTitle.parentElement.classList.remove('is-swapping');
    }, 250);

    // Ушедший слайд возвращаем в начало, когда он уже скрылся
    if (previous !== slide) {
      setTimeout(() => {
        if (previous !== slides[current] && animations.has(previous)) animations.get(previous).cancel();
      }, PHONE_FADE);
    }

    scrollSlide(slide);
    scheduleNext();
  }

  function scheduleNext() {
    clearTimeout(nextTimer);
    // При «уменьшить движение» работы сами не листаются — только по точкам
    if (reduceMotion || !isVisible || document.hidden) return;
    nextTimer = setTimeout(() => show(current + 1), PHONE_PAUSE * 2 + PHONE_SCROLL);
  }

  // Пауза, когда телефон не виден на экране или вкладка свёрнута
  function setPaused(paused) {
    const anim = animations.get(slides[current]);
    if (paused) {
      clearTimeout(nextTimer);
      if (anim) anim.pause();
    } else {
      show(current); // начинаем текущую работу заново
    }
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      const visibleNow = entries[0].isIntersecting;
      if (visibleNow === isVisible) return;
      isVisible = visibleNow;
      setPaused(!isVisible);
    }).observe(phone);
  }

  document.addEventListener('visibilitychange', () => {
    if (isVisible) setPaused(document.hidden);
  });

  // При изменении размера окна пересчитываем прокрутку
  window.addEventListener('resize', () => scrollSlide(slides[current]));

  // Телефон слегка наклоняется вслед за мышью (только компьютер)
  if (canHover && !reduceMotion) {
    scene.addEventListener('pointermove', (event) => {
      const rect = scene.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      tilt.style.setProperty('--tilt-y', (x * 16).toFixed(1) + 'deg');
      tilt.style.setProperty('--tilt-x', (-y * 10).toFixed(1) + 'deg');
    });
    scene.addEventListener('pointerleave', () => {
      tilt.style.removeProperty('--tilt-x');
      tilt.style.removeProperty('--tilt-y');
    });
  }

  show(0);
}


/* --- 8. Мои работы: окно со скриншотом ---
   По клику на карточку берём из неё картинку, тип, название, описание
   и кнопку «Смотреть сайт» и показываем всё это в большом окне. */
const modal = document.getElementById('work-modal');

if (modal) {
  const workCards = Array.from(document.querySelectorAll('.work-card'));
  const modalWindow = modal.querySelector('.modal__window');
  const modalImg = document.getElementById('modal-img');
  const modalType = document.getElementById('modal-type');
  const modalTitle = document.getElementById('modal-title');
  const modalText = document.getElementById('modal-text');
  const modalActions = document.getElementById('modal-actions');
  const modalOrder = document.getElementById('modal-order');
  let lastFocused = null;
  let modalCloseTimer = null;

  function openModal(card) {
    const image = card.querySelector('.cover__img');
    const title = card.querySelector('.work-card__title').textContent;

    modalImg.src = image.getAttribute('src');
    modalImg.alt = image.alt;
    modalType.textContent = card.querySelector('.work-card__badge').textContent;
    modalTitle.textContent = title;
    modalText.textContent = card.querySelector('.work-card__text').textContent;
    // Копируем кнопку «Смотреть сайт» (или надпись «Скоро онлайн»)
    modalActions.innerHTML = '';
    const action = card.querySelector('.work-card__footer > :first-child');
    if (action) modalActions.appendChild(action.cloneNode(true));
    // «Хочу похожий сайт» подставит название работы в форму на странице контактов
    modalOrder.href = 'contacts.html?work=' + encodeURIComponent(title);

    clearTimeout(modalCloseTimer);
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.documentElement.classList.add('modal-lock');
    modalWindow.scrollTop = 0;
    void modal.offsetWidth; // чтобы браузер успел «увидеть» окно до анимации
    modal.classList.add('modal--open');
    modalWindow.focus();
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.classList.remove('modal--open');
    document.documentElement.classList.remove('modal-lock');
    modalCloseTimer = setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 400);
    if (lastFocused) lastFocused.focus({ preventScroll: true });
  }

  workCards.forEach((card) => {
    card.addEventListener('click', (event) => {
      // Клик по ссылке «Смотреть сайт» открывает сайт, а не окно
      if (event.target.closest('a')) return;
      openModal(card);
    });
  });

  modal.querySelectorAll('[data-modal-close]').forEach((element) => {
    element.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (event) => {
    if (modal.hidden) return;
    if (event.key === 'Escape') closeModal();

    // Клавиша Tab «ходит по кругу» только внутри окна
    if (event.key === 'Tab') {
      const focusable = modalWindow.querySelectorAll('button, a[href]');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === modalWindow)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}


/* --- 9. Контакты: форма заявки ---
   ВАЖНО: сайт открывается как обычный файл, без сервера, поэтому
   сама форма письма не отправляет. При отправке открывается
   почтовая программа с готовым письмом на ваш адрес.

   ГДЕ МЕНЯТЬ: впишите свою почту в переменную ниже. */
const MY_EMAIL = 'gumenuk306525@gmail.com'; // ← почта, на которую уходят заявки

const form = document.getElementById('contact-form');

if (form) {
  const formStatus = document.getElementById('form-status');
  const formSubmit = document.getElementById('form-submit');
  const formFields = form.querySelectorAll('input, textarea');
  const messageField = document.getElementById('form-message');
  const SUBMIT_TEXT = formSubmit.textContent;

  // Пришли с кнопки «Заказать» (страница цен) или «Хочу похожий сайт» (работы)?
  // Тогда сразу подставляем текст в сообщение и убираем добавку из адреса.
  const params = new URLSearchParams(window.location.search);
  if (params.get('plan')) {
    messageField.value = 'Здравствуйте! Хочу заказать: «' + params.get('plan') + '». ';
  } else if (params.get('work')) {
    messageField.value = 'Здравствуйте! Хочу сайт, похожий на «' + params.get('work') + '». ';
  }
  if (window.location.search) {
    history.replaceState(null, '', window.location.pathname);
  }

  // Подсвечиваем незаполненное поле красным и показываем подсказку
  function checkField(field) {
    const isEmpty = field.value.trim() === '';
    field.closest('.form__field').classList.toggle('form__field--error', isEmpty);
    field.setAttribute('aria-invalid', isEmpty ? 'true' : 'false');
    return !isEmpty;
  }

  formFields.forEach((field) => {
    // Как только начали исправлять — убираем ошибку
    field.addEventListener('input', () => {
      if (field.closest('.form__field--error')) checkField(field);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // не перезагружаем страницу

    const allValid = Array.from(formFields).map(checkField).every(Boolean);
    if (!allValid) {
      formStatus.textContent = 'Заполните, пожалуйста, отмеченные поля.';
      formStatus.classList.add('form__status--error');
      form.querySelector('.form__field--error input, .form__field--error textarea').focus();
      return;
    }

    // Берём то, что ввёл посетитель
    const name = form.elements['name'].value.trim();
    const contact = form.elements['contact'].value.trim();
    const message = form.elements['message'].value.trim();

    // Собираем письмо
    const subject = 'Заявка с сайта от ' + name;
    const body = 'Имя: ' + name + '\nКак связаться: ' + contact + '\n\n' + message;

    // Кнопка показывает, что происходит: «Открываю почту…» → «Готово ✓»
    formSubmit.disabled = true;
    formSubmit.textContent = 'Открываю почту…';

    window.location.href = 'mailto:' + MY_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    setTimeout(() => {
      formSubmit.textContent = 'Готово ✓';
      formSubmit.classList.add('btn--success');
    }, 700);
    setTimeout(() => {
      formSubmit.disabled = false;
      formSubmit.textContent = SUBMIT_TEXT;
      formSubmit.classList.remove('btn--success');
    }, 3500);

    formStatus.classList.remove('form__status--error');
    formStatus.textContent = 'Спасибо, ' + name + '! Заявка подготовлена — отправьте письмо в почтовой программе.';
    form.reset();
  });
}


/* --- 10. Декор: предметы за мышью и свечение курсора ---
   Плавающие предметы чуть смещаются вслед за мышью (каждый со своей
   «глубиной» --depth, см. style.css), а за курсором плывёт мягкое свечение.
   Только для компьютера с мышью и без «уменьшить движение». */
const decorLayers = document.querySelectorAll('.decor');
const cursorGlow = document.getElementById('cursor-glow');

if (canHover && !reduceMotion && cursorGlow) {
  const mouse = { x: 0, y: 0, smoothX: 0, smoothY: 0 };       // от -1 до 1
  const glow = { x: 0, y: 0, smoothX: 0, smoothY: 0 };        // в пикселях
  let decorFrame = 0;

  function moveDecor() {
    // Плавно догоняем мышь: предметы — медленнее, свечение — быстрее
    mouse.smoothX += (mouse.x - mouse.smoothX) * 0.06;
    mouse.smoothY += (mouse.y - mouse.smoothY) * 0.06;
    glow.smoothX += (glow.x - glow.smoothX) * 0.18;
    glow.smoothY += (glow.y - glow.smoothY) * 0.18;

    decorLayers.forEach((layer) => {
      layer.style.setProperty('--mouse-x', mouse.smoothX.toFixed(3));
      layer.style.setProperty('--mouse-y', mouse.smoothY.toFixed(3));
    });
    cursorGlow.style.transform = 'translate3d(' + glow.smoothX.toFixed(1) + 'px, ' + glow.smoothY.toFixed(1) + 'px, 0)';

    // Анимация останавливается сама, когда всё догнало мышь
    const left = Math.abs(mouse.x - mouse.smoothX) + Math.abs(mouse.y - mouse.smoothY) +
      (Math.abs(glow.x - glow.smoothX) + Math.abs(glow.y - glow.smoothY)) / 100;
    decorFrame = left > 0.001 ? requestAnimationFrame(moveDecor) : 0;
  }

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
    glow.x = event.clientX;
    glow.y = event.clientY;
    if (!cursorGlow.classList.contains('cursor-glow--on')) {
      // Первое появление — сразу под курсором, без «прилёта» из угла
      glow.smoothX = glow.x;
      glow.smoothY = glow.y;
      cursorGlow.classList.add('cursor-glow--on');
    }
    if (!decorFrame) decorFrame = requestAnimationFrame(moveDecor);
  }, { passive: true });

  // Мышь ушла за пределы окна — прячем свечение
  document.documentElement.addEventListener('mouseleave', () => {
    cursorGlow.classList.remove('cursor-glow--on');
  });
}


/* --- 11. Магнитные кнопки ---
   Кнопка слегка тянется к курсору, пока он над ней. */
if (canHover && !reduceMotion) {
  const MAGNET = 7; // максимальный сдвиг в пикселях

  document.querySelectorAll('.btn, .to-top').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;   // от -0.5 до 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      // У широких кнопок (на всю карточку) тяга по горизонтали слабее
      const k = rect.width > 260 ? 0.4 : 1;
      button.style.setProperty('--bx', (x * MAGNET * 2 * k).toFixed(1) + 'px');
      button.style.setProperty('--by', (y * MAGNET * 2).toFixed(1) + 'px');
    });
    button.addEventListener('pointerleave', () => {
      button.style.removeProperty('--bx');
      button.style.removeProperty('--by');
    });
  });
}


/* --- 12. Бегущая лента технологий ---
   Для бесконечной прокрутки нужна вторая копия значков: делаем её здесь. */
document.querySelectorAll('.marquee__track').forEach((track) => {
  Array.from(track.children).forEach((item) => {
    const copy = item.cloneNode(true);
    copy.classList.add('tech--clone');
    copy.setAttribute('aria-hidden', 'true');
    track.appendChild(copy);
  });
});


/* --- 13. Текущий год в подвале (обновляется сам) --- */
document.getElementById('year').textContent = new Date().getFullYear();
