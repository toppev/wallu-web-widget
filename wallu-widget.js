/**
 * Wallu AI Chat Widget - Ultra-Simple Installation
 *
 * SETUP STEPS:
 * 1. 🔑 REQUIRED: Replace 'pk_your_actual_key_here' below with your real API key
 *    Get your key from: https://panel.wallubot.com/addons
 * 2. Choose your theme (discord, corporate, tech, gaming, minimal)
 * 3. Save this file
 * 4. Add to your website: <script defer src="./wallu-widget.js"></script>
 *
 * ALTERNATIVE/ADVANCED: You can also set window.WALLU_CONFIG before loading this script
 * to override these settings without editing this file.
 */

// ============ CONFIGURATION ============
// 🔑 STEP 1: Replace with your API key from https://panel.wallubot.com/addons
// ⚠️  IMPORTANT: The widget will NOT work until you set a real API key!
const WALLU_CONFIG = {
  apiKey: 'pk_your_actual_key_here', // CHANGE THIS!

  // STEP 2: Choose your theme (discord, corporate, tech, gaming, minimal)
  theme: 'tech',

  // STEP 3: Customize the experience (optional)
  botName: 'AI Assistant',
  botAvatar: 'AI',
  welcomeMessage: 'Hello! I\'m your AI assistant. How can I help you today?',
  fieldPlaceholder: 'Ask me anything...',
  position: 'bottom-right', // 'bottom-right', 'bottom-left'
  // Send logs to staff notification channel configured in https://panel.wallubot.com/settings
  discordWebhook: true,

  // Do not modify this baseUrl
  baseUrl: 'https://api.wallubot.com/v1',
  // This allows configuration without editing this file (window.WALLU_CONFIG can override these settings)
  ...(window.WALLU_CONFIG || {})
};

// ============ THEMES ============
const THEMES = {
  discord: {
    primary: '#5865F2',
    secondary: '#7C3AED',
    background: '#1E1F22',
    surface: '#2B2D31',
    text: '#F2F3F5',
    textSecondary: '#B5BAC1',
    inputBg: '#383A40',
    accent: '#00A8FC',
    success: '#23A55A',
    warning: '#F0B232',
    error: '#F23F43'
  },
  corporate: {
    primary: '#2563EB',
    secondary: '#1E40AF',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#64748B',
    inputBg: '#F8FAFC',
    accent: '#0EA5E9',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626'
  },
  tech: {
    primary: '#7C3AED',
    secondary: '#5B21B6',
    background: '#FAFBFC',
    surface: '#FFFFFF',
    text: '#0D1117',
    textSecondary: '#656D76',
    inputBg: '#F6F8FA',
    accent: '#8B5CF6',
    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545'
  },
  gaming: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    background: '#0A0A0F',
    surface: '#1A1A2E',
    text: '#EAEAEA',
    textSecondary: '#B8B8B8',
    inputBg: '#16213E',
    accent: '#FFE66D',
    success: '#4ECDC4',
    warning: '#FF8B94',
    error: '#FF5722'
  },
  minimal: {
    primary: '#18181B',
    secondary: '#3F3F46',
    background: '#FFFFFF',
    surface: '#FAFAFA',
    text: '#0A0A0A',
    textSecondary: '#737373',
    inputBg: '#F4F4F5',
    accent: '#6366F1',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  }
};

