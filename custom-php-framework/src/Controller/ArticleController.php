<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Article;
use App\Service\Router;
use App\Service\Templating;

class ArticleController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $articles = Article::findAll();
        $html = $templating->render('article/index.html.php', [
            'articles' => $articles,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestPost, Templating $templating, Router $router): ?string
    {
        if ($requestPost) {
            $article = Article::fromArray($requestPost);

            $article->save();

            $path = $router->generatePath('article-index');
            $router->redirect($path);
            return null;
        } else {
            $article = new Article();
        }

        $html = $templating->render('article/create.html.php', [
            'article' => $article,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $postId, ?array $requestPost, Templating $templating, Router $router): ?string
    {
        $article = Article::find($articleId);
        if (!$article) {
            throw new NotFoundException("Missing article with id $articleId");
        }

        if ($requestPost) {
            $article->fill($requestPost);

            $article->save();

            $path = $router->generatePath('article-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('article/edit.html.php', [
            'article' => $article,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $postId, Templating $templating, Router $router): ?string
    {
        $article = Article::find($articleId);
        if (!$article) {
            throw new NotFoundException("Missing article with id $articleId");
        }

        $html = $templating->render('article/show.html.php', [
            'article' => $article,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $postId, Router $router): ?string
    {
        $article = Article::find($articleId);
        if (!$article) {
            throw new NotFoundException("Missing article with id $articleId");
        }

        $article->delete();
        $path = $router->generatePath('article-index');
        $router->redirect($path);
        return null;
    }
}
