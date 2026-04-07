# Test Cases for Student Mark Analysis System

**Experiment No:** 9  
**Test Case:** Student Mark Analysis System  
**Date:** 08-04-2024  

---

## Aim

To verify the test cases for the Student Mark Analysis System, ensuring all features work correctly including authentication, mark management, analysis, user management, and reporting.

---

## 1. AUTHENTICATION - LOGIN FORM

### Test Case 1.1: Valid Credentials Login
- **TC ID:** AUTH-001
- **Objective:** Verify that users can log in with valid credentials
- **Precondition:** User has a valid account registered in the system
- **Steps:**
  1. Navigate to the student mark analysis system home page
  2. Click on "Login" for the respective role (Student/Teacher/Admin)
  3. Enter valid email address
  4. Enter valid password
  5. Click "Submit" button
- **Expected Result:** User is successfully logged in and redirected to their respective dashboard
- **Status:** ✓ Pass / ✗ Fail

### Test Case 1.2: Invalid Email Format
- **TC ID:** AUTH-002
- **Objective:** Verify that invalid email format displays an error message
- **Precondition:** None
- **Steps:**
  1. Navigate to login page
  2. Enter email without "@" symbol (e.g., "studentgmail.com")
  3. Enter password
  4. Click "Submit" button
- **Expected Result:** Error message "Please enter a valid email" is displayed
- **Status:** ✓ Pass / ✗ Fail

### Test Case 1.3: Invalid Credentials - Wrong Password
- **TC ID:** AUTH-003
- **Objective:** Verify that incorrect password displays an error message
- **Precondition:** Valid user account exists
- **Steps:**
  1. Navigate to login page
  2. Enter valid email address
  3. Enter incorrect password
  4. Click "Submit" button
- **Expected Result:** Error message "Invalid credentials" or "Email/Password incorrect" is displayed
- **Status:** ✓ Pass / ✗ Fail

### Test Case 1.4: Invalid Credentials - Non-existent User
- **TC ID:** AUTH-004
- **Objective:** Verify that non-existent user email displays an error message
- **Precondition:** Email not registered in system
- **Steps:**
  1. Navigate to login page
  2. Enter unregistered email address
  3. Enter password
  4. Click "Submit" button
- **Expected Result:** Error message "User not found" or "Invalid credentials" is displayed
- **Status:** ✓ Pass / ✗ Fail

### Test Case 1.5: Empty Email Field
- **TC ID:** AUTH-005
- **Objective:** Verify that empty email field prevents form submission
- **Precondition:** None
- **Steps:**
  1. Navigate to login page
  2. Leave email field empty
  3. Enter password
  4. Click "Submit" button
- **Expected Result:** Error message "Please fill in all fields" is displayed
- **Status:** ✓ Pass / ✗ Fail

### Test Case 1.6: Empty Password Field
- **TC ID:** AUTH-006
- **Objective:** Verify that empty password field prevents form submission
- **Precondition:** None
- **Steps:**
  1. Navigate to login page
  2. Enter valid email
  3. Leave password field empty
  4. Click "Submit" button
- **Expected Result:** Error message "Please fill in all fields" is displayed
- **Status:** ✓ Pass / ✗ Fail

### Test Case 1.7: Password Length Validation
- **TC ID:** AUTH-007
- **Objective:** Verify that password less than 6 characters is rejected
- **Precondition:** None
- **Steps:**
  1. Navigate to login page
  2. Enter valid email
  3. Enter password with less than 6 characters (e.g., "pass")
  4. Click "Submit" button
- **Expected Result:** Error message "Password must be at least 6 characters" is displayed
- **Status:** ✓ Pass / ✗ Fail

### Test Case 1.8: Email and Password Case Sensitivity
- **TC ID:** AUTH-008
- **Objective:** Verify email handling and password case sensitivity
- **Precondition:** Valid user account exists with specific email case
- **Steps:**
  1. Navigate to login page
  2. Enter email with different case variations (e.g., "Student@Gmail.Com" vs "student@gmail.com")
  3. Enter password (case-sensitive)
  4. Click "Submit" button
- **Expected Result:** Email is case-insensitive, password is case-sensitive; login only succeeds with correct password case
- **Status:** ✓ Pass / ✗ Fail

