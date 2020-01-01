const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  // Add Product to the DB
  const {
    title,
    imageUrl,
    price,
    description,
  } = req.body;
  Product.create({ title, imageUrl, price, description })
    .then(() => { res.redirect('/admin/products'); })
    .catch((err) => { console.log(err); });

};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then(product => res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    }))
    .catch((err) => { console.log(err); });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const {
    id,
    title,
    price,
    imageUrl,
    description,
  } = req.body;

  Product.findByPk(prodId)
    .then((product) => {
      Object.assign(product, { title, price, imageUrl, description });
      return product.save();
    })
    .then(result => res.redirect('/admin/products'))
    .catch((err) => { console.log(err); });

};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    }))
    .catch((err) => { console.log(err); });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then(product => product.destroy())
    .then(() => res.redirect('/admin/products'))
    .catch((err) => { console.log(err); });
};
