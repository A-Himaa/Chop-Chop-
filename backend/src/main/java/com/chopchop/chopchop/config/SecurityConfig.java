package com.chopchop.chopchop.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // Disable CSRF protection
            .authorizeRequests()
            .requestMatchers("/**").permitAll() // Allow all URLs
            .anyRequest().permitAll(); // Allow other requests as well

        return http.build();
    }

    @Bean
    public HttpFirewall allowUrlEncodedCharsHttpFirewall() {
        StrictHttpFirewall firewall = new StrictHttpFirewall();
        firewall.setAllowUrlEncodedPercent(true); // Allow percent-encoded characters
        firewall.setAllowUrlEncodedSlash(true);   // Allow encoded slashes
        firewall.setAllowBackSlash(true);         // Allow backslashes
        return firewall;
    }
}
