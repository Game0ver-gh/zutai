<?php
namespace App\Model;

use App\Service\Config;

class Article
{
    private ?int $id = null;
    private ?string $title = null;
    private ?string $body = null;
    private ?string $author = null;

    public function fill($array): Article
    {
        if (isset($array['id']) && !$this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['title'])) {
            $this->setTitle($array['title']);
        }
        if (isset($array['body'])) {
            $this->setBody($array['body']);
        }
        if (isset($array['author'])) {
            $this->setAuthor($array['author']);
        }

        return $this;
    }

    public static function fromArray($array): Article
    {
        $article = new self();
        $article->fill($array);
        return $article;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $statement = $pdo->query('SELECT * FROM articles');
        $articlesArray = $statement->fetchAll(\PDO::FETCH_ASSOC);

        return array_map(function ($articleArray) {
            return self::fromArray($articleArray);
        }, $articlesArray);
    }

    public static function find($id): ?Article
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM articles WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->bindValue(':id', $id);
        $statement->execute();

        $articleArray = $statement->fetch(\PDO::FETCH_ASSOC);
        return $articleArray ? self::fromArray($articleArray) : null;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if ($this->id) {
            $sql = 'UPDATE articles SET title = :title, body = :body, author = :author WHERE id = :id';
            $statement = $pdo->prepare($sql);
            $statement->bindValue(':id', $this->id);
        } else {
            $sql = 'INSERT INTO articles (title, body, author) VALUES (:title, :body, :author)';
            $statement = $pdo->prepare($sql);
        }

        $statement->bindValue(':title', $this->title);
        $statement->bindValue(':body', $this->body);
        $statement->bindValue(':author', $this->author);
        $statement->execute();

        if (!$this->id) {
            $this->id = $pdo->lastInsertId();
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'DELETE FROM articles WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->bindValue(':id', $this->id);
        $statement->execute();
    }



}
