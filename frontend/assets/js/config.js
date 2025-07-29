// Configuration management for frontend
class Config {
    constructor() {
        this.isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        this.config = this.loadConfig();
    }

    loadConfig() {
        // Default configuration
        const defaultConfig = {
            development: {
                API_BASE_URL: 'http://localhost:8000',
                FRONTEND_URL: 'http://localhost:80'
            },
            production: {
                API_BASE_URL: 'https://api.fobium.com',
                FRONTEND_URL: 'https://www.fobium.com'
            }
        };

        // Return configuration based on environment
        return this.isProduction ? defaultConfig.production : defaultConfig.development;
    }

    get(key) {
        return this.config[key];
    }

    // Getter methods for common configurations
    get apiBaseUrl() {
        return this.config.API_BASE_URL;
    }

    get frontendUrl() {
        return this.config.FRONTEND_URL;
    }

    get isProduction() {
        return this._isProduction;
    }

    set isProduction(value) {
        this._isProduction = value;
    }
}

// Create global config instance
window.CONFIG = new Config();

// Log current configuration (only in development)
if (!window.CONFIG.isProduction) {
    console.log('🔧 Configuration loaded:', window.CONFIG.config);
}
