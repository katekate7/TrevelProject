<?php

namespace App\Entity;

use App\Repository\ItemRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ItemRepository::class)]
class Item
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255, unique: true)]
    private string $name;

    #[ORM\Column(type: 'string', length: 20, options: ["default" => "optional"])]
    private string $importanceLevel = 'optional';

    #[ORM\OneToMany(mappedBy: 'item', targetEntity: TripItem::class, cascade: ['persist', 'remove'])]
    private Collection $tripItems;

    public function __construct()
    {
        $this->tripItems = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
        return $this;
    }

    public function getImportanceLevel(): string
    {
        return $this->importanceLevel;
    }

    public function setImportanceLevel(string $importanceLevel): static
    {
        $this->importanceLevel = $importanceLevel;
        return $this;
    }

    public function getTripItems(): Collection
    {
        return $this->tripItems;
    }

    public function addTripItem(TripItem $tripItem): self
    {
        if (!$this->tripItems->contains($tripItem)) {
            $this->tripItems->add($tripItem);
            $tripItem->setItem($this);
        }
        return $this;
    }

    public function removeTripItem(TripItem $tripItem): self
    {
        if ($this->tripItems->removeElement($tripItem)) {
            if ($tripItem->getItem() === $this) {
                $tripItem->setItem(null);
            }
        }
        return $this;
    }
}
