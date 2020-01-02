const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const db = require('./util/database');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');


const app = express();

// app config
app.set('view engine', 'ejs');
app.set('views', 'views');

// setup middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// attributing all request to test user
app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch((err) => { console.log(err); });

});

// setup routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

// sequelize associations
User.hasMany(Product);
User.hasMany(Order);
User.hasOne(Cart);

Cart.belongsToMany(Product, { through: CartItem });

Product.belongsToMany(Cart, { through: CartItem });
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

Order.belongsToMany(Product, { through: OrderItem });

// db.sync({ force: true })
db.sync({ force: false })
  .then(() => User.findByPk(1))
  .then(user => user
      ? user
      : User.create({ name: 'max', email: 'me@gmail.com' })
  )
  .then((user) => { user.createCart(); })
  .then(() => { app.listen (3000); })
  .catch((err) => { console.log(err); });
