CREATE TABLE IF NOT EXISTS Classroom (
    building VARCHAR(50) NOT NULL,
    room_number VARCHAR(10) NOT NULL,
    capacity INT NOT NULL,
    PRIMARY KEY (building, room_number)
);

CREATE TABLE IF NOT EXISTS Department (
    dept_name VARCHAR(50) PRIMARY KEY,
    building VARCHAR(50) NOT NULL,
    budget FLOAT NOT NULL
);

CREATE TABLE IF NOT EXISTS Course (
    course_id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    dept_name VARCHAR(50) NOT NULL,
    credits INT NOT NULL,
    FOREIGN KEY (dept_name) REFERENCES Department(dept_name) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Instructor (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dept_name VARCHAR(50),
    salary FLOAT NOT NULL,
    FOREIGN KEY (dept_name) REFERENCES Department(dept_name) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS TimeSlot (
    time_slot_id VARCHAR(10) PRIMARY KEY,
    day VARCHAR(10) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);

CREATE TABLE IF NOT EXISTS Section (
    course_id VARCHAR(10) NOT NULL,
    sec_id VARCHAR(10) NOT NULL,
    semester VARCHAR(10) NOT NULL,
    year INT NOT NULL,
    building VARCHAR(50),
    room_number VARCHAR(10),
    time_slot_id VARCHAR(10) NOT NULL,
    PRIMARY KEY (course_id, sec_id, semester, year),
    FOREIGN KEY (course_id) REFERENCES Course(course_id) ON DELETE CASCADE,
    FOREIGN KEY (building, room_number) REFERENCES Classroom(building, room_number) ON DELETE SET NULL,
    FOREIGN KEY (time_slot_id) REFERENCES TimeSlot(time_slot_id)
);

CREATE TABLE IF NOT EXISTS Teaches (
    ID INT NOT NULL,
    course_id VARCHAR(10) NOT NULL,
    sec_id VARCHAR(10) NOT NULL,
    semester VARCHAR(10) NOT NULL,
    year INT NOT NULL,
    PRIMARY KEY (ID, course_id, sec_id, semester, year),
    FOREIGN KEY (ID) REFERENCES Instructor(ID) ON DELETE CASCADE,
    FOREIGN KEY (course_id, sec_id, semester, year) REFERENCES Section(course_id, sec_id, semester, year) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Student (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dept_name VARCHAR(50),
    tot_cred INT NOT NULL,
    FOREIGN KEY (dept_name) REFERENCES Department(dept_name) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Takes (
    ID INT NOT NULL,
    course_id VARCHAR(10) NOT NULL,
    sec_id VARCHAR(10) NOT NULL,
    semester VARCHAR(10) NOT NULL,
    year INT NOT NULL,
    grade VARCHAR(5),
    PRIMARY KEY (ID, course_id, sec_id, semester, year),
    FOREIGN KEY (ID) REFERENCES Student(ID) ON DELETE CASCADE,
    FOREIGN KEY (course_id, sec_id, semester, year) REFERENCES Section(course_id, sec_id, semester, year) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Advisor (
    s_ID INT NOT NULL,
    i_ID INT NOT NULL,
    PRIMARY KEY (s_ID, i_ID),
    FOREIGN KEY (s_ID) REFERENCES Student(ID) ON DELETE CASCADE,
    FOREIGN KEY (i_ID) REFERENCES Instructor(ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Prerequisite (
    course_id VARCHAR(10) NOT NULL,
    prereq_id VARCHAR(10) NOT NULL,
    PRIMARY KEY (course_id, prereq_id),
    FOREIGN KEY (course_id) REFERENCES Course(course_id) ON DELETE CASCADE,
    FOREIGN KEY (prereq_id) REFERENCES Course(course_id) ON DELETE CASCADE
);