// ============ WIDGET CLASS ============
class WalluChatWidget {
  constructor(config, theme) {
    this.config = config;
    this.theme = theme;
    this.apiUrl = WALLU_CONFIG.baseUrl + '/on-message';
    this.logApiUrl = WALLU_CONFIG.baseUrl + '/log-message';
    this.isOpen = false;
    this.isMobile = window.innerWidth < 768;
    this.conversationId = this.generateId();
    this.userId = this.generateId();
    this.unreadCount = 0;

    setTimeout(() => this.init(), 100); // Wait for elements to be ready
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  init() {
    this.bindEvents();

    // Check if API key is still the default and show warning
    if (this.config.apiKey === 'pk_your_actual_key_here') {
      setTimeout(() => {
        this.addMessage('⚠️ **Setup Required**: Please replace the default API key with your real key from https://panel.wallubot.com/addons to start using the widget.', 'bot', true);
      }, 1500);
    } else if (!this.config.apiKey.startsWith('pk_')) {
      setTimeout(() => {
        this.addMessage('❌ **Invalid API Key**: The API key doesn\'t look like a public key (should start with "pk_"). You may be using a private key (sk_) which cannot be used in the widget. Get your public key from https://panel.wallubot.com/addons', 'bot', true);
      }, 1500);
    }

    setTimeout(() => this.addMessage(this.config.welcomeMessage, 'bot', false, true), 1000);
  }

  bindEvents() {
    const chatButton = document.getElementById('walluChatButton');
    if (chatButton) chatButton.addEventListener('click', () => this.toggle());
    const closeButton = document.getElementById('walluCloseButton');
    const mobileCloseButton = document.getElementById('walluMobileCloseButton');
    const sendButton = document.getElementById('walluSendButton');
    const mobileSendButton = document.getElementById('walluMobileSendButton');

    if (closeButton) closeButton.addEventListener('click', () => this.close());
    if (mobileCloseButton) mobileCloseButton.addEventListener('click', () => this.close());
    if (sendButton) sendButton.addEventListener('click', () => this.send());
    if (mobileSendButton) mobileSendButton.addEventListener('click', () => this.send());

    ['walluMessageInput', 'walluMobileMessageInput'].forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', (e) => this.updateSend(e));
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.send();
          }
        });
      }
    });

    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
  }

  updateSend(e) {
    const hasText = e.target.value.trim().length > 0;

    const sendButton = document.getElementById('walluSendButton');
    const mobileSendButton = document.getElementById('walluMobileSendButton');

    if (sendButton) sendButton.disabled = !hasText;
    if (mobileSendButton) mobileSendButton.disabled = !hasText;

    // Sync input values between desktop and mobile
    const other = e.target.id === 'walluMessageInput' ? 'walluMobileMessageInput' : 'walluMessageInput';
    const otherInput = document.getElementById(other);
    if (otherInput) {
      otherInput.value = e.target.value;
    }
  }

  toggle() {
    if (this.isOpen) this.close(); else this.open();
  }

  open() {
    this.isOpen = true;
    this.unreadCount = 0;
    this.updateBadge();

    if (this.isMobile) {
      const overlay = document.getElementById('walluMobileOverlay');
      overlay.classList.remove('wallu-mobile-hidden');
      overlay.classList.add('show');
      document.getElementById('walluMobileMessages').innerHTML = document.getElementById('walluChatMessages').innerHTML;
      document.body.style.overflow = 'hidden';
      
      // Prevent auto-focus on mobile input
      const input = document.getElementById('walluMobileMessageInput');
      if (input) input.blur();
    } else {
      document.getElementById('walluChatWindow').classList.add('show');
      // On desktop we focus
      document.getElementById('walluMessageInput').focus();
    }
  }

  close() {
    this.isOpen = false;
    this.updateBadge();

    // Close both mobile and desktop views to handle screen size changes
    const overlay = document.getElementById('walluMobileOverlay');
    overlay.classList.add('wallu-mobile-hidden');
    overlay.classList.remove('show');
    document.getElementById('walluChatWindow').classList.remove('show');
    document.body.style.overflow = '';
  }

  updateBadge() {
    const badge = document.getElementById('walluNotificationBadge');
    if (!badge) return;
    
    if (this.unreadCount > 0 && !this.isOpen) {
      badge.textContent = String(this.unreadCount);
      badge.style.visibility = 'visible';
    } else {
      badge.style.visibility = 'hidden';
    }
  }

  addMessage(text, sender, isError = false, skipLogging = false, attachments = []) {
    // Add the text message
    const msg = document.createElement('div');
    msg.className = `wallu-msg ${sender}${isError ? ' error' : ''}`;

    if (sender === 'bot') {
      const avatar = document.createElement('div');
      avatar.className = 'wallu-avatar';
      avatar.style.cssText = `background: ${this.theme.primary}20; color: ${this.theme.primary};`;
      avatar.textContent = this.config.botAvatar;
      msg.appendChild(avatar);
    }

    const bubble = document.createElement('div');
    bubble.className = 'wallu-msg-bubble';

    if (sender === 'user') {
      bubble.style.background = this.theme.primary;
    }

    bubble.innerHTML = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="wallu-link">$1</a>');
    msg.appendChild(bubble);

    document.getElementById('walluChatMessages').appendChild(msg);
    if (this.isMobile && this.isOpen) document.getElementById('walluMobileMessages').appendChild(msg.cloneNode(true));

    // Add attachments as separate messages if present
    if (attachments && attachments.length > 0) {
      attachments.forEach(attachment => {
        this.addAttachmentMessage(attachment, sender);
      });
    }

    this.scroll();
    if (!skipLogging) this.logToDiscord(text, sender, isError).then();

    // Increment unread count for bot messages when chat is closed
    if (sender === 'bot' && !this.isOpen) {
      this.unreadCount++;
      this.updateBadge();
    }

    // For demo purposes, expose this method globally
    if (!window.walluChatWidget.addMessage) {
      window.walluChatWidget.addMessage = this.addMessage.bind(this);
    }
  }

  showTyping() {
    document.getElementById('walluTypingIndicator').classList.add('show');
    document.getElementById('walluMobileTypingIndicator').classList.add('show');
    this.scroll();
  }

  hideTyping() {
    document.getElementById('walluTypingIndicator').classList.remove('show');
    document.getElementById('walluMobileTypingIndicator').classList.remove('show');
  }

  scroll() {
    setTimeout(() => {
      ['walluChatMessages', 'walluMobileMessages'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.scrollTop = el.scrollHeight;
      });
    }, 100);
  }

  async send() {
    const input = document.getElementById(this.isMobile ? 'walluMobileMessageInput' : 'walluMessageInput');
    const message = input.value.trim();
    if (!message) return;

    this.addMessage(message, 'user');
    input.value = '';
    document.getElementById(this.isMobile ? 'walluMessageInput' : 'walluMobileMessageInput').value = '';
    document.getElementById('walluSendButton').disabled = true;
    document.getElementById('walluMobileSendButton').disabled = true;

    // Check if API key is still the default
    if (this.config.apiKey === 'pk_your_actual_key_here') {
      this.addMessage('❌ **API Key Error**: You need to replace the default API key with your real key from https://panel.wallubot.com/addons. The widget will not work until you set a valid API key.', 'bot', true);
      return;
    }
    // Check if API key starts with pk_ (public key)
    if (!this.config.apiKey.startsWith('pk_')) {
      this.addMessage('❌ **Invalid API Key**: The API key doesn\'t look like a public key (should start with "pk_"). You\'re probably using a private key (sk_) which cannot be used in the widget. Get your public key from https://panel.wallubot.com/addons', 'bot', true);
      return;
    }

    this.showTyping();

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': this.config.apiKey },
        body: JSON.stringify({
          addon: { name: 'web-widget (' + window.location.hostname + ')', version: '1.0.0' },
          channel: { id: window.location.pathname, name: 'Website Chat @ ' + window.location.pathname },
          user: { id: this.userId, username: 'Website Visitor', is_staff_member: false },
          message: { id: this.generateId(), is_bot_mentioned: true, content: message },
          configuration: { emoji_type: 'unicode', include_sources: false }
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const responseMessage = data.response?.message || data.message || 'No response available';
      this.hideTyping();
      this.addMessage(responseMessage, 'bot', false, false,  data.response?.attachments || []);
    } catch (error) {
      console.error('Wallu Widget Error:', error);
      this.hideTyping();
      this.addMessage('Sorry, I\'m having trouble connecting. Please try again later.', 'bot', true);
    }
  }

  async logToDiscord(message, sender, isError) {
    if (!this.config.discordWebhook) return;
    try {
      await fetch(this.logApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey
        },
        body: JSON.stringify({
          message: message,
          sender: sender,
          isError: isError
        })
      });
    } catch (error) {
      console.error('Discord log error:', error);
    }
  }

  addAttachmentMessage(attachment, sender) {
    const msg = document.createElement('div');
    msg.className = `wallu-msg wallu-attachment-msg ${sender}`;
    if (sender === 'bot') {
      // Add a smaller, subtle avatar for attachment messages
      const avatar = document.createElement('div');
      avatar.className = 'wallu-avatar';
      avatar.style.cssText = `
        background: transparent;
        color: ${this.theme.textSecondary};
        font-size: 10px;
        width: 24px;
        height: 24px;
        margin-top: 8px;
      `;
      avatar.textContent = '📎';
      msg.appendChild(avatar);
    }
    msg.appendChild(this.createAttachmentElement(attachment));
    document.getElementById('walluChatMessages').appendChild(msg);
    if (this.isMobile && this.isOpen) document.getElementById('walluMobileMessages').appendChild(msg.cloneNode(true));
  }

  createAttachmentElement(attachment) {
    const { id, filename, mime_type, alt_text, url } = attachment;
    const isImage = mime_type.startsWith('image/');
    if (isImage) return this.createImageAttachment(url, filename, alt_text);
    return this.createFileAttachment(url, filename, mime_type);
  }

  createImageAttachment(url, filename, alt_text) {
    const container = document.createElement('div');
    container.className = 'wallu-attachment wallu-image-attachment';
    
    const img = document.createElement('img');
    img.src = url;
    img.alt = alt_text || filename;
    img.className = 'wallu-attachment-image';
    img.style.cssText = `
      max-width: 250px;
      max-height: 200px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    `;
    
    img.addEventListener('click', () => this.openImageFullscreen(url, alt_text || filename));
    img.addEventListener('mouseenter', () => {
      img.style.opacity = '0.9';
      img.style.transform = 'scale(1.02)';
    });
    img.addEventListener('mouseleave', () => {
      img.style.opacity = '1';
      img.style.transform = 'scale(1)';
    });
    
    container.appendChild(img);
    return container;
  }

  createFileAttachment(url, filename, mime_type) {
    const container = document.createElement('div');
    container.className = 'wallu-attachment wallu-file-attachment';
    container.style.cssText = `
      display: flex;
      align-items: center;
      padding: 12px;
      background: ${this.theme.inputBg};
      border-radius: 8px;
      margin-top: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid rgba(0,0,0,0.06);
    `;
    
    const icon = document.createElement('div');
    icon.className = 'wallu-file-icon';
    icon.innerHTML = this.getFileIcon(mime_type);
    icon.style.cssText = `
      width: 32px;
      height: 32px;
      margin-right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${this.theme.primary};
    `;
    
    const info = document.createElement('div');
    info.className = 'wallu-file-info';
    info.innerHTML = `
      <div style="font-weight: 500; color: ${this.theme.text};">${filename}</div>
      <div style="font-size: 12px; color: ${this.theme.textSecondary};">${this.getFileTypeLabel(mime_type)}</div>
    `;
    
    container.appendChild(icon);
    container.appendChild(info);
    
    container.addEventListener('click', () => this.handleFileClick(url, filename, mime_type));
    container.addEventListener('mouseenter', () => container.style.background = this.theme.surface);
    container.addEventListener('mouseleave', () => container.style.background = this.theme.inputBg);
    
    return container;
  }

  openImageFullscreen(url, alt_text) {
    const overlay = document.createElement('div');
    overlay.className = 'wallu-image-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000001;
      cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = url;
    img.alt = alt_text;
    img.style.cssText = `
      max-width: 90vw;
      max-height: 90vh;
      object-fit: contain;
      border-radius: 8px;
    `;
    
    overlay.appendChild(img);
    document.body.appendChild(overlay);
    
    const closeOverlay = () => {
      document.body.removeChild(overlay);
      document.body.style.overflow = '';
    };
    
    overlay.addEventListener('click', closeOverlay);
    document.addEventListener('keydown', function onEscape(e) {
      if (e.key === 'Escape') {
        closeOverlay();
        document.removeEventListener('keydown', onEscape);
      }
    });
    
    document.body.style.overflow = 'hidden';
  }

  handleFileClick(url, filename, mime_type) {
    const shouldOpenInBrowser = ['application/pdf', 'image/', 'video/', 'audio/'].some(it => mime_type.startsWith(it))
    if (shouldOpenInBrowser) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      this.downloadFile(url, filename);
    }
  }

  downloadFile(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  getFileIcon(mime_type) {
    if (mime_type.startsWith('image/')) return '🖼️';
    if (mime_type.startsWith('video/')) return '🎥';
    if (mime_type.startsWith('audio/')) return '🎵';
    if (mime_type === 'application/pdf') return '📄';
    if (mime_type.startsWith('text/')) return '📝';
    if (mime_type.includes('zip') || mime_type.includes('archive')) return '📦';
    if (mime_type.includes('word') || mime_type.includes('document')) return '📄';
    if (mime_type.includes('excel') || mime_type.includes('spreadsheet')) return '📊';
    if (mime_type.includes('powerpoint') || mime_type.includes('presentation')) return '📈';
    return '📎';
  }

  getFileTypeLabel(mime_type) {
    if (mime_type.startsWith('image/')) return 'Image';
    if (mime_type.startsWith('video/')) return 'Video';
    if (mime_type.startsWith('audio/')) return 'Audio';
    if (mime_type === 'application/pdf') return 'PDF Document';
    if (mime_type.startsWith('text/')) return 'Text File';
    if (mime_type.includes('zip')) return 'Archive';
    if (mime_type.includes('word')) return 'Word Document';
    if (mime_type.includes('excel')) return 'Spreadsheet';
    if (mime_type.includes('powerpoint')) return 'Presentation';
    return 'File';
  }
}

