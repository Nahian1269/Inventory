'use client';
import React from 'react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { ProductCard } from './components/product-card';
import { AISuggestions } from './components/ai-suggestions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function FavoritesPage() {
  const { favoriteProducts } = useFavorites();

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Favorite Products</CardTitle>
          <CardDescription>Your handpicked list of favorite or trending products.</CardDescription>
        </CardHeader>
        <CardContent>
          {favoriteProducts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">You haven't added any products to your favorites yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favoriteProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">AI-Powered Promotion Suggestions</CardTitle>
          <CardDescription>Get intelligent suggestions for products to add to your favorites list for increased visibility.</CardDescription>
        </CardHeader>
        <CardContent>
          <AISuggestions />
        </CardContent>
      </Card>
    </div>
  );
}
