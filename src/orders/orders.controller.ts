import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get(':number')
  findByNumber(@Param('number') number: string) {
    return this.ordersService.findByNumber(Number(number));
  }

  @Delete(':number')
  delete(@Param('number') number: string) {
    return this.ordersService.delete(Number(number));
  }
}
