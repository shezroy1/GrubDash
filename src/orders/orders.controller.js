const path = require("path");

// Use the existing orders data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

const orderExists = (req, res, next) => {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);

  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  }

  next({ status: 404, message: `Order id ${orderId} not found.` });
};

const bodyHasProperty = (propertyName) => {
  return (req, res, next) => {
    const { data = {} } = req.body;

    if (propertyName === "status") {
      if (
        !data[propertyName] ||
        !["pending", "preparing", "in-progress", "ready"].includes(
          data[propertyName],
        )
      ) {
        return next({
          status: 400,
          message: `Order status must be one of: pending, preparing, in-progress, ready`,
        });
      }
    }

    if (data[propertyName]) {
      return next();
    }

    next({
      status: 400,
      message: `Order property ${propertyName} not found.`,
    });
  };
};

const bodyHasDishes = () => {
  return (req, res, next) => {
    const { data: { dishes } = {} } = req.body;
    if (!Array.isArray(dishes) || dishes.length === 0) {
      return next({
        status: 400,
        message: "Order must include at least one dish",
      });
    }

    for (let i = 0; i < dishes.length; i++) {
      const dish = dishes[i];
      if (
        !dish.quantity ||
        typeof dish.quantity !== "number" ||
        dish.quantity <= 0
      ) {
        return next({
          status: 400,
          message: `Dish ${i} must have a quantity that is an integer greater than 0`,
        });
      }
    }

    return next();
  };
};

const bodyHasId = () => {
  return (req, res, next) => {
    const { data: { id } = {} } = req.body;

    if (!Boolean(id) || id === res.locals.order.id) {
      return next();
    }

    next({
      status: 400,
      message: `id $${id} not valid.`,
    });
  };
};

// TODO: Implement the /dishes handlers needed to make the tests pass
const list = (req, res) => {
  res.json({ data: orders });
};

const read = (req, res) => {
  const foundOrder = res.locals.order;

  res.json({ data: foundOrder });
};

const create = (req, res) => {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;

  const newOrder = {
    deliverTo,
    mobileNumber,
    status,
    dishes,
    id: nextId(),
  };

  orders.push(newOrder);

  res.status(201).json({ data: newOrder });
};

const destroy = (req, res, next) => {
  const order = res.locals.order;

  if (order.status !== "pending") {
    return next({
      status: 400,
      message: `Order id ${order.id} is pending.`,
    });
  }

  const { orderId } = req.params;
  const index = orders.findIndex((order) => order.id === orderId);

  const deletedOrder = orders.splice(index, 1);
  res.sendStatus(204);
};

const update = (req, res, next) => {
  const order = res.locals.order;
  const { data: { id, deliverTo, mobileNumber, status, dishes } = {} } =
    req.body;

  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.status = status;
  order.dishes = dishes;

  res.json({ data: order });
};

module.exports = {
  list,
  read: [orderExists, read],
  create: [
    bodyHasProperty("deliverTo"),
    bodyHasProperty("mobileNumber"),
    bodyHasDishes(),
    create,
  ],
  destroy: [orderExists, destroy],
  update: [
    orderExists,
    bodyHasId(),
    bodyHasProperty("deliverTo"),
    bodyHasProperty("mobileNumber"),
    bodyHasProperty("status"),
    bodyHasDishes(),
    update,
  ],
};
