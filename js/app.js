/* ====================================
   ShoreSquad - Main Application Script
   ==================================== */

// ====================================
// SERVICE WORKER REGISTRATION (PWA)
// ====================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('SW registered', reg))
            .catch(err => console.log('SW registration failed:', err));
    });
}

// ====================================
// STATE MANAGEMENT
// ====================================

const AppState = {
    userLocation: null,
    events: [],
    crew: [],
    weather: null,
    map: null,

    init() {
        this.loadFromLocalStorage();
    },

    loadFromLocalStorage() {
        const saved = localStorage.getItem('shoresquad-data');
        if (saved) {
            const data = JSON.parse(saved);
            this.events = data.events || [];
            this.crew = data.crew || [];
        }
    },

    save() {
        localStorage.setItem('shoresquad-data', JSON.stringify({
            events: this.events,
            crew: this.crew
        }));
    }
};

// ====================================
// MAP FUNCTIONALITY
// ====================================

const MapManager = {
    map: null,
    markers: [],

    init() {
        // Initialize Leaflet map centered on default location
        this.map = L.map('map').setView([37.7749, -122.4194], 12);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);

        AppState.map = this.map;
        this.renderEventMarkers();
    },

    renderEventMarkers() {
        // Clear existing markers
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];

        // Add markers for each cleanup event
        AppState.events.forEach(event => {
            const marker = L.marker([event.lat, event.lng], {
                title: event.name
            })
                .bindPopup(`
                    <strong>${event.name}</strong><br>
                    ${event.date}<br>
                    <button onclick="MapManager.zoomToEvent(${event.lat}, ${event.lng})" class="btn btn-primary">Details</button>
                `)
                .addTo(this.map);

            this.markers.push(marker);
        });
    },

    addEvent(name, lat, lng, date) {
        const event = { id: Date.now(), name, lat, lng, date };
        AppState.events.push(event);
        AppState.save();
        this.renderEventMarkers();
        return event;
    },

    zoomToEvent(lat, lng) {
        this.map.setView([lat, lng], 15);
    },

    locateUser() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    AppState.userLocation = { lat: latitude, lng: longitude };
                    this.map.setView([latitude, longitude], 13);

                    // Add user marker
                    L.marker([latitude, longitude], {
                        title: 'Your Location',
                        icon: L.icon({
                            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        })
                    }).addTo(this.map)
                        .bindPopup('📍 Your Location')
                        .openPopup();

                    console.log('User located:', latitude, longitude);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    alert('Unable to get your location. Please check browser permissions.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    }
};

// ====================================
// WEATHER FUNCTIONALITY
// ====================================