### Test Case 1.9: Login with Different User Roles
- **TC ID:** AUTH-009
- **Objective:** Verify that login redirects to correct dashboard based on user role
- **Precondition:** Test accounts for each role (Student, Teacher, Admin) exist
- **Steps:**
  1. Log in as Student with valid credentials
  2. Verify Student Dashboard is displayed
  3. Log out and log in as Teacher
  4. Verify Teacher Dashboard is displayed
  5. Log out and log in as Admin
  6. Verify Admin Dashboard is displayed
- **Expected Result:** Each role is redirected to their respective dashboard
- **Status:** ✓ Pass / ✗ Fail

### Test Case 1.10: Session Persistence
- **TC ID:** AUTH-010
- **Objective:** Verify that user session persists on page refresh
- **Precondition:** User is logged in
- **Steps:**
  1. Log in with valid credentials
  2. Navigate to a dashboard section
  3. Refresh the page (F5)
  4. Verify user is still logged in
- **Expected Result:** User session is maintained after page refresh
- **Status:** ✓ Pass / ✗ Fail

---

## 2. AUTHENTICATION - SIGN-UP FORM

### Test Case 2.1: Successful Sign-up
- **TC ID:** SIGNUP-001
- **Objective:** Verify that new user can successfully sign up
- **Precondition:** None
- **Steps:**
  1. Navigate to sign-up page
  2. Fill in Name field with valid name
  3. Fill in Email field with unique email
  4. Fill in Phone field with 10 digits
  5. Select Role (Student/Teacher)
  6. Create Password (minimum 6 characters)
  7. Click "Sign Up" button
- **Expected Result:** User account is created and user is redirected to login page with success message
- **Status:** ✓ Pass / ✗ Fail

### Test Case 2.2: Name Validation - Letters Only
- **TC ID:** SIGNUP-002
- **Objective:** Verify that name field only accepts letters
- **Precondition:** None
- **Steps:**
  1. Navigate to sign-up page
  2. Enter name with numbers (e.g., "Student123")
  3. Try to submit form
- **Expected Result:** Error message "Name should contain only letters" is displayed
- **Status:** ✓ Pass / ✗ Fail

### Test Case 2.3: Name Validation - No Special Characters
- **TC ID:** SIGNUP-003
- **Objective:** Verify that name doesn't accept special characters
- **Precondition:** None
- **Steps:**
  1. Navigate to sign-up page
  2. Enter name with special characters (e.g., "Student@#$")
  3. Try to submit form
- **Expected Result:** Error message "Name should contain only letters" is displayed
- **Status:** ✓ Pass / ✗ Fail

### Test Case 2.4: Email Format Validation
- **TC ID:** SIGNUP-004
- **Objective:** Verify that email must be in valid format
- **Precondition:** None
- **Steps:**
  1. Navigate to sign-up page
  2. Enter invalid email format (e.g., "studentgmail" or "student@.com")
  3. Try to submit form
- **Expected Result:** Error message "Email should be in email format" is displayed
- **Status:** ✓ Pass / ✗ Fail

### Test Case 2.5: Phone Number Validation - 10 Digits
- **TC ID:** SIGNUP-005
- **Objective:** Verify that phone number must be exactly 10 digits
- **Precondition:** None
- **Steps:**
  1. Navigate to sign-up page
  2. Enter phone number with less than 10 digits (e.g., "98765")
  3. Try to submit form
  4. Then enter phone number with more than 10 digits (e.g., "98765432109")
  5. Try to submit form
- **Expected Result:** Error message "Phone number should be 10 digits" is displayed for both cases
- **Status:** ✓ Pass / ✗ Fail

### Test Case 2.6: Duplicate Email Registration
- **TC ID:** SIGNUP-006
- **Objective:** Verify that duplicate email cannot be registered
- **Precondition:** An account with specific email already exists
- **Steps:**
  1. Navigate to sign-up page
  2. Enter email that already exists in system
  3. Fill in other fields correctly
  4. Click "Sign Up" button
- **Expected Result:** Error message "Email already exists" is displayed
- **Status:** ✓ Pass / ✗ Fail

### Test Case 2.7: Empty Name Field
- **TC ID:** SIGNUP-007
- **Objective:** Verify that empty name field prevents submission
- **Precondition:** None
- **Steps:**
  1. Navigate to sign-up page
  2. Leave name field empty
  3. Fill other fields correctly
  4. Click "Sign Up" button
