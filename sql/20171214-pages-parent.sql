
--

ALTER TABLE `pages` ADD COLUMN `parent_id`  int(11);
ALTER TABLE `pages` ADD COLUMN `level`      int(11) DEFAULT 0;
ALTER TABLE `pages` ADD COLUMN `site`       varchar(99);
