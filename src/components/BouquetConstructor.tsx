import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Flower } from '@/types';

interface BouquetConstructorProps {
  flowers: Flower[];
  selectedFlowers: number[];
  onSelectFlower: (id: number) => void;
  aiPrompt: string;
  onAiPromptChange: (value: string) => void;
  onGenerate: () => void;
  generatedImage: string;
  isGenerating: boolean;
  onAddToCart: (item: { id: number; name: string; price: number }) => void;
  onOpenCart: () => void;
}

const BouquetConstructor = ({
  flowers,
  selectedFlowers,
  onSelectFlower,
  aiPrompt,
  onAiPromptChange,
  onGenerate,
  generatedImage,
  isGenerating,
  onAddToCart,
  onOpenCart
}: BouquetConstructorProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold mb-4">Конструктор букетов</h2>
        <p className="text-lg text-muted-foreground">Создайте уникальный букет с помощью ИИ</p>
      </div>

      <Card className="p-8">
        <h3 className="text-2xl font-bold mb-6">Выберите цветы</h3>
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {flowers.map(flower => (
            <Card
              key={flower.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${selectedFlowers.includes(flower.id) ? 'ring-2 ring-primary' : ''}`}
              onClick={() => onSelectFlower(flower.id)}
            >
              <div className="aspect-square overflow-hidden rounded-t-lg">
                <img src={flower.image} alt={flower.name} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-4">
                <p className="font-semibold text-sm">{flower.name}</p>
                <p className="text-xs text-muted-foreground">{flower.price} ₽/шт</p>
                <Badge variant="secondary" className="mt-2">{flower.available} шт</Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Опишите желаемый букет</label>
            <Textarea
              value={aiPrompt}
              onChange={(e) => onAiPromptChange(e.target.value)}
              placeholder="Например: романтичный букет для свидания, яркие цвета, много зелени..."
              rows={4}
              className="resize-none"
            />
          </div>

          <Button 
            onClick={onGenerate} 
            disabled={selectedFlowers.length === 0 || isGenerating}
            className="w-full"
            size="lg"
          >
            <Icon name={isGenerating ? "Loader2" : "Wand2"} size={20} className={`mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Генерирую букет...' : 'Сгенерировать букет'}
          </Button>
        </div>

        {generatedImage && (
          <div className="mt-8 animate-scale-in">
            <h4 className="text-xl font-bold mb-4">Ваш уникальный букет</h4>
            <div className="rounded-2xl overflow-hidden mb-4">
              <img src={generatedImage} alt="Generated bouquet" className="w-full" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Стоимость букета</p>
                <p className="text-3xl font-bold text-primary">
                  {selectedFlowers.reduce((sum, id) => {
                    const flower = flowers.find(f => f.id === id);
                    return sum + (flower?.price || 0) * 5;
                  }, 0)} ₽
                </p>
              </div>
              <Button size="lg" onClick={() => {
                const bouquetPrice = selectedFlowers.reduce((sum, id) => {
                  const flower = flowers.find(f => f.id === id);
                  return sum + (flower?.price || 0) * 5;
                }, 0);
                onAddToCart({ id: Date.now(), name: 'Авторский букет', price: bouquetPrice });
                onOpenCart();
              }}>
                <Icon name="ShoppingCart" size={20} className="mr-2" />
                Добавить в корзину
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BouquetConstructor;