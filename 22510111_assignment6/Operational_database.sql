CREATE DATABASE IF NOT EXISTS HeadquarterSalesDB;
USE HeadquarterSalesDB;

CREATE TABLE Customer (
    Customer_id INT PRIMARY KEY,
    Customer_name VARCHAR(255) NOT NULL,
    City_id INT NOT NULL,
    First_order_date DATE
);

CREATE TABLE Walk_in_customers (
    Customer_id INT PRIMARY KEY,
    tourism_guide VARCHAR(255),
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Customer_id) REFERENCES Customer(Customer_id)
);

CREATE TABLE Mail_order_customers (
    Customer_id INT PRIMARY KEY,
    post_address TEXT,
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Customer_id) REFERENCES Customer(Customer_id)
);


CREATE TABLE Headquarters (
    City_id INT PRIMARY KEY,
    City_name VARCHAR(255) NOT NULL,
    Headquarter_addr TEXT,
    State VARCHAR(255),
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Stores (
    Store_id INT PRIMARY KEY,
    City_id INT NOT NULL,
    Phone VARCHAR(20),
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (City_id) REFERENCES Headquarters(City_id)
);

CREATE TABLE Items (
    Item_id INT PRIMARY KEY,
    Description TEXT,
    Size VARCHAR(50),
    Weight DECIMAL(10,2),
    Unit_price DECIMAL(10,2),
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Stored_items (
    Store_id INT,
    Item_id INT,
    Quantity_held INT,
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (Store_id, Item_id),
    FOREIGN KEY (Store_id) REFERENCES Stores(Store_id),
    FOREIGN KEY (Item_id) REFERENCES Items(Item_id)
);

CREATE TABLE Orders (
    Order_no INT PRIMARY KEY,
    Order_date DATE,
    Customer_id INT NOT NULL,
    FOREIGN KEY (Customer_id) REFERENCES Customer(Customer_id)
);

CREATE TABLE Ordered_item (
    Order_no INT,
    Item_id INT,
    Quantity_ordered INT,
    Ordered_price DECIMAL(10,2),
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (Order_no, Item_id),
    FOREIGN KEY (Order_no) REFERENCES Orders(Order_no),
    FOREIGN KEY (Item_id) REFERENCES Items(Item_id)
);



INSERT INTO Headquarters (City_id, City_name, Headquarter_addr, State)
SELECT t.id, CONCAT('City', t.id), CONCAT('Address', t.id), CONCAT('State', t.id)
FROM (SELECT @row := @row + 1 AS id FROM (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) a, 
          (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) b, 
          (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) c, 
          (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) d, 
          (SELECT @row := 0) e) t LIMIT 100;


INSERT INTO Stores (Store_id, City_id, Phone)
SELECT t.id, h.City_id, CONCAT('+91-', FLOOR(9000000000 + (RAND() * 99999999)))
FROM (SELECT @row := @row + 1 AS id FROM (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) a, 
          (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) b, 
          (SELECT @row := 0) c) t 
JOIN Headquarters h ON h.City_id = t.id LIMIT 100;

INSERT INTO Customer (Customer_id, Customer_name, City_id, First_order_date)
SELECT t.id, CONCAT('Customer', t.id), h.City_id, DATE_SUB(CURDATE(), INTERVAL FLOOR(RAND() * 365) DAY)
FROM (SELECT @row := @row + 1 AS id FROM (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) a, 
          (SELECT @row := 0) b) t 
JOIN Headquarters h ON h.City_id = t.id LIMIT 100;


INSERT INTO Walk_in_customers (Customer_id, tourism_guide)
SELECT Customer_id, CONCAT('Guide', Customer_id) FROM Customer LIMIT 100;


INSERT INTO Mail_order_customers (Customer_id, post_address)
SELECT Customer_id, CONCAT('Address', Customer_id) FROM Customer LIMIT 100;

INSERT INTO Items (Item_id, Description, Size, Weight, Unit_price)
SELECT t.id, CONCAT('Item', t.id), CONCAT('Size', FLOOR(1 + (RAND() * 10))),
       ROUND(RAND() * 100, 2), ROUND(RAND() * 500, 2)
FROM (SELECT @row := @row + 1 AS id FROM (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) a, 
          (SELECT @row := 0) b) t LIMIT 100;


INSERT INTO Stored_items (Store_id, Item_id, Quantity_held)
SELECT s.Store_id, i.Item_id, FLOOR(1 + (RAND() * 50)) 
FROM Stores s, Items i LIMIT 100;

INSERT INTO Orders (Order_no, Order_date, Customer_id)
SELECT t.id, DATE_SUB(CURDATE(), INTERVAL FLOOR(RAND() * 365) DAY), c.Customer_id
FROM (SELECT @row := @row + 1 AS id FROM (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) a, 
          (SELECT @row := 0) b) t 
JOIN Customer c ON c.Customer_id = t.id LIMIT 100;


INSERT INTO Ordered_item (Order_no, Item_id, Quantity_ordered, Ordered_price)
SELECT o.Order_no, i.Item_id, FLOOR(1 + (RAND() * 10)), i.Unit_price
FROM Orders o, Items i LIMIT 100;


SELECT * FROM Customer;
SELECT * FROM Walk_in_customers;
SELECT * FROM Mail_order_customers;
SELECT * FROM Headquarters;
SELECT * FROM Stores;
SELECT * FROM Items;
SELECT * FROM Stored_items;
SELECT * FROM Orders;
SELECT * FROM Ordered_item;