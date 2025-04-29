SELECT s.Store_id, h.City_name, h.State, s.Phone, i.Description, i.Size, i.Weight, i.Unit_price
FROM DimStore s
JOIN DimHeadquarter h ON s.City_id = h.City_id
JOIN DimItem i ON i.Item_id IN (SELECT Item_id FROM FactSales WHERE Store_id = s.Store_id)
WHERE i.Item_id = 1;  

SELECT f.Order_no, c.Customer_name, d.Full_date AS Order_date
FROM FactSales f
JOIN DimCustomer c ON f.Customer_id = c.Customer_id
JOIN DimDate d ON f.Order_date_id = d.Date_id
WHERE f.Store_id = 1; 

SELECT DISTINCT s.Store_id, h.City_name, s.Phone
FROM FactSales f
JOIN DimStore s ON f.Store_id = s.Store_id
JOIN DimHeadquarter h ON s.City_id = h.City_id
WHERE f.Customer_id = 1; 

SELECT h.City_name, h.State, h.Headquarter_addr, s.Store_id
FROM DimStore s
JOIN DimHeadquarter h ON s.City_id = h.City_id
JOIN FactSales f ON s.Store_id = f.Store_id
WHERE f.Item_id = 1 AND f.Quantity_ordered > 1;  


SELECT f.Order_no, f.Customer_id, i.Item_id, i.Description, s.Store_id, h.City_name
FROM FactSales f
JOIN DimItem i ON f.Item_id = i.Item_id
JOIN DimStore s ON f.Store_id = s.Store_id
JOIN DimHeadquarter h ON s.City_id = h.City_id;


SELECT h.City_name, h.State
FROM DimCustomer c
JOIN DimHeadquarter h ON c.City_id = h.City_id
WHERE c.Customer_id = 1;  


SELECT s.Store_id, h.City_name, f.Item_id, SUM(f.Quantity_ordered) AS Stock_Level
FROM FactSales f
JOIN DimStore s ON f.Store_id = s.Store_id
JOIN DimHeadquarter h ON s.City_id = h.City_id
WHERE f.Item_id = 1 AND h.City_name = "City1"
GROUP BY s.Store_id, h.City_name, f.Item_id;


SELECT f.Order_no, i.Item_id, i.Description, f.Quantity_ordered, c.Customer_name, s.Store_id, h.City_name
FROM FactSales f
JOIN DimItem i ON f.Item_id = i.Item_id
JOIN DimCustomer c ON f.Customer_id = c.Customer_id
JOIN DimStore s ON f.Store_id = s.Store_id
JOIN DimHeadquarter h ON s.City_id = h.City_id
WHERE f.Order_no = 1;  


SELECT Customer_id, Customer_name, 
       CASE 
           WHEN Customer_type = 'Walk-in' THEN 'Walk-in Customer'
           WHEN Customer_type = 'Mail-order' THEN 'Mail-order Customer'
           ELSE 'Dual Customer'
       END AS Customer_Category
FROM DimCustomer;