import React from 'react';

interface SectionHeaderProps {
  badge?: {
    icon: string;
    text: string;
  };
  title: string;
  description?: string;
  className?: string;
}

export default function SectionHeader({
  badge,
  title,
  description,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`section-header ${className}`}>
      {badge && (
        <div className="section-badge">
          <i className={badge.icon}></i>
          <span>{badge.text}</span>
        </div>
      )}
      <h2 className="section-title">{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}

