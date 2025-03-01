BEGIN;

INSERT INTO
  students (email)
VALUES
  ('studentjon@gmail.com'),
  ('studenthon@gmail.com'),
  ('commonstudent1@gmail.com'),
  ('commonstudent2@gmail.com'),
  ('student_only_under_teacher_ken@gmail.com');

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
