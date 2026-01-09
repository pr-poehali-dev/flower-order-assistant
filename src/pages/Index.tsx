import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Flower {
  id: number;
  name: string;
  price: number;
  image: string;
  available: number;
}

interface Bouquet {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  status: 'pending' | 'assembling' | 'ready' | 'delivering' | 'completed';
  items: CartItem[];
  total: number;
  createdAt: Date;
  readyAt?: Date;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedFlowers, setSelectedFlowers] = useState<number[]>([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [customerData, setCustomerData] = useState({ name: '', phone: '', address: '' });
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const flowers: Flower[] = [
    { id: 1, name: 'Розы красные', price: 150, image: 'https://cdn.poehali.dev/projects/20e9b2da-3dd2-44fd-ab1b-8035bfe9ef49/files/8f79cff6-adab-460c-af6a-c960614d00b1.jpg', available: 50 },
    { id: 2, name: 'Лаванда', price: 100, image: 'https://cdn.poehali.dev/projects/20e9b2da-3dd2-44fd-ab1b-8035bfe9ef49/files/dd3f26e5-31f3-44e5-8fc3-fbef297b0915.jpg', available: 30 },
    { id: 3, name: 'Тюльпаны', price: 120, image: 'https://cdn.poehali.dev/projects/20e9b2da-3dd2-44fd-ab1b-8035bfe9ef49/files/cfd6b18b-72a0-46fc-9c55-3e4c1fb6551b.jpg', available: 40 },
    { id: 4, name: 'Пионы розовые', price: 200, image: 'https://cdn.poehali.dev/projects/20e9b2da-3dd2-44fd-ab1b-8035bfe9ef49/files/8f79cff6-adab-460c-af6a-c960614d00b1.jpg', available: 25 },
  ];

  const bouquets: Bouquet[] = [
    { id: 1, name: 'Нежность', description: 'Розовые розы с зеленью', price: 2500, image: 'https://cdn.poehali.dev/projects/20e9b2da-3dd2-44fd-ab1b-8035bfe9ef49/files/8f79cff6-adab-460c-af6a-c960614d00b1.jpg' },
    { id: 2, name: 'Прованс', description: 'Лаванда с белыми цветами', price: 1800, image: 'https://cdn.poehali.dev/projects/20e9b2da-3dd2-44fd-ab1b-8035bfe9ef49/files/dd3f26e5-31f3-44e5-8fc3-fbef297b0915.jpg' },
    { id: 3, name: 'Весенний микс', description: 'Тюльпаны и розы', price: 3200, image: 'https://cdn.poehali.dev/projects/20e9b2da-3dd2-44fd-ab1b-8035bfe9ef49/files/cfd6b18b-72a0-46fc-9c55-3e4c1fb6551b.jpg' },
  ];

  const addToCart = (item: { id: number; name: string; price: number }) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(c => {
      if (c.id === id) {
        const newQty = c.quantity + delta;
        return newQty > 0 ? { ...c, quantity: newQty } : c;
      }
      return c;
    }).filter(c => c.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleGenerateAI = () => {
    if (selectedFlowers.length === 0) return;
    setGeneratedImage('https://cdn.poehali.dev/projects/20e9b2da-3dd2-44fd-ab1b-8035bfe9ef49/files/cfd6b18b-72a0-46fc-9c55-3e4c1fb6551b.jpg');
  };

  const handleCheckout = () => {
    if (cart.length === 0 || !customerData.name || !customerData.phone || !customerData.address) return;
    
    const order: Order = {
      id: `ORD-${Date.now()}`,
      status: 'pending',
      items: [...cart],
      total: cartTotal,
      createdAt: new Date(),
    };
    
    setCurrentOrder(order);
    setCart([]);
    setIsCartOpen(false);
    setActiveTab('tracking');

    setTimeout(() => {
      setCurrentOrder(prev => prev ? { ...prev, status: 'assembling' } : null);
    }, 2000);

    setTimeout(() => {
      setCurrentOrder(prev => prev ? { ...prev, status: 'ready', readyAt: new Date() } : null);
    }, 17000);
  };

  const getOrderStatusText = (status: Order['status']) => {
    const statusMap = {
      pending: 'Принят',
      assembling: 'Собирается',
      ready: 'Готов',
      delivering: 'Доставляется',
      completed: 'Выполнен'
    };
    return statusMap[status];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-muted/30">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-primary">Florista</h1>
            <nav className="hidden md:flex gap-6">
              <button onClick={() => setActiveTab('home')} className="text-foreground/70 hover:text-primary transition-colors">
                Главная
              </button>
              <button onClick={() => setActiveTab('constructor')} className="text-foreground/70 hover:text-primary transition-colors">
                Конструктор
              </button>
              <button onClick={() => setActiveTab('catalog')} className="text-foreground/70 hover:text-primary transition-colors">
                Каталог
              </button>
              <button onClick={() => setActiveTab('tracking')} className="text-foreground/70 hover:text-primary transition-colors">
                Отслеживание
              </button>
            </nav>
            <Button onClick={() => setIsCartOpen(true)} variant="outline" className="relative">
              <Icon name="ShoppingCart" size={20} />
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                  {cart.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {activeTab === 'home' && (
          <div className="space-y-20 animate-fade-in">
            <section className="text-center py-20">
              <h2 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Цветы для особенных моментов
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Создайте уникальный букет с помощью ИИ-ассистента или выберите из готовых композиций
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button size="lg" onClick={() => setActiveTab('constructor')} className="text-lg px-8">
                  <Icon name="Sparkles" size={20} className="mr-2" />
                  Создать с ИИ
                </Button>
                <Button size="lg" variant="outline" onClick={() => setActiveTab('catalog')} className="text-lg px-8">
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
                        <Button onClick={() => addToCart(bouquet)}>
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
              <Button size="lg" onClick={() => setActiveTab('constructor')}>
                Начать создание
              </Button>
            </section>
          </div>
        )}

        {activeTab === 'constructor' && (
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
                    onClick={() => {
                      if (selectedFlowers.includes(flower.id)) {
                        setSelectedFlowers(selectedFlowers.filter(id => id !== flower.id));
                      } else {
                        setSelectedFlowers([...selectedFlowers, flower.id]);
                      }
                    }}
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
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Например: романтичный букет для свидания, яркие цвета, много зелени..."
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <Button 
                  onClick={handleGenerateAI} 
                  disabled={selectedFlowers.length === 0}
                  className="w-full"
                  size="lg"
                >
                  <Icon name="Wand2" size={20} className="mr-2" />
                  Сгенерировать букет
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
                      addToCart({ id: Date.now(), name: 'Авторский букет', price: bouquetPrice });
                      setIsCartOpen(true);
                    }}>
                      <Icon name="ShoppingCart" size={20} className="mr-2" />
                      Добавить в корзину
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'catalog' && (
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
                          <Button onClick={() => addToCart(bouquet)}>
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
                        <Button onClick={() => addToCart(flower)} size="sm" className="w-full">
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
        )}

        {activeTab === 'tracking' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold mb-4">Отслеживание заказа</h2>
              <p className="text-lg text-muted-foreground">Следите за статусом вашего букета в реальном времени</p>
            </div>

            {currentOrder ? (
              <Card className="p-8">
                <div className="text-center mb-8">
                  <Badge variant="outline" className="text-lg py-2 px-4 mb-4">
                    Заказ {currentOrder.id}
                  </Badge>
                  <h3 className="text-3xl font-bold text-primary">{getOrderStatusText(currentOrder.status)}</h3>
                </div>

                <div className="space-y-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentOrder.status === 'pending' ? 'bg-primary text-white' : 'bg-primary/20'}`}>
                      <Icon name="Check" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold">Заказ принят</p>
                      <p className="text-sm text-muted-foreground">{currentOrder.createdAt.toLocaleTimeString('ru-RU')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${['assembling', 'ready', 'delivering', 'completed'].includes(currentOrder.status) ? 'bg-primary text-white' : 'bg-muted'}`}>
                      <Icon name="Scissors" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold">Флорист собирает букет</p>
                      <p className="text-sm text-muted-foreground">15 минут на сборку</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${['ready', 'delivering', 'completed'].includes(currentOrder.status) ? 'bg-primary text-white' : 'bg-muted'}`}>
                      <Icon name="Package" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold">Букет готов</p>
                      {currentOrder.readyAt && (
                        <p className="text-sm text-muted-foreground">{currentOrder.readyAt.toLocaleTimeString('ru-RU')}</p>
                      )}
                    </div>
                  </div>
                </div>

                {currentOrder.status === 'ready' && (
                  <div className="space-y-4 animate-scale-in">
                    <p className="text-center text-muted-foreground mb-4">Выберите способ получения</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button size="lg" className="h-24" onClick={() => setCurrentOrder({...currentOrder, status: 'completed'})}>
                        <div className="text-left">
                          <Icon name="Store" size={24} className="mb-2" />
                          <p className="font-bold">Самовывоз</p>
                          <p className="text-xs opacity-80">Бесплатно</p>
                        </div>
                      </Button>
                      <Button size="lg" variant="outline" className="h-24" onClick={() => setCurrentOrder({...currentOrder, status: 'delivering'})}>
                        <div className="text-left">
                          <Icon name="Truck" size={24} className="mb-2" />
                          <p className="font-bold">Доставка</p>
                          <p className="text-xs opacity-80">Расчет при заказе</p>
                        </div>
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t">
                  <h4 className="font-bold mb-4">Состав заказа</h4>
                  <div className="space-y-2">
                    {currentOrder.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name} × {item.quantity}</span>
                        <span className="font-semibold">{item.price * item.quantity} ₽</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
                    <span>Итого</span>
                    <span className="text-primary">{currentOrder.total} ₽</span>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center">
                <Icon name="Package" size={64} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-bold mb-2">Нет активных заказов</h3>
                <p className="text-muted-foreground mb-6">Создайте свой первый букет</p>
                <Button onClick={() => setActiveTab('constructor')}>
                  Перейти к конструктору
                </Button>
              </Card>
            )}
          </div>
        )}
      </main>

      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Корзина</DialogTitle>
          </DialogHeader>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="ShoppingCart" size={64} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Корзина пуста</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-4 pb-4 border-b">
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.price} ₽</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, -1)}>
                        <Icon name="Minus" size={16} />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, 1)}>
                        <Icon name="Plus" size={16} />
                      </Button>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => removeFromCart(item.id)}>
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Ваше имя</label>
                  <Input
                    value={customerData.name}
                    onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                    placeholder="Иван Иванов"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Телефон</label>
                  <Input
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Адрес доставки</label>
                  <Textarea
                    value={customerData.address}
                    onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
                    placeholder="Москва, ул. Примерная, д. 1, кв. 10"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-2xl font-bold pt-4 border-t">
                <span>Итого:</span>
                <span className="text-primary">{cartTotal} ₽</span>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={!customerData.name || !customerData.phone || !customerData.address}
              >
                Оформить заказ
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
