# Wallu AI Chat Widget

Extend your Discord AI assistant to your website! A modern chat widget that gives your website visitors access to the same AI that helps your Discord community.
No separate training needed - your Discord knowledge automatically powers your website support.

Perfect for Discord communities wanting to provide consistent AI assistance across platforms.

## 🚀 Features

- 🔗 **Discord Extension** - Same AI assistant from your Discord server, now on your website
- 🧠 **Unified Knowledge** - No separate training needed - uses your existing Discord knowledge base
- 📱 **Mobile Responsive** - Works perfectly on desktop, tablet, and mobile devices
- 🎨 **Highly Customizable** - 5 built-in themes plus easy color customization
- ⚡ **Ultra-Simple Setup** - Download one file, configure API key, done!
- 🔒 **Secure** - Uses public API keys that only allow message sending
- 📊 **Discord Integration** - Optional webhook logging to track conversations

## 🎯 Perfect For

- Discord communities wanting to extend their AI to their website
- Gaming servers with websites that need consistent support
- SaaS products that use Discord for community support
- Content creators with both Discord and website presence
- Any business that has built up knowledge in Discord and wants to share it with website visitors

## 📦 Installation - Simple as it gets!

### 🚀 Super Simple Setup (Recommended)

**3 steps to extend your Discord AI to your website:**

1. **Download** the `wallu-widget.js` file to your website's folder
2. **Configure** your API key and theme inside the file (takes 30 seconds)
3. **Add** one line to your website: `<script src="./wallu-widget.js"></script>`

That's it! Your Discord AI is now available on your website. 🎉

### 🎮 Try the Live Demo First!

**Experience your future Discord-powered website support:**

1. Open `demo.html` in your browser (or visit our demo site)
2. Chat with the AI - it's the same one helping Discord communities
3. See how it would look on your website
4. Then download `wallu-widget.js` and set up your own!

### 🔑 Get Your API Key

