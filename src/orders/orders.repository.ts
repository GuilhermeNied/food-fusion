import { Injectable } from '@nestjs/common';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersRepository {
  constructor() {}
  create(order: Order): void {}
  delete(number: number): void {}
  findByNumber(number: number): Order {
    return new Order();
  }
  exists(number: number): boolean {
    return false;
  }
}
