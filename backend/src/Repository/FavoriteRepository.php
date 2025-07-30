<?php

namespace App\Repository;

use App\Entity\Favorite;
use App\Entity\User;
use App\Entity\Post;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Favorite>
 */
class FavoriteRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Favorite::class);
    }

    public function findByUser(User $user): array
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.user = :user')
            ->setParameter('user', $user)
            ->orderBy('f.createdAt', 'DESC')
            ->getQuery()
            ->getResult()
        ;
    }

    public function findByPost(Post $post): array
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.post = :post')
            ->setParameter('post', $post)
            ->orderBy('f.createdAt', 'DESC')
            ->getQuery()
            ->getResult()
        ;
    }

    public function existsByUserAndPost(User $user, Post $post): bool
    {
        $result = $this->createQueryBuilder('f')
            ->select('COUNT(f.id)')
            ->andWhere('f.user = :user')
            ->andWhere('f.post = :post')
            ->setParameter('user', $user)
            ->setParameter('post', $post)
            ->getQuery()
            ->getSingleScalarResult();

        return $result > 0;
    }

    public function removeByUserAndPost(User $user, Post $post): void
    {
        $this->createQueryBuilder('f')
            ->delete()
            ->andWhere('f.user = :user')
            ->andWhere('f.post = :post')
            ->setParameter('user', $user)
            ->setParameter('post', $post)
            ->getQuery()
            ->execute();
    }
}