1. Visit [Wallu Panel - Addons](https://panel.wallubot.com/addons)
2. Create a new **public** API key (starts with `pk_`)
3. Copy your API key and use it in your chosen installation method

## ⚙️ Configuration Made Simple

### 30-second installation

```html
<script>
    // Configure your API key BEFORE loading the widget
    window.WALLU_CONFIG = {
        apiKey: 'pk_your_actual_key_here', // 🔑 REQUIRED: Get from https://panel.wallubot.com/addons
        theme: 'gaming',
    }
</script>
<script src="https://cdn.jsdelivr.net/gh/toppev/wallu-web-widget/wallu-widget.js"></script>
```

### Fully customizable (download & edit `wallu-widget.js`)

TIP: Ask AI (Claude or ChatGPT) to customize the widget!

Open `wallu-widget.js` and update the `WALLU_CONFIG` section:

```javascript
const WALLU_CONFIG = {
    // 🔑 REQUIRED: Get this from https://panel.wallubot.com/addons
    apiKey: 'pk_your_actual_key_here',

    // 🎨 THEME: Pick one that matches your brand
    theme: 'discord', // 'discord', 'corporate', 'tech', 'gaming', 'minimal'

    // 📝 OPTIONAL: Customize the experience
    botName: 'AI Assistant',
    welcomeMessage: 'Hey! I\'m here to help with the same knowledge from our Discord.',
    position: 'bottom-right', // or 'bottom-left'

    // 🔗 OPTIONAL: Log conversations to Discord
    // discordWebhook: 'https://discord.com/api/webhooks/YOUR_WEBHOOK_URL',
};
```

### 🎛️ Advanced Configuration

**Custom Bot Instructions per Channel:**  
You can set specific instructions for your AI assistant for different parts of your website by configuring channels in
the [Wallu Panel - Channels](https://panel.wallubot.com/channels). This allows you to have different bot behavior on different pages or sections of your site.

**Examples:**

- **Homepage**: General welcome and company info
- **Support Page**: Technical troubleshooting focus
- **Sales Page**: Product-focused responses
- **Documentation**: Code examples and technical details

## 🔧 Platform-Specific Installation

### WordPress

**Option 1: No file editing (Recommended)**

1. Use a plugin like "Insert Headers and Footers"
2. Add to Footer section:
   ```html
   <script>
   // Configure your API key BEFORE loading the widget
   window.WALLU_CONFIG = {
       apiKey: 'pk_your_actual_key_here', // 🔑 REQUIRED: Get from https://panel.wallubot.com/addons
       theme: 'corporate',
       botName: 'Support Assistant'
   };
   </script>
   <script src="https://cdn.jsdelivr.net/gh/toppev/wallu-web-widget/wallu-widget.js"></script>
   ```

**Option 2: Download and configure**

1. Download `wallu-widget.js` to your theme folder or upload via Media Library
2. Configure your API key in the `wallu-widget.js` file
3. Add this to your theme's `functions.php` or use "Insert Headers and Footers":
   ```html
   <script src="./wallu-widget.js"></script>
   ```

### Shopify

1. Upload `wallu-widget.js` to your theme assets folder
2. Open `layout/theme.liquid`
3. Add before `</body>`:
   ```html
   <script src="{{ 'wallu-widget.js' | asset_url }}"></script>
   ```
4. Configure your API key in the uploaded file and save

### Squarespace

**⚠️ Important: Configure your API key first!**

1. Go to Settings → Advanced → Code Injection
2. Add to Footer section:
   ```html
   <script>
   // Configure your API key BEFORE loading the widget
   window.WALLU_CONFIG = {
       apiKey: 'pk_your_actual_key_here', // 🔑 REQUIRED: Get from https://panel.wallubot.com/addons
       theme: 'corporate',
       botName: 'AI Assistant'
   };
   </script>
   <script src="https://cdn.jsdelivr.net/gh/toppev/wallu-web-widget/wallu-widget.js"></script>
   ```
3. Save changes

### Wix

**⚠️ Important: Configure your API key first!**

1. Go to Settings → Custom Code
2. Add new code → Body - end
3. Add this code:
   ```html
   <script>
   // Configure your API key BEFORE loading the widget
   window.WALLU_CONFIG = {
       apiKey: 'pk_your_actual_key_here', // 🔑 REQUIRED: Get from https://panel.wallubot.com/addons
       theme: 'minimal',
       botName: 'AI Assistant'
   };
   </script>
   <script src="https://cdn.jsdelivr.net/gh/toppev/wallu-web-widget/wallu-widget.js"></script>
   ```
4. Apply to all pages

### React/Next.js

**Option 1: Configure API key via window.WALLU_CONFIG (Recommended)**

```jsx
import { useEffect } from 'react';

export default function ChatWidget() {
    useEffect(() => {
        // Configure your API key BEFORE loading the widget
        window.WALLU_CONFIG = {
            apiKey: 'pk_your_actual_key_here', // 🔑 REQUIRED: Get from https://panel.wallubot.com/addons
            theme: 'discord',
            botName: 'AI Assistant',
            welcomeMessage: 'Hey! I\'m here to help with the same knowledge from our Discord.'
        };

        // Load the Wallu widget
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/gh/toppev/wallu-web-widget/wallu-widget.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return null; // Widget renders itself
}
```

**Option 2: Download and configure wallu-widget.js**

1. Download `wallu-widget.js` to your `/public` folder
2. Edit the `WALLU_CONFIG` section inside the file to set your API key
3. Use this component:

```jsx
import { useEffect } from 'react';

export default function ChatWidget() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = '/wallu-widget.js'; // Local file with your API key configured
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return null;
}
```

### HTML/Static Sites

**Option 1: Configure API key via window.WALLU_CONFIG (No downloading & editing wallu_widget.js)**

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Site</title>
</head>
<body>
<!-- Your site content -->

<!-- Wallu Chat Widget -->
<script>
// Configure your API key BEFORE loading the widget
window.WALLU_CONFIG = {
    apiKey: 'pk_your_actual_key_here', // 🔑 REQUIRED: Get from https://panel.wallubot.com/addons
    theme: 'discord',
    botName: 'AI Assistant',
    welcomeMessage: 'Hello! How can I help you today?'
};
</script>
<script src="https://cdn.jsdelivr.net/gh/toppev/wallu-web-widget/wallu-widget.js"></script>
</body>
</html>
```

**Option 2: Download and configure wallu-widget.js**

1. Download `wallu-widget.js` to your website folder
2. Open the file and edit the `WALLU_CONFIG` section to set your API key
3. Add one line before closing `</body>` tag:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Site</title>
</head>
<body>
<!-- Your site content -->

<!-- Wallu Chat Widget -->
<script src="./wallu-widget.js"></script>
</body>
</html>
```

## 🎨 Customization Guide

### Colors and Theming

```javascript
// Custom color themes
const themes = {
    blue: { primaryColor: '3b82f6' },
    green: { primaryColor: '10b981' },
    purple: { primaryColor: '8b5cf6' },
    red: { primaryColor: 'ef4444' },
    custom: { primaryColor: 'your-hex-color' }
};
```

### Messages and Content

```javascript
// Customize all text content
new WalluChatWidget({
    botName: 'Your Bot Name',
    botAvatar: 'AI', // Or emoji like '🤖'
    welcomeMessage: 'Custom welcome message here!',
    placeholderText: 'Type your question...',
    // ... other options
});
```

## 🔒 Security & API Keys

### Public vs Private Keys

- ✅ **Public keys** (`pk_*`) - Safe to use in frontend code
    - Only allow sending messages to the API (just like user messages on Discord)
    - Cannot modify bot settings
    - Perfectly fine to include in your website code

- ❌ **Private keys** - Never use in frontend
    - Allow full access to your bot settings
    - Can modify documents, settings, etc.
    - Keep these server-side only

### Rate Limiting & Abuse Prevention

- The API has built-in rate limiting
- Consider implementing client-side rate limiting for heavy traffic sites
- Discord webhook logging helps monitor for abuse
- Public keys have limited scope to minimize abuse potential

## 📊 Discord Integration

### Webhook Logging (Optional)

Track conversations in Discord:

1. Create a Discord webhook in your server
2. Add the webhook URL to your widget config
3. All conversations will be logged to that channel

```javascript
new WalluChatWidget({
    discordWebhook: 'https://discord.com/api/webhooks/123/abc...',
    // ... other config
});
```

## 🛠️ Development & Customization

### File Structure

```
wallu-web-widget/
├── wallu-widget.js    # 🚀 Ultra-simple one-file installation (RECOMMENDED)
├── demo.html          # 🎮 Live demo page with Discord theme
├── index.html         # 📋 HTML template with theme presets  
└── README.md          # 📚 This documentation
```

### Making Changes

1. Fork this repository
2. Modify `index.html` as needed
3. Test thoroughly on different devices
4. Submit a pull request (optional)

### AI Assistant Help

Need help customizing or integrating? Ask Claude or ChatGPT:

> "Help me integrate the Wallu chat widget into my [platform] website and customize it to match my brand colors [colors] and change the welcome message
> to [message]."

## ❓ Troubleshooting

### Common Issues

**Widget not appearing:**

- Check browser console for JavaScript errors
- Verify API key format (should start with `pk_`)
- Ensure proper HTML structure

**API not responding:**

- Verify your API key is active at [panel.wallubot.com](https://panel.wallubot.com/addons)
- Check network connectivity
- Look for CORS issues in browser console

**Mobile display issues:**

- Test responsive design on actual devices
- Check CSS media queries
- Verify touch event handling

**Styling conflicts:**

- Use more specific CSS selectors
- Add `!important` to custom styles
- Check for conflicting CSS frameworks

### Getting Help

1. Check [Wallu Documentation](https://wallubot.com/developers)
2. Join our [Discord Community](https://discord.gg/wallubot)
3. Contact support via the widget itself (meta!)
4. Ask Claude or ChatGPT for coding help

## 🤝 Contributing

We welcome contributions! Areas where you can help:

- Platform-specific integration guides
- Theme templates and presets
- Bug fixes and improvements
- Documentation enhancements

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Links

- [Wallu AI Website](https://wallubot.com)
- [Developer Documentation](https://wallubot.com/developers)
- [API Reference](https://api.wallubot.com/docs)
- [Discord Community](https://discord.gg/wallubot)

---

**Made with ❤️ for Discord communities**

Transform your website visitors into engaged community members with AI-powered support that connects directly to your Discord knowledge base.
