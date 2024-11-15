package com.fisw.proyecto.DatabaseManagement;

import java.sql.Connection; 
import java.sql.DriverManager;
import java.sql.SQLException; 

public class DatabaseConnection {

    private static final String URL_VARIABLE= "URL"; 
    private static final String USER_VARIABLE= "USER"; 
    private static final String PASSWORD_VARIABLE = "PASSWORD"; 

    
    private static final String URL= "URL"; 
    private static final String USER= "USER"; 
    private static final String PASSWORD = "PASSWORD"; 

    public static Connection getConnection() throws SQLException{

        String url= System.getenv(URL_VARIABLE) != null ? System.getenv(URL_VARIABLE) : URL; 
        String user= System.getenv(USER_VARIABLE) != null ? System.getenv(USER_VARIABLE) : URL; 
        String password= System.getenv(PASSWORD_VARIABLE) != null ? System.getenv(PASSWORD_VARIABLE) : URL; 

        System.out.println("URL: "+ url);
        System.out.println("USER: "+ user);
        System.out.println("PASSWORD: "+ password);


        return DriverManager.getConnection(URL, USER, PASSWORD);

    }
}
