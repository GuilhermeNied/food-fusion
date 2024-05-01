import { Injectable } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus as PrismaOrderStatus } from '@prisma/client';
import { OrderStatus } from './enum/OrderStatus';

@Injectable()
export class OrdersRepository {
  constructor(private prismaService: PrismaService) { }
  private orderStatusMapping = {
    [OrderStatus.RECEIVED]: PrismaOrderStatus.RECEIVED,
    [OrderStatus.DOING]: PrismaOrderStatus.DOING,
    [OrderStatus.DONE]: PrismaOrderStatus.DONE,
    [OrderStatus.CANCELED]: PrismaOrderStatus.CANCELED,
  };

  private prismaStatusMapping = {
    [PrismaOrderStatus.RECEIVED]: OrderStatus.RECEIVED,
    [PrismaOrderStatus.DOING]: OrderStatus.DOING,
    [PrismaOrderStatus.DONE]: OrderStatus.DONE,
    [PrismaOrderStatus.CANCELED]: OrderStatus.CANCELED,
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
      status: this.convertPrimsaStatus(order.status),
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

  async update(number: number, order: Order): Promise<void> {
    const { name, items, description, status } = order;

    await this.prismaService.order.update({
      where: {
        number,
      },
      data: {
        name,
        description,
        status: this.convertOrderStatus(status),
      },
    });

    items?.forEach(async (item) => {
      await this.prismaService.orderItem.updateMany({
        where: {
          orderId: number,
          id: item.id,
        },
        data: {
          name: item.name,
          quantity: item.quantity,
        },
      });
    });
  }

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
    return this.orderStatusMapping[status];
  }
  private convertPrimsaStatus(status: PrismaOrderStatus): OrderStatus {
    return this.prismaStatusMapping[status];
  }
}
