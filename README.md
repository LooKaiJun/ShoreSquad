# ShoreSquad - Beach Cleanup Social App

🌊 **Rally your crew, track weather, and hit the next beach cleanup with ShoreSquad!**

## Project Overview

ShoreSquad is a web application designed to mobilize young people for beach cleanup initiatives. It combines interactive mapping, real-time weather tracking, and social features to make environmental action fun and connected.

### Key Features
- 🗺️ **Interactive Map**: Find and create beach cleanup events near you
- 🌤️ **Weather Integration**: Real-time conditions to plan your cleanup
- 👥 **Crew Management**: Rally your friends and track team members
- 📱 **Progressive Web App**: Installable and works offline
- ♿ **Accessibility**: WCAG 2.1 AA compliant
- 📱 **Mobile-First**: Optimized for Gen Z users on smartphones

## Design System

### Colour Palette
- **Primary (Ocean Blue)**: `#0073E6` - Trust, energy, and the ocean
- **Secondary (Sunshine)**: `#FFB81C` - Optimism and accessibility
- **Accent (Eco Green)**: `#00B894` - Environmental action
- **Dark Navy**: `#2C3E50` - Professional text and backgrounds
- **Off-White**: `#F8F9FA` - Clean, accessible backgrounds

### Typography
- Font: **Poppins** (Google Fonts)
- Weights: 400 (Regular), 600 (Semibold), 700 (Bold), 800 (Extra Bold)

## Tech Stack

### Frontend
- **HTML5** - Semantic markup with accessibility attributes
- **CSS3** - Modern responsive design with Flexbox/Grid
- **JavaScript (Vanilla)** - No framework bloat, optimal performance
- **Leaflet.js** - Lightweight, open-source mapping

### Libraries & APIs
- **Geolocation API** - User location detection
- **Open-Meteo API** - Free weather data (no API key required)
- **Local Storage API** - Data persistence
- **Service Workers** - PWA offline capabilities
- **Intersection Observer** - Lazy loading images

### Performance Features
- 📦 Lightweight (no heavy frameworks)
- ⚡ Fast load times (Lighthouse target: 90+)
- 🔄 Service Worker caching
- 🖼️ Lazy loading for images
- 📉 Debounced resize events
- 🎯 Event delegation for efficient DOM handling

## Accessibility Features
- ✅ WCAG 2.1 AA compliance
- ✅ Semantic HTML (`<nav>`, `<section>`, `<footer>`, etc.)
- ✅ ARIA labels and live regions
- ✅ High contrast color palette
- ✅ Keyboard navigation support
- ✅ Focus indicators on interactive elements
- ✅ Reduced motion media query support
- ✅ Alt text for all images

## UX Design Principles
- **Mobile-First**: Designed for Gen Z on smartphones
- **Micro-interactions**: Button feedback, loading states, smooth transitions
- **Clear CTAs**: Prominent "Get Started," "Join Cleanup," social sharing buttons
- **Fast Performance**: Snappy interactions, no jank
- **Social Features**: Share crew, events, and achievements
- **Gamification Ready**: Foundation for points, badges, leaderboards

## Project Structure

```
ShoreSquad/
├── index.html              # HTML5 boilerplate
├── css/
│   └── styles.css          # Complete responsive styling
├── js/
│   └── app.js              # Main application logic
├── assets/                 # Images, icons, etc.
├── sw.js                   # Service Worker (PWA)
├── manifest.json           # PWA manifest
├── package.json            # Dependencies & scripts
├── .liveserverrc          # Live Server configuration
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Getting Started

### Prerequisites
- Node.js and npm (for Live Server)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone or extract the project**
```bash
cd ShoreSquad
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

This will open `http://localhost:5500` in your browser.

### Alternative: Direct Opening
Simply open `index.html` in your browser (some features like Service Workers work best over HTTPS or localhost).

## Usage

### Creating Events
1. Click "Create Event" in the Events section
2. Enter event details (name, date, location)
3. Event appears on map with marker

### Locating Yourself
1. Click "📍 Locate Me" button on the map
2. Grant location permission when prompted
3. Map centers on your position

### Checking Weather
- Weather widget updates based on your location
- Open-Meteo API provides real-time conditions
- Includes temperature, wind speed, and conditions

### Managing Crew
1. Click "+ Add Member" to invite friends
2. Avatar generated automatically using Dicebear API
3. Remove members as needed

## Browser Support
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Metrics
- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 3s
- **Cumulative Layout Shift**: < 0.1
- **Lighthouse Score Target**: 90+

## Future Enhancements
- 🔐 Authentication system (Firebase/Auth0)
- 📸 Photo sharing from cleanup events
- 🏆 Gamification (badges, leaderboards, achievements)
- 💬 Real-time chat and notifications
- 📊 Impact tracking (trash collected, CO2 saved)
- 🌍 Multiple language support
- 🤝 Social media integration
- 🗓️ Calendar view for events

## Contributing
This is a demo project. To extend it:

1. Fork or create a new branch
2. Make changes to CSS, JS, or HTML
3. Test on multiple devices
4. Commit with clear messages
5. Submit pull request

## License
MIT License - Feel free to use for educational and commercial projects.

## Credits
- **Design Inspiration**: Mobile-first design trends for Gen Z
- **Libraries**: Leaflet.js, Open-Meteo API, Dicebear API
- **Fonts**: Google Fonts (Poppins)

## Contact & Support
- 📧 Email: info@shoresquad.app
- 🌐 Website: [Coming Soon]
- 📱 Social: [@ShoreSquadApp](https://twitter.com)

---

**Made with 🌊 for beach lovers and environmental warriors!**