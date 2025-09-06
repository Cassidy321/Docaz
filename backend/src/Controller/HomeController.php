<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

#[Route('/api', name: 'api_')]
class HomeController extends AbstractController
{
    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        return $this->json([
            'success' => true,
            'message' => 'API Docaz fonctionne !',
            'timestamp' => new \DateTime(),
        ]);
    }
    
    #[Route('/db-status', name: 'db_status', methods: ['GET'])]
    public function databaseStatus(EntityManagerInterface $em): JsonResponse
    {
        try {
            $connection = $em->getConnection();

            $dbInfo = $connection->executeQuery('SELECT DATABASE() as current_db, VERSION() as version')->fetchAssociative();
            $tables = $connection->executeQuery('SHOW TABLES')->fetchAllAssociative();

            return $this->json([
                'connection' => 'ok',
                'database' => $dbInfo['current_db'],
                'version' => $dbInfo['version'],
                'table_count' => count($tables),
                'tables' => array_column($tables, 'Tables_in_railway')
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'connection' => 'failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
