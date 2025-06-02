'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useProducts } from '@/contexts/ProductContext';
import { suggestFavoriteProducts, type SuggestFavoriteProductsInput, type SuggestFavoriteProductsOutput } from '@/ai/flows/suggest-favorite-products';
import { useToast } from '@/hooks/use-toast';
import { ProductCard } from './product-card';
import { Loader2, Sparkles } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function AISuggestions() {
  const { products, getProductById } = useProducts();
  const { toast } = useToast();
  const [customerData, setCustomerData] = useState<string>('Loves eco-friendly products, frequently buys items under $50, interested in home decor.');
  const [numberOfSuggestions, setNumberOfSuggestions] = useState<number>(3);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [reasoning, setReasoning] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGetSuggestions = async () => {
    if (products.length === 0) {
      toast({ title: 'No Products', description: 'Add some products to your inventory first.', variant: 'destructive' });
      return;
    }
    if (!customerData.trim()) {
      toast({ title: 'Missing Customer Data', description: 'Please provide some customer data for analysis.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setSuggestedProducts([]);
    setReasoning('');

    const productDescriptions = products.map(p => `${p.name}: ${p.description} (Price: $${p.sellingPrice}, Stock: ${p.quantity})`);
    
    const input: SuggestFavoriteProductsInput = {
      productDescriptions,
      customerData,
      numberOfSuggestions,
    };

    try {
      const result: SuggestFavoriteProductsOutput = await suggestFavoriteProducts(input);
      const foundProducts = result.suggestedProductIndices
        .map(index => products[index]) // Assuming indices match the `products` array order from context
        .filter((p): p is Product => p !== undefined);
      
      setSuggestedProducts(foundProducts);
      setReasoning(result.reasoning);

      if (foundProducts.length > 0) {
        toast({ title: 'Suggestions Ready!', description: `AI has suggested ${foundProducts.length} products.` });
      } else {
        toast({ title: 'No Suggestions', description: 'AI could not find suitable suggestions with current data.' });
      }

    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      toast({ title: 'AI Error', description: 'Could not fetch suggestions from AI.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6 items-end">
        <div>
          <Label htmlFor="customerData">Customer Data/Preferences</Label>
          <Textarea
            id="customerData"
            value={customerData}
            onChange={(e) => setCustomerData(e.target.value)}
            placeholder="Describe your target customer or their preferences..."
            rows={4}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="numSuggestions">Number of Suggestions</Label>
          <Input
            id="numSuggestions"
            type="number"
            value={numberOfSuggestions}
            onChange={(e) => setNumberOfSuggestions(Math.max(1, parseInt(e.target.value)))}
            min="1"
            max="10"
            className="mt-1"
          />
           <Button onClick={handleGetSuggestions} disabled={isLoading} className="w-full mt-4 bg-primary hover:bg-primary/90">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Get AI Suggestions
          </Button>
        </div>
      </div>

      {reasoning && (
        <Alert className="bg-green-50 border-green-200">
          <Sparkles className="h-5 w-5 text-accent" />
          <AlertTitle className="font-headline text-accent">AI Reasoning</AlertTitle>
          <AlertDescription>{reasoning}</AlertDescription>
        </Alert>
      )}

      {suggestedProducts.length > 0 && (
        <div>
          <h3 className="text-xl font-headline font-semibold mb-4">Suggested Products:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedProducts.map((product) => (
              <ProductCard key={product.id} product={product} showFavoriteButton={true} />
            ))}
          </div>
        </div>
      )}
       {isLoading && !suggestedProducts.length && (
         <div className="text-center py-8">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">AI is thinking...</p>
         </div>
       )}
    </div>
  );
}
