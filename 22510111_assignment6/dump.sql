SELECT s.Store_id, c.City_name, c.State, s.Phone, i.Description, i.Size, i.Weight, i.Unit_price 
FROM Stores s 
JOIN City_Dim c ON s.City_id = c.City_id 
JOIN Stored_items si ON s.Store_id = si.Store_id 
JOIN Item_Dim i ON si.Item_id = i.Item_id 
WHERE i.Item_id = ?;

SELECT o.Order_no, o.Order_date, c.Customer_name 
FROM Order_Fact o 
JOIN Customer_Dim c ON o.Customer_id = c.Customer_id 
WHERE o.Store_id = ?;

SELECT DISTINCT s.Store_id, c.City_name, s.Phone 
FROM Stores s 
JOIN City_Dim c ON s.City_id = c.City_id 
JOIN Order_Fact o ON s.Store_id = o.Store_id 
WHERE o.Customer_id = ?;

SELECT h.Headquarter_addr, c.City_name, c.State 
FROM Headqarters h 
JOIN City_Dim c ON h.City_id = c.City_id 
JOIN Stores s ON c.City_id = s.City_id 
JOIN Stored_items si ON s.Store_id = si.Store_id 
WHERE si.Item_id = ? AND si.Quantity_held > ?;

SELECT o.Order_no, i.Description, s.Store_id, c.City_name 
FROM Order_Fact o 
JOIN Item_Dim i ON o.Item_id = i.Item_id 
JOIN Stores s ON o.Store_id = s.Store_id 
JOIN City_Dim c ON s.City_id = c.City_id;

SELECT c.City_name, c.State 
FROM Customer_Dim cd 
JOIN City_Dim c ON cd.City_id = c.City_id 
WHERE cd.Customer_id = ?;

SELECT s.Store_id, si.Quantity_held 
FROM Stores s 
JOIN Stored_items si ON s.Store_id = si.Store_id 
WHERE si.Item_id = ? AND s.City_id = ?;

SELECT o.Order_no, i.Description, o.Quantity_ordered, c.Customer_name, s.Store_id, cd.City_name 
FROM Order_Fact o 
JOIN Item_Dim i ON o.Item_id = i.Item_id 
JOIN Customer_Dim c ON o.Customer_id = c.Customer_id 
JOIN Stores s ON o.Store_id = s.Store_id 
JOIN City_Dim cd ON s.City_id = cd.City_id;

SELECT c.Customer_id, c.Customer_name, 
       CASE 
           WHEN w.Customer_id IS NOT NULL AND m.Customer_id IS NOT NULL THEN 'Dual'
           WHEN w.Customer_id IS NOT NULL THEN 'Walk-in'
           WHEN m.Customer_id IS NOT NULL THEN 'Mail-order'
           ELSE 'Unknown'
       END AS Customer_Type
FROM Customer_Dim c
LEFT JOIN Walk-in_customers w ON c.Customer_id = w.Customer_id
LEFT JOIN Mail_order_customers m ON c.Customer_id = m.Customer_id;