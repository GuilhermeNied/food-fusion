import { PrismaService } from '../prisma/prisma.service';
import { Order } from './entities/order.entity';
import { OrderStatus } from './enum/OrderStatus';
import { OrdersRepository } from './orders.repository';
import { OrderStatus as PrismaOrderStatus } from '@prisma/client';

describe.only('OrderRepository Integration Test', () => {
  let prismaService: PrismaService;
  let orderRepository: OrdersRepository;
  async function createAnOrder() {
    return await prismaService.order.create({
      data: {
        number: 1,
        name: 'Test name',
        description: 'Test description',
        status: PrismaOrderStatus.RECEIVED,
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

  async function createFiveOrders() {
    const createdOrders = [];
    for (let index = 1; index <= 5; index++) {
      const order = await prismaService.order.create({
        data: {
          number: index,
          name: `Test name ${index}`,
          description: `Test description ${index}`,
          status: PrismaOrderStatus.RECEIVED,
          items: {
            createMany: {
              data: [
                {
                  id: `${index}123`,
                  name: 'Teste',
                  quantity: 1,
                },
                {
                  id: `${index}456`,
                  name: 'Teste2',
                  quantity: 1,
                },
              ],
            },
          },
        },
      });
      createdOrders.push(order);
    }
    return createdOrders;
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

  it('should successfully create an order', async () => {
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

  it('should accurately find an order by its number', async () => {
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

  it('should confirm existence of an order', async () => {
    // GIVEN
    const orderNumber = 1;
    await createAnOrder();

    // WHEN
    const exists = await orderRepository.exists(orderNumber);

    // THEN
    expect(exists).toBeTruthy();
  });

  it('should confirm non-existence of an order', async () => {
    // GIVEN
    const orderNumber = 1;

    // WHEN
    const exists = await orderRepository.exists(orderNumber);

    // THEN
    expect(exists).not.toBeTruthy();
  });

  it('should successfully update an existing order', async () => {
    // GIVEN
    const orderNumberToUpdate = 1;
    const orderToUpdate: Partial<Order> = {
      name: 'TesteUpdate',
      items: [{ id: '123', name: 'TesteUpdate', quantity: 5 }],
      description: 'Testing update',
    };
    await createAnOrder();

    // WHEN
    await orderRepository.update(orderNumberToUpdate, orderToUpdate);

    const updatedOrder =
      await orderRepository.findByNumber(orderNumberToUpdate);

    // THEN
    expect(updatedOrder.name).toEqual(orderToUpdate.name);
    expect(updatedOrder.description).toEqual(orderToUpdate.description);
    expect(updatedOrder.items[1].quantity).toEqual(
      orderToUpdate.items[0].quantity,
    );
  });

  it('should successfully delete an existing order', async () => {
    // GIVEN
    const orderNumberToDelete = 1;

    await createAnOrder();

    // WHEN
    await orderRepository.delete(orderNumberToDelete);

    // THEN
    const exists = await orderRepository.exists(orderNumberToDelete);
    expect(exists).not.toBeTruthy();
  });

  it('should retrieve a specific number of orders with pagination', async () => {
    // GIVEN
    const skip = 0;
    const limit = 4;
    await createFiveOrders();

    // WHEN
    const paginatedOrders = await orderRepository.getPaginate(skip, limit);

    // THEN
    expect(paginatedOrders.length).toEqual(4);
  });
});
