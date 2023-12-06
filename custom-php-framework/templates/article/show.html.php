<?php

/** @var \App\Model\Article $article */
/** @var \App\Service\Router $router */

$title = "{$article->getSubject()} ({$article->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $article->getSubject() ?></h1>
    <article>
        <?= $article->getContent();?>
    </article>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('article-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('article-edit', ['id'=> $article->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
