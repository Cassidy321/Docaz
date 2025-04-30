<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

class CsrfAuthenticator extends AbstractAuthenticator
{
    private CsrfTokenManagerInterface $csrfTokenManager;
    private array $excludedRoutes;

    public function __construct(CsrfTokenManagerInterface $csrfTokenManager)
    {
        $this->csrfTokenManager = $csrfTokenManager;
        $this->excludedRoutes = [
            'api_login_check',
            'api_register',
            'api_verify_email',
            'api_resend_verification',
            'api_csrf_token'
        ];
    }

    public function supports(Request $request): ?bool
    {
        $route = $request->attributes->get('_route');
        if (in_array($route, $this->excludedRoutes)) {
            return false;
        }

        $method = $request->getMethod();
        return in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE']);
    }

    public function authenticate(Request $request): Passport
    {
        $csrfToken = $request->headers->get('X-CSRF-TOKEN');

        if (!$csrfToken) {
            throw new AuthenticationException('CSRF token manquant');
        }

        if (!$this->csrfTokenManager->isTokenValid(new CsrfToken('api', $csrfToken))) {
            throw new AuthenticationException('CSRF token invalide');
        }

        return new SelfValidatingPassport(new UserBadge('anonymous'));
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        return new JsonResponse(['error' => 'CSRF token invalide ou manquant.'], Response::HTTP_FORBIDDEN);
    }
}
