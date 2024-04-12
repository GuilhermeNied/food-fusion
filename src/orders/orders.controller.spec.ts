import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { InvalidOrderException } from './exceptions/invalid-order.exception';
import { Order } from './entities/order.entity';
import { OrderStatus } from './enum/OrderStatus';
import { NotFoundOrderException } from './exceptions/not-found-order.exception';
import { UpdateOrderDto } from './dto/update-order.dto';

describe('OrdersController', () => {
  let ordersController: OrdersController;
  let ordersService: OrdersService;
  let ordersRepository: OrdersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrdersService, OrdersRepository],
    }).compile();

    ordersController = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<OrdersRepository>(OrdersRepository);
  });

  it('should be create an order', () => {
    // GIVEN
    const ordersServiceSpy = jest.spyOn(ordersService, 'create');

    const createOrderDto: CreateOrderDto = {
      name: 'Teste',
      items: [
        {
          id: '1',
          name: 'TesteItem',
          quantity: 1,
        },
      ],
    };
    // WHEN
    ordersController.create(createOrderDto);

    // THEN
    expect(ordersServiceSpy).toHaveBeenCalledWith(createOrderDto);
    expect(ordersServiceSpy).toHaveBeenCalledTimes(1);
  });

  it('should be not create an order when items is empty', () => {
    // GIVEN
    const order: CreateOrderDto = {
      name: 'Teste',
      description: 'Teste',
      items: [],
    };

    // WHEN
    const createOrder = () => ordersController.create(order);

    // THEN
    expect(createOrder).toThrow(InvalidOrderException);
  });

  it('should not be create an order when name have length lass than 3', () => {
    // GIVEN
    const order: CreateOrderDto = {
      name: 'T',
      description: 'Teste',
      items: [
        {
          id: '1',
          name: 'TesteItem',
          quantity: 1,
        },
      ],
    };

    // WHEN
    const createOrder = () => ordersController.create(order);

    // THEN
    expect(createOrder).toThrow(InvalidOrderException);
  });

  it('should be find an order by number', async () => {
    // GIVEN
    const number: string = '1';
    const serviceResult: Order = {
      number: 1,
      name: 'Teste',
      description: 'Teste',
      items: [{ id: '123', name: 'Teste', quantity: 1 }],
      status: OrderStatus.DOING,
    };

    jest
      .spyOn(ordersService, 'findByNumber')
      .mockImplementation(() => Promise.resolve(serviceResult));

    // WHEN
    const result: Order = await ordersController.findByNumber(number);

    // THEN
    expect(result).toEqual(serviceResult);
  });

  it('should be find an order by number', () => {
    // GIVEN
    const number: string = '1';

    // WHEN
    const result = () => ordersController.findByNumber(number);

    // THEN
    expect(result).toThrow(NotFoundOrderException);
  });

  it('should be update an order by number', () => {
    //GIVEN
    const number: string = '1';
    const updateOrderDto: UpdateOrderDto = {
      name: 'Teste',
      items: [{ id: '123', name: 'Teste', quantity: 1 }],
      description: 'Teste',
      status: OrderStatus.CANCELED,
    };
    const ordersServiceSpy = jest.spyOn(ordersService, 'update');

    jest
      .spyOn(ordersRepository, 'exists')
      .mockReturnValue(Promise.resolve(true));

    //WHEN
    ordersController.update(number, updateOrderDto);

    //THEN
    expect(ordersServiceSpy).toHaveBeenCalledWith(
      Number(number),
      updateOrderDto,
    );
  });

  it('should not update an order by number', () => {
    //GIVEN
    const number: string = '1';
    const updateOrderDto: UpdateOrderDto = {
      name: 'Teste',
      items: [{ id: '123', name: 'Teste', quantity: 1 }],
      description: 'Teste',
      status: OrderStatus.DONE,
    };

    //WHEN
    const result = () => ordersController.update(number, updateOrderDto);

    //THEN
    expect(result).toThrow(NotFoundOrderException);
  });

  it('should be delete an order by number', () => {
    //GIVEN
    const number: string = '1';
    const ordersServiceSpy = jest.spyOn(ordersService, 'delete');

    jest
      .spyOn(ordersRepository, 'exists')
      .mockReturnValue(Promise.resolve(true));

    //WHEN
    ordersController.delete(number);

    //THEN
    expect(ordersServiceSpy).toHaveBeenCalledWith(Number(number));
  });

  it('should not delete an order by number', () => {
    //GIVEN
    const number: string = '1';

    //WHEN
    const result = () => ordersController.delete(number);

    //THEN
    expect(result).toThrow(NotFoundOrderException);
  });
});
