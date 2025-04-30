<?php

namespace App\Security;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Lexik\Bundle\JWTAuthenticationBundle\Response\JWTAuthenticationSuccessResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;

class JwtCookieManager implements AuthenticationSuccessHandlerInterface, EventSubscriberInterface
{
    /** @var JWTTokenManagerInterface */
    private JWTTokenManagerInterface $jwtManager;
    private string $cookieName;
    private bool $secureCookie;
    private int $tokenTtl;

    public function __construct(
        JWTTokenManagerInterface $jwtManager,
        string $cookieName = 'AUTH_TOKEN',
        bool $secureCookie = true,
        int $tokenTtl = 86400
    ) {
        $this->jwtManager = $jwtManager;
        $this->cookieName = $cookieName;
        $this->secureCookie = $secureCookie;
        $this->tokenTtl = $tokenTtl;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token): JWTAuthenticationSuccessResponse
    {
        $user = $token->getUser();
        $jwt = $this->jwtManager->create($user);

        $response = new JWTAuthenticationSuccessResponse($jwt);
        $response->setData([
            'user' => $this->getUserData($user),
            'token' => $jwt
        ]);

        $expiration = time() + $this->tokenTtl;
        $cookie = new Cookie(
            $this->cookieName,
            $jwt,
            $expiration,
            '/',
            null,
            $this->secureCookie,
            true,
            false,
            Cookie::SAMESITE_STRICT
        );

        $response->headers->setCookie($cookie);

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
