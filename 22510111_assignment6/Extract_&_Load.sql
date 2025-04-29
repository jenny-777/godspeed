INSERT INTO DimCustomer (Customer_id, Customer_name, City_id, First_order_date, Customer_type)
SELECT c.Customer_id, c.Customer_name, c.City_id, c.First_order_date, 
       CASE 
           WHEN w.Customer_id IS NOT NULL THEN 'Walk-in'
           WHEN m.Customer_id IS NOT NULL THEN 'Mail-order'
           ELSE 'Both'
       END AS Customer_type
FROM HeadquarterSalesDB.Customer c
LEFT JOIN HeadquarterSalesDB.Walk_in_customers w ON c.Customer_id = w.Customer_id
LEFT JOIN HeadquarterSalesDB.Mail_order_customers m ON c.Customer_id = m.Customer_id;

INSERT INTO DimStore (Store_id, City_id, Phone)
SELECT Store_id, City_id, Phone FROM HeadquarterSalesDB.Stores;

INSERT INTO DimItem (Item_id, Description, Size, Weight, Unit_price)
SELECT Item_id, Description, Size, Weight, Unit_price FROM HeadquarterSalesDB.Items;


INSERT INTO DimHeadquarter (City_id, City_name, Headquarter_addr, State)
SELECT City_id, City_name, Headquarter_addr, State FROM HeadquarterSalesDB.Headquarters;

INSERT INTO DimDate (Full_date, Year, Month, Day, Quarter)
SELECT DISTINCT Order_date, 
                YEAR(Order_date),
                MONTH(Order_date),
                DAY(Order_date),
                QUARTER(Order_date)
FROM HeadquarterSalesDB.Orders;



SELECT o.Order_no, si.Store_id, oi.Item_id, o.Customer_id, oi.Quantity_ordered, oi.Ordered_price, d.Date_id
FROM HeadquarterSalesDB.Orders o
JOIN HeadquarterSalesDB.Ordered_item oi ON o.Order_no = oi.Order_no
JOIN HeadquarterSalesDB.Stored_items si ON oi.Item_id = si.Item_id
JOIN DimDate d ON o.Order_date = d.Full_date;


INSERT INTO FactSales (Order_no, Store_id, Item_id, Customer_id, Quantity_ordered, Ordered_price, Order_date_id)
SELECT 
    o.Order_no, 
    si.Store_id, 
    oi.Item_id, 
    o.Customer_id, 
    oi.Quantity_ordered, 
    oi.Ordered_price, 
    d.Date_id
FROM HeadquarterSalesDB.Orders o
JOIN HeadquarterSalesDB.Ordered_item oi 
    ON o.Order_no = oi.Order_no
JOIN HeadquarterSalesDB.Stored_items si 
    ON oi.Item_id = si.Item_id
JOIN DimDate d 
    ON o.Order_date = d.Full_date
ON DUPLICATE KEY UPDATE 
    Quantity_ordered = VALUES(Quantity_ordered),
    Ordered_price = VALUES(Ordered_price),
    Order_date_id = VALUES(Order_date_id);