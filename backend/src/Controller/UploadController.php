<?php

namespace App\Controller;

use App\Service\S3StorageService;
use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api', name: 'api_')]
class UploadController extends AbstractController
{
    private S3StorageService $s3Service;
    private UserService $userService;

    public function __construct(
        S3StorageService $s3Service,
        UserService $userService
    ) {
        $this->s3Service = $s3Service;
        $this->userService = $userService;
    }

    #[Route('/upload/temp', name: 'upload_temp', methods: ['POST'])]
    public function uploadTemporaryFile(Request $request): JsonResponse
    {
        $user = $this->userService->getCurrentUser();

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        if (!$user->isEmailVerified()) {
            return $this->json(['error' => 'Veuillez vérifier votre email avant d\'uploader des fichiers'], Response::HTTP_FORBIDDEN);
        }

        $file = $request->files->get('file');

        if (!$file) {
            return $this->json(['error' => 'Aucun fichier fourni'], Response::HTTP_BAD_REQUEST);
        }

        $mimeType = $file->getMimeType();
        if (!str_starts_with($mimeType, 'image/')) {
            return $this->json(['error' => 'Seules les images sont autorisées'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $directory = 'temp/' . $user->getId() . '/' . date('Ymd');
            $fileData = $this->s3Service->uploadFile($file, $directory);

            return $this->json([
                'file' => $fileData,
                'message' => 'Fichier uploadé avec succès'
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de l\'upload du fichier: ' . $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/upload/validate', name: 'upload_validate', methods: ['POST'])]
    public function validateFile(Request $request): JsonResponse
    {
        $user = $this->userService->getCurrentUser();

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);
        $storageKey = $data['storageKey'] ?? null;

        if (!$storageKey) {
            return $this->json(['error' => 'StorageKey manquant'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $exists = $this->s3Service->fileExists($storageKey);

            if (!$exists) {
                return $this->json(['error' => 'Fichier introuvable'], Response::HTTP_NOT_FOUND);
            }

            return $this->json([
                'valid' => true,
                'message' => 'Fichier validé'
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la validation du fichier: ' . $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }
}
