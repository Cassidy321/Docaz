<?php

namespace App\Security;

use App\Entity\User;
use App\Entity\RefreshToken;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Lexik\Bundle\JWTAuthenticationBundle\Response\JWTAuthenticationSuccessResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;

class JwtCookieManager implements AuthenticationSuccessHandlerInterface, EventSubscriberInterface
{
    private JWTTokenManagerInterface $jwtManager;
    private EntityManagerInterface $entityManager;
    private string $refreshCookieName;
    private bool $secureCookie;
    private int $tokenTtl;
    private int $refreshTokenTtl;

    public function __construct(
        JWTTokenManagerInterface $jwtManager,
        EntityManagerInterface $entityManager,
        string $refreshCookieName = 'REFRESH_TOKEN',
        bool $secureCookie = false,
        int $tokenTtl = 3600,
        int $refreshTokenTtl = 2592000
    ) {
        $this->jwtManager = $jwtManager;
        $this->entityManager = $entityManager;
        $this->refreshCookieName = $refreshCookieName;
        $this->secureCookie = $secureCookie;
        $this->tokenTtl = $tokenTtl;
        $this->refreshTokenTtl = $refreshTokenTtl;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token): JWTAuthenticationSuccessResponse
    {
        /** @var User $user */
        $user = $token->getUser();
        $jwt = $this->jwtManager->create($user);

        $refreshToken = new RefreshToken();
        $refreshToken->setUser($user);

        $refreshTokenValue = bin2hex(random_bytes(64));
        $refreshToken->setToken($refreshTokenValue);

        $refreshToken->setExpiresAt(new \DateTimeImmutable('+' . $this->refreshTokenTtl . ' seconds'));
        $refreshToken->setCreatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($refreshToken);
        $this->entityManager->flush();

        $response = new JWTAuthenticationSuccessResponse($jwt);
        $response->setData([
            'user' => $this->getUserData($user),
            'token' => $jwt
        ]);

        $refreshCookie = new Cookie(
            $this->refreshCookieName,
            $refreshTokenValue,
            time() + $this->refreshTokenTtl,
            '/',
            null,
            $this->secureCookie,
            true,
            false,
            Cookie::SAMESITE_LAX
        );

        $response->headers->setCookie($refreshCookie);

        return $response;
    }

    public function onAuthenticationSuccessResponse(AuthenticationSuccessEvent $event): void
    {
        $data = $event->getData();
        $user = $event->getUser();

        if (!$user instanceof UserInterface) {
            return;
        }

        $data['user'] = $this->getUserData($user);

        $event->setData($data);
    }

    private function getUserData(UserInterface $user): array
    {
        if (!$user instanceof User) {
            return ['username' => $user->getUserIdentifier()];
        }

        return [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'roles' => $user->getRoles(),
            'emailVerified' => $user->isEmailVerified()
        ];
    }

    public static function getSubscribedEvents(): array
    {
        return [
            Events::AUTHENTICATION_SUCCESS => 'onAuthenticationSuccessResponse',
        ];
    }
}
