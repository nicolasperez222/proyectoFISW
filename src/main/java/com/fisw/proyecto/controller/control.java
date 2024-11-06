package com.fisw.proyecto.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class control {
    @GetMapping("/")
    public String getMessage()  {
        return "Hola Mundo !!";
    }
}
