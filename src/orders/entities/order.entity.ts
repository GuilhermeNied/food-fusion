import { OrderStatus } from '../enum/OrderStatus';
import { OrderItem } from './order-item.entity';

export class Order {
  number: number;
  name: string;
  items: OrderItem[];
  description: string;
  status: OrderStatus;
}
