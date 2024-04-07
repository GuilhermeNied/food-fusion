import { OrderItem } from '../entities/order-item.entity';
import { OrderStatus } from '../enum/OrderStatus';

export class CreateOrderDto {
  name: string;
  items: OrderItem[];
  description?: string;
  status?: OrderStatus;
}
