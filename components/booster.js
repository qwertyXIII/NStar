/**
 * Анимирует число до заданного значения с форматированием (K, M, B).
 * @param {HTMLElement} element — элемент, в который будет писаться число
 * @param {number} [target=10_000_000_000] — целевое число
 * @param {number} [duration=2500] — длительность анимации (мс)
 * @param {Function} [onComplete] — функция, вызываемая после завершения
 */
export function animateToBillions(element, target = 10_000_000_000, duration = 2500, onComplete) {
  if (!element) return;

  // Определяем, не передали ли коллбэк вместо target/duration
  // Поддерживаем вызов: animateToBillions(el, callback)
  if (typeof target === 'function') {
    onComplete = target;
    target = 10_000_000_000;
    duration = 2500;
  } else if (typeof duration === 'function') {
    onComplete = duration;
    duration = 2500;
  }

  const currentText = element.textContent.trim();
  let start = 0;

  if (currentText) {
    const numPart = currentText.replace(/[^\d.,]/g, '').replace(',', '.');
    if (!isNaN(numPart)) {
      const suffix = currentText.slice(-1).toUpperCase();
      let multiplier = 1;
      if (suffix === 'K') multiplier = 1_000;
      else if (suffix === 'M') multiplier = 1_000_000;
      else if (suffix === 'B') multiplier = 1_000_000_000;
      start = parseFloat(numPart) * multiplier;
    }
  }

  const startTime = performance.now();

  function formatNumber(num) {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(num % 1_000_000_000 === 0 ? 0 : 1) + 'B';
    }
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + 'M';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1) + 'K';
    }
    return Math.floor(num).toString();
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = start + easeOutExpo * (target - start);

    element.textContent = formatNumber(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      // Анимация завершена → вызываем коллбэк
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }
  }

  requestAnimationFrame(update);
}