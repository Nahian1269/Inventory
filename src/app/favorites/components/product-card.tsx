'use client';
import React from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Trash2 } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  showFavoriteButton?: boolean; // To control if favorite toggle is shown, e.g. on general product list vs favorites page
}

export function ProductCard({ product, showFavoriteButton = true }: ProductCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();

  const isCurrentlyFavorite = isFavorite(product.id);

  const handleToggleFavorite = () => {
    if (isCurrentlyFavorite) {
      removeFavorite(product.id);
      toast({ title: 'Removed from Favorites', description: `${product.name} removed from your favorites.` });
    } else {
      addFavorite(product);
      toast({ title: 'Added to Favorites', description: `${product.name} added to your favorites.` });
    }
  };

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <Image
          src={product.imageUrl || `https://placehold.co/300x200.png?text=${product.name.substring(0,3)}`}
          alt={product.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
          data-ai-hint="product item"
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-lg mb-1 truncate" title={product.name}>{product.name}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground mb-2">ID: {product.id}</CardDescription>
        <p className="text-sm line-clamp-2 mb-2" title={product.description}>{product.description}</p>
        <p className="text-xl font-semibold text-primary">${product.sellingPrice.toFixed(2)}</p>
        <p className="text-xs text-muted-foreground">Stock: {product.quantity}</p>
      </CardContent>
      {showFavoriteButton && (
        <CardFooter className="p-4 border-t">
          <Button
            variant={isCurrentlyFavorite ? "secondary" : "outline"}
            size="sm"
            className="w-full"
            onClick={handleToggleFavorite}
          >
            {isCurrentlyFavorite ? <Trash2 className="mr-2 h-4 w-4" /> : <Star className="mr-2 h-4 w-4" />}
            {isCurrentlyFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
