import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

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

  @Get()
  getPaginate(@Query() pagination: { page: number; limit: number }) {
    const { page, limit } = pagination;

    return this.ordersService.getPaginate(Number(page), Number(limit));
  }

  @Patch(':number')
  update(
    @Param('number') number: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(Number(number), updateOrderDto);
  }

  @Delete(':number')
  delete(@Param('number') number: string) {
    return this.ordersService.delete(Number(number));
  }
}
