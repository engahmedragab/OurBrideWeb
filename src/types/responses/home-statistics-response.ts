/**
 * Home Statistics Response
 * Response for home page statistics display
 */
export interface HomeStatisticsResponse {
  /**
   * Total number of clients (Bride and Groom users)
   */
  clients: string

  /**
   * Total number of service providers
   */
  serviceProviders: string

  /**
   * Total number of available services
   */
  availableServices: string

  /**
   * Total number of products
   */
  products: string

  /**
   * Total number of active users
   */
  activeUsers: string

  /**
   * Total number of reservations
   */
  reservations: string
}
