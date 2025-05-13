// Datos de ejemplo para la aplicación

// Usuarios
export const users = [
  {
    id: 1,
    name: "María García",
    email: "maria@example.com",
    password: "password123",
    isProfessional: false,
    image: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 2,
    name: "Juan Pérez",
    email: "juan@example.com",
    password: "password123",
    isProfessional: true,
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    profession: "Electricista",
    description:
      "Electricista profesional con más de 10 años de experiencia en instalaciones residenciales y comerciales.",
    availability: [0, 1, 2, 3, 4], // Lunes a Viernes
    hourlyRate: 25,
  },
];

// Servicios
export const services = [
  {
    id: 1,
    title: "Instalación eléctrica completa",
    category: "Electricidad",
    description:
      "Servicio de instalación eléctrica para viviendas y locales comerciales. Incluye cableado, instalación de enchufes, interruptores y cuadro eléctrico.",
    price: 25,
    providerId: 2,
    providerName: "Juan Pérez",
    providerImage: "https://randomuser.me/api/portraits/men/1.jpg",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.8,
    reviews: 24,
  },
  {
    id: 2,
    title: "Limpieza de hogar completa",
    category: "Limpieza",
    description:
      "Servicio de limpieza profunda para hogares. Incluye limpieza de todas las habitaciones, baños, cocina y áreas comunes.",
    price: 20,
    providerId: 3,
    providerName: "Ana Martínez",
    providerImage: "https://randomuser.me/api/portraits/women/2.jpg",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.9,
    reviews: 36,
  },
  {
    id: 3,
    title: "Corte de cabello a domicilio",
    category: "Peluqueria",
    description:
      "Servicio de peluquería a domicilio. Incluye lavado, corte y peinado según preferencias del cliente.",
    price: 30,
    providerId: 4,
    providerName: "Carlos Rodríguez",
    providerImage: "https://randomuser.me/api/portraits/men/3.jpg",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.7,
    reviews: 18,
  },
  {
    id: 4,
    title: "Reparación de grifos y tuberías",
    category: "Plomeria",
    description:
      "Servicio de plomería para reparación de grifos con fugas, tuberías obstruidas y problemas de desagüe.",
    price: 22,
    providerId: 5,
    providerName: "Roberto Sánchez",
    providerImage: "https://randomuser.me/api/portraits/men/4.jpg",
    image:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.6,
    reviews: 15,
  },
  {
    id: 5,
    title: "Mantenimiento de jardín",
    category: "Jardineria",
    description:
      "Servicio completo de jardinería que incluye corte de césped, poda de arbustos y árboles, y mantenimiento general.",
    price: 18,
    providerId: 6,
    providerName: "Laura Gómez",
    providerImage: "https://randomuser.me/api/portraits/women/5.jpg",
    image:
      "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.9,
    reviews: 27,
  },
  {
    id: 6,
    title: "Fabricación de muebles a medida",
    category: "Carpinteria",
    description:
      "Diseño y fabricación de muebles personalizados según las necesidades y espacio del cliente.",
    price: 35,
    providerId: 7,
    providerName: "Miguel Torres",
    providerImage: "https://randomuser.me/api/portraits/men/6.jpg",
    image:
      "https://plus.unsplash.com/premium_photo-1681754370510-f8c0a0f23ec2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
    reviews: 21,
  },
  {
    id: 99,
    title: "Limpieza profunda",
    category: "Limpieza",
    description:
      "Servicio de limpieza profunda para hogares y oficinas. Incluye desinfección, lavado de pisos y limpieza de superficies difíciles.",
    price: 25,
    providerId: 8,
    providerName: "María González",
    providerImage: "https://randomuser.me/api/portraits/women/8.jpg",
    image:
      "https://images.unsplash.com/photo-1581579185169-641f92f3f41b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.9,
    reviews: 42,
  },
  {
    id: 100,
    title: "Servicio de Plomería",
    category: "Plomería",
    description: "Reparación de cañerías y filtraciones en el hogar.",
    price: 35,
    providerId: 9,
    providerName: "Carlos Tapia",
    providerImage: "https://randomuser.me/api/portraits/men/9.jpg",
    image:
      "https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.6,
    reviews: 30,
  }
];

// Testimonios
export const testimonials = [
  {
    id: 1,
    userName: "Sofía López",
    userImage: "https://randomuser.me/api/portraits/women/10.jpg",
    rating: 5,
    text: "Excelente servicio. Juan llegó puntual y resolvió todos los problemas eléctricos de mi casa en tiempo récord. Muy profesional.",
    service: "Electricidad",
  },
  {
    id: 2,
    userName: "Pedro Ramírez",
    userImage: "https://randomuser.me/api/portraits/men/10.jpg",
    rating: 4,
    text: "Ana hizo un trabajo impecable con la limpieza de mi apartamento. Quedó todo reluciente y con un agradable aroma. Repetiré sin duda.",
    service: "Limpieza",
  },
  {
    id: 3,
    userName: "Carmen Díaz",
    userImage: "https://randomuser.me/api/portraits/women/11.jpg",
    rating: 5,
    text: "Carlos es un excelente peluquero. Entendió perfectamente lo que quería y el resultado fue mejor de lo esperado. Muy recomendable.",
    service: "Peluquería",
  },
];

// Citas/Reservas
export const bookings = [
  {
    id: 1,
    serviceId: 1,
    userId: 1,
    providerId: 2,
    date: "2023-06-15",
    time: "10:00",
    status: "completed",
    reviewed: true,
    reviewId: 1,
  },
  {
    id: 2,
    serviceId: 2,
    userId: 1,
    providerId: 3,
    date: "2023-06-20",
    time: "14:00",
    status: "upcoming",
    reviewed: false,
  },
];
