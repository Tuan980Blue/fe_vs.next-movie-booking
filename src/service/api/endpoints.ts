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
    assignAdmin: (id: string) => `/users/${id}/assign-admin`,
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
    detail: (id: string) => `/showtimes/${id}`,
    byMovie: (movieId: string) => `/showtimes/movie/${movieId}`,
    bookedSeats: (id: string) => `/showtimes/${id}/booked-seats`,
    create: '/showtimes',
    update: (id: string) => `/showtimes/${id}`,
    delete: (id: string) => `/showtimes/${id}`,
  },
  
  // Seat Lock endpoints
  seatLocks: {
    lock: '/seat-locks/lock',
    unlock: '/seat-locks/unlock',
    changeTtl: '/seat-locks/change-ttl',
    getLockedSeats: (showtimeId: string) => `/seat-locks/showtime/${showtimeId}`,
  },
  
  // Price Rule endpoints
  priceRules: {
    list: '/price-rules',
    detail: (id: string) => `/price-rules/${id}`,
    create: '/price-rules',
    update: (id: string) => `/price-rules/${id}`,
    delete: (id: string) => `/price-rules/${id}`,
  },
  
  // Price Calculation endpoints
  priceCalculation: {
    calculate: '/price-calculation/calculate',
  },
  
  // Booking endpoints
  bookings: {
    list: '/bookings',
    me: '/bookings/me',
    detail: (id: string) => `/bookings/${id}`,
    byCode: (code: string) => `/bookings/code/${code}`,
    create: '/bookings',
    confirm: (id: string) => `/bookings/${id}/confirm`,
    cancel: (id: string) => `/bookings/${id}/cancel`,
  },
  
  // Payment endpoints
  payments: {
    list: '/payments',
    detail: (id: string) => `/payments/${id}`,
    create: '/payments',
    vnpayReturn: '/payments/vnpay-return',
    vnpayIpn: '/payments/vnpay-ipn',
  },
  
  // Ticket endpoints
  tickets: {
    verifyQr: (qrCode: string) => `/tickets/qr/${qrCode}`,
    checkIn: (bookingCode: string) => `/tickets/${bookingCode}/checkin`,
  },
  
  // Promotion endpoints (to be implemented when backend is ready)
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


