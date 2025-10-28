// Функция для плавной замены текста
export function changeText(el, string) {
  el.classList.add('text_transperent');
  el.style.transition = '0.3s ease-in-out';
  setTimeout(() => {
    el.innerHTML = string;
    el.classList.remove('text_transperent');
  }, 300);
}