import { danceWishes } from "./constants.js";

/**
 * Автоматически подстраивает высоту textarea под содержимое.
 * @param {HTMLTextAreaElement} textarea
 */
function autoResizeTextarea(textarea) {
  // Сбрасываем высоту, чтобы получить точный scrollHeight
  textarea.style.height = 'auto';
  // Ограничиваем максимальную высоту (например, 120px), чтобы не убежало
  const maxHeight = 120;
  const newHeight = Math.min(textarea.scrollHeight, maxHeight);
  textarea.style.height = newHeight + 'px';
}

/**
 * Запускает анимацию "печатания и отправки" пожеланий в стиле iMessage.
 * @param {Object} options
 * @param {HTMLElement} options.chatContainer - контейнер для сообщений
 * @param {HTMLTextAreaElement} options.messageInput - поле ввода (должен быть <textarea>)
 * @param {HTMLElement} [options.startButton] - кнопка (опционально)
 * @param {number} [options.typingDelay=50] - задержка между буквами (мс)
 * @param {number} [options.messageDelay=600] - пауза между сообщениями (мс)
 */
export async function startDanceWishesAnimation({
  chatContainer,
  messageInput,
  startButton = null,
  typingDelay = 50,
  messageDelay = 600
}) {
  if (!chatContainer || !messageInput) {
    throw new Error('chatContainer and messageInput are required');
  }

  const messages = [...danceWishes]; // копируем, чтобы не мутировать оригинал

  async function typeAndSend(text) {
    // Очищаем и сбрасываем высоту
    messageInput.value = '';
    autoResizeTextarea(messageInput);

    // Печатаем по буквам
    for (let i = 0; i <= text.length; i++) {
      messageInput.value = text.slice(0, i);
      autoResizeTextarea(messageInput); // ← обновляем высоту после каждого символа
      await new Promise(resolve => setTimeout(resolve, typingDelay));
    }

    // Имитация отправки
    await new Promise(resolve => setTimeout(resolve, 300));

    // Добавляем сообщение в чат
    const messageEl = document.createElement('div');
    messageEl.className = 'message--outgoing';
    messageEl.textContent = text;
    chatContainer.appendChild(messageEl);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Очищаем поле
    messageInput.value = '';
    autoResizeTextarea(messageInput);
  }

  // Обновляем состояние кнопки (если есть)
  if (startButton) {
    startButton.disabled = true;
    startButton.textContent = 'Отправляю...';
  }

  // Отправляем все пожелания по очереди
  for (const msg of messages) {
    await typeAndSend(msg);
    await new Promise(resolve => setTimeout(resolve, messageDelay));
  }

  // Восстанавливаем кнопку
  if (startButton) {
    startButton.textContent = 'Готово!';
    setTimeout(() => {
      startButton.disabled = false;
      startButton.textContent = 'Запустить снова';
    }, 1000);
  }
}