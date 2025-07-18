<?php

namespace App\Service;

use Twig\Environment;

class EmailService
{
    private ResendService $resendService;
    private Environment $twig;
    private string $fromEmail;
    private string $appUrl;

    public function __construct(
        ResendService $resendService,
        Environment $twig,
        string $fromEmail,
        string $appUrl
    ) {
        $this->resendService = $resendService;
        $this->twig = $twig;
        $this->fromEmail = $fromEmail;
        $this->appUrl = $appUrl;
    }

    public function sendVerificationEmail(string $to, string $firstName, string $token): bool
    {
        $verificationUrl = $this->appUrl . '/verify-email/' . $token;

        $htmlContent = $this->twig->render('emails/email_verification.html.twig', [
            'firstName' => $firstName,
            'verificationUrl' => $verificationUrl
        ]);

        return $this->resendService->send(
            $this->fromEmail,
            $to,
            'Vérification de votre adresse email',
            $htmlContent
        );
    }

    public function sendWelcomeEmail(string $to, string $firstName): bool
    {
        $htmlContent = $this->twig->render('emails/welcome.html.twig', [
            'firstName' => $firstName,
            'loginUrl' => $this->appUrl . '/connexion'
        ]);

        return $this->resendService->send(
            $this->fromEmail,
            $to,
            'Bienvenue sur notre plateforme',
            $htmlContent
        );
    }

    public function sendPasswordResetEmail(string $to, string $firstName, string $token): bool
    {
        $resetUrl = $this->appUrl . '/reset-password/' . $token;

        $htmlContent = $this->twig->render('emails/password_reset.html.twig', [
            'firstName' => $firstName,
            'resetUrl' => $resetUrl
        ]);

        return $this->resendService->send(
            $this->fromEmail,
            $to,
            'Réinitialisation de votre mot de passe',
            $htmlContent
        );
    }
}
