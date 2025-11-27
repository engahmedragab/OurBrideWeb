/**
 * Card Component
 * 
 * A reusable card component for displaying content.
 * 
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>Title</CardHeader>
 *   <CardBody>Content goes here</CardBody>
 *   <CardFooter>Footer content</CardFooter>
 * </Card>
 * ```
 */

import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
}) => {
  return (
    <div className={`card card-${variant} ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`card-header ${className}`}>{children}</div>;
};

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`card-body ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`card-footer ${className}`}>{children}</div>;
};

export default Card;

