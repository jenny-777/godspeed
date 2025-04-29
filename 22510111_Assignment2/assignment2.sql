CREATE TABLE test_table (
    RecordNumber INT(3),
    CurrentDate DATE
);

DELIMITER $$

CREATE PROCEDURE Insert50Records()
BEGIN
    DECLARE i INT DEFAULT 1;

    WHILE i <= 50 DO
        INSERT INTO test_table (RecordNumber, CurrentDate)
        VALUES (i, CURDATE());
        SET i = i + 1;
    END WHILE;
END $$

DELIMITER ;

CALL Insert50Records();

----------------------------------------------------------------------

CREATE TABLE products (
    ProductID INT(4), 
    category CHAR(3),
    detail VARCHAR(30), 
    price DECIMAL(10,2),
    stock INT(5) 
);

INSERT INTO products (ProductID, category, detail, price, stock) VALUES (1001, 'ELE', 'Laptop', 1000.00, 10);
INSERT INTO products (ProductID, category, detail, price, stock) VALUES (1002, 'ELE', 'Phone', 500.00, 15);
INSERT INTO products (ProductID, category, detail, price, stock) VALUES (1003, 'FUR', 'Sofa', 200.00, 5);
INSERT INTO products (ProductID, category, detail, price, stock) VALUES (1004, 'FUR', 'Chair', 80.00, 20);
INSERT INTO products (ProductID, category, detail, price, stock) VALUES (1005, 'APP', 'Apple', 2.00, 100);

DELIMITER $$

CREATE PROCEDURE IncreasePriceByCategory(IN X DECIMAL(5,2), IN Y CHAR(3))
BEGIN
    UPDATE products
    SET price = price + (price * X / 100)
    WHERE category = Y;
END $$

DELIMITER ;

CALL IncreasePriceByCategory(10, 'ELE');

-- -- Step 1: Create the test_table
-- CREATE TABLE test_table (
--     RecordNumber NUMBER(3),
--     CurrentDate DATE
-- );

-- DELIMITER $$

-- CREATE PROCEDURE Insert50Records()
-- BEGIN
--     DECLARE i INT DEFAULT 1;

--     WHILE i <= 50 DO
--         INSERT INTO test_table (RecordNumber, CurrentDate)
--         VALUES (i, CURDATE());
--         SET i = i + 1;
--     END WHILE;
-- END $$

-- DELIMITER ;

-- CALL Insert50Records();

-- ----------------------------------------------------------------------

-- CREATE TABLE products (
--     ProductID NUMBER(4),
--     category CHAR(3),
--     detail VARCHAR2(30),
--     price NUMBER(10,2),
--     stock NUMBER(5)
-- );

-- INSERT INTO products (ProductID, category, detail, price, stock) VALUES (1001, 'ELE', 'Laptop', 1000.00, 10);
-- INSERT INTO products (ProductID, category, detail, price, stock) VALUES (1002, 'ELE', 'Phone', 500.00, 15);
-- INSERT INTO products (ProductID, category, detail, price, stock) VALUES (1003, 'FUR', 'Sofa', 200.00, 5);
-- INSERT INTO products (ProductID, category, detail, price, stock) VALUES (1004, 'FUR', 'Chair', 80.00, 20);
-- INSERT INTO products (ProductID, category, detail, price, stock) VALUES (1005, 'APP', 'Apple', 2.00, 100);

-- DELIMITER $$

-- CREATE PROCEDURE IncreasePriceByCategory(IN X DECIMAL(5,2), IN Y CHAR(3))
-- BEGIN
--     UPDATE products
--     SET price = price + (price * X / 100)
--     WHERE category = Y;
-- END $$

-- DELIMITER ;

-- CALL IncreasePriceByCategory(10, 'ELE');