- **Expected Result:** Error message "Name is required" or "Please fill in all fields" is displayed
- **Status:** ✓ Pass / ✗ Fail

### Test Case 2.8: Empty Email Field
- **TC ID:** SIGNUP-008
- **Objective:** Verify that empty email field prevents submission
- **Precondition:** None
- **Steps:**
  1. Navigate to sign-up page
  2. Fill name and other fields
  3. Leave email field empty
  4. Click "Sign Up" button
- **Expected Result:** Error message "Email is required" or "Please fill in all fields" is displayed
- **Status:** ✓ Pass / ✗ Fail

### Test Case 2.9: Empty Phone Field
- **TC ID:** SIGNUP-009
- **Objective:** Verify that empty phone field prevents submission
- **Precondition:** None
- **Steps:**
  1. Navigate to sign-up page
  2. Fill all fields except phone
  3. Click "Sign Up" button
- **Expected Result:** Error message "Phone is required" or "Please fill in all fields" is displayed
- **Status:** ✓ Pass / ✗ Fail

### Test Case 2.10: Weak Password Validation
- **TC ID:** SIGNUP-010
- **Objective:** Verify that password must meet minimum length requirement
- **Precondition:** None
- **Steps:**
  1. Navigate to sign-up page
  2. Fill all fields with valid data
  3. Enter password with less than 6 characters
  4. Click "Sign Up" button
- **Expected Result:** Error message "Password must be at least 6 characters" is displayed
- **Status:** ✓ Pass / ✗ Fail

---

## 3. STUDENT FEATURES - VIEW MARKS

### Test Case 3.1: View All Marks
- **TC ID:** STUDENT-001
- **Objective:** Verify that student can view all their marks
- **Precondition:** Student is logged in and has marks entered
- **Steps:**
  1. Log in as student
  2. Navigate to "View Marks" section
  3. Verify all marks are displayed in a table/list format
- **Expected Result:** All marks across subjects and exams are displayed correctly
- **Status:** ✓ Pass / ✗ Fail

### Test Case 3.2: Mark Display Format
- **TC ID:** STUDENT-002
- **Objective:** Verify that marks are displayed in correct format
- **Precondition:** Student is logged in
- **Steps:**
  1. Log in as student
  2. Navigate to "View Marks" section
  3. Check if marks display format includes: Subject name, Exam type, Mark obtained, Total marks, Grade
- **Expected Result:** All required information is displayed in organized format
- **Status:** ✓ Pass / ✗ Fail

### Test Case 3.3: View Marks - No Marks Entered
- **TC ID:** STUDENT-003
- **Objective:** Verify appropriate message when student has no marks
- **Precondition:** Student is logged in but has no marks entered
- **Steps:**
  1. Log in as student with no marks
  2. Navigate to "View Marks" section
  3. Observe the display
- **Expected Result:** Message "No marks found" or empty table is displayed
- **Status:** ✓ Pass / ✗ Fail

### Test Case 3.4: Mark Search/Filter
- **TC ID:** STUDENT-004
- **Objective:** Verify that student can search or filter marks by subject
- **Precondition:** Student has multiple marks in different subjects
- **Steps:**
  1. Log in as student
  2. Navigate to "View Marks" section
  3. Use search/filter to find marks for specific subject
  4. Verify only relevant marks are displayed
- **Expected Result:** Only marks from selected subject are displayed
- **Status:** ✓ Pass / ✗ Fail

---

## 4. STUDENT FEATURES - PERFORMANCE ANALYSIS

### Test Case 4.1: View Performance Analysis Dashboard
- **TC ID:** STUDENT-005
- **Objective:** Verify that student can view performance analysis
- **Precondition:** Student is logged in and has marks
- **Steps:**
  1. Log in as student
  2. Navigate to "Performance Analysis" section
  3. Verify dashboard is displayed with various metrics
- **Expected Result:** Performance analysis dashboard loads successfully
- **Status:** ✓ Pass / ✗ Fail

### Test Case 4.2: GPA Calculation Display
- **TC ID:** STUDENT-006
- **Objective:** Verify that GPA is calculated and displayed correctly
- **Precondition:** Student has marks in multiple subjects
- **Steps:**
  1. Log in as student
  2. View performance analysis
  3. Verify GPA is displayed
  4. Calculate manually and verify accuracy
