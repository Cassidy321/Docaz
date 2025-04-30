<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

#[Route('/api', name: 'api_')]
class CsrfController extends AbstractController
{
    #[Route('/csrf-token', name: 'csrf_token', methods: ['GET'])]
    public function getToken(CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
    {
        return $this->json([
            'token' => $csrfTokenManager->getToken('api')->getValue()
        ]);
    }
}
