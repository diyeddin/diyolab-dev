// Chatbot widget loader
(function() {
  // Create and load the chatbot widget script
  const script = document.createElement('script');
  script.src = 'https://standbyai.diyolab.dev/widget.js';
  script.setAttribute('data-app-id', 'your-company-id');
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
      // Track chatbot button clicks (when widget opens)
      const chatbotButton = document.querySelector('.chat-bubble');
      
      if (chatbotButton) {
        chatbotButton.addEventListener('click', function() {
          if (window.umami) {
            umami.track('chatbot-opened');
          }
        });
      }

      // Track when iframe appears (chatbot window opened)
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          mutation.addedNodes.forEach(function(node) {
            if (node.tagName === 'IFRAME' && node.src && node.src.includes('standbyai')) {
              if (window.umami) {
                umami.track('chatbot-widget-loaded');
              }
              
              // Track when messages are sent (detect iframe activity)
              const messageTracker = setInterval(function() {
                if (window.umami && node.contentWindow) {
                  // Check if iframe is still visible
                  const isVisible = node.offsetParent !== null;
                  if (!isVisible) {
                    clearInterval(messageTracker);
                    if (window.umami) {
                      umami.track('chatbot-closed');
                    }
                  }
                }
              }, 1000);
            }
          });
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }, 1000);
  };
})();