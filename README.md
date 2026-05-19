# Hover Vertical Tabs

A Chrome extension that **expands the vertical tab panel on hover** — no click required.  
Just move your mouse to the left edge to instantly preview and switch between tabs, even when the panel is collapsed.

---

## Screenshots

### Default state (collapsed)
A semi-transparent handle sits quietly on the left edge, keeping the page unobstructed.

![Collapsed](docs/screenshot_collapsed.png)

### On hover (panel expanded)
Moving the mouse over the handle smoothly slides in the full tab list.

![Expanded](docs/screenshot_expanded.png)

---

## Features

| Action | Result |
|--------|--------|
| Hover over the left edge | Tab panel expands |
| Click a tab | Switch to that tab |
| Click × | Close the tab |
| Move mouse away | Panel closes automatically |

- Automatic dark / light theme support
- Localized UI — English and Japanese based on browser language

---

## Requirements

- Google Chrome 114 or later

---

## Installation

Until a Chrome Web Store release is available, load the extension manually in developer mode.

1. Clone the repository (or download and unzip)

   ```bash
   git clone https://github.com/<your-username>/hover-tab-panel.git
   ```

2. Open `chrome://extensions/` in Chrome

3. Enable **Developer mode** (toggle in the top-right corner)

4. Click **Load unpacked** and select the cloned folder

---

## Usage

1. Optionally enable Chrome's built-in vertical tabs and collapse the panel
2. Open any webpage
3. Move your mouse to the **left edge of the content area**
4. Click the tab you want to switch to
5. Move the mouse away to close the panel

> **Note**  
> This extension cannot directly control Chrome's native vertical tab panel (browser UI is off-limits to extensions). Instead, it renders an overlay inside the page content area. It works alongside Chrome's vertical tabs or as a standalone tab switcher.

---

## File structure

```
hover-tab-panel/
├── manifest.json        # Extension config (Manifest V3)
├── background.js        # Tab query, switch, and close handlers
├── content.js           # Hover panel DOM and event logic
├── content.css          # Panel styles (dark & light theme)
├── icon16.png
├── icon48.png
├── icon128.png
└── _locales/
    ├── en/messages.json # English strings
    └── ja/messages.json # Japanese strings
```

---

## License

[MIT](LICENSE)
