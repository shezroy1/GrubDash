const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

const dishExists = () => {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === Number(dishId));

  if (foundDish) {
    res.local.dish = foundDish;
    return nextId();
  }

  nextId({ status: 404, message: `Dish id ${dishId} not found.` });
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

    nextId({
      status: 400,
      message: `Dish property ${propertyName} not found.`,
    });
  };
};

// TODO: Implement the /dishes handlers needed to make the tests pass
const list = (req, res) => {
  res.json({ data: dishes });
};

const read = (req, res) => {
  const foundDish = res.local.dish;

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

module.exports = {
  list,
  read: [dishExists, read],
  create: [
    bodyHasProperty("name"),
    bodyHasProperty("description"),
    bodyHasProperty("price"),
    bodyHasProperty("image_url"),
    create,
  ],
};
