<?php

namespace App\Service;

use App\Entity\Post;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class PostService
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function createPost(array $postData, User $author): Post
    {
        $post = new Post();
        $post->setTitle($postData['title']);
        $post->setDescription($postData['description']);
        $post->setPrice($postData['price'] ?? null);
        $post->setLocation($postData['location'] ?? null);
        $post->setAttributes($postData['attributes'] ?? null);
        $post->setIsActive(true);
        $post->setAuthor($author);
        $post->setCreatedAt(new \DateTimeImmutable());
        $post->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($post);
        $this->entityManager->flush();

        return $post;
    }

    public function updatePost(Post $post, array $postData): Post
    {
        $post->setTitle($postData['title']);
        $post->setDescription($postData['description']);
        $post->setPrice($postData['price'] ?? null);
        $post->setLocation($postData['location'] ?? null);
        $post->setAttributes($postData['attributes'] ?? null);
        $post->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->flush();
        return $post;
    }

    public function deletePost(Post $post): bool
    {
        try {
            $this->entityManager->remove($post);
            $this->entityManager->flush();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function togglePostActivation(Post $post): Post
    {
        $post->setIsActive(!$post->isActive());
        $post->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->flush();
        return $post;
    }

    public function getUserPosts(User $user): array
    {
        return $this->entityManager->getRepository(Post::class)
            ->findBy(['author' => $user], ['createdAt' => 'DESC']);
    }
}
