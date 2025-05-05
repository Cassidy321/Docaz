<?php

namespace App\Controller;

use App\Entity\Post;
use App\Entity\Image;
use App\Service\PostService;
use App\Service\UserService;
use App\Service\ImageService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api', name: 'api_')]
class PostController extends AbstractController
{
    private PostService $postService;
    private UserService $userService;
    private ImageService $imageService;
    private EntityManagerInterface $entityManager;

    public function __construct(
        PostService $postService,
        UserService $userService,
        ImageService $imageService,
        EntityManagerInterface $entityManager
    ) {
        $this->postService = $postService;
        $this->userService = $userService;
        $this->imageService = $imageService;
        $this->entityManager = $entityManager;
    }

    #[Route('/posts', name: 'posts_create', methods: ['POST'])]
    public function createPost(Request $request): JsonResponse
    {
        $user = $this->userService->getCurrentUser();

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        if (!$user->isEmailVerified()) {
            return $this->json(['error' => 'Veuillez vérifier votre email avant de publier des annonces'], Response::HTTP_FORBIDDEN);
        }

        $postData = json_decode($request->request->get('data', '{}'), true);

        $files = $request->files->get('images') ?? [];

        try {
            $post = $this->postService->createPost($postData, $user);

            $images = [];
            if (!empty($files)) {
                $images = $this->imageService->addMultipleImagesToPost($post, $files);
            }

            $imageUrls = [];
            foreach ($images as $image) {
                $imageUrls[] = [
                    'id' => $image->getId(),
                    'url' => $image->getStorageUrl(),
                    'position' => $image->getPosition()
                ];
            }

            return $this->json([
                'post' => [
                    'id' => $post->getId(),
                    'title' => $post->getTitle(),
                    'description' => $post->getDescription(),
                    'price' => $post->getPrice(),
                    'location' => $post->getLocation(),
                    'createdAt' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
                    'images' => $imageUrls
                ],
                'message' => 'Annonce créée avec succès'
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la création de l\'annonce: ' . $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/posts', name: 'posts_list', methods: ['GET'])]
    public function listPosts(): JsonResponse
    {
        $posts = $this->entityManager->getRepository(Post::class)->findBy(
            ['isActive' => true],
            ['createdAt' => 'DESC']
        );

        $postsData = [];
        foreach ($posts as $post) {
            $mainImage = null;

            foreach ($post->getImages() as $image) {
                if ($image->getPosition() === 0) {
                    $mainImage = $image->getStorageUrl();
                    break;
                }
            }

            $postsData[] = [
                'id' => $post->getId(),
                'title' => $post->getTitle(),
                'description' => $post->getDescription(),
                'price' => $post->getPrice(),
                'location' => $post->getLocation(),
                'createdAt' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
                'mainImage' => $mainImage
            ];
        }

        return $this->json([
            'posts' => $postsData
        ], Response::HTTP_OK);
    }

    #[Route('/posts/{id}', name: 'posts_show', methods: ['GET'])]
    public function showPost(Post $post): JsonResponse
    {
        $this->imageService->refreshPostImages($post);

        $images = [];
        foreach ($post->getImages() as $image) {
            $images[] = [
                'id' => $image->getId(),
                'url' => $image->getStorageUrl(),
                'position' => $image->getPosition()
            ];
        }

        return $this->json([
            'post' => [
                'id' => $post->getId(),
                'title' => $post->getTitle(),
                'description' => $post->getDescription(),
                'price' => $post->getPrice(),
                'location' => $post->getLocation(),
                'attributes' => $post->getAttributes(),
                'createdAt' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
                'author' => [
                    'id' => $post->getAuthor()->getId(),
                    'firstName' => $post->getAuthor()->getFirstName(),
                    'lastName' => $post->getAuthor()->getLastName()
                ],
                'images' => $images
            ]
        ], Response::HTTP_OK);
    }

    #[Route('/posts/{id}', name: 'posts_update', methods: ['PUT', 'PATCH'])]
    public function updatePost(Post $post, Request $request): JsonResponse
    {
        $user = $this->userService->getCurrentUser();

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        if ($post->getAuthor()->getId() !== $user->getId()) {
            return $this->json(['error' => 'Vous n\'êtes pas autorisé à modifier cette annonce'], Response::HTTP_FORBIDDEN);
        }

        $postData = json_decode($request->request->get('data', '{}'), true);

        $files = $request->files->get('images') ?? [];

        try {
            $post = $this->postService->updatePost($post, $postData);

            $newImages = [];
            if (!empty($files)) {
                $newImages = $this->imageService->addMultipleImagesToPost($post, $files);
            }

            $images = [];
            foreach ($post->getImages() as $image) {
                $images[] = [
                    'id' => $image->getId(),
                    'url' => $image->getStorageUrl(),
                    'position' => $image->getPosition()
                ];
            }

            return $this->json([
                'post' => [
                    'id' => $post->getId(),
                    'title' => $post->getTitle(),
                    'description' => $post->getDescription(),
                    'price' => $post->getPrice(),
                    'location' => $post->getLocation(),
                    'createdAt' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
                    'updatedAt' => $post->getUpdatedAt()->format('Y-m-d H:i:s'),
                    'images' => $images
                ],
                'message' => 'Annonce mise à jour avec succès'
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la mise à jour de l\'annonce: ' . $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/posts/{id}', name: 'posts_delete', methods: ['DELETE'])]
    public function deletePost(Post $post): JsonResponse
    {
        $user = $this->userService->getCurrentUser();

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        if ($post->getAuthor()->getId() !== $user->getId()) {
            return $this->json(['error' => 'Vous n\'êtes pas autorisé à supprimer cette annonce'], Response::HTTP_FORBIDDEN);
        }

        try {
            foreach ($post->getImages() as $image) {
                $this->imageService->removeImage($image);
            }

            $this->postService->deletePost($post);

            return $this->json([
                'message' => 'Annonce supprimée avec succès'
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la suppression de l\'annonce: ' . $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/posts/{postId}/images/{imageId}', name: 'posts_delete_image', methods: ['DELETE'])]
    public function deleteImage(int $postId, int $imageId): JsonResponse
    {
        $user = $this->userService->getCurrentUser();

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $image = $this->entityManager->getRepository(Image::class)->find($imageId);

        if (!$image) {
            return $this->json(['error' => 'Image non trouvée'], Response::HTTP_NOT_FOUND);
        }

        $post = $image->getPost();

        if ($post->getId() != $postId) {
            return $this->json(['error' => 'L\'image n\'appartient pas à cette annonce'], Response::HTTP_BAD_REQUEST);
        }

        if ($post->getAuthor()->getId() !== $user->getId()) {
            return $this->json(['error' => 'Vous n\'êtes pas autorisé à supprimer cette image'], Response::HTTP_FORBIDDEN);
        }

        try {
            $result = $this->imageService->removeImage($image);

            if ($result) {
                return $this->json([
                    'message' => 'Image supprimée avec succès'
                ], Response::HTTP_OK);
            } else {
                return $this->json([
                    'error' => 'Erreur lors de la suppression de l\'image'
                ], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la suppression de l\'image: ' . $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/posts/{postId}/images/reorder', name: 'posts_reorder_images', methods: ['POST'])]
    public function reorderImages(int $postId, Request $request): JsonResponse
    {
        $user = $this->userService->getCurrentUser();

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $post = $this->entityManager->getRepository(Post::class)->find($postId);

        if (!$post) {
            return $this->json(['error' => 'Annonce non trouvée'], Response::HTTP_NOT_FOUND);
        }

        if ($post->getAuthor()->getId() !== $user->getId()) {
            return $this->json(['error' => 'Vous n\'êtes pas autorisé à modifier cette annonce'], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['imageOrder']) || !is_array($data['imageOrder'])) {
            return $this->json(['error' => 'Données invalides'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $imageOrder = $data['imageOrder'];
            $imageRepository = $this->entityManager->getRepository(Image::class);

            foreach ($imageOrder as $order) {
                if (!isset($order['id']) || !isset($order['position'])) {
                    continue;
                }

                $image = $imageRepository->find($order['id']);

                if ($image && $image->getPost()->getId() === $post->getId()) {
                    $image->setPosition($order['position']);
                }
            }

            $this->entityManager->flush();

            return $this->json([
                'message' => 'Ordre des images mis à jour avec succès'
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la mise à jour de l\'ordre des images: ' . $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }
}
