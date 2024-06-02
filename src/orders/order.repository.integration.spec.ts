import { PrismaService } from '../prisma/prisma.service';
import { Order } from './entities/order.entity';
import { OrderStatus } from './enum/OrderStatus';
import { OrdersRepository } from './orders.repository';
import { OrderStatus as PrismaOrderStatus } from '@prisma/client';

describe('OrderRepository Integration Test', () => {
  let prismaService: PrismaService;
  let orderRepository: OrdersRepository;
  async function createAnOrder() {
    return await prismaService.order.create({
      data: {
        number: 1,
        name: 'Test name',
        description: 'Test description',
        status: PrismaOrderStatus.RECEIVED, // Use Prisma's generated enum
        items: {
          createMany: {
            data: [
              {
                id: '123',
                name: 'Teste',
                quantity: 1,
              },
              {
                id: '456',
                name: 'Teste2',
                quantity: 1,
              },
            ],
          },
        },
      },
    });
  }

  beforeAll(async () => {
    prismaService = new PrismaService();
    orderRepository = new OrdersRepository(prismaService);
  });

  beforeEach(async () => {
    await prismaService.orderItem.deleteMany({});
    await prismaService.order.deleteMany({});
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should create an order', async () => {
    // GIVEN
    const randomNumber = Math.floor(Math.random() * 100);
    const order: Order = {
      name: `Test name_${randomNumber}`,
      description: 'Test description',
      status: OrderStatus.RECEIVED,
      items: [
        {
          id: '123',
          name: 'Teste',
          quantity: 1,
        },
        {
          id: '456',
          name: 'Teste2',
          quantity: 1,
        },
      ],
    };

    // WHEN
    await orderRepository.create(order);
    const createdOrder = await prismaService.order.findFirst({
      where: {
        name: order.name,
      },
      include: {
        items: true,
      },
    });

    // THEN
    expect(createdOrder.name).toEqual(order.name);
  });

  it('should find a order', async () => {
    // GIVEN
    const orderNumber = 1;
    const createdOrder = await createAnOrder();

    // WHEN
    const findedOrder = await orderRepository.findByNumber(orderNumber);

    // THEN
    expect(findedOrder.name).toEqual(createdOrder.name);
    expect(findedOrder.description).toEqual(createdOrder.description);
    expect(findedOrder.status).toEqual(createdOrder.status.toLowerCase());
  });

  it('should return order exists', async () => {
    // GIVEN
    const orderNumber = 1;
    await createAnOrder();

    // WHEN
    const exists = await orderRepository.exists(orderNumber);

    // THEN
    expect(exists).toBeTruthy();
  });

  it('should return order not exists', async () => {
    // GIVEN
    const orderNumber = 1;

    // WHEN
    const exists = await orderRepository.exists(orderNumber);

    // THEN
    expect(exists).not.toBeTruthy();
  });
});
