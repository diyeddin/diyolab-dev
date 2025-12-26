// Chatbot widget loader
(function() {
  // Create and load the chatbot widget script
  const script = document.createElement('script');
  script.src = 'https://standbyai.diyolab.dev/widget.js';
  script.setAttribute('data-app-id', 'app_d2218a5699c2');
  script.setAttribute('data-color', '#a855f7');
  script.setAttribute('data-bg', '#0f172a');
  script.setAttribute('data-user-msg', '#a855f7');
  script.setAttribute('data-bot-msg', '#e5e7eb');
  script.setAttribute('data-bot-msg-border', '#a855f7');
  script.setAttribute('data-offset-y', '100');
  script.setAttribute('data-title', 'Standby Support');
  script.setAttribute('data-brand', 'standbyai');
  script.setAttribute('data-position', 'right');
  
  // Append the script to the document head
  document.head.appendChild(script);

  // Track chatbot interactions with Umami
  script.onload = function() {
    // Wait for widget to be ready
    setTimeout(function() {
      let isOpen = false;
      
      // Track chatbot button clicks (when widget opens/closes)
      const chatbotButton = document.querySelector('.chat-bubble');
      
      if (chatbotButton) {
        chatbotButton.addEventListener('click', function() {
          if (window.umami) {
            if (!isOpen) {
              umami.track('chatbot-opened');
              isOpen = true;
            } else {
              umami.track('chatbot-closed');
              isOpen = false;
            }
          }
        });
      }
    }, 1000);
  };
})();