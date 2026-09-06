DROP DATABASE IF EXISTS timetable_db;
CREATE DATABASE timetable_db;
USE timetable_db;

-- 1. Teachers Table
CREATE TABLE IF NOT EXISTS teachers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    short_name VARCHAR(10) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    primary_subject VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- 2. Users Table for Auth
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('teacher', 'advisor', 'hod', 'admin') NOT NULL DEFAULT 'teacher',
    teacher_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 3. Classes Table
CREATE TABLE IF NOT EXISTS classes (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dept VARCHAR(150) NOT NULL,
    sem VARCHAR(10) NOT NULL,
    advisor_id VARCHAR(50) NOT NULL,
    room VARCHAR(20) NOT NULL,
    FOREIGN KEY (advisor_id) REFERENCES teachers(id)
) ENGINE=InnoDB;

-- 4. Timetable Slots Table
CREATE TABLE IF NOT EXISTS timetable_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id VARCHAR(20) NOT NULL,
    day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NOT NULL,
    period INT NOT NULL CHECK (period BETWEEN 1 AND 7),
    subject VARCHAR(20) NOT NULL,
    subject_full VARCHAR(150) NOT NULL,
    teacher_id VARCHAR(50) NOT NULL,
    is_lab BOOLEAN DEFAULT FALSE,
    note VARCHAR(255),
    UNIQUE KEY uq_class_day_period (class_id, day, period),
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Substitution Requests Table
CREATE TABLE IF NOT EXISTS substitution_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    absent_teacher_id VARCHAR(50) NOT NULL,
    subject VARCHAR(20) NOT NULL,
    class_id VARCHAR(20) NOT NULL,
    day VARCHAR(15) NOT NULL,
    period INT NOT NULL,
    time_range VARCHAR(30) NOT NULL,
    status ENUM('pending', 'accepted', 'declined', 'escalated', 'free_hour') NOT NULL DEFAULT 'pending',
    requested_teacher_id VARCHAR(50),
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (absent_teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (requested_teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. Substitution Candidates Table (Sequential Chain)
CREATE TABLE IF NOT EXISTS substitution_candidates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    teacher_id VARCHAR(50) NOT NULL,
    chain_order INT NOT NULL,
    status ENUM('pending', 'notified', 'declined', 'accepted') NOT NULL DEFAULT 'pending',
    notified_at TIMESTAMP NULL,
    responded_at TIMESTAMP NULL,
    UNIQUE KEY uq_req_teacher (request_id, teacher_id),
    UNIQUE KEY uq_req_order (request_id, chain_order),
    FOREIGN KEY (request_id) REFERENCES substitution_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Uploaded Timetables Table
CREATE TABLE IF NOT EXISTS uploaded_timetables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id VARCHAR(20) NOT NULL,
    image_url TEXT,
    file_name VARCHAR(255),
    status ENUM('parsed', 'processing', 'error') NOT NULL DEFAULT 'processing',
    extracted_slots INT DEFAULT 0,
    extracted_teachers INT DEFAULT 0,
    parsed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    action VARCHAR(100) NOT NULL,
    actor VARCHAR(100) NOT NULL,
    request_id INT,
    details TEXT NOT NULL,
    type ENUM('request', 'accept', 'decline', 'escalate', 'assign', 'free_hour') NOT NULL,
    FOREIGN KEY (request_id) REFERENCES substitution_requests(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Optimization Indexes
CREATE INDEX idx_timetable_lookup ON timetable_slots(class_id, day);
CREATE INDEX idx_timetable_teacher ON timetable_slots(teacher_id);
CREATE INDEX idx_sub_requests_status ON substitution_requests(status);
CREATE INDEX idx_sub_candidates_lookup ON substitution_candidates(request_id, status);
