import gsap from 'https://cdn.skypack.dev/gsap';
import { ScrollTrigger } from 'https://cdn.skypack.dev/gsap/ScrollTrigger';
import { spawnRandomWish } from './components/spawnRandomWish.js';
import { wishes } from './components/constants.js';
import { changeText } from "./components/changeText.js";
import { Application } from "https://unpkg.com/@splinetool/runtime@latest";

gsap.registerPlugin(ScrollTrigger);

// === Preloader ===
const preloader = document.querySelector('.preloader');
document.body.style.overflow = 'hidden'; // запрет скролла пока грузится

// === Wishes ===
setInterval(() => spawnRandomWish(document.querySelector('.wishes'), wishes), 300);

// === GSAP анимации ===
gsap.from(".happybd", { y: '-100vh', scrollTrigger: { trigger: "#happybd", start: "top 100%", end: "bottom top", scrub: true } });

gsap.fromTo(".career",
  { y: "200vh", scale: 0.1, borderRadius: "100vw", transformOrigin: "center center" },
  { y: "-20vh", scale: 1, borderRadius: "0px", scrollTrigger: { trigger: "#happybd", start: "top bottom", end: "bottom top", scrub: true } }
);

gsap.utils.toArray(".message").forEach(msg => {
  const bubble = msg.querySelector(".bubble");
  const fromX = msg.classList.contains("telegram") || msg.classList.contains("instagram") ? -200 : 200;

  gsap.from(bubble, { opacity: 0, x: fromX, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: msg, start: () => `top-=50vh bottom`, toggleActions: "play none none none" } });
  gsap.to(bubble, { y: -500, scrollTrigger: { trigger: msg, start: () => `top+=${window.innerHeight / 6} bottom`, end: "bottom top", scrub: 2 } });
});

// === Фон страницы при прокрутке ===
gsap.to('.page', { background: '#030321', scrollTrigger: { trigger: '.career', start: () => `top bottom+=500`, end: "bottom top", scrub: 2 } });

// === Линии / точки / инфографика ===
const allData = [
  { type: 'followers', data: { year: 2025, num: "1 145", message: 'Сейчас твой инст выглядит так' } },
  { type: 'likes', data: { year: 2025, num: "60", message: 'Среднее кол-во отметок "Мне нравится" под постами' } },
  { type: 'followers', data: { year: 2026, num: "3 684", message: 'Но пусть с каждым годом, он растет' } },
  { type: 'likes', data: { year: 2026, num: "363", message: 'Так-же как растет и реакция аудитории' } },
  { type: 'followers', data: { year: 2027, num: "175 393", message: 'И причем делает это в геометрической прогрессии!' } },
  { type: 'likes', data: { year: 2027, num: "14 937", message: 'Лайки множатся — значит, твой контент зацепил!' } },
  { type: 'followers', data: { year: 2028, num: '8 251 186 506', message: 'Чтобы в конце концов на тебя было подписанно все человечество!' } },
  { type: 'likes', data: { year: 2028, num: "28 485 927 281", message: 'А может даже и внеземные формы жизни' } }
];

let currentTop = 50;

allData.forEach(item => {
  const dot = document.createElement('div'); dot.classList.add('dot', item.type);

  const year = document.createElement('div'); year.classList.add('year'); year.textContent = item.data.year;

  const count = document.createElement('div'); count.classList.add('count');
  const icon = document.createElement('span');
  icon.innerHTML = item.type === 'likes'
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FF2D55"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#007AFF"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
  const number = document.createElement('span'); number.textContent = '0';
  count.append(icon, number);

  const message = document.createElement('p'); message.classList.add('message'); message.textContent = item.data.message;

  dot.append(year, count, message);
  dot.style.top = `${currentTop}px`;
  document.querySelector(`.line.${item.type}`).appendChild(dot);
  currentTop += dot.offsetHeight + 40;

  gsap.fromTo(dot, { opacity: 0, y: 20 }, { opacity: 1, y: 0, scrollTrigger: { trigger: dot, start: 'top 90%', end: 'top 80%', toggleActions: 'play none none none' } });

  gsap.to({ value: 0 }, {
    value: parseInt(item.data.num.replace(/\s/g,''), 10),
    duration: 2,
    scrollTrigger: { trigger: dot, start: 'top 90%', toggleActions: 'play none none none' },
    onUpdate: function() { number.textContent = Math.floor(this.targets()[0].value).toLocaleString('ru-RU'); }
  });
});

