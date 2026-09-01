'use client';

import React, { useState, useEffect, useRef } from 'react';

interface WorldTimezone {
  city: string;
  country: string;
  flag: string;
  timeZone: string;
  tag: string;
}

const WORLD_ZONES: WorldTimezone[] = [
  { city: 'İstanbul', country: 'Türkiye', flag: '🇹🇷', timeZone: 'Europe/Istanbul', tag: 'Merkez' },
  { city: 'Londra', country: 'İngiltere', flag: '🇬🇧', timeZone: 'Europe/London', tag: 'UTC+1' },
  { city: 'Dubai', country: 'BAE', flag: '🇦🇪', timeZone: 'Asia/Dubai', tag: 'UTC+4' },
  { city: 'Bangkok', country: 'Tayland', flag: '🇹🇭', timeZone: 'Asia/Bangkok', tag: 'UTC+7' },
  { city: 'Tokyo', country: 'Japonya', flag: '🇯🇵', timeZone: 'Asia/Tokyo', tag: 'UTC+9' },
  { city: 'New York', country: 'ABD', flag: '🇺🇸', timeZone: 'America/New_York', tag: 'UTC-4' },
];

export const ClockWidget: React.FC = () => {
  const [time, setTime] = useState('');
  const [seconds, setSeconds] = useState('');
  const [date, setDate] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [nowDate, setNowDate] = useState<Date>(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setNowDate(now);
      setTime(
        now.toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
      setSeconds(
        now.toLocaleTimeString('tr-TR', {
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
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate day progress percentage
  const hours = nowDate.getHours();
  const minutes = nowDate.getMinutes();
  const totalMinutesInDay = 24 * 60;
  const currentMinutesInDay = hours * 60 + minutes;
  const dayProgress = Math.round((currentMinutesInDay / totalMinutesInDay) * 100);

  // Work hours calculation (09:00 - 18:00 weekdays)
  const dayOfWeek = nowDate.getDay(); // 0 is Sunday, 6 is Saturday
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
  const isWorkHours = isWeekday && hours >= 9 && hours < 18;

  // Calculate Week Number
  const getWeekNumber = (d: Date) => {
    const target = new Date(d.valueOf());
    const dayNr = (d.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  };

  const weekNum = getWeekNumber(nowDate);

  // Calculate Day of Year
  const startOfYear = new Date(nowDate.getFullYear(), 0, 0);
  const diff = nowDate.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const formatZonedTime = (timeZone: string) => {
    try {
      return nowDate.toLocaleTimeString('tr-TR', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return '--:--';
    }
  };

  return (
    <div className="clock-widget-wrapper" ref={containerRef}>
      {/* Clock Pill Button */}
      <button
        type="button"
        className={`clock-pill ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Dünya Saatleri & Zaman Kontrol Paneli"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="clock-pill-svg"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>

        <div className="clock-pill-info">
          <div className="clock-pill-time-row">
            <span className="clock-pill-time">{time || '--:--'}</span>
            <span className="clock-pill-sec">:{seconds || '00'}</span>
          </div>
          {date && <span className="clock-pill-date">{date}</span>}
        </div>

        <span className={`clock-pill-status-dot ${isWorkHours ? 'online' : 'off'}`} title={isWorkHours ? 'Mesai Saati İçi' : 'Mesai Dışı'} />
      </button>

      {/* High-Tech Clock Popover */}
      {isOpen && (
        <div className="clock-popover">
          {/* Header */}
          <div className="c-pop-head">
            <div className="c-pop-title">
              <span className="c-pop-dot" />
              <span>Zaman & Dünya Saatleri Merkezi</span>
            </div>
            <div className={`c-pop-badge ${isWorkHours ? 'work-on' : 'work-off'}`}>
              {isWorkHours ? '● Mesai Saatleri İçi (09:00 - 18:00)' : '○ Mesai Dışı'}
            </div>
          </div>

          {/* Large Digital Display */}
          <div className="c-pop-digital">
            <div className="c-pop-main-time">
              <span className="c-digit-hm">{time}</span>
              <span className="c-digit-sec">:{seconds}</span>
            </div>
            <div className="c-pop-main-date">{date}</div>

            {/* Day Progress Bar */}
            <div className="c-progress-wrap">
              <div className="c-progress-head">
                <span>Günün İlerlemesi</span>
                <strong>%{dayProgress}</strong>
              </div>
              <div className="c-progress-track">
                <div className="c-progress-fill" style={{ width: `${dayProgress}%` }} />
              </div>
            </div>
          </div>

          {/* Time Telemetry (Week, Day of Year, UTC) */}
          <div className="c-pop-stats">
            <div className="c-stat-box">
              <span className="c-stat-val">{weekNum}. Hafta</span>
              <span className="c-stat-lbl">Yılın Haftası</span>
            </div>
            <div className="c-stat-box">
              <span className="c-stat-val">{dayOfYear} / 365</span>
              <span className="c-stat-lbl">Yılın Günü</span>
            </div>
            <div className="c-stat-box">
              <span className="c-stat-val">UTC+3</span>
              <span className="c-stat-lbl">İstanbul Saat Dilimi</span>
            </div>
          </div>

          {/* World Clocks for Global Operations */}
          <div className="c-pop-world">
            <div className="c-world-title">Ejder Turizm Global Operasyon Saatleri</div>
            <div className="c-world-list">
              {WORLD_ZONES.map((z) => (
                <div key={z.city} className="c-world-item">
                  <div className="c-world-left">
                    <span className="c-world-flag">{z.flag}</span>
                    <div>
                      <div className="c-world-city">{z.city}</div>
                      <div className="c-world-tag">{z.tag}</div>
                    </div>
                  </div>
                  <div className="c-world-time">{formatZonedTime(z.timeZone)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClockWidget;
