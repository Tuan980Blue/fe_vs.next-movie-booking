// API Endpoints configuration
const endpoints = {
  // Authentication endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh-token',
    changePassword: '/auth/change-password',
    logout: '/auth/logout',
  },
  
  // User endpoints
  users: {
    me: '/users/me',
    updateProfile: '/users/me',
    list: '/users',
    detail: (id: string) => `/users/${id}`,
  },
  
  // Movie endpoints
  movies: {
    list: '/movies',
    detail: (id: string) => `/movies/${id}`,
    create: '/movies',
    update: (id: string) => `/movies/${id}`,
    delete: (id: string) => `/movies/${id}`,
    changeStatus: (id: string) => `/movies/${id}/status`,
    byStatus: (status: string) => `/movies/status/${status}`,
    stats: '/movies/stats',
  },
  
  // Genre endpoints
  genres: {
    list: '/genres',
    detail: (id: string) => `/genres/${id}`,
    create: '/genres',
    update: (id: string) => `/genres/${id}`,
    delete: (id: string) => `/genres/${id}`,
  },
  
  // Cinema endpoints
  cinemas: {
    list: '/cinemas',
    detail: (id: string) => `/cinemas/${id}`,
    create: '/cinemas',
    update: (id: string) => `/cinemas/${id}`,
    delete: (id: string) => `/cinemas/${id}`,
    changeStatus: (id: string) => `/cinemas/${id}/status`,
    stats: (id: string) => `/cinemas/${id}/stats`,
  },
  
  // Room endpoints
  rooms: {
    list: (cinemaId: string) => `/cinemas/${cinemaId}/rooms`,
    detail: (cinemaId: string, id: string) => `/cinemas/${cinemaId}/rooms/${id}`,
    create: (cinemaId: string) => `/cinemas/${cinemaId}/rooms`,
    update: (cinemaId: string, id: string) => `/cinemas/${cinemaId}/rooms/${id}`,
    delete: (cinemaId: string, id: string) => `/cinemas/${cinemaId}/rooms/${id}`,
    changeStatus: (cinemaId: string, id: string) => `/cinemas/${cinemaId}/rooms/${id}/status`,
    stats: (cinemaId: string, id: string) => `/cinemas/${cinemaId}/rooms/${id}/stats`,
  },
  
  // Seat endpoints
  seats: {
    list: (cinemaId: string, roomId: string) => `/cinemas/${cinemaId}/rooms/${roomId}/seats`,
    layout: (cinemaId: string, roomId: string) => `/cinemas/${cinemaId}/rooms/${roomId}/seats/layout`,
    detail: (cinemaId: string, roomId: string, id: string) => `/cinemas/${cinemaId}/rooms/${roomId}/seats/${id}`,
    available: (cinemaId: string, roomId: string) => `/cinemas/${cinemaId}/rooms/${roomId}/seats/available`,
    byType: (cinemaId: string, roomId: string, seatType: string) => `/cinemas/${cinemaId}/rooms/${roomId}/seats/by-type/${seatType}`,
    stats: (cinemaId: string, roomId: string) => `/cinemas/${cinemaId}/rooms/${roomId}/seats/stats`,
    create: (cinemaId: string, roomId: string) => `/cinemas/${cinemaId}/rooms/${roomId}/seats`,
    createBulkLayout: (cinemaId: string, roomId: string) => `/cinemas/${cinemaId}/rooms/${roomId}/seats/bulk-layout`,
    update: (cinemaId: string, roomId: string, id: string) => `/cinemas/${cinemaId}/rooms/${roomId}/seats/${id}`,
    delete: (cinemaId: string, roomId: string, id: string) => `/cinemas/${cinemaId}/rooms/${roomId}/seats/${id}`,
    deleteAll: (cinemaId: string, roomId: string) => `/cinemas/${cinemaId}/rooms/${roomId}/seats/all`,
  },
  
  // Showtime endpoints
  showtimes: {
    list: '/showtimes',
    byMovie: (movieId: string) => `/showtimes/movie/${movieId}`,
    create: '/showtimes',
    update: (id: string) => `/showtimes/${id}`,
    delete: (id: string) => `/showtimes/${id}`,
  },
  
  // Price Rule endpoints
  priceRules: {
    list: '/pricerules',
    detail: (id: string) => `/pricerules/${id}`,
    create: '/pricerules',
    update: (id: string) => `/pricerules/${id}`,
    delete: (id: string) => `/pricerules/${id}`,
  },
  
  // Pricing endpoints
  pricing: {
    quote: '/pricing/quote',
  },
  
  // Booking endpoints (to be implemented)
  bookings: {
    list: '/bookings',
    detail: (id: string) => `/bookings/${id}`,
    create: '/bookings',
    update: (id: string) => `/bookings/${id}`,
    cancel: (id: string) => `/bookings/${id}/cancel`,
    confirm: (id: string) => `/bookings/${id}/confirm`,
  },
  
  // Payment endpoints (to be implemented)
  payments: {
    list: '/payments',
    detail: (id: string) => `/payments/${id}`,
    create: '/payments',
    process: (id: string) => `/payments/${id}/process`,
    refund: (id: string) => `/payments/${id}/refund`,
  },
  
  // Promotion endpoints (to be implemented)
  promotions: {
    list: '/promotions',
    detail: (id: string) => `/promotions/${id}`,
    create: '/promotions',
    update: (id: string) => `/promotions/${id}`,
    delete: (id: string) => `/promotions/${id}`,
    validate: '/promotions/validate',
    apply: '/promotions/apply',
  },
};

export default endpoints;


