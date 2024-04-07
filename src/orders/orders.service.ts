import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderStatus } from './enum/OrderStatus';

@Injectable()
export class OrdersService {
  create(createOrderDto: CreateOrderDto) {
    const order = this.toOrderEntity(createOrderDto);

    console.log(order);
    return order;
  }

  private toOrderEntity(createOrderDto: CreateOrderDto) {
    const order = new Order();
    order.name = createOrderDto.name;
    order.items = createOrderDto.items;
    order.description = createOrderDto.description;
    order.status = OrderStatus.RECEIVED;
    return order;
  }
}