- **Expected Result:** GPA is displayed correctly based on marks
- **Status:** ✓ Pass / ✗ Fail

### Test Case 4.3: Charts and Graphs Display
- **TC ID:** STUDENT-007
- **Objective:** Verify that performance charts are rendered correctly
- **Precondition:** Student has marks data
- **Steps:**
  1. Log in as student
  2. Navigate to Performance Analysis
  3. Verify charts for grade distribution are displayed
- **Expected Result:** Charts render correctly and data is visualized
- **Status:** ✓ Pass / ✗ Fail

### Test Case 4.4: Subject-wise Analysis
- **TC ID:** STUDENT-008
- **Objective:** Verify subject-wise performance breakdown
- **Precondition:** Student has marks in multiple subjects
- **Steps:**
  1. Log in as student
  2. View performance analysis
  3. Check subject-wise marks breakdown
  4. Compare with marks in View Marks section
- **Expected Result:** Subject-wise analysis matches actual marks
- **Status:** ✓ Pass / ✗ Fail

---

## 5. TEACHER FEATURES - ENTER MARKS

### Test Case 5.1: Successfully Enter Marks for Student
- **TC ID:** TEACHER-001
- **Objective:** Verify that teacher can enter marks for students
- **Precondition:** Teacher is logged in, students exist in system
- **Steps:**
  1. Log in as teacher
  2. Navigate to "Enter Marks" section
  3. Select a student
  4. Select a subject
  5. Enter mark (e.g., 45)
  6. Click "Submit" button
- **Expected Result:** Mark is saved successfully and confirmation message is displayed
- **Status:** ✓ Pass / ✗ Fail

### Test Case 5.2: Mark Validation - Range Check
- **TC ID:** TEACHER-002
- **Objective:** Verify that marks are within valid range (0-100)
- **Precondition:** Teacher is in mark entry form
- **Steps:**
  1. Log in as teacher
  2. Navigate to "Enter Marks" section
  3. Enter mark greater than 100 (e.g., 150)
  4. Try to submit
  5. Then enter negative mark (e.g., -10)
  6. Try to submit
- **Expected Result:** Error message "Mark should be between 0 and 100" is displayed for both cases
- **Status:** ✓ Pass / ✗ Fail

### Test Case 5.3: Mark Entry - Empty Fields
- **TC ID:** TEACHER-003
- **Objective:** Verify that required fields must be filled before submission
- **Precondition:** Teacher is in mark entry form
- **Steps:**
  1. Log in as teacher
  2. Navigate to "Enter Marks" section
  3. Leave any required field empty (Student/Subject/Mark)
  4. Try to submit
- **Expected Result:** Error message "Please fill in all fields" is displayed
- **Status:** ✓ Pass / ✗ Fail

### Test Case 5.4: Mark Entry - Decimal Marks
- **TC ID:** TEACHER-004
- **Objective:** Verify that decimal marks are handled correctly
- **Precondition:** Teacher is in mark entry form
- **Steps:**
  1. Log in as teacher
  2. Enter mark with decimal value (e.g., 45.5)
  3. Submit
- **Expected Result:** Mark is saved and displayed with decimal precision
- **Status:** ✓ Pass / ✗ Fail

### Test Case 5.5: Update Existing Marks
- **TC ID:** TEACHER-005
- **Objective:** Verify that teacher can update previously entered marks
- **Precondition:** Mark already exists for a student
- **Steps:**
  1. Log in as teacher
  2. Navigate to "Enter Marks" section
  3. Select same student and subject where mark exists
  4. Change the mark value
  5. Submit
- **Expected Result:** Mark is updated successfully without creating duplicate entry
- **Status:** ✓ Pass / ✗ Fail

---

## 6. TEACHER FEATURES - SUBJECT ANALYSIS

### Test Case 6.1: View Subject Analysis
- **TC ID:** TEACHER-006
- **Objective:** Verify that teacher can view subject-wise analysis
- **Precondition:** Teacher is logged in and has marks for students
- **Steps:**
  1. Log in as teacher
  2. Navigate to "Subject Analysis" section
  3. Verify analysis is displayed
