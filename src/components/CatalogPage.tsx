import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Bouquet, Flower } from '@/types';

interface CatalogPageProps {
  bouquets: Bouquet[];
  flowers: Flower[];
  onAddToCart: (item: { id: number; name: string; price: number }) => void;
}

const CatalogPage = ({ bouquets, flowers, onAddToCart }: CatalogPageProps) => {
  return (
    <div className="space-y-12 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold mb-4">Каталог</h2>
        <p className="text-lg text-muted-foreground">Готовые букеты и отдельные цветы</p>
      </div>

      <Tabs defaultValue="bouquets" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
          <TabsTrigger value="bouquets">Букеты</TabsTrigger>
          <TabsTrigger value="flowers">Цветы</TabsTrigger>
        </TabsList>

        <TabsContent value="bouquets">
          <div className="grid md:grid-cols-3 gap-8">
            {bouquets.map((bouquet, idx) => (
              <Card key={bouquet.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="aspect-square overflow-hidden">
                  <img src={bouquet.image} alt={bouquet.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                </div>
                <CardContent className="p-6">
                  <h4 className="text-2xl font-bold mb-2">{bouquet.name}</h4>
                  <p className="text-muted-foreground mb-4">{bouquet.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{bouquet.price} ₽</span>
                    <Button onClick={() => onAddToCart(bouquet)}>
                      <Icon name="Plus" size={20} className="mr-2" />
                      В корзину
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="flowers">
          <div className="grid md:grid-cols-4 gap-6">
            {flowers.map((flower, idx) => (
              <Card key={flower.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="aspect-square overflow-hidden">
                  <img src={flower.image} alt={flower.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                </div>
                <CardContent className="p-4">
                  <h4 className="text-lg font-bold mb-1">{flower.name}</h4>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-primary">{flower.price} ₽</span>
                    <Badge variant="secondary">{flower.available} шт</Badge>
                  </div>
                  <Button onClick={() => onAddToCart(flower)} size="sm" className="w-full">
                    <Icon name="Plus" size={16} className="mr-2" />
                    В корзину
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CatalogPage;
