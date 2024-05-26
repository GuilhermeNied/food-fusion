import { PrismaService } from '../prisma/prisma.service';
import { Order } from './entities/order.entity';
import { OrderStatus } from './enum/OrderStatus';
import { OrdersRepository } from './orders.repository';

describe.only('OrderRepository Integration Test', () => {
  let prismaService: PrismaService;
  let orderRepository: OrdersRepository;

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
});
