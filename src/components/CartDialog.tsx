import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { CartItem } from '@/types';

interface CartDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  cartTotal: number;
  customerData: { name: string; phone: string; address: string };
  onCustomerDataChange: (data: { name: string; phone: string; address: string }) => void;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveFromCart: (id: number) => void;
  onCheckout: () => void;
}

const CartDialog = ({
  isOpen,
  onOpenChange,
  cart,
  cartTotal,
  customerData,
  onCustomerDataChange,
  onUpdateQuantity,
  onRemoveFromCart,
  onCheckout
}: CartDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                    <Button size="sm" variant="outline" onClick={() => onUpdateQuantity(item.id, -1)}>
                      <Icon name="Minus" size={16} />
                    </Button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <Button size="sm" variant="outline" onClick={() => onUpdateQuantity(item.id, 1)}>
                      <Icon name="Plus" size={16} />
                    </Button>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => onRemoveFromCart(item.id)}>
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
                  onChange={(e) => onCustomerDataChange({...customerData, name: e.target.value})}
                  placeholder="Иван Иванов"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Телефон</label>
                <Input
                  value={customerData.phone}
                  onChange={(e) => onCustomerDataChange({...customerData, phone: e.target.value})}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Адрес доставки</label>
                <Textarea
                  value={customerData.address}
                  onChange={(e) => onCustomerDataChange({...customerData, address: e.target.value})}
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
              onClick={onCheckout}
              disabled={!customerData.name || !customerData.phone || !customerData.address}
            >
              Оформить заказ
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CartDialog;
