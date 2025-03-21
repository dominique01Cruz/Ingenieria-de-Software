# Database Structure

This folder contains all database-related code for the application, organized into separate files for better maintainability.

## File Organization

- `connection.php`: Contains database connection configuration and initialization functions
- `users.php`: Contains all user-related database functions (CRUD operations)
- `router.php`: Routes API requests to the appropriate handler functions
- `schema.sql`: SQL schema definition for the database

## How it Works

1. All database requests go through `api.php` in the root folder
2. The API file includes the router which determines which function to call
3. The router loads the necessary module files (users.php, etc.)
4. Each module file contains specific functions for its domain
5. All database operations use the connection functions from connection.php

## Adding New Functionality

To add new database functionality:

1. Create a new module file (e.g., `products.php`) in this folder
2. Define your database functions in that file
3. Include the file in `router.php`
4. Add route handlers for the new functions in the router
