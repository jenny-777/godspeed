CREATE USER '22510111'@'%' identified by '22510111'; 


SELECT User, Host FROM mysql.user;

Create database sample_db;

show databases;

use sample_db;

GRANT ALL PRIVILEGES ON sample_db.* TO '22510111'@'%';

flush privileges;

CREATE TABLE sample_table (
    id INT,
    sample_name VARCHAR(255)
);

INSERT INTO sample_table (id, sample_name)
VALUES
    (1, 'sample_book'),
    (2, 'sample_pen'),
    (3, 'sample_notebook'),
    (4, 'sample_ruler'),
    (5, 'sample_eraser');
    
select * from sample_table;

UPDATE sample_table
SET sample_name = 'updated_notebook'
WHERE id = 3;

DELETE FROM sample_table
WHERE id = 4;

GRANT ALL PRIVILEGES ON form_db.* TO '22510111'@'%'; 
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
FLUSH PRIVILEGES;
-- sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

-- mysql -u 22510111 -p -h 172.29.183.11 -P 3306
