import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderStatus } from './enum/OrderStatus';
import { OrdersRepository } from './orders.repository';
import { InvalidOrderException } from './exceptions/invalid-order.exception';
import { NotFoundOrderException } from './exceptions/not-found-order.exception';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async create(createOrderDto: CreateOrderDto): Promise<void> {
    if (this.isInvalidOrder(createOrderDto)) {
      throw new InvalidOrderException(
        'Name must be at least 3 characters long and items are required.',
      );
    }
    const order = this.toOrderEntity(createOrderDto);
    await this.ordersRepository.create(order);
  }

  findByNumber(number: number): Order {
    if (!this.isOrderExits(number)) {
      throw new NotFoundOrderException(
        `Order with number ${number} not found.`,
      );
    }

    return this.ordersRepository.findByNumber(number);
  }

  update(number: number, updateOrderDto: UpdateOrderDto): void {
    if (!this.isOrderExits(number)) {
      throw new NotFoundOrderException(
        `Order with number ${number} not found.`,
      );
    }
    const order: Order = this.toUpdateOrderEntity(updateOrderDto);
    return this.ordersRepository.update(number, order);
  }

  delete(number: number): void {
    if (!this.isOrderExits(number)) {
      throw new NotFoundOrderException(
        `Order with number ${number} not found.`,
      );
    }
    this.ordersRepository.delete(number);
  }

  async getAll() {
    return await this.ordersRepository.getAll();
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

  private toUpdateOrderEntity(updateOrderDto: UpdateOrderDto): Order {
    const order = new Order();
    if (updateOrderDto.name !== undefined && updateOrderDto.name !== null) {
      order.name = updateOrderDto.name;
    }
    if (updateOrderDto.items !== undefined && updateOrderDto.items !== null) {
      order.items = updateOrderDto.items;
    }

    if (
      updateOrderDto.description !== undefined &&
      updateOrderDto.description !== null
    ) {
      order.description = updateOrderDto.description;
    }
    if (updateOrderDto.status !== undefined && updateOrderDto.status !== null) {
      order.status = updateOrderDto.status;
    }
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
