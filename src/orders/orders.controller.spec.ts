import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { InvalidOrderException } from './exceptions/invalid-order.exception';
import { Order } from './entities/order.entity';
import { OrderStatus } from './enum/OrderStatus';
import { NotFoundOrderException } from './exceptions/not-found-order.exception';

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
        },
      ],
    };

    // WHEN
    const createOrder = () => ordersController.create(order);

    // THEN
    expect(createOrder).toThrow(InvalidOrderException);
  });

  it('shoud be find an order by number', () => {
    // GIVEN
    const number: string = '1';
    const serviceResult: Order = {
      number: 1,
      name: 'Teste',
      description: 'Teste',
      items: [{ id: '123', name: 'Teste' }],
      status: OrderStatus.DOING,
    };

    jest
      .spyOn(ordersService, 'findByNumber')
      .mockImplementation(() => serviceResult);

    // WHEN
    const result: Order = ordersController.getByNumber(number);
    console.log(result);

    // THEN
    expect(result).toEqual(serviceResult);
  });

  it('shoud be find an order by number', () => {
    // GIVEN
    const number: string = '1';

    // WHEN
    const result = () => ordersController.getByNumber(number);

    // THEN
    expect(result).toThrow(NotFoundOrderException);
  });

  it('shoud be delete an order by number', () => {
    //GIVEN
    const number: string = '1';
    const ordersServiceSpy = jest.spyOn(ordersService, 'delete');

    jest.spyOn(ordersRepository, 'exists').mockReturnValue(true);

    //WHEN
    ordersController.delete(number);

    //THEN
    expect(ordersServiceSpy).toHaveBeenCalledWith(Number(number));
  });

  it('shoud be delete an order by number', () => {
    //GIVEN
    const number: string = '1';

    //WHEN
    const result = () => ordersController.delete(number);

    //THEN
    expect(result).toThrow(NotFoundOrderException);
  });
});
