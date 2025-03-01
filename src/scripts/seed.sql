BEGIN;

INSERT INTO
  students (email, status)
VALUES
  ('studentjon@gmail.com', 'active'),
  ('studenthon@gmail.com', 'active'),
  ('commonstudent1@gmail.com', 'active'),
  ('commonstudent2@gmail.com', 'active'),
  ('student_only_under_teacher_ken@gmail.com', 'active'),
  ('studentmary@gmail.com', 'active');

INSERT INTO
  teachers (email)
VALUES
  ('teacherken@gmail.com'),
  ('teacherjoe@gmail.com');

INSERT INTO
  registrations (teacher_email, student_email)
VALUES
  ('teacherken@gmail.com', 'commonstudent1@gmail.com'),
  ('teacherken@gmail.com', 'commonstudent2@gmail.com'),
  ('teacherken@gmail.com', 'student_only_under_teacher_ken@gmail.com'),
  ('teacherjoe@gmail.com', 'commonstudent1@gmail.com'),
  ('teacherjoe@gmail.com', 'commonstudent2@gmail.com');
COMMIT;
