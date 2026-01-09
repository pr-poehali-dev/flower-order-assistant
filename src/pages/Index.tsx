import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import HomePage from '@/components/HomePage';
import BouquetConstructor from '@/components/BouquetConstructor';
import CatalogPage from '@/components/CatalogPage';
import OrderTracking from '@/components/OrderTracking';
import CartDialog from '@/components/CartDialog';
import { Flower, Bouquet, CartItem, Order } from '@/types';

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
    { id: 1, name: 'Роза красная', price: 150, image: 'https://cdn.poehali.dev/projects/20e9b2da-3dd2-44fd-ab1b-8035bfe9ef49/files/eb0145a3-73e5-41dc-bae7-50dc004598f9.jpg', available: 50 },
    { id: 2, name: 'Ромашка', price: 100, image: 'https://cdn.poehali.dev/projects/20e9b2da-3dd2-44fd-ab1b-8035bfe9ef49/files/0c497cad-0495-495d-af06-594a0f1ffb5d.jpg', available: 30 },
    { id: 3, name: 'Тюльпан желтый', price: 120, image: 'https://cdn.poehali.dev/projects/20e9b2da-3dd2-44fd-ab1b-8035bfe9ef49/files/a7fae14a-abcb-4ac7-8f40-26316f1944ca.jpg', available: 40 },
    { id: 4, name: 'Лилия', price: 200, image: 'https://cdn.poehali.dev/projects/20e9b2da-3dd2-44fd-ab1b-8035bfe9ef49/files/9c868a7b-47e6-4874-98d4-daa675f1f6bf.jpg', available: 25 },
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

  const handleSelectFlower = (id: number) => {
    if (selectedFlowers.includes(id)) {
      setSelectedFlowers(selectedFlowers.filter(flowerId => flowerId !== id));
    } else {
      setSelectedFlowers([...selectedFlowers, id]);
    }
  };

  const handleUpdateOrderStatus = (status: Order['status']) => {
    setCurrentOrder(prev => prev ? { ...prev, status } : null);
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
          <HomePage
            bouquets={bouquets}
            onNavigate={setActiveTab}
            onAddToCart={addToCart}
          />
        )}

        {activeTab === 'constructor' && (
          <BouquetConstructor
            flowers={flowers}
            selectedFlowers={selectedFlowers}
            onSelectFlower={handleSelectFlower}
            aiPrompt={aiPrompt}
            onAiPromptChange={setAiPrompt}
            onGenerate={handleGenerateAI}
            generatedImage={generatedImage}
            onAddToCart={addToCart}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {activeTab === 'catalog' && (
          <CatalogPage
            bouquets={bouquets}
            flowers={flowers}
            onAddToCart={addToCart}
          />
        )}

        {activeTab === 'tracking' && (
          <OrderTracking
            order={currentOrder}
            onNavigate={setActiveTab}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}
      </main>

      <CartDialog
        isOpen={isCartOpen}
        onOpenChange={setIsCartOpen}
        cart={cart}
        cartTotal={cartTotal}
        customerData={customerData}
        onCustomerDataChange={setCustomerData}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default Index;