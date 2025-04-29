CREATE DATABASE Sales_DW;
USE Sales_DW;

CREATE TABLE DimCustomer (
    CustomerID INT PRIMARY KEY AUTO_INCREMENT,
    CustomerAltID VARCHAR(10) NOT NULL,
    CustomerName VARCHAR(50),
    Gender VARCHAR(20)
);

INSERT INTO DimCustomer (CustomerAltID, CustomerName, Gender) VALUES
('IMI-001', 'Henry Ford', 'M'),
('IMI-002', 'Bill Gates', 'M'),
('IMI-003', 'Muskan Shaikh', 'F'),
('IMI-004', 'Richard Thrubin', 'M'),
('IMI-005', 'Emma Wattson', 'F');

CREATE TABLE DimProduct (
    ProductKey INT PRIMARY KEY AUTO_INCREMENT,
    ProductAltKey VARCHAR(10) NOT NULL,
    ProductName VARCHAR(100),
    ProductActualCost DECIMAL(10,2),
    ProductSalesCost DECIMAL(10,2)
);

INSERT INTO DimProduct (ProductAltKey, ProductName, ProductActualCost, ProductSalesCost) VALUES
('ITM-001', 'Wheat Floor 1kg', 5.50, 6.50),
('ITM-002', 'Rice Grains 1kg', 22.50, 24.00),
('ITM-003', 'SunFlower Oil 1 ltr', 42.00, 43.50),
('ITM-004', 'Nirma Soap', 18.00, 20.00),
('ITM-005', 'Arial Washing Powder 1kg', 135.00, 139.00);

CREATE TABLE DimStores (
    StoreID INT PRIMARY KEY AUTO_INCREMENT,
    StoreAltID VARCHAR(10) NOT NULL,
    StoreName VARCHAR(100),
    StoreLocation VARCHAR(100),
    City VARCHAR(100),
    State VARCHAR(100),
    Country VARCHAR(100)
);

INSERT INTO DimStores (StoreAltID, StoreName, StoreLocation, City, State, Country) VALUES
('LOC-A1', 'X-Mart', 'S.P. RingRoad', 'Ahmedabad', 'Guj', 'India'),
('LOC-A2', 'X-Mart', 'Maninagar', 'Ahmedabad', 'Guj', 'India'),
('LOC-A3', 'X-Mart', 'Sivranjani', 'Ahmedabad', 'Guj', 'India');

CREATE TABLE DimSalesPerson (
    SalesPersonID INT PRIMARY KEY AUTO_INCREMENT,
    SalesPersonAltID VARCHAR(10) NOT NULL,
    SalesPersonName VARCHAR(100),
    StoreID INT,
    City VARCHAR(100),
    State VARCHAR(100),
    Country VARCHAR(100),
    FOREIGN KEY (StoreID) REFERENCES DimStores(StoreID) ON DELETE CASCADE
);

INSERT INTO DimSalesPerson (SalesPersonAltID, SalesPersonName, StoreID, City, State, Country) VALUES
('SP-DMSPR1', 'Ashish', 1, 'Ahmedabad', 'Guj', 'India'),
('SP-DMSPR2', 'Ketan', 1, 'Ahmedabad', 'Guj', 'India'),
('SP-DMNGR1', 'Srinivas', 2, 'Ahmedabad', 'Guj', 'India'),
('SP-DMNGR2', 'Saad', 2, 'Ahmedabad', 'Guj', 'India'),
('SP-DMSVR1', 'Jasmin', 3, 'Ahmedabad', 'Guj', 'India'),
('SP-DMSVR2', 'Jacob', 3, 'Ahmedabad', 'Guj', 'India');

CREATE TABLE FactProductSales (
    TransactionId BIGINT PRIMARY KEY AUTO_INCREMENT,
    SalesInvoiceNumber INT NOT NULL,
    SalesDateKey INT,
    SalesTimeKey INT,
    SalesTimeAltKey INT,
    StoreID INT NOT NULL,
    CustomerID INT NOT NULL,
    ProductID INT NOT NULL,
    SalesPersonID INT NOT NULL,
    Quantity FLOAT,
    SalesTotalCost DECIMAL(10,2),
    ProductActualCost DECIMAL(10,2),
    Deviation FLOAT,

    FOREIGN KEY (StoreID) REFERENCES DimStores(StoreID) ON DELETE CASCADE,
    FOREIGN KEY (CustomerID) REFERENCES DimCustomer(CustomerID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES DimProduct(ProductKey) ON DELETE CASCADE,
    FOREIGN KEY (SalesPersonID) REFERENCES DimSalesPerson(SalesPersonID) ON DELETE CASCADE
);

INSERT INTO FactProductSales (SalesInvoiceNumber, SalesDateKey, SalesTimeKey, SalesTimeAltKey, StoreID, CustomerID, ProductID, SalesPersonID, Quantity, ProductActualCost, SalesTotalCost, Deviation) VALUES
(1, 20130101, 44347, 121907, 1, 1, 1, 1, 2, 11, 13, 2),
(1, 20130101, 44347, 121907, 1, 1, 2, 1, 1, 22.50, 24, 1.5),
(1, 20130101, 44347, 121907, 1, 1, 3, 1, 1, 42, 43.5, 1.5),
(2, 20130101, 44519, 122159, 1, 2, 3, 1, 1, 42, 43.5, 1.5),
(2, 20130101, 44519, 122159, 1, 2, 4, 1, 3, 54, 60, 6),
(3, 20130101, 52415, 143335, 1, 3, 2, 2, 2, 11, 13, 2),
(3, 20130101, 52415, 143335, 1, 3, 3, 2, 1, 42, 43.5, 1.5),
(3, 20130101, 52415, 143335, 1, 3, 4, 2, 3, 54, 60, 6),
(3, 20130101, 52415, 143335, 1, 3, 5, 2, 1, 135, 139, 4),
(4, 20130102, 44347, 121907, 1, 1, 1, 1, 2, 11, 13, 2),
(4, 20130102, 44347, 121907, 1, 1, 2, 1, 1, 22.50, 24, 1.5),
(5, 20130102, 44519, 122159, 1, 2, 3, 1, 1, 42, 43.5, 1.5),
(5, 20130102, 44519, 122159, 1, 2, 4, 1, 3, 54, 60, 6);