import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Bouquet } from '@/types';

interface HomePageProps {
  bouquets: Bouquet[];
  onNavigate: (tab: string) => void;
  onAddToCart: (item: { id: number; name: string; price: number }) => void;
}

const HomePage = ({ bouquets, onNavigate, onAddToCart }: HomePageProps) => {
  return (
    <div className="space-y-20 animate-fade-in">
      <section className="text-center py-20">
        <h2 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Цветы для особенных моментов
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Создайте уникальный букет с помощью ИИ-ассистента или выберите из готовых композиций
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" onClick={() => onNavigate('constructor')} className="text-lg px-8">
            <Icon name="Sparkles" size={20} className="mr-2" />
            Создать с ИИ
          </Button>
          <Button size="lg" variant="outline" onClick={() => onNavigate('catalog')} className="text-lg px-8">
            Смотреть каталог
          </Button>
        </div>
      </section>

      <section>
        <h3 className="text-4xl font-bold mb-8 text-center">Популярные букеты</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {bouquets.map((bouquet, idx) => (
            <Card key={bouquet.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
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
      </section>

      <section className="bg-secondary/20 rounded-3xl p-12 text-center">
        <Icon name="Sparkles" size={48} className="mx-auto mb-4 text-primary" />
        <h3 className="text-3xl font-bold mb-4">Попробуйте ИИ-конструктор</h3>
        <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
          Опишите желаемый букет, выберите цветы, и наш ИИ создаст визуализацию вашей мечты
        </p>
        <Button size="lg" onClick={() => onNavigate('constructor')}>
          Начать создание
        </Button>
      </section>
    </div>
  );
};

export default HomePage;
