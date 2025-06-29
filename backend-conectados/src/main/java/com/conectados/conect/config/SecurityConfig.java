// // src/main/java/com/conectados/conect/config/SecurityConfig.java
// package com.conectados.conect.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.http.HttpMethod;
// import org.springframework.security.config.Customizer;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.web.cors.CorsConfigurationSource;

// @Configuration
// public class SecurityConfig {

//     @Bean
//     public SecurityFilterChain securityFilterChain(
//             HttpSecurity http,
//             CorsConfigurationSource corsSource
//     ) throws Exception {
//         http
//           .cors(cors -> cors.configurationSource(corsSource))
//           .csrf(csrf -> csrf.disable())
//           .authorizeHttpRequests(auth -> auth
//               .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
//               .requestMatchers("/api/auth/**").permitAll()
//               .anyRequest().authenticated()
//           )
//           .httpBasic(Customizer.withDefaults());
//         return http.build();
//     }
// }
