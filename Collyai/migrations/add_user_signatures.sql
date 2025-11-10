-- ============================================
-- 사용자 서명 기능 추가 마이그레이션
-- ============================================

-- 1. userSignatures 테이블 생성
CREATE TABLE IF NOT EXISTS `userSignatures` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `userId` INT NOT NULL,
    `signatureData` LONGTEXT NOT NULL,
    `signatureType` VARCHAR(20) NOT NULL DEFAULT 'image',
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    `deletedAt` DATETIME NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_userId` (`userId`),
    INDEX `idx_deletedAt` (`deletedAt`),
    CONSTRAINT `fk_userSignatures_userId` 
        FOREIGN KEY (`userId`) 
        REFERENCES `users` (`id`) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. recommendation 테이블에 signatureData 컬럼 추가 (이미 있으면 무시됨)
ALTER TABLE `recommendation` 
ADD COLUMN `signatureData` TEXT NULL 
AFTER `content`;

-- 마이그레이션 완료 메시지
SELECT '사용자 서명 기능 테이블 생성 및 컬럼 추가 완료' AS message;

