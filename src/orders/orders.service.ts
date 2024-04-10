import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderStatus } from './enum/OrderStatus';
import { OrdersRepository } from './orders.repository';
import { InvalidOrderException } from './exceptions/invalid-order.exception';
import { NotFoundOrderException } from './exceptions/not-found-order.exception';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) { }

  create(createOrderDto: CreateOrderDto): void {
    if (this.isInvalidOrder(createOrderDto)) {
      throw new InvalidOrderException(
        'Name must be at least 3 characters long and items are required.',
      );
    }
    const order = this.toOrderEntity(createOrderDto);
    this.ordersRepository.create(order);
  }

  delete(number: number): void {
    if (!this.isOrderExits(number)) {
      throw new NotFoundOrderException(
        `Order with number ${number} not found.`,
      );
    }
    this.ordersRepository.delete(number);
  }

  findByNumber(number: number): Order {
    if (!this.isOrderExits(number)) {
      throw new NotFoundOrderException(
        `Order with number ${number} not found.`,
      );
    }

    return this.ordersRepository.findByNumber(number);
  }

  private isOrderExits(number: number): boolean {
    return this.ordersRepository.exists(number);
  }

  private toOrderEntity(createOrderDto: CreateOrderDto): Order {
    const order = new Order();
    order.name = createOrderDto.name;
    order.items = createOrderDto.items;
    order.description = createOrderDto.description;
    order.status = OrderStatus.RECEIVED;
    return order;
  }

  private isInvalidOrder(createOrderDto: CreateOrderDto): boolean {
    return (
      !createOrderDto.name ||
      createOrderDto.name.length <= 3 ||
      createOrderDto.items.length === 0
    );
  }
}
