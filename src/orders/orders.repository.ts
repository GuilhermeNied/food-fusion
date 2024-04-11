import { Injectable } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus as PrismaOrderStatus } from '@prisma/client';
import { OrderStatus } from './enum/OrderStatus';
import { Or } from '@prisma/client/runtime/library';

@Injectable()
export class OrdersRepository {
  constructor(private prismaService: PrismaService) { }
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

  async findByNumber(number: number): Promise<Order> {
    const order = await this.prismaService.order.findFirst({
      where: {
        number,
      },
      include: {
        items: true,
      },
    });
    const parsedOrder: Order = {
      number: order.number,
      name: order.name,
      items: order.items,
      description: order.description,
      status: this.statusMapping[order.status],
    };

    return parsedOrder;
  }
  async exists(number: number): Promise<boolean> {
    const isOrderExists = await this.prismaService.order.findFirst({
      where: {
        number,
      },
    });

    return !!isOrderExists;
  }

  update(number: number, order: Order): void { }

  async delete(number: number): Promise<void> {
    await this.prismaService.orderItem.deleteMany({
      where: {
        orderId: number,
      },
    });

    await this.prismaService.order.delete({
      where: {
        number,
      },
    });
  }

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
