const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

const dishExists = (req, res, next) => {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);

  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }

  next({ status: 404, message: `Dish id ${dishId} not found.` });
};

const bodyHasProperty = (propertyName) => {
  return (req, res, next) => {
    const { data = {} } = req.body;

    if (propertyName === "price") {
      if (data["price"] && data["price"] > 0) {
        return next();
      }
    } else if (data[propertyName]) {
      return next();
    }

    next({
      status: 400,
      message: `Dish property ${propertyName} not found.`,
    });
  };
};

const bodyHasPrice = () => {
  return (req, res, next) => {
    const { data: { price } = {} } = req.body;

    if (price && price > 0) {
      return next();
    }

    next({
      status: 400,
      message: `price $${price} not valid.`,
    });
  };
};

const bodyHasId = () => {
  return (req, res, next) => {
    const { data: { id } = {} } = req.body;

    if (!Boolean(id) || id === res.local.dish.id) {
      return next();
    }

    next({
      status: 400,
      message: `Price $${price} not valid.`,
    });
  };
};

// TODO: Implement the /dishes handlers needed to make the tests pass
const list = (req, res) => {
  res.json({ data: dishes });
};

const read = (req, res) => {
  const foundDish = res.locals.dish;

  res.json({ data: foundDish });
};

const create = (req, res) => {
  const { data: { name, description, image_url, price } = {} } = req.body;

  const newDish = {
    name,
    description,
    image_url,
    price,
    id: nextId(),
  };

  dishes.push(newDish);

  res.status(201).json({ data: newDish });
};

const destroy = (req, res, next) => {
  const { dishId } = req.params;
  const index = dishes.findIndex((dish) => dish.id === dishId);

  const deletedDish = dishes.splice(index, 1);
  next({ status: 405, message: `Dish id ${dishId} cannot be deleted.` });
};

const update = (req, res, next) => {};

module.exports = {
  list,
  read: [dishExists, read],
  create: [
    bodyHasProperty("name"),
    bodyHasProperty("description"),
    bodyHasPrice(),
    bodyHasProperty("image_url"),
    create,
  ],
  destroy,
  update: [
    dishExists,
    bodyHasId(),
    bodyHasProperty("name"),
    bodyHasProperty("description"),
    bodyHasProperty("price"),
    bodyHasProperty("image_url"),
  ],
};
