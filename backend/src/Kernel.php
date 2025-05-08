<?php

namespace App;

use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;

class Kernel extends BaseKernel
{
    use MicroKernelTrait;

    public function setTimezone(string $timezone): void
    {
        date_default_timezone_set($timezone);
    }

    /**
     * {@inheritdoc}
     */
    public function boot(): void
    {
        parent::boot();

        if ($this->container && $this->container->hasParameter('app.timezone')) {
            date_default_timezone_set($this->container->getParameter('app.timezone'));
        }
    }
}
