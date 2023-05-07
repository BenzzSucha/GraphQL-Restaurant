var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");
var express = require("express");

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
var schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);
// The root provides a resolver function for each API endpoint

var root = {
  restaurant: ({ id }) => {
    return restaurants.find((restaurant) => restaurant.id === id);
    // Your code goes here
  },
  restaurants: () => {
    // Your code goes here
    return restaurants;
  },
  setrestaurant: ({ input }) => {
    // Your code goes here
    const newRestaurant = {
      id: restaurants.length + 1,
      ...input,
      dishes: [],
    };
    restaurants.push(newRestaurant);
    return newRestaurant;
  },
  
  deleterestaurant: ({ id }) => {
    // Your code goes here
    const index = restaurants.findIndex((restaurant) => restaurant.id === id);
    if (index === -1) {
      throw new Error(`Restaurant with ID ${id} not found`);
    }
    restaurants.splice(index, 1);
    return { ok: true };
  },
  editrestaurant: ({ id, ...restaurant }) => {
    // Your code goes here
    const index = restaurants.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Restaurant with ID ${id} not found`);
    }
    restaurants[index] = { ...restaurants[index], ...restaurant };
    return restaurants[index];
  },
};
var app = express();
app.get('/', (req, res) => {
  res.send('GraphQL Restaurant Data Exercise');
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));

module.exports = root;