// ============ AUTO-INITIALIZATION ============
(function () {
  'use strict';

  // Get theme colors
  const theme = THEMES[WALLU_CONFIG.theme] || THEMES.tech;

  // Add custom styles
  const styles = document.createElement('style');
  //language=css
  styles.innerHTML = `
        /* Preflight reset for widget components only */
        .wallu-widget *, .wallu-widget *:before, .wallu-widget *:after {
          box-sizing: border-box !important;
          margin: 0 !important;
          padding: 0 !important;
          border: 0 !important;
          z-index: 999990 !important;
          font: inherit !important;
          vertical-align: baseline !important;
        }
        .wallu-widget { 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          line-height: 1.6 !important;
          color: inherit !important;
          z-index: 999990 !important;
          font-feature-settings: "kern" 1, "liga" 1, "calt" 1 !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }
        .wallu-widget input, .wallu-widget button, .wallu-widget textarea {
          font-family: inherit !important;
          pointer-events: auto !important;
          user-select: text !important;
          -webkit-appearance: none !important;
          appearance: none !important;
        }
        .wallu-widget button { cursor: pointer !important; }
        .wallu-widget a { text-decoration: none !important; color: inherit !important; }
        @keyframes wallu-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes wallu-typing { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-3px); opacity: 1; } }
        @keyframes wallu-fadeIn { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes wallu-slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes wallu-bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-4px); } 60% { transform: translateY(-2px); } }
        
        .wallu-btn { position: fixed !important; width: 64px !important; height: 64px !important; border-radius: 20px !important; display: flex !important; align-items: center !important; justify-content: center !important; cursor: pointer !important; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important; box-shadow: 0 8px 32px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.05) !important; backdrop-filter: blur(20px) !important; }
        .wallu-btn:hover { transform: scale(1.08) translateY(-3px) !important; box-shadow: 0 16px 48px -8px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.1) !important; }
        .wallu-btn:active { transform: scale(0.96) translateY(-1px) !important; transition: all 0.15s cubic-bezier(0.4, 0, 0.6, 1) !important; }
        .wallu-btn-badge { position: absolute !important; top: -6px !important; right: -6px !important; width: 22px !important; height: 22px !important; background: #ef4444 !important; color: white !important; font-size: 12px !important; font-weight: 700 !important; border-radius: 50% !important; display: flex !important; align-items: center !important; justify-content: center !important; animation: wallu-pulse 2s infinite !important; border: 2px solid white !important; }
        
        .wallu-window { position: fixed !important; width: 400px !important; max-width: calc(100vw - 32px) !important; height: 540px !important; bottom: 98px !important; border-radius: 24px !important; box-shadow: 0 32px 80px -16px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.06) !important; border: none !important; display: none !important; flex-direction: column !important; overflow: hidden !important; backdrop-filter: blur(24px) !important; animation: wallu-fadeIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important; }
        .wallu-window.show { display: flex !important; }
        
        .wallu-header { padding: 24px !important; display: flex !important; align-items: center !important; justify-content: space-between !important; color: white !important; position: relative !important; }
        .wallu-header::after { content: '' !important; position: absolute !important; bottom: 0 !important; left: 0 !important; right: 0 !important; height: 1px !important; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent) !important; }
        .wallu-close { width: 36px !important; height: 36px !important; padding: 8px !important; border-radius: 12px !important; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important; cursor: pointer !important; color: rgba(255,255,255,0.9) !important; background: rgba(255,255,255,0.15) !important; }
        .wallu-close:hover { color: white !important; background: rgba(255,255,255,0.25) !important; transform: scale(1.08) !important; }
        
        .wallu-messages { flex: 1 !important; overflow-y: auto !important; padding: 24px !important; scroll-behavior: smooth !important; }
        .wallu-messages::-webkit-scrollbar { width: 4px !important; }
        .wallu-messages::-webkit-scrollbar-track { background: transparent !important; }
        .wallu-messages::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1) !important; border-radius: 2px !important; }
        .wallu-messages > * + * { margin-top: 20px !important; }
        
        .wallu-msg { display: flex !important; animation: wallu-slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) !important; }
        .wallu-msg.user { justify-content: flex-end !important; }
        .wallu-msg-bubble { max-width: 280px !important; padding: 14px 18px !important; border-radius: 20px !important; word-wrap: break-word !important; line-height: 1.5 !important; font-size: 15px !important; }
        .wallu-msg.user .wallu-msg-bubble { color: white !important; box-shadow: 0 4px 16px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.1) !important; }
        .wallu-msg.bot { align-items: flex-start !important; }
        .wallu-msg.bot > * + * { margin-left: 10px !important; }
        .wallu-avatar { width: 38px !important; height: 38px !important; border-radius: 50% !important; display: flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important; margin-top: 2px !important; font-weight: 700 !important; font-size: 13px !important; box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important; letter-spacing: -0.02em !important; }
        .wallu-msg.bot .wallu-msg-bubble { background: ${theme.surface} !important; color: ${theme.text} !important; box-shadow: 0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04) !important; border: 1px solid rgba(0,0,0,0.06) !important; }
        .wallu-msg.error .wallu-msg-bubble { background: ${theme.error}15 !important; color: ${theme.error} !important; border: 1px solid ${theme.error}30 !important; }
        
        .wallu-typing { padding: 0 20px 12px !important; display: none !important; align-items: center !important; }
        .wallu-typing > * + * { margin-left: 10px !important; }
        .wallu-typing.show { display: flex !important; }
        .wallu-typing-dots { background: ${theme.surface} !important; border-radius: 20px !important; padding: 14px 18px !important; display: flex !important; align-items: center !important; box-shadow: 0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04) !important; border: 1px solid rgba(0,0,0,0.06) !important; }
        .wallu-typing-dots > * + * { margin-left: 4px !important; }
        .wallu-typing-dot { width: 7px !important; height: 7px !important; background: ${theme.textSecondary} !important; border-radius: 50% !important; animation: wallu-typing 1.6s infinite ease-in-out !important; }
        .wallu-typing-dot:nth-child(2) { animation-delay: 0.2s !important; }
        .wallu-typing-dot:nth-child(3) { animation-delay: 0.4s !important; }
        .wallu-input { padding: 24px !important; backdrop-filter: blur(16px) !important; display: flex !important; align-items: center !important; gap: 14px !important;}
        .wallu-input input {
          flex: 1 !important; border: none !important; border-radius: 14px !important; padding: 14px 18px !important; outline: none !important; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; background: ${theme.inputBg} !important; box-shadow: 0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04) !important; font-size: 15px !important; color: ${theme.text} !important; font-weight: 400 !important;
        }
        .wallu-input input:focus { box-shadow: 0 0 0 4px ${theme.primary}25, 0 4px 20px rgba(0,0,0,0.1), 0 0 0 1px ${theme.primary} !important; }
        .wallu-input input::placeholder { color: ${theme.textSecondary} !important; opacity: 0.8 !important; }
        .wallu-send {
          height: 52px !important; width: 52px !important; display: flex !important; align-items: center !important; justify-content: center !important; border: none !important;
          padding: 14px !important; border-radius: 14px !important; color: white !important; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important; cursor: pointer !important; box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
        }
        .wallu-send:hover:not(:disabled) { transform: scale(1.08) !important; box-shadow: 0 8px 24px rgba(0,0,0,0.18) !important; }
        .wallu-send:disabled { opacity: 0.4 !important; cursor: not-allowed !important; background: ${theme.textSecondary} !important; transform: none !important; }
        
        .wallu-mobile { position: fixed !important; inset: 0 !important; z-index: 1000000 !important; display: none !important; flex-direction: column !important; backdrop-filter: blur(8px) !important; background: rgba(0,0,0,0.3) !important; }
        .wallu-mobile.show { display: flex !important; animation: wallu-fadeIn 0.2s ease-out !important; }
        .wallu-mobile .wallu-avatar { background: ${theme.primary} !important; color: white !important; }
        
        .wallu-pos-br { bottom: 20px !important; right: 20px !important; }
        .wallu-pos-bl { bottom: 20px !important; left: 20px !important; }
        .wallu-window.right { right: 20px !important; }
        .wallu-window.left { left: 20px !important; }
        
        .wallu-link { text-decoration: underline !important; color: ${theme.primary} !important; transition: all 0.2s ease !important; }
        .wallu-link:hover { text-decoration: none !important; opacity: 0.8 !important; }
        
        .wallu-attachment-msg { margin-top: 8px !important; }
        .wallu-attachment-msg.bot { margin-left: 20px !important; }
        .wallu-attachment-msg.user { justify-content: flex-end !important; }
        .wallu-image-attachment { text-align: center !important; max-width: 280px !important; }
        .wallu-file-attachment { max-width: 280px !important; }
        .wallu-file-attachment:hover { transform: translateY(-1px) !important; box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important; }
        
        @media (max-width: 767px) {
          .wallu-mobile-hidden { display: none !important; }
        }
    `;
  document.head.appendChild(styles);

  // Position classes
  const positionClass = WALLU_CONFIG.position === 'bottom-left' ? 'wallu-pos-bl' : 'wallu-pos-br';
  const windowClass = WALLU_CONFIG.position.includes('right') ? 'right' : 'left';

  // Create widget HTML
  const widgetHTML = `
        <div id="walluWidget" class="wallu-widget">
            <button id="walluChatButton" class="wallu-btn ${positionClass}" style="background: linear-gradient(to right, ${theme.primary}, ${theme.secondary}); color: white;">
                <div id="walluNotificationBadge" class="wallu-btn-badge" style="visibility: hidden;">0</div>
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
            </button>

            <div id="walluChatWindow" class="wallu-window ${windowClass}" style="background: ${theme.surface};">
                <div class="wallu-header" style="background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary});">
                    <div>
                        <h3 style="font-size: 18px; font-weight: 600; margin: 0;">${WALLU_CONFIG.botName}</h3>
                        <p style="font-size: 14px; margin: 4px 0 0; color: rgba(255,255,255,0.8);">How can we help you?</p>
                    </div>
                    <button id="walluCloseButton" class="wallu-close">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                        </svg>
                    </button>
                </div>

                <!-- Messages appear here -->
                <div id="walluChatMessages" class="wallu-messages"></div>

                <div id="walluTypingIndicator" class="wallu-typing">
                    <div class="wallu-avatar" style="background: ${theme.primary}20; color: ${theme.primary};">${WALLU_CONFIG.botAvatar}</div>
                    <div class="wallu-typing-dots">
                        <div class="wallu-typing-dot"></div>
                        <div class="wallu-typing-dot"></div>
                        <div class="wallu-typing-dot"></div>
                    </div>
                </div>

                <div class="wallu-input">
                    <input id="walluMessageInput" type="text" placeholder="${WALLU_CONFIG.fieldPlaceholder}" autocomplete="off" spellcheck="false">
                    <button id="walluSendButton" class="wallu-send" disabled style="background: ${theme.primary};">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div id="walluMobileOverlay" class="wallu-mobile wallu-mobile-hidden" style="background: ${theme.surface};">
                <div class="wallu-header" style="background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary});">
                    <div>
                        <h3 style="font-size: 18px; font-weight: 600; margin: 0;">${WALLU_CONFIG.botName}</h3>
                        <p style="font-size: 14px; margin: 4px 0 0; color: rgba(255,255,255,0.8);">How can we help you?</p>
                    </div>
                    <button id="walluMobileCloseButton" class="wallu-close">
                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                        </svg>
                    </button>
                </div>
                
                <div id="walluMobileMessages" class="wallu-messages"></div>
                
                <div id="walluMobileTypingIndicator" class="wallu-typing">
                    <div class="wallu-avatar" style="background: ${theme.primary}20; color: ${theme.primary};">${WALLU_CONFIG.botAvatar}</div>
                    <div class="wallu-typing-dots">
                        <div class="wallu-typing-dot"></div>
                        <div class="wallu-typing-dot"></div>
                        <div class="wallu-typing-dot"></div>
                    </div>
                </div>
                
                <div class="wallu-input">
                    <input id="walluMobileMessageInput" type="text" placeholder="${WALLU_CONFIG.fieldPlaceholder}" autocomplete="off" spellcheck="false">
                    <button id="walluMobileSendButton" class="wallu-send" disabled style="background: ${theme.primary};">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;

  // Initialize when DOM is ready
  function initWallu() {
    // Add widget to page
    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // Initialize widget class
    window.walluChatWidget = new WalluChatWidget(WALLU_CONFIG, theme);

    // Expose config for demo overrides (advanced users only)
    window.walluChatWidget.config = WALLU_CONFIG;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWallu);
  } else {
    initWallu();
  }

})();

console.log('🚀 Wallu AI Chat Widget loaded successfully!');
console.log('📝 Configure your API key in the WALLU_CONFIG object');
console.log('🎨 Choose a theme by changing the "theme" property');
console.log('📚 Visit https://wallubot.com/widget-help for more info');