- **Expected Result:** Subject analysis dashboard loads and shows subject statistics
- **Status:** ✓ Pass / ✗ Fail

### Test Case 6.2: Class Statistics
- **TC ID:** TEACHER-007
- **Objective:** Verify that teacher can see class statistics
- **Precondition:** Teacher has students with marks
- **Steps:**
  1. Log in as teacher
  2. View Subject Analysis
  3. Check for metrics: Average marks, passing percentage, highest score, lowest score
- **Expected Result:** Class statistics are displayed and calculated correctly
- **Status:** ✓ Pass / ✗ Fail

### Test Case 6.3: Student Ranking
- **TC ID:** TEACHER-008
- **Objective:** Verify that students are ranked by performance
- **Precondition:** Multiple students have marks
- **Steps:**
  1. Log in as teacher
  2. View Subject Analysis
  3. Verify students are ranked from highest to lowest marks
- **Expected Result:** Ranking is displayed correctly
- **Status:** ✓ Pass / ✗ Fail

---

## 7. ADMIN FEATURES - USER MANAGEMENT

### Test Case 7.1: Create Student User
- **TC ID:** ADMIN-001
- **Objective:** Verify that admin can create new student accounts
- **Precondition:** Admin is logged in
- **Steps:**
  1. Log in as admin
  2. Navigate to "Create User" section
  3. Select role as "Student"
  4. Enter name, email, phone
  5. Create credentials
  6. Click "Create" button
- **Expected Result:** Student account is created successfully
- **Status:** ✓ Pass / ✗ Fail

### Test Case 7.2: Create Teacher User
- **TC ID:** ADMIN-002
- **Objective:** Verify that admin can create new teacher accounts
- **Precondition:** Admin is logged in
- **Steps:**
  1. Log in as admin
  2. Navigate to "Create User" section
  3. Select role as "Teacher"
  4. Fill in all required information
  5. Click "Create" button
- **Expected Result:** Teacher account is created successfully
- **Status:** ✓ Pass / ✗ Fail

### Test Case 7.3: User Validation - Email Format
- **TC ID:** ADMIN-003
- **Objective:** Verify that admin account creation validates email format
- **Precondition:** Admin is in create user form
- **Steps:**
  1. Log in as admin
  2. Try to create user with invalid email
  3. Try to submit
- **Expected Result:** Error message "Invalid email format" is displayed
- **Status:** ✓ Pass / ✗ Fail

### Test Case 7.4: Prevent Duplicate Email Registration
- **TC ID:** ADMIN-004
- **Objective:** Verify that duplicate emails cannot be registered
- **Precondition:** User with specific email already exists
- **Steps:**
  1. Log in as admin
  2. Try to create user with existing email
  3. Click "Create" button
- **Expected Result:** Error message "Email already exists" is displayed
- **Status:** ✓ Pass / ✗ Fail

### Test Case 7.5: Edit User Information
- **TC ID:** ADMIN-005
- **Objective:** Verify that admin can edit user information
- **Precondition:** User exists in system
- **Steps:**
  1. Log in as admin
  2. Navigate to user list
  3. Select user to edit
  4. Modify name or phone
  5. Click "Update" button
- **Expected Result:** User information is updated successfully
- **Status:** ✓ Pass / ✗ Fail

### Test Case 7.6: Delete User
- **TC ID:** ADMIN-006
- **Objective:** Verify that admin can delete user accounts
- **Precondition:** User exists and can be deleted
- **Steps:**
  1. Log in as admin
  2. Navigate to user list
  3. Select user to delete
  4. Confirm deletion
- **Expected Result:** User is deleted from system and no longer available
- **Status:** ✓ Pass / ✗ Fail

---

## 8. ADMIN FEATURES - SUBJECT MANAGEMENT

### Test Case 8.1: Create Subject
- **TC ID:** ADMIN-007
- **Objective:** Verify that admin can create new subjects
- **Precondition:** Admin is logged in
- **Steps:**
  1. Log in as admin
  2. Navigate to "Manage Subjects" section
  3. Click "Add Subject"
  4. Enter subject name
  5. Click "Create" button
- **Expected Result:** Subject is created successfully and added to system
- **Status:** ✓ Pass / ✗ Fail

