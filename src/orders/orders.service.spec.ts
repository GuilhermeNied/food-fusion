import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersRepository } from './orders.repository';
import { InvalidOrderException } from './exceptions/invalid-order.exception';

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let ordersRepository: OrdersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, OrdersRepository],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<OrdersRepository>(OrdersRepository);
  });

  it('should be create order', () => {
    // GIVEN
    const ordersRepositorySpy = jest.spyOn(ordersRepository, 'create');
    const order: CreateOrderDto = {
      name: 'Teste',
      description: 'Teste',
      items: [
        {
          id: '1',
          name: 'Teste',
        },
      ],
    };

    // WHEN
    ordersService.create(order);

    // THEN
    expect(ordersRepositorySpy).toHaveBeenCalledTimes(1);
  });

  it('should not be create order when name have length lass than 3', () => {
    // GIVEN
    const ordersRepositorySpy = jest.spyOn(ordersRepository, 'create');
    const order: CreateOrderDto = {
      name: 'T',
      description: 'Teste',
      items: [],
    };

    // WHEN
    const createOrder = () => ordersService.create(order);

    // THEN
    expect(createOrder).toThrow(InvalidOrderException);
    expect(ordersRepositorySpy).not.toHaveBeenCalled;
    expect(ordersRepositorySpy).toHaveBeenCalledTimes(0);
  });

  it('should not be create order when do not have items', () => {
    // GIVEN
    const ordersRepositorySpy = jest.spyOn(ordersRepository, 'create');

    const order: CreateOrderDto = {
      name: 'Teste',
      description: 'Teste',
      items: [],
    };

    // WHEN
    const createOrder = () => ordersService.create(order);

    // THEN
    expect(createOrder).toThrow(InvalidOrderException);
    expect(ordersRepositorySpy).not.toHaveBeenCalled;
    expect(ordersRepositorySpy).toHaveBeenCalledTimes(0);
  });
});
