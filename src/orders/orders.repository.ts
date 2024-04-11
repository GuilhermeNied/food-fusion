import { Injectable } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus as PrismaOrderStatus } from '@prisma/client';
import { OrderStatus } from './enum/OrderStatus';

@Injectable()
export class OrdersRepository {
  constructor(private prismaService: PrismaService) {}
  private statusMapping = {
    [OrderStatus.RECEIVED]: PrismaOrderStatus.RECEIVED,
    [OrderStatus.DOING]: PrismaOrderStatus.DOING,
    [OrderStatus.DONE]: PrismaOrderStatus.DONE,
    [OrderStatus.CANCELED]: PrismaOrderStatus.CANCELED,
  };

  async create(order: Order): Promise<void> {
    const { name, items, description, status } = order;
    await this.prismaService.order.create({
      data: {
        name,
        description,
        status: this.convertOrderStatus(status),
        items: {
          createMany: {
            data: items,
          },
        },
      },
    });
  }

  findByNumber(number: number): Order {
    return new Order();
  }
  exists(number: number): boolean {
    return false;
  }
  update(number: number, order: Order): void {}
  delete(number: number): void {}

  async getAll() {
    return await this.prismaService.order.findMany({
      include: {
        items: true,
      },
    });
  }

  private convertOrderStatus(status: OrderStatus): PrismaOrderStatus {
    return this.statusMapping[status];
  }
}
