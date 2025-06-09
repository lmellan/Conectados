package com.conectados.conect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(
  exclude = { SecurityAutoConfiguration.class }
)
public class ConectadosApplication {

	public static void main(String[] args) {
		SpringApplication.run(ConectadosApplication.class, args);
	}

}
