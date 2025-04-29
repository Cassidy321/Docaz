<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\EmailService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use DateTimeImmutable;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api', name: 'api_')]
class EmailController extends AbstractController
{
    #[Route('/verify-email/{token}', name: 'verify_email', methods: ['GET'])]
    public function verifyEmail(
        string $token,
        EntityManagerInterface $entityManager,
        EmailService $emailService
    ): JsonResponse {
        error_log("Tentative de vérification avec le token: " . $token);

        try {
            $userRepository = $entityManager->getRepository(User::class);
            $user = $userRepository->findOneBy(['emailVerificationToken' => $token]);

            if (!$user) {
                error_log("Utilisateur non trouvé pour le token: " . $token);
                return $this->json(['error' => 'Token de vérification invalide'], Response::HTTP_BAD_REQUEST);
            }

            error_log("Utilisateur trouvé: " . $user->getEmail());

            $expiresAt = $user->getEmailVerificationTokenExpiresAt();
            if (!$expiresAt || $expiresAt < new \DateTimeImmutable()) {
                error_log("Token expiré pour l'utilisateur: " . $user->getEmail());
                return $this->json(['error' => 'Le token de vérification a expiré'], Response::HTTP_BAD_REQUEST);
            }

            $user->setEmailVerified(true);
            $user->setEmailVerificationToken(null);
            $user->setEmailVerificationTokenExpiresAt(null);
            $user->setUpdatedAt(new \DateTimeImmutable());

            error_log("Avant flush - emailVerified: " . ($user->isEmailVerified() ? 'true' : 'false'));

            $entityManager->flush();

            $updatedUser = $userRepository->find($user->getId());
            error_log("Après flush - emailVerified: " . ($updatedUser->isEmailVerified() ? 'true' : 'false'));

            try {
                $emailService->sendWelcomeEmail(
                    $user->getEmail(),
                    $user->getFirstName()
                );
                error_log("Email de bienvenue envoyé à : " . $user->getEmail());
            } catch (\Exception $e) {
                error_log("Erreur lors de l'envoi de l'email de bienvenue : " . $e->getMessage());
            }

            return $this->json([
                'message' => 'Votre email a été vérifié avec succès. Vous pouvez maintenant vous connecter.'
            ]);
        } catch (\Exception $e) {
            error_log("Exception lors de la vérification d'email: " . $e->getMessage());
            return $this->json(['error' => 'Une erreur est survenue lors de la vérification'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/resend-verification', name: 'resend_verification', methods: ['POST'])]
    public function resendVerification(
        Request $request,
        EntityManagerInterface $entityManager,
        EmailService $emailService
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email']) || empty($data['email'])) {
            return $this->json(['error' => 'L\'email est requis'], Response::HTTP_BAD_REQUEST);
        }

        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        if (!$user) {
            return $this->json(['message' => 'Si votre compte existe, un email de vérification a été envoyé']);
        }

        if ($user->isEmailVerified()) {
            return $this->json(['message' => 'Votre email est déjà vérifié']);
        }

        $token = bin2hex(random_bytes(32));
        $user->setEmailVerificationToken($token);
        $user->setEmailVerificationTokenExpiresAt(new DateTimeImmutable('+24 hours'));
        $entityManager->flush();

        $emailSent = $emailService->sendVerificationEmail(
            $user->getEmail(),
            $user->getFirstName(),
            $token
        );

        return $this->json([
            'message' => 'Un nouvel email de vérification a été envoyé à votre adresse',
            'emailSent' => $emailSent
        ]);
    }
}
