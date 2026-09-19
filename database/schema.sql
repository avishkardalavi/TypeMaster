CREATE DATABASE IF NOT EXISTS typemaster;

USE typemaster;


-- =========================================
-- USERS
-- =========================================

CREATE TABLE users (

    id INT AUTO_INCREMENT PRIMARY KEY,

    username VARCHAR(50) NOT NULL UNIQUE,

    email VARCHAR(150) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP

);


-- =========================================
-- TYPING TEST RESULTS
-- =========================================

CREATE TABLE typing_results (

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    wpm INT NOT NULL DEFAULT 0,

    accuracy DECIMAL(5,2) NOT NULL DEFAULT 0,

    mistakes INT NOT NULL DEFAULT 0,

    characters INT NOT NULL DEFAULT 0,

    difficulty ENUM(
        'easy',
        'medium',
        'hard'
    ) DEFAULT 'easy',

    duration INT NOT NULL,

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_results_user

        FOREIGN KEY (user_id)

        REFERENCES users(id)

        ON DELETE CASCADE

);


-- =========================================
-- ACHIEVEMENTS
-- =========================================

CREATE TABLE achievements (

    id INT AUTO_INCREMENT PRIMARY KEY,

    achievement_key VARCHAR(100)
        NOT NULL UNIQUE,

    name VARCHAR(100) NOT NULL,

    description VARCHAR(255) NOT NULL,

    icon VARCHAR(100)

);


-- =========================================
-- USER ACHIEVEMENTS
-- =========================================

CREATE TABLE user_achievements (

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    achievement_id INT NOT NULL,

    unlocked_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (
        user_id,
        achievement_id
    ),

    CONSTRAINT fk_user_achievement_user

        FOREIGN KEY (user_id)

        REFERENCES users(id)

        ON DELETE CASCADE,

    CONSTRAINT fk_user_achievement_achievement

        FOREIGN KEY (achievement_id)

        REFERENCES achievements(id)

        ON DELETE CASCADE

);


-- =========================================
-- DEFAULT ACHIEVEMENTS
-- =========================================

INSERT INTO achievements
(
    achievement_key,
    name,
    description,
    icon
)
VALUES

(
    'first-test',
    'First Steps',
    'Complete your first typing test.',
    'bi-play-circle'
),

(
    'speed-40',
    'Getting Faster',
    'Reach 40 WPM.',
    'bi-lightning'
),

(
    'speed-60',
    'Speed Runner',
    'Reach 60 WPM.',
    'bi-speedometer2'
),

(
    'speed-80',
    'Fast Fingers',
    'Reach 80 WPM.',
    'bi-lightning-charge-fill'
),

(
    'speed-100',
    'Speed Demon',
    'Reach 100 WPM.',
    'bi-trophy-fill'
),

(
    'accuracy',
    'Sharpshooter',
    'Achieve 100% accuracy.',
    'bi-bullseye'
),

(
    'ten-tests',
    'Dedicated Typist',
    'Complete 10 typing tests.',
    'bi-collection'
),

(
    'twenty-five-tests',
    'Typing Veteran',
    'Complete 25 typing tests.',
    'bi-award'
);