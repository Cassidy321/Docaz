<?php

namespace App\Service;

use App\Entity\Image;
use App\Entity\Post;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ImageService
{
    private EntityManagerInterface $entityManager;
    private S3StorageService $s3Service;

    public function __construct(
        EntityManagerInterface $entityManager,
        S3StorageService $s3Service
    ) {
        $this->entityManager = $entityManager;
        $this->s3Service = $s3Service;
    }

    public function addImageToPost(Post $post, UploadedFile $file, int $position = 0): Image
    {
        $directory = 'annonces/' . $post->getId();

        $fileData = $this->s3Service->uploadFile($file, $directory);

        $image = new Image();
        $image->setFileName($fileData['fileName']);
        $image->setStorageKey($fileData['storageKey']);
        $image->setStorageUrl($fileData['storageUrl']);
        $image->setUrlExpiry($fileData['urlExpiry']);
        $image->setContentType($fileData['contentType']);
        $image->setFileSize($fileData['fileSize']);
        $image->setPosition($position);
        $image->setCreatedAt(new \DateTimeImmutable());
        $image->setPost($post);

        $this->entityManager->persist($image);
        $this->entityManager->flush();

        return $image;
    }

    public function addMultipleImagesToPost(Post $post, array $files): array
    {
        $images = [];
        $position = count($post->getImages());

        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                $image = $this->addImageToPost($post, $file, $position);
                $images[] = $image;
                $position++;
            }
        }

        return $images;
    }

    public function removeImage(Image $image): bool
    {
        try {
            $deleted = $this->s3Service->deleteFile($image->getStorageKey());

            if ($deleted) {
                $this->entityManager->remove($image);
                $this->entityManager->flush();
            }

            return $deleted;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function refreshImageUrl(Image $image): bool
    {
        try {
            $newUrl = $this->s3Service->generatePresignedUrl($image->getStorageKey());
            $image->setStorageUrl($newUrl);
            $image->setUrlExpiry(new \DateTimeImmutable('+24 hours'));

            $this->entityManager->flush();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function refreshPostImages(Post $post): void
    {
        $now = new \DateTimeImmutable();
        $needRefresh = false;

        foreach ($post->getImages() as $image) {
            $expiry = $image->getUrlExpiry();

            if ($expiry === null || $expiry < $now->modify('+30 minutes')) {
                $needRefresh = true;
                break;
            }
        }

        if ($needRefresh) {
            $storageKeys = [];
            foreach ($post->getImages() as $image) {
                $storageKeys[$image->getId()] = $image->getStorageKey();
            }

            $refreshedUrls = $this->s3Service->refreshMultipleUrls(array_values($storageKeys));

            foreach ($post->getImages() as $image) {
                $key = $image->getStorageKey();
                if (isset($refreshedUrls[$key]) && !isset($refreshedUrls[$key]['error'])) {
                    $image->setStorageUrl($refreshedUrls[$key]['url']);
                    $image->setUrlExpiry($refreshedUrls[$key]['expiry']);
                }
            }

            $this->entityManager->flush();
        }
    }
}
