<?php

namespace App\Controller;

use App\Entity\RefreshToken;
use App\Entity\User;
use App\Repository\RefreshTokenRepository;
use App\Service\UserService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

#[Route('/api', name: 'api_')]
class TokenController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private UserService $userService;
    private RefreshTokenRepository $refreshTokenRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        UserService $userService,
        RefreshTokenRepository $refreshTokenRepository
    ) {
        $this->entityManager = $entityManager;
        $this->userService = $userService;
        $this->refreshTokenRepository = $refreshTokenRepository;
    }

    #[Route('/refresh-token', name: 'refresh_token', methods: ['POST'])]
    public function refreshToken(Request $request): JsonResponse
    {
        $refreshTokenValue = $request->cookies->get('REFRESH_TOKEN');
        
        if (!$refreshTokenValue) {
            return $this->json(['error' => 'Refresh token manquant'], Response::HTTP_UNAUTHORIZED);
        }
        
        $currentFingerprint = hash('sha256', $request->headers->get('User-Agent') . $request->getClientIp());
        
        $refreshToken = $this->findRefreshTokenByValue($refreshTokenValue);
        
        
        if (!$refreshToken) {
            return $this->json(['error' => 'Refresh token invalide'], Response::HTTP_UNAUTHORIZED);
        }
        
        if ($refreshToken->isExpired()) {
            $this->entityManager->remove($refreshToken);
            $this->entityManager->flush();
            return $this->json(['error' => 'Refresh token expiré'], Response::HTTP_UNAUTHORIZED);
        }
        
        $user = $refreshToken->getUser();
        
        $jwt = $this->userService->createJwtToken($user);
        
        $this->entityManager->remove($refreshToken);
        
        $newRefreshToken = new RefreshToken();
        $newRefreshToken->setUser($user);
        $newTokenValue = bin2hex(random_bytes(64));
        $newRefreshToken->setToken($newTokenValue);
        $newRefreshToken->setExpiresAt(new \DateTimeImmutable('+30 days'));
        
        $this->entityManager->persist($newRefreshToken);
        $this->entityManager->flush();
        
        $response = $this->json([
            'token' => $jwt,
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'roles' => $user->getRoles(),
                'emailVerified' => $user->isEmailVerified()
            ]
        ]);
        
        $cookie = new Cookie(
            'REFRESH_TOKEN',
            $newTokenValue,
            time() + 30 * 24 * 3600,
            '/',
            null,
            $request->isSecure(),
            true,
            false,
            Cookie::SAMESITE_STRICT
        );
        
        $response->headers->setCookie($cookie);
        
        return $response;
    }
    
    #[Route('/logout', name: 'logout', methods: ['POST'])]
    public function logout(Request $request): JsonResponse
    {
        $refreshTokenValue = $request->cookies->get('REFRESH_TOKEN');
        
        if ($refreshTokenValue) {
            $refreshToken = $this->findRefreshTokenByValue($refreshTokenValue);
            
            if ($refreshToken) {
                $this->entityManager->remove($refreshToken);
                $this->entityManager->flush();
            }
        }
        
        $response = $this->json(['message' => 'Déconnexion réussie']);
        
        $cookie = new Cookie(
            'REFRESH_TOKEN',
            '',
            time() - 3600,
            '/',
            null,
            $request->isSecure(),
            true,
            false,
            Cookie::SAMESITE_STRICT
        );
        
        $response->headers->setCookie($cookie);
        
        return $response;
    }

    private function findRefreshTokenByValue(string $tokenValue): ?RefreshToken
    {
        $tokens = $this->refreshTokenRepository->findAll();
        foreach ($tokens as $token) {
            if (password_verify($tokenValue, $token->getToken())) {
                return $token;
            }
        }
        
        return null;
    }
}