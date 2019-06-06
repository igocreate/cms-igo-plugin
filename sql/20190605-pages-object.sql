
--
ALTER TABLE `pages` ADD COLUMN `object_type`  VARCHAR(50) AFTER `type`;
ALTER TABLE `pages` ADD COLUMN `object_id`    INT         AFTER `object_type`;
