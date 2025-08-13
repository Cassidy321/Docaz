<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class ResendService
{
    private HttpClientInterface $httpClient;
    private string $apiKey;

    public function __construct(HttpClientInterface $httpClient, string $apiKey)
    {
        $this->httpClient = $httpClient;
        $this->apiKey = $apiKey;
    }

    public function send(string $from, string $to, string $subject, string $html): bool
    {
        try {
            $fromWithName = 'Docaz <' . $from . '>';

            $response = $this->httpClient->request('POST', 'https://api.resend.com/emails', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'from' => $fromWithName,
                    'to' => $to,
                    'subject' => $subject,
                    'html' => $html,
                    'text' => strip_tags($html),
                    'headers' => [
                        'X-Entity-Ref-ID' => uniqid(),
                        'List-Unsubscribe' => '<mailto:unsubscribe@docaz.fr>',
                    ],
                    'tags' => [
                        'name' => 'email-verification',
                        'value' => 'docaz-platform'
                    ]
                ],
            ]);

            $statusCode = $response->getStatusCode();
            $content = $response->toArray(false);

            return $statusCode >= 200 && $statusCode < 300;
        } catch (\Exception $e) {
            return false;
        }
    }
}
