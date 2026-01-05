/**
 * Provider Home Statistics Response
 * Formatted statistics for display on provider home page
 */

export interface ProviderHomeStatisticsResponse {
  /**
   * Total appointments/bookings (Reservations + Orders) formatted for display
   * Example: "1 billion+", "130K+", "450K+"
   */
  totalAppointments: string

  /**
   * Total partner businesses (Providers) formatted for display
   * Example: "130,000+", "6K+"
   */
  partnerBusinesses: string

  /**
   * Total countries/cities/regions using the platform (optional)
   * Example: "120+", "50+"
   */
  countries: string

  /**
   * Total stylists and professionals (Staff/Service Providers) formatted for display
   * Example: "450,000+", "12K+"
   */
  stylistsAndProfessionals: string

  /**
   * Appointments booked today (Orders + Reservations created today) formatted for display
   * Example: "12,345,678", "1,234+"
   */
  appointmentsBookedToday: string
}
