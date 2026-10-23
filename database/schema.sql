-- ====================================================================
-- WorkforceIQ Database Schema
-- Compatible with MySQL 8.0+ and MySQL-compatible Cloud Databases (TiDB, Aiven, Railway, etc.)
-- ====================================================================

-- 1. Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `career` VARCHAR(255) DEFAULT NULL,
  `education` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(255) NOT NULL,
  `goal` VARCHAR(255) DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `study_days` INT DEFAULT NULL,
  `study_hours` INT DEFAULT NULL,
  `year` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. User Skills table
CREATE TABLE IF NOT EXISTS `user_skills` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `skill_name` VARCHAR(255) NOT NULL,
  `confidence` INT NOT NULL DEFAULT 50,
  `evidence_count` INT DEFAULT 0,
  `evidence_strength` VARCHAR(50) DEFAULT 'NONE',
  `last_assessed_at` DATETIME(6) DEFAULT NULL,
  `performance_score` DOUBLE DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_user_skills_user_skill` (`user_id`, `skill_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Evidence table
CREATE TABLE IF NOT EXISTS `evidence` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `skill_name` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) DEFAULT NULL,
  `evidence_type` VARCHAR(255) NOT NULL,
  `score` INT NOT NULL,
  `marks_obtained` DOUBLE DEFAULT NULL,
  `max_marks` DOUBLE DEFAULT NULL,
  `description` VARCHAR(1000) DEFAULT NULL,
  `evidence_url` VARCHAR(500) DEFAULT NULL,
  `is_verified` BIT(1) DEFAULT b'0',
  `assessment_date` DATETIME(6) DEFAULT NULL,
  `created_at` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Learning Progress table
CREATE TABLE IF NOT EXISTS `learning_progress` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `skill_name` VARCHAR(255) NOT NULL,
  `topic_name` VARCHAR(255) NOT NULL,
  `progress` INT NOT NULL DEFAULT 0,
  `completed` BIT(1) NOT NULL DEFAULT b'0',
  `updated_at` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Problem Progress table
CREATE TABLE IF NOT EXISTS `problem_progress` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `problem_id` VARCHAR(100) NOT NULL,
  `skill_name` VARCHAR(100) NOT NULL,
  `topic_name` VARCHAR(150) NOT NULL,
  `status` VARCHAR(30) NOT NULL,
  `attempts` INT NOT NULL DEFAULT 1,
  `score` DOUBLE DEFAULT 0,
  `solution_code` TEXT,
  `last_activity_at` DATETIME(6) NOT NULL,
  `completed_at` DATETIME(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_problem_user` (`user_id`),
  KEY `idx_problem_user_skill` (`user_id`, `skill_name`),
  KEY `idx_problem_user_problem` (`user_id`, `problem_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Progress History table
CREATE TABLE IF NOT EXISTS `progress_history` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `readiness_score` INT NOT NULL,
  `created_at` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Study Sessions table
CREATE TABLE IF NOT EXISTS `study_sessions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `skill` VARCHAR(255) NOT NULL,
  `duration` BIGINT NOT NULL,
  `session_date` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
