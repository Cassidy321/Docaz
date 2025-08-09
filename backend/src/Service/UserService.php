<?php

namespace App\Service;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class UserService
{
    private EntityManagerInterface $entityManager;
    private JWTTokenManagerInterface $jwtManager;
    private TokenStorageInterface $tokenStorage;

    public function __construct(
        EntityManagerInterface $entityManager,
        JWTTokenManagerInterface $jwtManager,
        TokenStorageInterface $tokenStorage
    ) {
        $this->entityManager = $entityManager;
        $this->jwtManager = $jwtManager;
        $this->tokenStorage = $tokenStorage;
    }

    public function getCurrentUser(): ?User
    {
        $token = $this->tokenStorage->getToken();

        if (!$token) {
            return null;
        }

        $user = $token->getUser();

        if (!$user instanceof UserInterface) {
            return null;
        }

        return $user;
    }

    public function isEmailVerified(User $user): bool
    {
        return $user->isEmailVerified();
    }

    public function createJwtToken(User $user): string
    {
        return $this->jwtManager->create($user);
    }

    public function isProfileComplete(User $user): bool
    {
        return !empty($this->getMissingRequiredFields($user));
    }

    public function hasPhone(User $user): bool
    {
        return !empty(trim($user->getPhone() ?? ''));
    }

    public function hasCity(User $user): bool
    {
        return !empty(trim($user->getCity() ?? ''));
    }

    public function getMissingRequiredFields(User $user): array
    {
        $missing = [];

        if (!$this->hasPhone($user)) {
            $missing[] = 'phone';
        }

        if (!$this->hasCity($user)) {
            $missing[] = 'city';
        }

        return $missing;
    }

    public function getMissingFieldsMessage(User $user): string
    {
        $missing = $this->getMissingRequiredFields($user);

        if (empty($missing)) {
            return '';
        }

        $fieldLabels = [
            'phone' => 'numéro de téléphone',
            'city' => 'ville'
        ];

        $missingLabels = array_map(
            fn(string $field): string => $fieldLabels[$field] ?? $field,
            $missing
        );

        $count = count($missingLabels);

        return match ($count) {
            1 => "Veuillez renseigner votre {$missingLabels[0]} pour pouvoir créer une annonce.",
            2 => "Veuillez renseigner votre " . implode(' et votre ', $missingLabels) . " pour pouvoir créer une annonce.",
            default => "Veuillez compléter votre profil pour pouvoir créer une annonce."
        };
    }
}
