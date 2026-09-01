'use client';

import React, { useState, useEffect, useRef } from 'react';

interface CityConfig {
  name: string;
  country: string;
  lat: number;
  lon: number;
  flag: string;
}

const POPULAR_CITIES: CityConfig[] = [
  { name: 'İstanbul (Merkez)', country: 'TR', lat: 41.08, lon: 28.97, flag: '🇹🇷' },
  { name: 'Antalya', country: 'TR', lat: 36.88, lon: 30.70, flag: '🇹🇷' },
  { name: 'Kapadokya', country: 'TR', lat: 38.64, lon: 34.83, flag: '🇹🇷' },
  { name: 'Paris', country: 'FR', lat: 48.85, lon: 2.35, flag: '🇫🇷' },
  { name: 'Dubai', country: 'AE', lat: 25.20, lon: 55.27, flag: '🇦🇪' },
  { name: 'Bangkok', country: 'TH', lat: 13.75, lon: 100.51, flag: '🇹🇭' },
  { name: 'Tokyo', country: 'JP', lat: 35.68, lon: 139.76, flag: '🇯🇵' },
  { name: 'Roma', country: 'IT', lat: 41.90, lon: 12.49, flag: '🇮🇹' },
];

interface WeatherInfo {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  weatherCode: number;
  isDay: boolean;
  desc: string;
  tempMax: number;
  tempMin: number;
  dailyForecast: Array<{
    day: string;
    max: number;
    min: number;
    code: number;
  }>;
}

function getWeatherInterpretation(code: number, isDay: boolean = true): { desc: string; iconType: string } {
  if (code === 0) return { desc: isDay ? 'Açık & Güneşli' : 'Açık Gece', iconType: isDay ? 'sun' : 'moon' };
  if (code === 1 || code === 2) return { desc: isDay ? 'Parçalı Bulutlu' : 'Az Bulutlu Gece', iconType: isDay ? 'partly-cloudy' : 'night-cloudy' };
  if (code === 3) return { desc: 'Kapalı / Bulutlu', iconType: 'cloudy' };
  if (code === 45 || code === 48) return { desc: 'Sisli / Puslu', iconType: 'fog' };
  if (code >= 51 && code <= 55) return { desc: 'Çiseleyen Yağmur', iconType: 'drizzle' };
  if (code >= 61 && code <= 65) return { desc: 'Yağmurlu', iconType: 'rain' };
  if (code >= 71 && code <= 77) return { desc: 'Karlı', iconType: 'snow' };
  if (code >= 80 && code <= 82) return { desc: 'Sağanak Yağış', iconType: 'rain-heavy' };
  if (code >= 85 && code <= 86) return { desc: 'Kar Sağanağı', iconType: 'snow' };
  if (code >= 95 && code <= 99) return { desc: 'Gök Gürültülü Fırtına', iconType: 'thunder' };
  return { desc: 'Normal', iconType: isDay ? 'sun' : 'cloudy' };
}

