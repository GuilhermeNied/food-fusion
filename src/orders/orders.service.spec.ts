import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersRepository } from './orders.repository';
import { InvalidOrderException } from './exceptions/invalid-order.exception';
import { NotFoundOrderException } from './exceptions/not-found-order.exception';
import { Order } from './entities/order.entity';
import { OrderStatus } from './enum/OrderStatus';

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

  it('should be find a order by number', () => {
    // GIVEN
    const number: number = 1;
    const repositoryResult: Order = {
      number: 1,
      name: 'Teste',
      description: 'Teste',
      items: [{ id: '123', name: 'Teste' }],
      status: OrderStatus.RECEIVED,
    };
    jest.spyOn(ordersRepository, 'exists').mockReturnValue(true);

    jest
      .spyOn(ordersRepository, 'findByNumber')
      .mockImplementation(() => repositoryResult);

    // WHEN
    const result: Order = ordersService.findByNumber(number);

    // THEN
    expect(result).toEqual(repositoryResult);
  });

  it('should not find a order by number when order not exists', () => {
    // GIVEN
    const number: number = 1;
    const ordersRepositorySpy = jest.spyOn(ordersRepository, 'findByNumber');
    jest.spyOn(ordersRepository, 'exists').mockReturnValue(false);

    // WHEN
    const result = () => ordersService.findByNumber(number);

    // THEN
    expect(result).toThrow(NotFoundOrderException);
    expect(ordersRepositorySpy).not.toHaveBeenCalled();
    expect(ordersRepositorySpy).toHaveBeenCalledTimes(0);
  });

  it('should be delete a order by number', () => {
    // GIVEN
    const ordersRepositorySpy = jest.spyOn(ordersRepository, 'delete');
    const number: number = 1;
    jest.spyOn(ordersRepository, 'exists').mockReturnValue(true);

    // WHEN
    ordersService.delete(number);

    // THEN
    expect(ordersRepositorySpy).toHaveBeenCalledTimes(1);
  });

  it('should not delete a order when number not exists', () => {
    // GIVEN
    const ordersRepositorySpy = jest.spyOn(ordersRepository, 'delete');
    const number: number = 1;
    jest.spyOn(ordersRepository, 'exists').mockReturnValue(false);

    // WHEN
    const deleteOrder = () => ordersService.delete(number);

    // THEN
    expect(deleteOrder).toThrow(NotFoundOrderException);
    expect(ordersRepositorySpy).not.toHaveBeenCalled;
    expect(ordersRepositorySpy).toHaveBeenCalledTimes(0);
  });
});
