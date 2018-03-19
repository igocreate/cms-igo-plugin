
--

ALTER TABLE `pages` ADD COLUMN `type`       varchar(20);
UPDATE `pages` SET `type`='page';
UPDATE `pages` SET `type`='post' WHERE `category`='blog';
