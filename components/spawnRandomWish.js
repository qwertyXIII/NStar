export function spawnRandomWish(container, wordsArray) {
  if (!container || !Array.isArray(wordsArray) || wordsArray.length === 0) {
    console.warn('Неверные аргументы: нужен контейнер и непустой массив');
    return;
  }

  const text = wordsArray[Math.floor(Math.random() * wordsArray.length)];

  const wishEl = document.createElement('div');
  wishEl.textContent = text;
  wishEl.style.position = 'absolute';
  wishEl.style.userSelect = 'none';
  wishEl.style.pointerEvents = 'none';
  wishEl.style.fontFamily = 'Inter, sans-serif';
  wishEl.style.color = 'rgba(255, 255, 255, 0.5)';
  wishEl.style.opacity = '0';
  wishEl.style.transition = 'opacity 0.5s ease-out, transform 1.2s ease-out';

  // Случайный размер: от 1rem до 2.2rem
  const fontSize = (1 + Math.random() * 1.2).toFixed(2);
  wishEl.style.fontSize = `${fontSize}rem`;

  // Случайная жирность: 300, 400, 500, 600, 700
  const fontWeight = [300, 400, 500, 600, 700][Math.floor(Math.random() * 5)];
  wishEl.style.fontWeight = fontWeight.toString();

  // Случайный наклон
  const randomRotate = (Math.random() * 50 - 25).toFixed(1);
  wishEl.style.transform = `translateY(0) rotate(${randomRotate}deg)`;

  // Позиционирование внутри контейнера
  const rect = container.getBoundingClientRect();
  const maxX = rect.width - 100; // запас под крупные слова/эмодзи
  const maxY = rect.height - 60;

  if (maxX <= 0 || maxY <= 0) return;

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  wishEl.style.left = `${x}px`;
  wishEl.style.top = `${y}px`;

  container.appendChild(wishEl);

  // Появление
  setTimeout(() => {
    wishEl.style.opacity = '1';
    wishEl.style.transform = `translateY(-80px) rotate(${randomRotate}deg)`;
  }, 10);

  // Исчезновение
  setTimeout(() => {
    wishEl.style.opacity = '0';
    wishEl.style.transform = `translateY(-120px) rotate(${randomRotate}deg)`;
  }, 2500);

  // Удаление из DOM
  setTimeout(() => {
    if (wishEl.parentNode) {
      wishEl.remove();
    }
  }, 3000);
}