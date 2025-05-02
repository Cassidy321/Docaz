<?php

namespace App\Service;

use Aws\S3\S3Client;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class S3StorageService
{
    private S3Client $s3Client;
    private string $bucket;
    private string $region;

    public function __construct(
        string $accessKey,
        string $secretKey,
        string $region,
        string $bucket
    ) {
        $this->bucket = $bucket;
        $this->region = $region;

        $this->s3Client = new S3Client([
            'version' => 'latest',
            'region' => $region,
            'credentials' => [
                'key' => $accessKey,
                'secret' => $secretKey,
            ],
        ]);
    }

    public function uploadFile(UploadedFile $file, string $directory = ''): array
    {
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = transliterator_transliterate(
            'Any-Latin; Latin-ASCII; [^A-Za-z0-9_] remove; Lower()',
            $originalFilename
        );
        $fileName = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();

        $storageKey = $directory ? $directory . '/' . $fileName : $fileName;

        $this->s3Client->putObject([
            'Bucket' => $this->bucket,
            'Key' => $storageKey,
            'Body' => fopen($file->getPathname(), 'rb'),
            'ContentType' => $file->getMimeType(),
            'Metadata' => [
                'originalName' => $originalFilename,
                'uploadDate' => (new \DateTime())->format('Y-m-d H:i:s')
            ],
        ]);

        $presignedUrl = $this->generatePresignedUrl($storageKey);
        $expiry = new \DateTimeImmutable('+24 hours');

        return [
            'fileName' => $fileName,
            'storageKey' => $storageKey,
            'storageUrl' => $presignedUrl,
            'urlExpiry' => $expiry,
            'contentType' => $file->getMimeType(),
            'fileSize' => $file->getSize(),
        ];
    }

    public function deleteFile(string $storageKey): bool
    {
        try {
            if (!$this->s3Client->doesObjectExist($this->bucket, $storageKey)) {
                return true;
            }

            $this->s3Client->deleteObject([
                'Bucket' => $this->bucket,
                'Key' => $storageKey,
            ]);
            return true;
        } catch (\Exception $e) {
            error_log('Erreur lors de la suppression du fichier S3: ' . $e->getMessage());
            return false;
        }
    }

    public function generatePresignedUrl(string $storageKey, int $expirationInSeconds = 86400): string
    {
        if (!$this->s3Client->doesObjectExist($this->bucket, $storageKey)) {
            throw new \Exception("Le fichier demandé n'existe pas dans le bucket S3");
        }

        $command = $this->s3Client->getCommand('GetObject', [
            'Bucket' => $this->bucket,
            'Key' => $storageKey,
        ]);

        $presignedRequest = $this->s3Client->createPresignedRequest($command, "+{$expirationInSeconds} seconds");

        return (string) $presignedRequest->getUri();
    }

    public function refreshMultipleUrls(array $storageKeys): array
    {
        $result = [];
        foreach ($storageKeys as $key) {
            try {
                $result[$key] = [
                    'url' => $this->generatePresignedUrl($key),
                    'expiry' => new \DateTimeImmutable('+24 hours')
                ];
            } catch (\Exception $e) {
                $result[$key] = [
                    'error' => $e->getMessage()
                ];
            }
        }
        return $result;
    }

    public function fileExists(string $storageKey): bool
    {
        try {
            return $this->s3Client->doesObjectExist($this->bucket, $storageKey);
        } catch (\Exception $e) {
            return false;
        }
    }
}
