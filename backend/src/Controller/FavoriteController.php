<?php

namespace App\Controller;

use App\Entity\Favorite;
use App\Repository\PostRepository;
use App\Repository\FavoriteRepository;
use App\Service\UserService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api', name: 'api_')]
class FavoriteController extends AbstractController
{
    public function __construct(
        private PostRepository $postRepository,
        private FavoriteRepository $favoriteRepository,
        private UserService $userService,
        private EntityManagerInterface $entityManager
    ) {}

    #[Route('/posts/{id}/favorite', name: 'add_favorite', methods: ['POST'])]
    public function addFavorite(int $id): JsonResponse
    {
        $user = $this->userService->getCurrentUser();

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $post = $this->postRepository->find($id);

        if (!$post) {
            return $this->json(['error' => 'Post non trouvé'], Response::HTTP_NOT_FOUND);
        }

        if ($this->favoriteRepository->existsByUserAndPost($user, $post)) {
            return $this->json(['error' => 'Post déjà en favoris'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $favorite = new Favorite();
            $favorite->setUser($user);
            $favorite->setPost($post);
            $favorite->setCreatedAt(new \DateTimeImmutable());

            $this->entityManager->persist($favorite);
            $this->entityManager->flush();

            return $this->json([
                'message' => 'Post ajouté aux favoris',
                'isFavorite' => true
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de l\'ajout aux favoris: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/posts/{id}/favorite', name: 'remove_favorite', methods: ['DELETE'])]
    public function removeFavorite(int $id): JsonResponse
    {
        $user = $this->userService->getCurrentUser();

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $post = $this->postRepository->find($id);

        if (!$post) {
            return $this->json(['error' => 'Post non trouvé'], Response::HTTP_NOT_FOUND);
        }

        if (!$this->favoriteRepository->existsByUserAndPost($user, $post)) {
            return $this->json(['error' => 'Post pas dans les favoris'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $this->favoriteRepository->removeByUserAndPost($user, $post);

            return $this->json([
                'message' => 'Post retiré des favoris',
                'isFavorite' => false
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la suppression du favori: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/users/me/favorites', name: 'get_user_favorites', methods: ['GET'])]
    public function getUserFavorites(): JsonResponse
    {
        $user = $this->userService->getCurrentUser();

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        try {
            $favorites = $this->favoriteRepository->findByUser($user);

            $data = array_map(function ($favorite) {
                return [
                    'id' => $favorite->getId(),
                    'post' => [
                        'id' => $favorite->getPost()->getId(),
                        'title' => $favorite->getPost()->getTitle(),
                        'description' => $favorite->getPost()->getDescription(),
                        'price' => $favorite->getPost()->getPrice(),
                        'location' => $favorite->getPost()->getLocation(),
                    ],
                    'createdAt' => $favorite->getCreatedAt()->format('Y-m-d H:i:s')
                ];
            }, $favorites);

            return $this->json([
                'favorites' => $data,
                'count' => count($data)
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la récupération des favoris: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
