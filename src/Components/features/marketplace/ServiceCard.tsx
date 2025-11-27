/**
 * ServiceCard Component
 * 
 * Feature-specific component for displaying service cards in the marketplace.
 * 
 * @example
 * ```tsx
 * <ServiceCard
 *   service={serviceData}
 *   onSelect={handleSelect}
 * />
 * ```
 */

import React from 'react';
import { Card, CardBody, CardFooter } from '@/components/ui';

export interface ServiceCardProps {
  service: {
    id: number | string;
    name: string;
    description?: string;
    price?: number;
    rating?: number;
    image?: string;
  };
  onSelect?: (serviceId: number | string) => void;
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onSelect,
  className = '',
}) => {
  // TODO: Implement service card UI
  // This is a placeholder component structure
  
  return (
    <Card className={`service-card ${className}`}>
      <CardBody>
        <h3>{service.name}</h3>
        {service.description && <p>{service.description}</p>}
        {service.price && <p>Price: ${service.price}</p>}
      </CardBody>
      {onSelect && (
        <CardFooter>
          <button onClick={() => onSelect(service.id)}>View Details</button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ServiceCard;

