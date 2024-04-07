import { Injectable } from '@nestjs/common';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersRepository {
  constructor() {}
  create(order: Order): void {
    console.log(order);
  }
}
