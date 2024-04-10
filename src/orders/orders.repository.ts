import { Injectable } from '@nestjs/common';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersRepository {
  constructor() {}
  create(order: Order): void {}
  findByNumber(number: number): Order {
    return new Order();
  }
  exists(number: number): boolean {
    return false;
  }
  update(number: number, order: Order): void {}
  delete(number: number): void {}
}
