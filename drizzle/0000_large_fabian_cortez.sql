CREATE TABLE `students` (
	`email` varchar(255) NOT NULL,
	`status` enum('active','suspended'),
	CONSTRAINT `students_email` PRIMARY KEY(`email`)
);
--> statement-breakpoint
CREATE TABLE `registrations` (
	`teacher_email` varchar(255) NOT NULL,
	`student_email` varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `teachers` (
	`email` varchar(255) NOT NULL,
	CONSTRAINT `teachers_email` PRIMARY KEY(`email`)
);
--> statement-breakpoint
ALTER TABLE `registrations` ADD CONSTRAINT `registrations_teacher_email_teachers_email_fk` FOREIGN KEY (`teacher_email`) REFERENCES `teachers`(`email`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `registrations` ADD CONSTRAINT `registrations_student_email_students_email_fk` FOREIGN KEY (`student_email`) REFERENCES `students`(`email`) ON DELETE no action ON UPDATE no action;