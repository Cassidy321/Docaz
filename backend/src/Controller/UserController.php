<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\UserService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api', name: 'api_')]
class UserController extends AbstractController
{
    public function __construct(
        private UserService $userService,
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator
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

    #[Route('/user/profile/complete', name: 'complete_profile', methods: ['PUT'])]
    public function completeProfile(Request $request): JsonResponse
    {
        $user = $this->userService->getCurrentUser();

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Données invalides'], Response::HTTP_BAD_REQUEST);
        }

        $allowedFields = ['phone', 'city', 'bio'];
        $hasAtLeastOneField = false;

        foreach ($allowedFields as $field) {
            if (isset($data[$field]) && !empty(trim($data[$field]))) {
                $hasAtLeastOneField = true;
                break;
            }
        }

        if (!$hasAtLeastOneField) {
            return $this->json(['error' => 'Au moins un champ doit être renseigné'], Response::HTTP_BAD_REQUEST);
        }

        try {
            if (isset($data['phone']) && !empty(trim($data['phone']))) {
                $user->setPhone(trim($data['phone']));
            }

            if (isset($data['city']) && !empty(trim($data['city']))) {
                $user->setCity(trim($data['city']));
            }

            if (isset($data['bio'])) {
                $user->setBio(trim($data['bio']) ?: null); // Bio peut être vide
            }

            $user->setUpdatedAt(new \DateTimeImmutable());

            $errors = $this->validator->validate($user);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[$error->getPropertyPath()] = $error->getMessage();
                }
                return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
            }

            $this->entityManager->persist($user);
            $this->entityManager->flush();

            $isComplete = $this->userService->isProfileComplete($user);

            return $this->json([
                'message' => 'Profil mis à jour avec succès',
                'user' => [
                    'id' => $user->getId(),
                    'firstName' => $user->getFirstName(),
                    'lastName' => $user->getLastName(),
                    'email' => $user->getEmail(),
                    'phone' => $user->getPhone(),
                    'city' => $user->getCity(),
                    'bio' => $user->getBio(),
                ],
                'isProfileComplete' => $isComplete,
                'missingFields' => !$isComplete ? $this->userService->getMissingRequiredFields($user) : []
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la mise à jour du profil: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
