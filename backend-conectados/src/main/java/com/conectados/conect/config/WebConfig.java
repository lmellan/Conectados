// // src/main/java/com/conectados/conect/config/WebConfig.java
// package com.conectados.conect.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.context.annotation.Primary;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.CorsConfigurationSource;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// import java.util.List;

// @Configuration
// public class WebConfig {

//     @Bean
//     @Primary
//     public CorsConfigurationSource corsConfigurationSource() {
//         // 1) Creamos la configuración CORS
//         CorsConfiguration config = new CorsConfiguration();
//         // Si usas un solo origen en desarrollo:
//         config.setAllowedOrigins(List.of("http://localhost:3000"));
//         // O, si necesitas comodines:
//         // config.setAllowedOriginPatterns(List.of("*"));
//         config.setAllowCredentials(true);
//         config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
//         config.setAllowedHeaders(List.of("*"));

//         // 2) La asociamos a todas las rutas
//         UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//         source.registerCorsConfiguration("/**", config);
//         return source;
//     }
// }
