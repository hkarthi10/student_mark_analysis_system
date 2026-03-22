-- ============================================
-- STUDENT MARK ANALYSIS SYSTEM - PostgreSQL Schema
-- Compatible with Neon serverless PostgreSQL
-- ============================================

-- Drop existing tables (if running fresh)
DROP TABLE IF EXISTS marks CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- USERS TABLE (Base table for all roles)
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'teacher', 'student')) NOT NULL,
    department VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for frequent email lookups during login
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_department ON users(department);

-- ============================================
-- STUDENTS TABLE
-- ============================================
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    roll_number VARCHAR(20) UNIQUE NOT NULL,
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    year_of_study INTEGER CHECK (year_of_study BETWEEN 1 AND 4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_roll_number ON students(roll_number);
CREATE INDEX idx_students_semester ON students(semester);

-- ============================================
-- TEACHERS TABLE
-- ============================================
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    qualification VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE INDEX idx_teachers_user_id ON teachers(user_id);

-- ============================================
-- SUBJECTS TABLE
-- ============================================
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    subject_code VARCHAR(20) UNIQUE NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    credits INTEGER NOT NULL DEFAULT 4 CHECK (credits BETWEEN 1 AND 4),
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
    semester INTEGER CHECK (semester BETWEEN 1 AND 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subjects_code ON subjects(subject_code);
CREATE INDEX idx_subjects_department ON subjects(department);
CREATE INDEX idx_subjects_teacher_id ON subjects(teacher_id);
CREATE INDEX idx_subjects_semester ON subjects(semester);

-- ============================================
-- MARKS TABLE (Core - Student Performance)
-- ============================================
CREATE TABLE marks (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    internal_marks INTEGER DEFAULT 0 CHECK (internal_marks >= 0 AND internal_marks <= 40),
    external_marks INTEGER DEFAULT 0 CHECK (external_marks >= 0 AND external_marks <= 60),
    total_marks INTEGER GENERATED ALWAYS AS (internal_marks + external_marks) STORED,
    grade CHAR(2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, subject_id)
);

CREATE INDEX idx_marks_student_id ON marks(student_id);
CREATE INDEX idx_marks_subject_id ON marks(subject_id);
CREATE INDEX idx_marks_grade ON marks(grade);
CREATE INDEX idx_marks_total ON marks(total_marks);

-- ============================================
-- COMMENTS for documentation
-- ============================================
COMMENT ON TABLE users IS 'Central users table for admin, teacher, and student roles';
COMMENT ON TABLE students IS 'Student-specific data linked to users table';
COMMENT ON TABLE teachers IS 'Teacher-specific data linked to users table';
COMMENT ON TABLE subjects IS 'Engineering college subjects with credits and teacher assignment';
COMMENT ON TABLE marks IS 'Student marks tracking with automatic total calculation';
COMMENT ON COLUMN marks.internal_marks IS 'Internal/continuous evaluation marks (out of 40)';
COMMENT ON COLUMN marks.external_marks IS 'External/final exam marks (out of 60)';
COMMENT ON COLUMN marks.total_marks IS 'Auto-calculated total (internal + external)';
