<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250710220905 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE item CHANGE name name VARCHAR(100) NOT NULL');
        $this->addSql('ALTER TABLE item_request CHANGE name name VARCHAR(100) NOT NULL');
        $this->addSql('ALTER TABLE place CHANGE name name VARCHAR(100) NOT NULL');
        $this->addSql('ALTER TABLE trip CHANGE city city VARCHAR(100) NOT NULL, CHANGE country country VARCHAR(100) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE item CHANGE name name VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE item_request CHANGE name name VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE trip CHANGE city city VARCHAR(255) NOT NULL, CHANGE country country VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE place CHANGE name name VARCHAR(255) NOT NULL');
    }
}