function WeatherIcon({ iconType, size = 18 }: { iconType: string; size?: number }) {
  if (iconType === 'sun') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="w-svg-sun">
        <circle cx="12" cy="12" r="5" fill="#F59E0B" />
        <g stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </g>
      </svg>
    );
  }
  if (iconType === 'moon') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#818CF8" fillOpacity="0.2" />
      </svg>
    );
  }
  if (iconType === 'partly-cloudy') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="w-svg-cloud">
        <circle cx="9" cy="9" r="4" fill="#FBBF24" />
        <path d="M7 16a4 4 0 0 1 0-8 5 5 0 0 1 9.9 1A3.5 3.5 0 0 1 18 16H7z" fill="#94A3B8" />
      </svg>
    );
  }
  if (iconType === 'rain' || iconType === 'rain-heavy' || iconType === 'drizzle') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="w-svg-rain">
        <path d="M17.5 14a4.5 4.5 0 0 0-4-6.9 6 6 0 0 0-11 2.9 4.5 4.5 0 0 0 4 4h11z" fill="#64748B" />
        <line x1="8" y1="17" x2="7" y2="21" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="17" x2="11" y2="21" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="17" x2="15" y2="21" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (iconType === 'thunder') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M17.5 13a4.5 4.5 0 0 0-4-6.9 6 6 0 0 0-11 2.9 4.5 4.5 0 0 0 4 4h11z" fill="#475569" />
        <polygon points="13 13 10 18 13 18 11 23 16 16 13 16" fill="#FACC15" />
      </svg>
    );
  }
  if (iconType === 'snow') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#7DD3FC" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="5" y1="5" x2="19" y2="19" />
        <line x1="5" y1="19" x2="19" y2="5" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M17.5 16a4.5 4.5 0 0 0-4-6.9 6 6 0 0 0-11 2.9 4.5 4.5 0 0 0 4 4h11z" fill="#94A3B8" />
    </svg>
  );
}

