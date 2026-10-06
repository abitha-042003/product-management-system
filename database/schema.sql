CREATE DATABASE IF NOT EXISTS product_management;
USE product_management;

CREATE TABLE IF NOT EXISTS products (
  product_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(150) NOT NULL,
  product_code VARCHAR(80) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  date_added DATE NOT NULL,
  status ENUM('Available','Unavailable') NOT NULL DEFAULT 'Available',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_product_price CHECK (price > 0),
  CONSTRAINT chk_product_quantity CHECK (quantity >= 0)
);

INSERT INTO products (product_name, product_code, category, price, quantity, date_added, status)
VALUES
('Wireless Mouse', 'WM-1001', 'Electronics', 799.00, 25, CURDATE(), 'Available'),
('Notebook', 'NB-1002', 'Stationery', 120.00, 50, CURDATE(), 'Available'),
('Water Bottle', 'WB-1003', 'Home', 450.00, 0, CURDATE(), 'Unavailable');
