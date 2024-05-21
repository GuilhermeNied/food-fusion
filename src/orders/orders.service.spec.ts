import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersRepository } from './orders.repository';
import { InvalidOrderException } from './exceptions/invalid-order.exception';
import { NotFoundOrderException } from './exceptions/not-found-order.exception';
import { Order } from './entities/order.entity';
import { OrderStatus } from './enum/OrderStatus';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma/prisma.service';

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let ordersRepository: OrdersRepository;

  beforeEach(async () => {
    const orderRepositoryMock = {
      create: jest.fn(),
      findByNumber: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
    };

    const prismaServiceMock = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useValue: orderRepositoryMock,
        },
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<OrdersRepository>(OrdersRepository);
  });

  it('should be create order', () => {
    // GIVEN
    const ordersRepositorySpy = jest.spyOn(ordersRepository, 'create');
    const order: CreateOrderDto = {
      name: 'Teste',
      items: [
        {
          id: '1',
          name: 'Teste',
          quantity: 1,
        },
      ],
      description: 'Teste',
    };

    // WHEN
    ordersService.create(order);

    // THEN
    expect(ordersRepositorySpy).toHaveBeenCalledTimes(1);
  });

  it('should not be create order when name have length lass than 3', async () => {
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
    expect(createOrder).rejects.toThrow(InvalidOrderException);
    expect(ordersRepositorySpy).not.toHaveBeenCalled;
  });

  it('should not be create order when do not have items', async () => {
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
    expect(createOrder).rejects.toThrow(InvalidOrderException);
    expect(ordersRepositorySpy).not.toHaveBeenCalled;
  });

  it('should be find a order', async () => {
    // GIVEN
    const number: number = 1;
    const repositoryResult: Order = {
      number: 1,
      name: 'Teste',
      description: 'Teste',
      items: [{ id: '123', name: 'Teste', quantity: 1 }],
      status: OrderStatus.RECEIVED,
    };
    jest
      .spyOn(ordersRepository, 'exists')
      .mockReturnValue(Promise.resolve(true));

    jest
      .spyOn(ordersRepository, 'findByNumber')
      .mockImplementation(() => Promise.resolve(repositoryResult));

    // WHEN
    const result: Order = await ordersService.findByNumber(number);

    // THEN
    expect(result).toEqual(repositoryResult);
  });

  it('should not find a order when order not exists', async () => {
    // GIVEN
    const number: number = 1;
    const ordersRepositorySpy = jest.spyOn(ordersRepository, 'findByNumber');
    jest
      .spyOn(ordersRepository, 'exists')
      .mockReturnValue(Promise.resolve(false));

    // WHEN
    const result = () => ordersService.findByNumber(number);

    // THEN
    expect(result).rejects.toThrow(NotFoundOrderException);
    expect(ordersRepositorySpy).not.toHaveBeenCalled();
  });

  it('should be update a order', async () => {
    // GIVEN
    const ordersRepositorySpy = jest.spyOn(ordersRepository, 'update');
    const updateOrderDto: UpdateOrderDto = {
      name: 'Teste',
      items: [{ id: '123', name: 'Teste', quantity: 1 }],
      description: 'Teste',
      status: OrderStatus.CANCELED,
    };
    const number: number = 1;

    jest.spyOn(ordersRepository, 'exists').mockResolvedValue(true);

    // WHEN
    await ordersService.update(number, updateOrderDto);

    // THEN
    expect(ordersRepositorySpy).toHaveBeenCalled();
    expect(ordersRepositorySpy).toHaveBeenCalledTimes(1);
  });

  it('should not update a order when order not exists', async () => {
    // GIVEN
    const ordersRepositorySpy = jest.spyOn(ordersRepository, 'update');
    const updateOrderDto: UpdateOrderDto = {
      name: 'Teste',
      items: [{ id: '123', name: 'Teste', quantity: 1 }],
      description: 'Teste',
      status: OrderStatus.CANCELED,
    };
    const number: number = 1;
    jest
      .spyOn(ordersRepository, 'exists')
      .mockReturnValue(Promise.resolve(false));

    // WHEN
    const updateOrder = () => ordersService.update(number, updateOrderDto);

    // THEN
    await expect(updateOrder).rejects.toThrow(NotFoundOrderException);
    expect(ordersRepositorySpy).not.toHaveBeenCalled;
  });

  it('should be delete a order', async () => {
    // GIVEN
    const ordersRepositorySpy = jest.spyOn(ordersRepository, 'delete');
    const number: number = 1;
    jest
      .spyOn(ordersRepository, 'exists')
      .mockReturnValue(Promise.resolve(true));

    // WHEN
    await ordersService.delete(number);

    // THEN
    expect(ordersRepositorySpy).toHaveBeenCalledTimes(1);
  });

  it('should not delete a order when order not exists', async () => {
    //GIVEN
    const ordersRepositorySpy = jest.spyOn(ordersRepository, 'delete');
    const number: number = 1;
    jest
      .spyOn(ordersRepository, 'exists')
      .mockReturnValue(Promise.resolve(false));

    // WHEN
    const deleteOrder = () => ordersService.delete(number);

    // THEN
    await expect(deleteOrder).rejects.toThrow(NotFoundOrderException);
    expect(ordersRepositorySpy).not.toHaveBeenCalled;
  });
});
