<?php
    /** @var $post ?\App\Model\Article */
?>

<div class="form-group">
    <label for="subject">Subject</label>
    <input type="text" id="subject" name="article[subject]" value="<?= $post ? $post->getSubject() : '' ?>">
</div>

<div class="form-group">
    <label for="content">Content</label>
    <textarea id="content" name="article[content]"><?= $post? $post->getContent() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
