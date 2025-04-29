CREATE DATABASE IF NOT EXISTS SalesDataWarehouse;
USE SalesDataWarehouse;

CREATE TABLE DimCustomer (
    Customer_id INT PRIMARY KEY,
    Customer_name VARCHAR(255) NOT NULL,
    City_id INT NOT NULL,
    First_order_date DATE,
    Customer_type VARCHAR(50)  
);

CREATE TABLE DimStore (
    Store_id INT PRIMARY KEY,
    City_id INT NOT NULL,
    Phone VARCHAR(20)
);

CREATE TABLE DimItem (
    Item_id INT PRIMARY KEY,
    Description TEXT,
    Size VARCHAR(50),
    Weight DECIMAL(10,2),
    Unit_price DECIMAL(10,2)
);

CREATE TABLE DimHeadquarter (
    City_id INT PRIMARY KEY,
    City_name VARCHAR(255) NOT NULL,
    Headquarter_addr TEXT,
    State VARCHAR(255)
);

CREATE TABLE DimDate (
    Date_id INT PRIMARY KEY AUTO_INCREMENT,
    Full_date DATE NOT NULL,
    Year INT,
    Month INT,
    Day INT,
    Quarter INT
);


CREATE TABLE FactSales (
    Order_no INT,
    Store_id INT,
    Item_id INT,
    Customer_id INT,
    Quantity_ordered INT,
    Ordered_price DECIMAL(10,2),
    Order_date_id INT, 

    PRIMARY KEY (Order_no, Item_id),
    FOREIGN KEY (Store_id) REFERENCES DimStore(Store_id),
    FOREIGN KEY (Item_id) REFERENCES DimItem(Item_id),
    FOREIGN KEY (Customer_id) REFERENCES DimCustomer(Customer_id),
    FOREIGN KEY (Order_date_id) REFERENCES DimDate(Date_id)
);


SELECT * FROM DimCustomer;


SELECT * FROM DimStore;

SELECT * FROM DimItem;

SELECT * FROM DimHeadquarter;


SELECT * FROM DimDate;


SELECT * FROM FactSales;

SELECT DISTINCT Order_date FROM HeadquarterSalesDB.Orders;

SELECT * FROM DimCustomer;
SELECT * FROM DimStore;
SELECT * FROM DimItem;


SELECT fs.Order_no, s.Store_id, s.Phone, i.Item_id, i.Description, 
       c.Customer_id, c.Customer_name, d.Full_date AS Order_Date, 
       fs.Quantity_ordered, fs.Ordered_price
FROM FactSales fs
JOIN DimStore s ON fs.Store_id = s.Store_id
JOIN DimItem i ON fs.Item_id = i.Item_id
JOIN DimCustomer c ON fs.Customer_id = c.Customer_id
JOIN DimDate d ON fs.Order_date_id = d.Date_id;

SELECT s.Store_id, h.City_name, h.State, SUM(fs.Ordered_price) AS Total_Revenue
FROM FactSales fs
JOIN DimStore s ON fs.Store_id = s.Store_id
JOIN DimHeadquarter h ON s.City_id = h.City_id
GROUP BY s.Store_id, h.City_name, h.State
ORDER BY Total_Revenue DESC;

SELECT i.Item_id, i.Description, SUM(fs.Quantity_ordered) AS Total_Sold
FROM FactSales fs
JOIN DimItem i ON fs.Item_id = i.Item_id
GROUP BY i.Item_id, i.Description
ORDER BY Total_Sold DESC;



