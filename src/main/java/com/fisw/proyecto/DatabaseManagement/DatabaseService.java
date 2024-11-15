package com.fisw.proyecto.DatabaseManagement;
import java.sql.*;

import org.springframework.stereotype.Service;

@Service
public class DatabaseService {

    public Connection connect() throws SQLException {
        return DatabaseConnection.getConnection();
    }

    public void closeConnection(Connection connection, Statement stmt, ResultSet rs) {
        try {
            if (rs != null) rs.close();
            if (stmt != null) stmt.close();
            if (connection != null) connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}