### Test Case 8.2: Edit Subject
- **TC ID:** ADMIN-008
- **Objective:** Verify that admin can edit subject details
- **Precondition:** Subject exists in system
- **Steps:**
  1. Log in as admin
  2. Navigate to "Manage Subjects" section
  3. Select subject to edit
  4. Modify subject name
  5. Click "Update" button
- **Expected Result:** Subject information is updated successfully
- **Status:** ✓ Pass / ✗ Fail

### Test Case 8.3: Delete Subject
- **TC ID:** ADMIN-009
- **Objective:** Verify that admin can delete subjects
- **Precondition:** Subject exists and has no dependent marks
- **Steps:**
  1. Log in as admin
  2. Navigate to "Manage Subjects" section
  3. Select subject to delete
  4. Confirm deletion
- **Expected Result:** Subject is deleted from system
- **Status:** ✓ Pass / ✗ Fail

### Test Case 8.4: Subject Name Validation
- **TC ID:** ADMIN-010
- **Objective:** Verify that subject name is validated
- **Precondition:** Admin is in create subject form
- **Steps:**
  1. Navigate to create subject
  2. Try to create with empty name
  3. Try with special characters only
- **Expected Result:** Error messages are displayed for invalid inputs
- **Status:** ✓ Pass / ✗ Fail

---

## 9. ADMIN FEATURES - REPORTS

### Test Case 9.1: Generate GPA Report
- **TC ID:** ADMIN-011
- **Objective:** Verify that admin can generate GPA report
- **Precondition:** Admin is logged in and student data exists
- **Steps:**
  1. Log in as admin
  2. Navigate to "Reports" section
  3. Select "GPA Report"
  4. Click "Generate"
- **Expected Result:** GPA report is generated with CGPA calculations for all students
- **Status:** ✓ Pass / ✗ Fail

### Test Case 9.2: Generate Failed Students Report
- **TC ID:** ADMIN-012
- **Objective:** Verify that admin can identify failed students
- **Precondition:** Some students have marks below passing grade
- **Steps:**
  1. Log in as admin
  2. Navigate to Reports
  3. Generate "Failed Students" report
  4. Verify list shows students with marks below 40 (or defined passing mark)
- **Expected Result:** Report correctly identifies and lists failed students
- **Status:** ✓ Pass / ✗ Fail

### Test Case 9.3: Generate Top Performers Report
- **TC ID:** ADMIN-013
- **Objective:** Verify that admin can view top performing students
- **Precondition:** Multiple students with varying marks exist
- **Steps:**
  1. Log in as admin
  2. Navigate to Reports
  3. Generate "Top Performers" report
  4. Verify students are ranked by GPA/marks
- **Expected Result:** Top performers are correctly identified and ranked
- **Status:** ✓ Pass / ✗ Fail

### Test Case 9.4: Generate Student Marks Report
- **TC ID:** ADMIN-014
- **Objective:** Verify that admin can export student marks report
- **Precondition:** Student marks exist
- **Steps:**
  1. Log in as admin
  2. Navigate to Reports
  3. Generate "Student Marks" report
  4. Verify all students and their marks are included
- **Expected Result:** Report contains accurate marks for all students
- **Status:** ✓ Pass / ✗ Fail

### Test Case 9.5: Report Export Functionality
- **TC ID:** ADMIN-015
- **Objective:** Verify that reports can be exported (PDF/CSV)
- **Precondition:** Report is generated
- **Steps:**
  1. Generate a report
  2. Click "Export" or "Download"
  3. Select format (PDF or CSV)
  4. Verify file downloads
- **Expected Result:** Report is exported in selected format successfully
- **Status:** ✓ Pass / ✗ Fail

### Test Case 9.6: System Statistics Dashboard
- **TC ID:** ADMIN-016
- **Objective:** Verify that admin can view system-wide statistics
- **Precondition:** Data exists in system
- **Steps:**
  1. Log in as admin
  2. View dashboard/main report section
  3. Check for metrics: Total students, Total teachers, Average GPA, Pass percentage
- **Expected Result:** System statistics are displayed and calculated correctly
- **Status:** ✓ Pass / ✗ Fail

---

## 10. NAVIGATION & UI FEATURES

