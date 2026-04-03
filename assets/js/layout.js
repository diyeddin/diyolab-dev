// Global layout bootstrap
(function () {
  function setCurrentYear() {
    const yearElements = document.querySelectorAll('#year');
    const currentYear = String(new Date().getFullYear());

    yearElements.forEach((element) => {
      element.textContent = currentYear;
    });
  }

  function loadChatbotWidget() {
    const widgetSrc = 'https://standbyai.tech/widget.js';
    const existingWidget = document.querySelector(`script[src="${widgetSrc}"]`);

    if (existingWidget) {
      return;
    }

    const script = document.createElement('script');
    script.src = widgetSrc;
    script.setAttribute('data-app-id', 'app_a0bb1636d326b39e451d15b6b1b4462d');
    script.setAttribute('data-offset-y', '100');
    script.setAttribute('data-title', 'Standby Support');
    script.setAttribute('data-position', 'right');
    document.head.appendChild(script);
  }

  function initLayout() {
    setCurrentYear();
    loadChatbotWidget();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLayout);
  } else {
    initLayout();
  }
})();
