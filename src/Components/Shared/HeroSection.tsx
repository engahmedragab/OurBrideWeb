import React from 'react';

interface HeroStat {
  number: string | number;
  label: string;
}

interface HeroSectionProps {
  badge?: {
    icon: string;
    text: string;
  };
  title: string | React.ReactNode;
  description?: string;
  stats?: HeroStat[];
  background?: 'gradient' | 'solid';
  particles?: boolean;
}

export default function HeroSection({
  badge,
  title,
  description,
  stats,
  background = 'gradient',
  particles = true,
}: HeroSectionProps) {
  return (
    <section className="hero-section">
      <div className="hero-background">
        {background === 'gradient' && <div className="hero-gradient"></div>}
        {particles && (
          <div className="hero-particles">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
            <div className="particle particle-5"></div>
          </div>
        )}
      </div>
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-lg-8">
            <div className="hero-content">
              {badge && (
                <div className="hero-badge">
                  <div className="badge-icon">
                    <i className={badge.icon}></i>
                  </div>
                  <span>{badge.text}</span>
                </div>
              )}
              <h1 className="hero-title">
                {typeof title === 'string' ? title : title}
              </h1>
              {description && <p className="hero-description">{description}</p>}
              {stats && stats.length > 0 && (
                <div className="hero-stats">
                  {stats.map((stat, index) => (
                    <div key={index} className="stat-item">
                      <div className="stat-number">{stat.number}</div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

