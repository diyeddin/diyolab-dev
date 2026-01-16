// Chatbot widget loader
(function() {
  // Create and load the chatbot widget script
  const script = document.createElement('script');
  script.src = 'https://standbyai.diyolab.dev/widget.js';
  script.setAttribute('data-app-id', 'app_74428a5dbf84');
  script.setAttribute('data-offset-y', '100');
  script.setAttribute('data-title', 'Standby Support');
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