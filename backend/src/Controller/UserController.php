<?php

namespace App\Controller;

use App\Entity\User; // Assurez-vous d'importer votre classe User
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api', name: 'api_')]
class UserController extends AbstractController
{
    #[Route('/me', name: 'user_info', methods: ['GET'])]
    public function getCurrentUser(): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non authentifié'], 401);
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'roles' => $user->getRoles(),
            'emailVerified' => $user->isEmailVerified()
        ]);
    }
}
