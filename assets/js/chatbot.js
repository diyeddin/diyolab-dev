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
})();

// [TODO] make the chat persist across all pages (use localStorage or cookies)