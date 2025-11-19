import React from 'react';
import { Link } from 'react-router-dom';

interface CTAButton {
  label: string;
  icon?: string;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'outline';
}

interface CTASectionProps {
  title: string;
  description?: string;
  buttons: CTAButton[];
  className?: string;
}

export default function CTASection({
  title,
  description,
  buttons,
  className = '',
}: CTASectionProps) {
  return (
    <section className={`cta-section ${className}`}>
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-lg-8">
            <div className="cta-content">
              <h2 className="cta-title">{title}</h2>
              {description && <p className="cta-description">{description}</p>}
              <div className="cta-buttons">
                {buttons.map((button, index) => {
                  const buttonContent = (
                    <>
                      {button.icon && <i className={`${button.icon} me-2`}></i>}
                      {button.label}
                    </>
                  );

                  if (button.to) {
                    return (
                      <Link
                        key={index}
                        to={button.to}
                        className={`btn ${button.variant === 'outline' ? 'btn-outline-main' : 'btn-main'} cta-btn`}
                      >
                        {buttonContent}
                      </Link>
                    );
                  }

                  if (button.href) {
                    return (
                      <a
                        key={index}
                        href={button.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`btn ${button.variant === 'outline' ? 'btn-outline-main' : 'btn-main'} cta-btn`}
                      >
                        {buttonContent}
                      </a>
                    );
                  }

                  return (
                    <button
                      key={index}
                      onClick={button.onClick}
                      className={`btn ${button.variant === 'outline' ? 'btn-outline-main' : 'btn-main'} cta-btn`}
                    >
                      {buttonContent}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