export const WeatherWidget: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityConfig>(POPULAR_CITIES[0]);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [gpsActive, setGpsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch weather data from Open-Meteo High Precision API
  const fetchWeather = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Weather API error');
      const data = await res.json();

      const current = data.current;
      const daily = data.daily;
      const code = current.weather_code ?? 0;
      const isDay = current.is_day === 1;
      const inter = getWeatherInterpretation(code, isDay);

      const daysOfWeek = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
      const dailyForecast = (daily.time || []).slice(0, 3).map((tStr: string, idx: number) => {
        const d = new Date(tStr);
        const dayLabel = idx === 0 ? 'Bugün' : idx === 1 ? 'Yarın' : daysOfWeek[d.getDay()];
        return {
          day: dayLabel,
          max: Math.round(daily.temperature_2m_max?.[idx] ?? 0),
          min: Math.round(daily.temperature_2m_min?.[idx] ?? 0),
          code: daily.weather_code?.[idx] ?? 0,
        };
      });

      setWeather({
        temp: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        humidity: current.relative_humidity_2m ?? 0,
        windSpeed: Math.round(current.wind_speed_10m ?? 0),
        precipitation: current.precipitation ?? 0,
        weatherCode: code,
        isDay: isDay,
        desc: inter.desc,
        tempMax: Math.round(daily.temperature_2m_max?.[0] ?? current.temperature_2m),
        tempMin: Math.round(daily.temperature_2m_min?.[0] ?? current.temperature_2m),
        dailyForecast,
      });
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedCity.lat, selectedCity.lon);
    const interval = setInterval(() => {
      fetchWeather(selectedCity.lat, selectedCity.lon);
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedCity]);

  // Handle GPS Auto-Detect
  const handleGPSDetect = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setSelectedCity({
            name: 'Mevcut Konum',
            country: 'GPS',
            lat,
            lon,
            flag: '📍',
          });
          setGpsActive(true);
          fetchWeather(lat, lon);
        },
        () => {
          setLoading(false);
        }
      );
    }
  };

  // Close popup when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentInter = weather ? getWeatherInterpretation(weather.weatherCode, weather.isDay) : { desc: 'Yükleniyor', iconType: 'sun' };

  return (
    <div className="weather-widget-wrapper" ref={containerRef}>
      {/* Weather Pill Button */}
      <button
        type="button"
        className={`weather-pill ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Canlı Hava Durumu & Tahmin Paneli"
      >
        <span className="w-pill-icon">
          <WeatherIcon iconType={currentInter.iconType} size={18} />
        </span>
        <div className="w-pill-info">
          <span className="w-pill-temp">{weather ? `${weather.temp}°C` : '--'}</span>
          <span className="w-pill-city">
            {selectedCity.flag} {selectedCity.name.split(' ')[0]}
          </span>
        </div>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`w-pill-chevron ${isOpen ? 'open' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* High-Tech Weather Popover */}
      {isOpen && (
        <div className="weather-popover">
          {/* Header & Location */}
          <div className="w-pop-head">
            <div className="w-pop-title">
              <span className="w-pop-dot" />
              <span>Canlı Meteoroloji İstasyonu</span>
            </div>
            <button
              type="button"
              className="w-pop-refresh"
              onClick={() => fetchWeather(selectedCity.lat, selectedCity.lon)}
              disabled={loading}
              title="Yenile"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`w-pop-refresh-svg ${loading ? 'spinning' : ''}`}
              >
                <path d="M23 4v6h-6" />
                <path d="M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </button>
          </div>

          {/* Main Weather Card */}
          <div className="w-pop-main">
            <div className="w-pop-main-left">
              <div className="w-pop-hero-icon">
                <WeatherIcon iconType={currentInter.iconType} size={44} />
              </div>
              <div>
                <div className="w-pop-hero-temp">
                  {weather ? `${weather.temp}°` : '--'}
                </div>
                <div className="w-pop-desc">{weather?.desc}</div>
              </div>
            </div>
            <div className="w-pop-main-right">
              <div className="w-pop-stat">
                <span className="w-pop-stat-label">Hissedilen</span>
                <span className="w-pop-stat-val">{weather ? `${weather.feelsLike}°C` : '--'}</span>
              </div>
              <div className="w-pop-stat">
                <span className="w-pop-stat-label">Min / Max</span>
                <span className="w-pop-stat-val">
                  {weather ? `${weather.tempMin}° / ${weather.tempMax}°` : '--'}
                </span>
              </div>
            </div>
          </div>

          {/* Telemetry Metrics (Humidity, Wind, Rain) */}
          <div className="w-pop-metrics">
            <div className="w-metric-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-metric-svg">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
              <div>
                <div className="w-metric-val">%{weather?.humidity ?? '--'}</div>
                <div className="w-metric-lbl">Nem Oranı</div>
              </div>
            </div>
            <div className="w-metric-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-metric-svg">
                <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
              </svg>
              <div>
                <div className="w-metric-val">{weather ? `${weather.windSpeed} km/s` : '--'}</div>
                <div className="w-metric-lbl">Rüzgar Hızı</div>
              </div>
            </div>
            <div className="w-metric-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-metric-svg">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <div>
                <div className="w-metric-val">{weather?.precipitation ? `${weather.precipitation} mm` : '0 mm'}</div>
                <div className="w-metric-lbl">Yağış İhtimali</div>
              </div>
            </div>
          </div>

          {/* 3-Day Forecast */}
          {weather?.dailyForecast && (
            <div className="w-pop-forecast">
              <div className="w-forecast-title">3 Günlük Tahmin</div>
              <div className="w-forecast-grid">
                {weather.dailyForecast.map((f, i) => {
                  const inter = getWeatherInterpretation(f.code, true);
                  return (
                    <div key={i} className="w-forecast-item">
                      <span className="w-f-day">{f.day}</span>
                      <WeatherIcon iconType={inter.iconType} size={20} />
                      <span className="w-f-temp">
                        <strong className="w-f-max">{f.max}°</strong>
                        <span className="w-f-min">{f.min}°</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Destination / City Switcher */}
          <div className="w-pop-cities">
            <div className="w-cities-head">
              <span>Ejder Destinasyonları</span>
              <button type="button" className="w-gps-btn" onClick={handleGPSDetect} title="GPS ile konumumu bul">
                <span>📍 Konumumu Bul</span>
              </button>
            </div>
            <div className="w-cities-chips">
              {POPULAR_CITIES.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  className={`w-city-chip ${selectedCity.name === c.name && !gpsActive ? 'selected' : ''}`}
                  onClick={() => {
                    setGpsActive(false);
                    setSelectedCity(c);
                  }}
                >
                  <span>{c.flag}</span>
                  <span>{c.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
