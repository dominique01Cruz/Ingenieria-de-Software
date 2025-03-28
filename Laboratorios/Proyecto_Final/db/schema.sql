-- Active: 1742431241497@@127.0.0.1@3306@phpmyadmin
--drop database if exists facturacion;--
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS facturacion;


 --drop database if exists facturacion;    
-- Use database
USE facturacion;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    user_type ENUM('administrador', 'contador', 'vendedor', 'invitado') NOT NULL DEFAULT 'invitado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_image MEDIUMTEXT
);


-- Insert default admin user
INSERT INTO users (username, password, name, user_type) 
VALUES ('admin', 'admin123', 'Administrador', 'administrador')
ON DUPLICATE KEY UPDATE username = 'admin'; 

-- Insert vendedor user
INSERT INTO users (username, password, name, user_type) 
VALUES ('manuel', '123456', 'Manuel', 'vendedor')
ON DUPLICATE KEY UPDATE username = 'manuel';

-- Insert contador user
INSERT INTO users (username, password, name, user_type) 
VALUES ('saul', 'aaaaaa', 'Saul', 'contador')
ON DUPLICATE KEY UPDATE username = 'saul';

-- Insert invitado user
INSERT INTO users (username, password, name, user_type) 
VALUES ('marisol', 'bbbbbb', 'Marisol', 'invitado')
ON DUPLICATE KEY UPDATE username = 'marisol'; 