document.querySelectorAll('.line').forEach(line => line.style.height = `${currentTop}px`);

// === Соц. надпись ===
const msg = document.querySelector(".social__message");
const textWidth = msg.offsetWidth, viewportWidth = window.innerWidth;
gsap.fromTo(msg, { x: viewportWidth }, { x: -textWidth - 150, ease: "none", scrollTrigger: { trigger: "#social", start: "top bottom", end: `+=${(textWidth + viewportWidth)*(viewportWidth<768?0.4:0.45)}`, scrub: 0.3, invalidateOnRefresh: true } });

// === 3D сцена Spline ===
const canvas = document.createElement("canvas");
document.querySelector("#spline-container").appendChild(canvas);
const app = new Application(canvas);

Promise.all([new Promise(res => window.onload = res), document.fonts.ready])
  .then(() => app.load("https://prod.spline.design/bLTkqukr3Gbqr2i1/scene.splinecode"))
  .then(() => {
    const phone = app.findObjectByName("Phone");
    if (!phone) { console.warn("Phone не найден"); return; }

    gsap.to(preloader, { opacity: 0, duration: 0.8, onComplete: () => preloader.style.display = 'none' });
    document.body.style.overflow = '';

    const happyText = document.querySelector('.happybd__text');
    changeText(happyText, 'Ой, бл...');
    setTimeout(() => changeText(happyText, 'С днем рождения! �'), 1000);

    gsap.fromTo(".gift__title", { y: "-50vh", scale: 0.1, transformOrigin: "center center" }, { y: "40vh", scale: 1, scrollTrigger: { trigger: "#gift", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.fromTo(".social", { scale: 1, transformOrigin: "center center" }, { scale: 0.9, borderRadius: 50, opacity: 0, scrollTrigger: { trigger: "#gift", start: "top bottom", end: "bottom top", scrub: true } });

    function updateScale() {
      const w = window.innerWidth;
      phone.scale.set(w<768?0.6:w<1440?0.8:1, w<768?0.6:w<1440?0.8:1, w<768?0.6:w<1440?0.8:1);
    }
    updateScale();
    window.addEventListener("resize", updateScale);

    gsap.fromTo(phone.position, { y: -300 }, { y: 300, scrollTrigger: { trigger: "#social", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.fromTo(phone.rotation, { y: 0, x: 0 }, { y: Math.PI/4, x: Math.PI/8, scrollTrigger: { trigger: "#social", start: "top bottom", end: "bottom top", scrub: true } });

    animateCards();
  });

// === Карточки ===
const cards = gsap.utils.toArray(".cards .card");
function animateCards() {
  const width = window.innerWidth;
  gsap.killTweensOf(cards);
  cards.forEach(c => gsap.set(c, { opacity: 0, x: 0, y: 0 }));

  if (width >= 900) {
    gsap.to(cards, { opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: "back.out(1.7)", scrollTrigger: { trigger: ".cards", start: "top 80%", end: "bottom top", toggleActions: "play none none none" }, onStart: () => cards.forEach(c => gsap.set(c, { y: 100 })) });
  } else {
    cards.forEach((c, i) => gsap.fromTo(c, { opacity: 0, x: i%2===0?-200:200 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: c, start: "top 90%", toggleActions: "play none none none" } }));
  }
}

window.addEventListener("resize", () => { ScrollTrigger.refresh(); animateCards(); });