### Test Case 10.1: Navigation Between Sections
- **TC ID:** NAV-001
- **Objective:** Verify smooth navigation between dashboard sections
- **Precondition:** User is logged in
- **Steps:**
  1. Log in with valid credentials
  2. Click on different menu items (e.g., View Marks, Analysis, etc.)
  3. Verify each section loads correctly
- **Expected Result:** All sections load without errors, navigation is smooth
- **Status:** ✓ Pass / ✗ Fail

### Test Case 10.2: Logout Functionality
- **TC ID:** NAV-002
- **Objective:** Verify that users can log out successfully
- **Precondition:** User is logged in
- **Steps:**
  1. Click "Logout" button
  2. Verify redirect to login/home page
  3. Try to navigate back to dashboard using browser back button
- **Expected Result:** User is logged out, cannot access protected pages
- **Status:** ✓ Pass / ✗ Fail

### Test Case 10.3: Protected Routes
- **TC ID:** NAV-003
- **Objective:** Verify that unauthenticated users cannot access protected pages
- **Precondition:** None
- **Steps:**
  1. Without logging in, try to access dashboard URL directly
  2. Verify redirect to login page
- **Expected Result:** User is redirected to login page
- **Status:** ✓ Pass / ✗ Fail

### Test Case 10.4: Role-Based Access Control
- **TC ID:** NAV-004
- **Objective:** Verify that users can only access their role-specific features
- **Precondition:** Different user accounts exist for each role
- **Steps:**
  1. Log in as student and verify only student features are available
  2. Log out and log in as teacher, verify only teacher features are available
  3. Log out and log in as admin, verify only admin features are available
- **Expected Result:** Each role can only access their designated features
- **Status:** ✓ Pass / ✗ Fail

### Test Case 10.5: Responsive Design - Mobile
- **TC ID:** NAV-005
- **Objective:** Verify that application is responsive on mobile devices
- **Precondition:** None
- **Steps:**
  1. Open application on mobile device or simulate mobile view (DevTools)
  2. Navigate through different sections
  3. Check if hamburger menu works
  4. Verify all content is readable on small screen
- **Expected Result:** Application is fully functional and readable on mobile
- **Status:** ✓ Pass / ✗ Fail

### Test Case 10.6: Responsive Design - Tablet
- **TC ID:** NAV-006
- **Objective:** Verify that application is responsive on tablet devices
- **Precondition:** None
- **Steps:**
  1. Open application on tablet or simulate tablet view
  2. Verify layout adapts properly
  3. Check sidebar and content area responsiveness
- **Expected Result:** Application displays correctly on tablet screen size
- **Status:** ✓ Pass / ✗ Fail

### Test Case 10.7: Hamburger Menu Functionality
- **TC ID:** NAV-007
- **Objective:** Verify that hamburger menu works on mobile
- **Precondition:** Viewing on mobile/small screen
- **Steps:**
  1. Click hamburger menu icon
  2. Verify sidebar opens
  3. Close menu by clicking menu item or overlay
  4. Verify menu closes
- **Expected Result:** Menu toggles correctly
- **Status:** ✓ Pass / ✗ Fail

---

## 11. SECURITY & VALIDATION TESTS

### Test Case 11.1: SQL Injection Prevention - Login
- **TC ID:** SEC-001
- **Objective:** Verify that application prevents SQL injection in login
- **Precondition:** None
- **Steps:**
  1. Navigate to login
  2. Enter SQL injection payload in email field (e.g., "' OR '1'='1")
  3. Try to submit
- **Expected Result:** Invalid login, no database compromise, normal error message
- **Status:** ✓ Pass / ✗ Fail

### Test Case 11.2: XSS Prevention - User Input
- **TC ID:** SEC-002
- **Objective:** Verify that XSS attacks are prevented
- **Precondition:** None
- **Steps:**
  1. Try to enter script tags in form fields (e.g., "<script>alert('XSS')</script>")
  2. Submit and verify it doesn't execute
- **Expected Result:** Script is not executed, input is sanitized
- **Status:** ✓ Pass / ✗ Fail

### Test Case 11.3: Password Encryption
- **TC ID:** SEC-003
- **Objective:** Verify that passwords are encrypted in database
- **Precondition:** User account exists
- **Steps:**
  1. Directly check database (if accessible)
  2. Verify password is not stored as plain text
- **Expected Result:** Password is hashed/encrypted in database
- **Status:** ✓ Pass / ✗ Fail

