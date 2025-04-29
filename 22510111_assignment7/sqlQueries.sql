SELECT s.StoreName, SUM(f.SalesTotalCost) AS Total_Sales
FROM FactProductSales f
JOIN DimStores s ON f.StoreID = s.StoreID
GROUP BY s.StoreName
ORDER BY Total_Sales DESC;

SELECT p.ProductName, SUM(f.Quantity) AS Total_Quantity_Sold
FROM FactProductSales f
JOIN DimProduct p ON f.ProductID = p.ProductKey
GROUP BY p.ProductName
ORDER BY Total_Quantity_Sold DESC;

SELECT sp.SalesPersonName, SUM(f.SalesTotalCost) AS Total_Sales
FROM FactProductSales f
JOIN DimSalesPerson sp ON f.SalesPersonID = sp.SalesPersonID
GROUP BY sp.SalesPersonName
ORDER BY Total_Sales DESC;

SELECT SalesDateKey, SUM(SalesTotalCost) AS DailySales
FROM FactProductSales
GROUP BY SalesDateKey
ORDER BY SalesDateKey;