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
            $response = $this->httpClient->request('POST', 'https://api.resend.com/emails', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'from' => $from,
                    'to' => $to,
                    'subject' => $subject,
                    'html' => $html,
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
