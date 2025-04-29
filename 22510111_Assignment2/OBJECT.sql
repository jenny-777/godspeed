CREATE TYPE name_type AS OBJECT (
    name VARCHAR2(50),
    
    MEMBER FUNCTION countNoOfWords RETURN NUMBER DETERMINISTIC
);
/

CREATE TYPE BODY name_type AS
    MEMBER FUNCTION countNoOfWords RETURN NUMBER IS
    BEGIN
        RETURN REGEXP_COUNT(name, '\S+'); 
    END;
END;
/

CREATE TABLE name_table OF name_type;

INSERT INTO name_table VALUES (name_type('John Doe'));
INSERT INTO name_table VALUES (name_type('Alice Wonderland'));
INSERT INTO name_table VALUES (name_type('Steve Jobs'));

SELECT n.name, n.countNoOfWords() AS WordCount FROM name_table n;


--------------------------------------------------------------------------------------
CREATE TYPE address_type AS OBJECT (
    address VARCHAR2(100),
    city VARCHAR2(50),
    state VARCHAR2(50),
    pincode VARCHAR2(10),
    
    MEMBER FUNCTION extractAddresses(keyword VARCHAR2) RETURN VARCHAR2 DETERMINISTIC,
    
    MEMBER FUNCTION countWords(attribute_name VARCHAR2) RETURN NUMBER DETERMINISTIC
);
/

CREATE TYPE BODY address_type AS
    MEMBER FUNCTION extractAddresses(keyword VARCHAR2) RETURN VARCHAR2 IS
    BEGIN
        IF address LIKE '%' || keyword || '%' OR 
           city LIKE '%' || keyword || '%' OR 
           state LIKE '%' || keyword || '%' THEN
            RETURN address || ', ' || city || ', ' || state || ' - ' || pincode;
        ELSE
            RETURN NULL;
        END IF;
    END;

    MEMBER FUNCTION countWords(attribute_name VARCHAR2) RETURN NUMBER IS
        word_count NUMBER;
    BEGIN
        CASE attribute_name
            WHEN 'address' THEN word_count := REGEXP_COUNT(address, '\S+');
            WHEN 'city' THEN word_count := REGEXP_COUNT(city, '\S+');
            WHEN 'state' THEN word_count := REGEXP_COUNT(state, '\S+');
            ELSE word_count := 0;
        END CASE;
        RETURN word_count;
    END;
END;
/

CREATE TABLE address_table OF address_type;

INSERT INTO address_table VALUES (address_type('221B Baker Street', 'London', 'UK', 'NW16XE'));
INSERT INTO address_table VALUES (address_type('1600 Amphitheatre Parkway', 'Mountain View', 'California', '94043'));

SELECT a.address, a.city, a.extractAddresses('London') AS ExtractedAddress 
FROM address_table a;

SELECT a.address, a.countWords('address') AS WordCount
FROM address_table a;


---------------------------------------------------------------------------------------------------

CREATE TYPE course_type AS OBJECT (
    course_id NUMBER,
    description VARCHAR2(100)
);
/


CREATE TABLE course_table OF course_type;

INSERT INTO course_table VALUES (course_type(101, 'Database Management System'));
INSERT INTO course_table VALUES (course_type(102, 'Object-Oriented Programming'));
INSERT INTO course_table VALUES (course_type(103, 'Artificial Intelligence'));

SELECT * FROM course_table;



-- CREATE TYPE name_type AS OBJECT (
--     name VARCHAR2(50),
    
--     MEMBER FUNCTION countNoOfWords RETURN NUMBER
-- );
-- /

-- CREATE TYPE BODY name_type AS
--     MEMBER FUNCTION countNoOfWords RETURN NUMBER IS
--     BEGIN
--         RETURN REGEXP_COUNT(name, '\S+') ; 
--     END;
-- END;
-- /

-- CREATE TABLE name_table OF name_type;

-- INSERT INTO name_table VALUES (name_type('John Doe'));
-- INSERT INTO name_table VALUES (name_type('Alice Wonderland'));
-- INSERT INTO name_table VALUES (name_type('Steve Jobs'));

-- SELECT name, VALUE(n).countNoOfWords() AS WordCount FROM name_table n;

-- -----------------------------------------------------------------------------------------------------------------

-- CREATE  TYPE address_type AS OBJECT (
--     address VARCHAR2(100),
--     city VARCHAR2(50),
--     state VARCHAR2(50),
--     pincode VARCHAR2(10),
    
--     MEMBER FUNCTION extractAddresses(keyword VARCHAR2) RETURN VARCHAR2,
    
--     MEMBER FUNCTION countWords(attribute_name VARCHAR2) RETURN NUMBER
-- );
-- /

-- CREATE TYPE BODY address_type AS
--     MEMBER FUNCTION extractAddresses(keyword VARCHAR2) RETURN VARCHAR2 IS
--     BEGIN
--         IF address LIKE '%' || keyword || '%' OR 
--            city LIKE '%' || keyword || '%' OR 
--            state LIKE '%' || keyword || '%' THEN
--             RETURN address || ', ' || city || ', ' || state || ' - ' || pincode;
--         ELSE
--             RETURN NULL;
--         END IF;
--     END;

--     MEMBER FUNCTION countWords(attribute_name VARCHAR2) RETURN NUMBER IS
--         word_count NUMBER;
--     BEGIN
--         CASE attribute_name
--             WHEN 'address' THEN word_count := REGEXP_COUNT(address, '\S+');
--             WHEN 'city' THEN word_count := REGEXP_COUNT(city, '\S+');
--             WHEN 'state' THEN word_count := REGEXP_COUNT(state, '\S+');
--             ELSE word_count := 0;
--         END CASE;
--         RETURN word_count;
--     END;
-- END;
-- /

-- CREATE TABLE address_table OF address_type;

-- INSERT INTO address_table VALUES (address_type('221B Baker Street', 'London', 'UK', 'NW16XE'));
-- INSERT INTO address_table VALUES (address_type('1600 Amphitheatre Parkway', 'Mountain View', 'California', '94043'));

-- SELECT address, city, VALUE(a).extractAddresses('London') AS ExtractedAddress 
-- FROM address_table a;

-- SELECT address, VALUE(a).countWords('address') AS WordCount
-- FROM address_table a;


-- ---------------------------------------------------------------------------------------------------------------
-- CREATE  TYPE course_type AS OBJECT (
--     course_id NUMBER,
--     description VARCHAR2(100)
-- );
-- /

-- CREATE TABLE course_table OF course_type;

-- INSERT INTO course_table VALUES (course_type(101, 'Database Management System'));
-- INSERT INTO course_table VALUES (course_type(102, 'Object-Oriented Programming'));
-- INSERT INTO course_table VALUES (course_type(103, 'Artificial Intelligence'));

-- SELECT * FROM course_table;