const WeatherManager = {
    apiKey: 'demo', // Replace with actual API key from openweathermap.org

    async fetchWeather(lat = 37.7749, lng = -122.4194) {
        try {
            // Using Open-Meteo (free, no API key required)
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit`
            );
            const data = await response.json();
            const current = data.current;

            const weather = {
                temp: Math.round(current.temperature_2m),
                condition: this.getWeatherCondition(current.weather_code),
                windSpeed: Math.round(current.wind_speed_10m),
                location: 'Current Location'
            };

            AppState.weather = weather;
            this.renderWeather(weather);
        } catch (error) {
            console.error('Weather fetch error:', error);
            this.renderWeatherError();
        }
    },

    getWeatherCondition(code) {
        const conditions = {
            0: '☀️ Clear',
            1: '🌤️ Mostly Clear',
            2: '⛅ Partly Cloudy',
            3: '☁️ Overcast',
            45: '🌫️ Foggy',
            48: '🌫️ Foggy',
            51: '🌧️ Light Drizzle',
            53: '🌧️ Moderate Drizzle',
            55: '🌧️ Heavy Drizzle',
            61: '🌧️ Light Rain',
            63: '🌧️ Moderate Rain',
            65: '⛈️ Heavy Rain',
            80: '🌧️ Light Showers',
            81: '⛈️ Moderate Showers',
            82: '⛈️ Violent Showers',
            95: '⛈️ Thunderstorm'
        };
        return conditions[code] || '🌡️ Unknown';
    },

    renderWeather(weather) {
        const widget = document.getElementById('weather-widget');
        widget.innerHTML = `
            <div class="weather-card fade-in">
                <h3>Weather at Your Location</h3>
                <div class="weather-condition">${weather.condition}</div>
                <div class="weather-temp">${weather.temp}°F</div>
                <p style="color: #666; font-size: 0.9rem;">Wind: ${weather.windSpeed} mph</p>
                <p style="color: #999; font-size: 0.85rem; margin: 0;">Good conditions for beach cleanup!</p>
            </div>
        `;
    },

    renderWeatherError() {
        const widget = document.getElementById('weather-widget');
        widget.innerHTML = `
            <div class="weather-card">
                <p>Unable to fetch weather data. Please refresh or try again later.</p>
            </div>
        `;
    }
};

// ====================================
// CREW MANAGEMENT
// ====================================

const CrewManager = {
    addCrewMember(name, avatar) {
        const member = {
            id: Date.now(),
            name,
            avatar,
            joinedDate: new Date().toLocaleDateString()
        };
        AppState.crew.push(member);
        AppState.save();
        this.renderCrew();
        return member;
    },

    renderCrew() {
        const crewList = document.getElementById('crew-list');
        
        if (AppState.crew.length === 0) {
            crewList.innerHTML = `
                <div class="crew-card">
                    <img src="https://via.placeholder.com/80" alt="Crew member avatar">
                    <h3>Add Your First Member</h3>
                    <p>Invite friends to join your cleanup crew</p>
                    <button class="btn btn-primary" onclick="CrewManager.showAddMemberForm()">+ Add Member</button>
                </div>
            `;
            return;
        }

        crewList.innerHTML = AppState.crew.map(member => `
            <div class="crew-card fade-in">
                <img src="${member.avatar}" alt="${member.name}" class="crew-avatar">
                <h3>${member.name}</h3>
                <p style="font-size: 0.85rem; color: #999;">Joined ${member.joinedDate}</p>
                <button class="btn btn-secondary" onclick="CrewManager.removeMember(${member.id})">Remove</button>
            </div>
        `).join('');
    },

    showAddMemberForm() {
        const name = prompt('Enter crew member name:');
        if (name) {
            this.addCrewMember(name, `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`);
        }
    },

    removeMember(id) {
        AppState.crew = AppState.crew.filter(member => member.id !== id);
        AppState.save();
        this.renderCrew();
    }
};

// ====================================
// EVENT MANAGEMENT
// ====================================

const EventManager = {
    addEvent(name, date, location, lat, lng) {
        const event = {
            id: Date.now(),
            name,
            date,
            location,
            lat,
            lng,
            attendees: 1,
            createdDate: new Date().toLocaleDateString()
        };
        AppState.events.push(event);
        AppState.save();
        MapManager.renderEventMarkers();
        this.renderEvents();
        return event;
    },

    renderEvents() {
        const eventsList = document.getElementById('events-list');

        if (AppState.events.length === 0) {
            eventsList.innerHTML = `
                <div class="event-card">
                    <h3>No events yet</h3>
                    <p>Create or join a cleanup event to get started!</p>
                    <button class="btn btn-primary" onclick="EventManager.showCreateEventForm()">Create Event</button>
                </div>
            `;
            return;
        }

        eventsList.innerHTML = AppState.events.map(event => `
            <div class="event-card fade-in">
                <h3>${event.name}</h3>
                <div class="event-meta">
                    <span>📅 ${event.date}</span>
                    <span>📍 ${event.location}</span>
                    <span>👥 ${event.attendees} attending</span>
                </div>
                <p style="margin-top: 1rem; margin-bottom: 1rem;">Join this cleanup to make a difference!</p>
                <div style="display: flex; gap: 1rem;">
                    <button class="btn btn-primary" onclick="EventManager.joinEvent(${event.id})">Join Event</button>
                    <button class="btn btn-secondary" onclick="EventManager.removeEvent(${event.id})">Delete</button>
                </div>
            </div>
        `).join('');
    },

    showCreateEventForm() {
        const name = prompt('Cleanup event name:');
        if (!name) return;

        const date = prompt('Date (YYYY-MM-DD):');
        if (!date) return;

        const location = prompt('Location name:');
        if (!location) return;

        // For demo, use random coordinates near San Francisco
        const lat = 37.7749 + (Math.random() - 0.5) * 0.5;
        const lng = -122.4194 + (Math.random() - 0.5) * 0.5;

        this.addEvent(name, date, location, lat, lng);
        alert('Event created! Check the map to see it.');
    },

    joinEvent(id) {
        const event = AppState.events.find(e => e.id === id);
        if (event) {
            event.attendees++;
            AppState.save();
            this.renderEvents();
            alert(`You've joined ${event.name}!`);
        }
    },

    removeEvent(id) {
        AppState.events = AppState.events.filter(event => event.id !== id);
        AppState.save();
        MapManager.renderEventMarkers();
        this.renderEvents();
    }
};

// ====================================
// NAVIGATION MENU
// ====================================

const Navigation = {
    init() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');

        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
};

// ====================================
// EVENT LISTENERS
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize app state
    AppState.init();

    // Initialize navigation
    Navigation.init();

    // Initialize map
    setTimeout(() => {
        MapManager.init();
    }, 100);

    // Fetch weather for default location
    WeatherManager.fetchWeather(37.7749, -122.4194);

    // Render crew and events
    CrewManager.renderCrew();
    EventManager.renderEvents();

    // Button event listeners
    document.getElementById('getStartedBtn')?.addEventListener('click', () => {
        alert('Welcome to ShoreSquad! Start by exploring the map or creating your first cleanup event.');
        document.getElementById('events-section').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('locateMeBtn')?.addEventListener('click', () => {
        MapManager.locateUser();
        // Fetch weather for user location
        setTimeout(() => {
            if (AppState.userLocation) {
                WeatherManager.fetchWeather(AppState.userLocation.lat, AppState.userLocation.lng);
            }
        }, 1000);
    });

    document.getElementById('refreshMapBtn')?.addEventListener('click', () => {
        MapManager.renderEventMarkers();
        alert('Map refreshed!');
    });

    // Add some demo data on first load
    if (AppState.events.length === 0) {
        EventManager.addEvent('Ocean Beach Cleanup', '2025-12-15', 'Ocean Beach, SF', 37.7596, -122.5107);
        EventManager.addEvent('Lands End Restoration', '2025-12-22', 'Lands End, SF', 37.7809, -122.5107);
    }

    if (AppState.crew.length === 0) {
        CrewManager.addCrewMember('Alex', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex');
        CrewManager.addCrewMember('Jordan', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan');
    }
});

// ====================================
// PERFORMANCE OPTIMIZATION
// ====================================

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('fade-in');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// Debounce function for window resize
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Handle responsive map resizing
window.addEventListener('resize', debounce(() => {
    if (AppState.map) {
        AppState.map.invalidateSize();
    }
}, 250));

console.log('ShoreSquad app initialized!');