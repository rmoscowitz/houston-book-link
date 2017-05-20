-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS mydb;
USE mydb;

-- -----------------------------------------------------
-- Table `mydb`.`libraries`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS mydb.libraries (
  id INT NOT NULL,
  overdrive_id VARCHAR(45) NULL,
  name VARCHAR(45) NULL,
  token VARCHAR(45) NULL,
  PRIMARY KEY (id));



-- -----------------------------------------------------
-- Table `mydb`.`books`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS mydb.books (
  id INT NOT NULL,
  overdrive_id VARCHAR(45) NULL,
  mediaType VARCHAR(45) NULL,
  title VARCHAR(45) NULL,
  subtitle VARCHAR(45) NULL,
  sortTitle VARCHAR(45) NULL,
  primaryCreatorRole VARCHAR(45) NULL,
  primaryCreatorName VARCHAR(45) NULL,
  starRating VARCHAR(45) NULL,
  dateAdded VARCHAR(45) NULL,
  productcol VARCHAR(45) NULL,
  response VARCHAR(45) NULL,
  collection_id INT NULL,
  PRIMARY KEY (id),
  INDEX book_library_fk_idx (collection_id ASC),
  CONSTRAINT book_library_fk
    FOREIGN KEY (collection_id)
    REFERENCES mydb.libraries (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `mydb`.`formats`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`formats` (
  `id` INT NOT NULL,
  `key` VARCHAR(45) NULL,
  `label` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`book_formats`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`book_formats` (
  `id` INT NOT NULL,
  `product_id` INT NULL,
  `format_id` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `product_product_formats_fk_idx` (`product_id` ASC),
  INDEX `product_formats_formats_fk_idx` (`format_id` ASC),
  CONSTRAINT `product_product_formats_fk`
    FOREIGN KEY (`product_id`)
    REFERENCES `mydb`.`books` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `product_formats_formats_fk`
    FOREIGN KEY (`format_id`)
    REFERENCES `mydb`.`formats` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`book_images`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`book_images` (
  `id` INT NOT NULL,
  `product_id` INT NULL,
  `title` VARCHAR(45) NULL,
  `type` VARCHAR(45) NULL,
  `href` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  INDEX `product_fk_idx` (`product_id` ASC),
  CONSTRAINT `product_fk`
    FOREIGN KEY (`product_id`)
    REFERENCES `mydb`.`books` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
