import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Order } from '@/types';

interface OrderTrackingProps {
  order: Order | null;
  onNavigate: (tab: string) => void;
  onUpdateOrderStatus: (status: Order['status']) => void;
}

const OrderTracking = ({ order, onNavigate, onUpdateOrderStatus }: OrderTrackingProps) => {
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
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold mb-4">Отслеживание заказа</h2>
        <p className="text-lg text-muted-foreground">Следите за статусом вашего букета в реальном времени</p>
      </div>

      {order ? (
        <Card className="p-8">
          <div className="text-center mb-8">
            <Badge variant="outline" className="text-lg py-2 px-4 mb-4">
              Заказ {order.id}
            </Badge>
            <h3 className="text-3xl font-bold text-primary">{getOrderStatusText(order.status)}</h3>
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${order.status === 'pending' ? 'bg-primary text-white' : 'bg-primary/20'}`}>
                <Icon name="Check" size={24} />
              </div>
              <div>
                <p className="font-semibold">Заказ принят</p>
                <p className="text-sm text-muted-foreground">{order.createdAt.toLocaleTimeString('ru-RU')}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${['assembling', 'ready', 'delivering', 'completed'].includes(order.status) ? 'bg-primary text-white' : 'bg-muted'}`}>
                <Icon name="Scissors" size={24} />
              </div>
              <div>
                <p className="font-semibold">Флорист собирает букет</p>
                <p className="text-sm text-muted-foreground">15 минут на сборку</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${['ready', 'delivering', 'completed'].includes(order.status) ? 'bg-primary text-white' : 'bg-muted'}`}>
                <Icon name="Package" size={24} />
              </div>
              <div>
                <p className="font-semibold">Букет готов</p>
                {order.readyAt && (
                  <p className="text-sm text-muted-foreground">{order.readyAt.toLocaleTimeString('ru-RU')}</p>
                )}
              </div>
            </div>
          </div>

          {order.status === 'ready' && (
            <div className="space-y-4 animate-scale-in">
              <p className="text-center text-muted-foreground mb-4">Выберите способ получения</p>
              <div className="grid md:grid-cols-2 gap-4">
                <Button size="lg" className="h-24" onClick={() => onUpdateOrderStatus('completed')}>
                  <div className="text-left">
                    <Icon name="Store" size={24} className="mb-2" />
                    <p className="font-bold">Самовывоз</p>
                    <p className="text-xs opacity-80">Бесплатно</p>
                  </div>
                </Button>
                <Button size="lg" variant="outline" className="h-24" onClick={() => onUpdateOrderStatus('delivering')}>
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
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span className="font-semibold">{item.price * item.quantity} ₽</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
              <span>Итого</span>
              <span className="text-primary">{order.total} ₽</span>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <Icon name="Package" size={64} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-2xl font-bold mb-2">Нет активных заказов</h3>
          <p className="text-muted-foreground mb-6">Создайте свой первый букет</p>
          <Button onClick={() => onNavigate('constructor')}>
            Перейти к конструктору
          </Button>
        </Card>
      )}
    </div>
  );
};

export default OrderTracking;
