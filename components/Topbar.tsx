'use client';

import React, { useState, useEffect } from 'react';
import { getGreeting } from '@/lib/utils';

interface TopbarProps {
  onMenuClick: () => void;
  modeLabel: string;
}

interface WeatherData {
  temp: string;
  desc: string;
  icon: string;
  city: string;
}

function getWeatherEmoji(desc: string): string {
  const d = desc.toLowerCase();
  if (d.includes('sunny') || (d.includes('clear') && !d.includes('night'))) return '☀️';
  if (d.includes('clear')) return '🌙';
  if (d.includes('thunder') || d.includes('storm')) return '⛈️';
  if (d.includes('blizzard') || d.includes('heavy snow')) return '❄️';
  if (d.includes('snow') || d.includes('sleet')) return '🌨️';
  if (d.includes('heavy rain') || d.includes('torrential')) return '🌧️';
  if (d.includes('rain') || d.includes('drizzle') || d.includes('shower')) return '🌦️';
  if (d.includes('overcast')) return '☁️';
  if (d.includes('cloudy') || d.includes('cloud')) return '⛅';
  if (d.includes('mist') || d.includes('fog') || d.includes('haze')) return '🌫️';
  if (d.includes('wind') || d.includes('breezy')) return '💨';
  return '🌡️';
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick, modeLabel }) => {
  const [greeting, setGreeting] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Live clock + greeting — ticks every second
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDate(
        now.toLocaleDateString('tr-TR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
      setGreeting(getGreeting());
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Weather via wttr.in — free, no API key, auto-detects city by IP
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://wttr.in/Kagithane,Istanbul?format=j1', {
          next: { revalidate: 900 },
        } as RequestInit);
        if (!res.ok) return;
        const data = await res.json();
        const current = data.current_condition?.[0];
        const tempC = current?.temp_C ?? '--';
        const desc = current?.weatherDesc?.[0]?.value ?? '';
        setWeather({ temp: tempC, desc, icon: getWeatherEmoji(desc), city: 'Kağıthane' });
      } catch {
        // silently fail — weather is optional
      }
    };
    fetchWeather();
    const id = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="topbar">
      {/* Hamburger – mobile only */}
      <button className="tb-menu" onClick={onMenuClick}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Left: greeting + title */}
      <div className="tb-ctx">
        <div className="tb-greet">{greeting}</div>
        <div className="tb-title">Portal Yönetim Merkezi</div>
      </div>

      {/* Right: weather + clock + mode pill */}
      <div className="tb-right">
        {/* Weather widget */}
        {weather && (
          <div className="tb-weather-pill" title={weather.desc}>
            <span className="tb-w-icon">{weather.icon}</span>
            <div className="tb-w-info">
              <span className="tb-w-temp">{weather.temp}°C</span>
              {weather.city && (
                <span className="tb-w-city">{weather.city}</span>
              )}
            </div>
          </div>
        )}

        {/* Clock + Date widget */}
        {time && (
          <div className="tb-clock-pill">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="tb-clock-svg"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <div className="tb-clock-info">
              <span className="tb-clock-time">{time}</span>
              {date && <span className="tb-clock-date">{date}</span>}
            </div>
          </div>
        )}

        {/* Mode pill */}
        <div className="mpill">
          <span className="mdot" />
          <span>{modeLabel}</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
