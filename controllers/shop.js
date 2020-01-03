const Product = require('../models/product');


exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then((products) => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  })
  .catch((err) => { console.log(err); });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch((err) => { console.log(err); });
};

exports.getCart = async (req, res, next) => {
  try {
    const { user } = req;
    const cart = await user.getCart();
    const products = await cart.getProducts();
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products,
    })
  } catch (e) {
    console.log(e)
  }
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  const { user } = req;
  try {
    const cart = await user.getCart();
    const matches = await cart.getProducts({ where: { id: prodId }});

    if (matches.length > 0) {
      let { quantity } = matches[0].cartItem;
      quantity += 1;
      await cart.addProduct(matches[0], { through: { quantity }});
    } else {
      const product = await Product.findByPk(prodId);
      await cart.addProduct(product, { through: { quantity: 1 } });
    }
    res.redirect('/cart');
  } catch(e) {
    console.log(e);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const { user } = req;
    const cart = await user.getCart();

    const product = await cart.getProducts({ where: { id: prodId } });
    await product[0].cartItem.destroy();
    res.redirect('/cart');

  } catch(e) { console.log(e); }
};

exports.postOrder = async (req, res) => {
  // Copy the <Cart> into a new <Order>
  try {
    const { user } = req;
    const cart = await user.getCart();
    const products = await cart.getProducts();
    const order = await user.createOrder();
    const orderedProducts = products.map((product) => {
      const { quantity } = product.cartItem;
      product.orderItem = { quantity };
      return product;
    });
    // add products to order and clear the cart
    await order.addProducts(orderedProducts);
    await cart.setProducts(null);
    res.redirect('/orders');

  } catch (err) { console.log(err); }
};

exports.getOrders = async (req, res) => {
  const { user } = req;
  const orders = await user.getOrders({ include: ['products'] });

  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
    orders,
  })
};