### Test Case 11.4: JWT Token Validation
- **TC ID:** SEC-004
- **Objective:** Verify that JWT tokens are properly validated
- **Precondition:** User is logged in
- **Steps:**
  1. Log in and note the token (if visible in browser storage)
  2. Try to use expired or modified token
  3. Verify unauthorized access is blocked
- **Expected Result:** Invalid tokens are rejected
- **Status:** ✓ Pass / ✗ Fail

---

## 12. PERFORMANCE TESTS

### Test Case 12.1: Page Load Time
- **TC ID:** PERF-001
- **Objective:** Verify that pages load within acceptable time
- **Precondition:** None
- **Steps:**
  1. Navigate to each main page
  2. Measure load time using browser DevTools
- **Expected Result:** Pages load in less than 3 seconds
- **Status:** ✓ Pass / ✗ Fail

### Test Case 12.2: Dashboard with Large Dataset
- **TC ID:** PERF-002
- **Objective:** Verify that dashboard performs well with many records
- **Precondition:** System has large amount of mark data (1000+ records)
- **Steps:**
  1. Log in and navigate to dashboard
  2. Monitor performance and UI responsiveness
- **Expected Result:** Dashboard loads and remains responsive even with large data
- **Status:** ✓ Pass / ✗ Fail

### Test Case 12.3: Concurrent User Access
- **TC ID:** PERF-003
- **Objective:** Verify that system handles concurrent users
- **Precondition:** Multiple user accounts exist
- **Steps:**
  1. Simulate 10-20 concurrent logins
  2. Monitor system response time and stability
- **Expected Result:** System remains stable and responsive
- **Status:** ✓ Pass / ✗ Fail

---

## 13. ERROR HANDLING TESTS

### Test Case 13.1: Server Error Handling
- **TC ID:** ERR-001
- **Objective:** Verify that server errors display appropriate messages
- **Precondition:** Server is experiencing errors
- **Steps:**
  1. When server error occurs
  2. Verify user-friendly error message is displayed
  3. Verify application doesn't crash
- **Expected Result:** Error message is user-friendly, application remains stable
- **Status:** ✓ Pass / ✗ Fail

### Test Case 13.2: Network Timeout Handling
- **TC ID:** ERR-002
- **Objective:** Verify handling of network timeouts
- **Precondition:** None
- **Steps:**
  1. Simulate slow network (using DevTools)
  2. Try to load dashboard
  3. Verify loading indicator or timeout message appears
- **Expected Result:** Appropriate timeout message is displayed
- **Status:** ✓ Pass / ✗ Fail

### Test Case 13.3: Invalid Database Connection
- **TC ID:** ERR-003
- **Objective:** Verify error handling when database is unavailable
- **Precondition:** Database connection is broken
- **Steps:**
  1. Try to load data when database is down
  2. Observe error handling
- **Expected Result:** User sees appropriate error message
- **Status:** ✓ Pass / ✗ Fail

---

## RESULT SUMMARY

| Feature | Total Test Cases | Passed | Failed | Notes |
|---------|-----------------|--------|--------|-------|
| Authentication | 10 | | | |
| Sign-up | 10 | | | |
| Student Features | 8 | | | |
| Teacher Features | 8 | | | |
| Admin Features | 16 | | | |
| Navigation & UI | 7 | | | |
| Security | 4 | | | |
| Performance | 3 | | | |
| Error Handling | 3 | | | |
| **TOTAL** | **69** | | | |

---

## CONCLUSION

Thus, the test cases for the Student Mark Analysis System have been developed and verified successfully. The comprehensive test suite covers all critical functionality including authentication, user management, mark entry and analysis, reporting, security, and performance aspects of the system.

**Tested By:** [QA Team Name]  
**Tested Date:** 08-04-2024  
**Status:** Ready for Implementation ✓

---

## NOTES FOR TESTERS

1. **Test Environment:** Ensure backend server is running on port 5000
2. **Database:** Use test database with sample data
3. **Test Accounts:** Use predefined test accounts for each role
4. **Documentation:** Record actual vs expected results in the Status column
5. **Bug Reporting:** Any failed test cases should have detailed bug reports
6. **Regression Testing:** After bug fixes, retest the related test cases

---
