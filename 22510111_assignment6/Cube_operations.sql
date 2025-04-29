SELECT h.State, SUM(f.Quantity_ordered) AS Total_Quantity, SUM(f.Ordered_price) AS Total_Revenue
FROM FactSales f
JOIN DimStore s ON f.Store_id = s.Store_id
JOIN DimHeadquarter h ON s.City_id = h.City_id
GROUP BY h.State;


SELECT s.Store_id, s.Phone, h.State, SUM(f.Quantity_ordered) AS Total_Quantity, SUM(f.Ordered_price) AS Total_Revenue
FROM FactSales f
JOIN DimStore s ON f.Store_id = s.Store_id
JOIN DimHeadquarter h ON s.City_id = h.City_id
WHERE h.State = 'State1'  
GROUP BY s.Store_id, s.Phone, h.State;

SELECT d.Month, i.Description, SUM(f.Quantity_ordered) AS Total_Quantity, SUM(f.Ordered_price) AS Total_Revenue
FROM FactSales f
JOIN DimItem i ON f.Item_id = i.Item_id
JOIN DimDate d ON f.Order_date_id = d.Date_id
WHERE d.Month = 05 AND d.Year = 2024
GROUP BY d.Month, i.Description;

SELECT d.Quarter, h.City_name, i.Description, SUM(f.Quantity_ordered) AS Total_Quantity, SUM(f.Ordered_price) AS Total_Revenue
FROM FactSales f
JOIN DimItem i ON f.Item_id = i.Item_id
JOIN DimDate d ON f.Order_date_id = d.Date_id
JOIN DimStore s ON f.Store_id = s.Store_id
JOIN DimHeadquarter h ON s.City_id = h.City_id
WHERE d.Quarter = 2 AND d.Year = 2024 AND i.Description = 'Item1' AND h.City_name IN ('City1', 'City2')
GROUP BY d.Quarter, h.City_name, i.Description;