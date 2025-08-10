<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api', name: 'api_')]
class UserController extends AbstractController
{
    public function __construct(
        private UserService $userService
    ) {}

    #[Route('/me', name: 'user_info', methods: ['GET'])]
    public function getCurrentUser(): JsonResponse
    {
        $user = $this->userService->getCurrentUser();

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non authentifié'], 401);
        }

        $isComplete = $this->userService->isProfileComplete($user);

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'phone' => $user->getPhone(),
            'city' => $user->getCity(),
            'bio' => $user->getBio(),
            'roles' => $user->getRoles(),
            'emailVerified' => $user->isEmailVerified(),
            'createdAt' => $user->getCreatedAt()->format('Y-m-d H:i:s'),
            'updatedAt' => $user->getUpdatedAt()->format('Y-m-d H:i:s'),
            'isProfileComplete' => $isComplete,
            'missingFields' => !$isComplete ? $this->userService->getMissingRequiredFields($user) : []
        ]);
    }

    #[Route('/user/profile/check-complete', name: 'check_profile_complete', methods: ['GET'])]
    public function checkProfileComplete(): JsonResponse
    {
        $user = $this->userService->getCurrentUser();

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non authentifié'], 401);
        }

        $isComplete = $this->userService->isProfileComplete($user);

        return $this->json([
            'isComplete' => $isComplete,
            'missingFields' => !$isComplete ? $this->userService->getMissingRequiredFields($user) : [],
            'message' => !$isComplete ? $this->userService->getMissingFieldsMessage($user) : ''
        ]);
    }
}
