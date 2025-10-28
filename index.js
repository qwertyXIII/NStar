import gsap from 'https://cdn.skypack.dev/gsap';
import { ScrollTrigger } from 'https://cdn.skypack.dev/gsap/ScrollTrigger';
import { spawnRandomWish } from './components/spawnRandomWish.js';
import { wishes } from './components/constants.js';
import { changeText } from "./components/changeText.js";
gsap.registerPlugin(ScrollTrigger);

// запускаем виши раз в 50мс
setInterval(() => {
  spawnRandomWish(document.querySelector('.wishes'), wishes);
}, 150);




// GSAP //
// надпись на старте
gsap.from(".happybd", {
  y: '-100vh',
  scrollTrigger: {
    trigger: "#happybd",
    start: "top 100%",
    end: "bottom top",
    scrub: true
  }
});
// анимация карточек
gsap.from(".career .card", {
  x: () => (Math.random() < 0.5 ? -window.innerWidth : window.innerWidth), // слева или справа
  opacity: 0,
  rotation: () => (Math.random() * 30 - 15), // лёгкий наклон
  duration: 1,
  stagger: 0.3, // задержка между карточками
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".career",
    start: "top 80%",   // когда блок дойдёт до 80% высоты экрана
    end: "bottom top",
    scrub: false,       // анимация срабатывает один раз при скролле
  }
});



/*
const messages = gsap.utils.toArray('.message');

// Анимация: из краёв → в финальную позицию
gsap.from(messages, {
  // Начальное положение — за краями экрана
  x: () => {
    // Случайно: слева или справа?
    return Math.random() > 0.5 ? -window.innerWidth : window.innerWidth;
  },
  y: () => {
    // Иногда снизу (для разнообразия)
    return Math.random() > 0.7 ? window.innerHeight * 0.5 : 0;
  },
  opacity: 0,
  scale: 0.8,
  rotate: () => gsap.utils.random(-5, 5), // лёгкий поворот для живости

  // Параметры анимации
  duration: 1.1,
  ease: "back.out(1.4)", // эффект "подскока" при входе
  stagger: 0.15, // задержка между сообщениями

  // Запуск при прокрутке
  scrollTrigger: {
    trigger: ".career",
    start: "top 70%", // когда секция почти вошла в экран
    once: true        // анимация сработает только один раз
  }
});
*/




window.onload = () => {
  setTimeout(() => {
    changeText(document.querySelector('.happybd__text'), 'Ой, бл...');
    setTimeout(() => {
      changeText(document.querySelector('.happybd__text'), 'С днем рождения! 🎉');
    }, 1000);
  }, 2000);
}


