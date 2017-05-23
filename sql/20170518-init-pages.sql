
--
CREATE TABLE `pages` (
  `id`                  int(11)       NOT NULL AUTO_INCREMENT,
  `author_id`           int(11),
  `lang`                varchar(15),
  `status`              varchar(15),
  `title`               varchar(255),
  `subtitle`            varchar(255),
  `slug`                varchar(255),
  `meta_title`          varchar(255),
  `meta_description`    TEXT,
  `excerpt`             TEXT,
  `body`                TEXT,
  `category`            varchar(255),
  `tags`                varchar(255),
  `image_id`            int(11),
  `menu_id`             int(11),
  `menu_order`          int(11),
  `published_at`        datetime,
  `updated_at`          datetime,
  `created_at`          datetime      NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


--
CREATE TABLE `posts` (
  `id`                  int(11)       NOT NULL AUTO_INCREMENT,
  `author_id`           int(11),
  `lang`                varchar(15),
  `status`              varchar(15),
  `title`               varchar(255),
  `slug`                varchar(255),
  `meta_title`          varchar(255),
  `meta_description`    TEXT,
  `excerpt`             TEXT,
  `body`                TEXT,
  `category`            varchar(255),
  `tags`                varchar(255),
  `image_id`            int(11),
  `published_at`        datetime,
  `updated_at`          datetime,
  `created_at`          datetime      NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


--
CREATE TABLE `medias` (
  `id`                  int(11) NOT NULL AUTO_INCREMENT,
  `uuid`                varchar(99),
  `user_id`             int(11),
  `name`                varchar(255) NOT NULL,
  `description`         text,
  `filename`            varchar(255),
  `type`                varchar(99),
  `size`                int(11),
  `container`           varchar(255),
  `fullpath`            varchar(255),
  `is_deleted`          tinyint(1),
  `deleted_at`          datetime,
  `deleted_by`          int(11),
  `created_at`          datetime      NOT NULL,
PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
