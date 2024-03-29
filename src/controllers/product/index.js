const Product = require("../../models/product");
const shortid = require("shortid");
const slugify = require("slugify");
// const Category = require("../models/category");

function createProducts(products) {
  const productList = [];
  for (let product of products) {
    productList.push({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discount: product.discount,
      quantity: product.quantity,
      description: product.description,
      description_detail: product.description_detail,
      reviewers: product.reviewers,
      // brandId: product.brandId,
      categoryId: product.categoryId,
      productPictures: product.productPictures,
      updatedAt: product.updatedAt,
      createdAt: product.createdAt,
    });
  }
  return productList;
}

// exports.getProducts = (req, res) => {
//   Product.find({}).exec((error, products) => {
//     if (error)
//       return res.status(400).json({ success: false, statusCode: 400, error });
//     if (products) {
//       const productList = createProducts(products);
//       res
//         .status(200)
//         .json({ success: true, statusCode: 200, data: productList });
//     }
//   });
// };

exports.createProduct = (req, res) => {
  const { name, price, description,description_detail,categoryId, quantity, discount } = req.body;
  let productPictures = [];

  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }

  const product = new Product({
    name: name,
    slug: slugify(name),
    price,
    quantity,
    discount,
    description,
    description_detail,
    productPictures,
    // brandId,
    categoryId,
    createdBy: req.admin._id,
  });

  product.save((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      res.status(201).json({ product, files: req.files });
    }
  });
};

// exports.getProductsBySlug = (req, res) => {
//   const { slug } = req.params;
//   Category.findOne({ slug: slug })
//     .select("_id type")
//     .exec((error, category) => {
//       if (error) {
//         return res.status(400).json({ error });
//       }

//       if (category) {
//         Product.find({ category: category._id }).exec((error, products) => {
//           if (error) {
//             return res.status(400).json({ error });
//           }
//           res.status(200).json({ products });
//         });
//       }
//     });
// };

exports.getProductDetailsById = (req, res) => {
  const { id } = req.params;
  if (id) {
    Product.findOne({ _id: id }).populate('brandId').populate('categoryId').exec((error, product) => {
      if (error)
        return res.status(400).json({ success: false, statusCode: 400, error });
      if (product) {
        res.status(200).json({ success: true, statusCode: 200, data: product });
      }
    });
  } else {
    return res
      .status(400)
      .json({ success: false, statusCode: 400, error: "Params required" });
  }
};

exports.getProductDetailsByBrand = (req, res) => {
  const { id } = req.params;
  if (id) {
    Product.find({ brandId: id }).exec((error, product) => {
      if (error)
        return res.status(400).json({ success: false, statusCode: 400, error });
      if (product) {
        res.status(200).json({ success: true, statusCode: 200, data: product });
      }
    });
  } else {
    return res
      .status(400)
      .json({ success: false, statusCode: 400, error: "Params required" });
  }
};

exports.getProductDetailsByCategory = (req, res) => {
  const { id } = req.params;
  if (id) {
    Product.find({ categoryId: id }).exec((error, product) => {
      if (error)
        return res.status(400).json({ success: false, statusCode: 400, error });
      if (product) {
        res.status(200).json({ success: true, statusCode: 200, data: product });
      }
    });
  } else {
    return res
      .status(400)
      .json({ success: false, statusCode: 400, error: "Params required" });
  }
};

// exports.getProductDetailsByCategory = (req, res) => {
//   const { id } = req.params;
//   if (id) {
//     Product.find({})
//       .populate({
//         path: "brandId",
//         select: "categoryId",
//         populate: { path: "categoryId", select: "_id" },
//       })
//       .exec((error, product) => {
//         if (error)
//           return res
//             .status(400)
//             .json({ success: false, statusCode: 400, error });
//         if (product) {
//           const data = product.filter(
//             (product) => String(product.brandId.categoryId._id) === String(id)
//           );

//           res.status(200).json({ success: true, statusCode: 200, data: data });
//         }
//       });
//   } else {
//     return res
//       .status(400)
//       .json({ success: false, statusCode: 400, error: "Params required" });
//   }
// };

// new update
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = {};
  if (req.body.name) {
    product.name = req.body.name;
    product.slug = slugify(req.body.name);
  }
  if (req.body.price) product.price = req.body.price;
  if (req.body.quantity) product.quantity = req.body.quantity;
  if (req.body.discount) product.discount = req.body.discount;
  if (req.body.description) product.description = req.body.description;
  if (req.body.description_detail) product.description_detail = req.body.description_detail;
  // if (req.body.brandId) product.brandId = req.body.brandId;
  if (req.body.categoryId) product.categoryId = req.body.categoryId;
  if (req.files.length > 0) {
    product.productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }
  if (id) {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id },
      product,
      {
        new: true,
      }
    );
    return res.status(201).json({ updatedProduct });
  } else {
    return res.status(400).json({ error: "No ID" });
  }
};

exports.deleteProductById = (req, res) => {
  const { id } = req.params;
  if (id) {
    Product.deleteOne({ _id: id }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

// exports.getProducts = async (req, res) => {
//   const products = await Product.find({ createdBy: req.user._id })
//     .select("_id name price quantity slug description productPictures brandId")
//     .populate({ path: "brand", select: "_id name" })
//     .exec();

//   res.status(200).json({ products });
// };

exports.searchProducts = (req, res) => {
  const name = req.query.name;
  const query = new RegExp(".*" + name + ".*");
  console.log(query);
  // Product.find({"name": /.*name.*/}).exec((error, product) => {
  Product.find({ name: { $regex: query, $options: "i" } }).exec(
    (error, product) => {
      if (error)
        return res.status(400).json({ success: false, statusCode: 400, error });
      if (product) {
        res.status(200).json({ success: true, statusCode: 200, data: product });
      }
    }
  );
};


exports.getProducts = (req, res) => {
  const page = req.query.page - 1;
  const limit = req.query.limit;

  if(page && limit) {
    Product.find({}).skip(limit*page).limit(limit).exec((error, products) => {
      if (error)
        return res.status(400).json({ success: false, statusCode: 400, error });
      if (products) {
        const productList = createProducts(products);
        res
          .status(200)
          .json({ success: true, statusCode: 200, data: productList });
      }
    });
  }
  else {
    Product.find({}).exec((error, products) => {
      if (error)
        return res.status(400).json({ success: false, statusCode: 400, error });
      if (products) {
        const productList = createProducts(products);
        res
          .status(200)
          .json({ success: true, statusCode: 200, data: productList });
      }
    });
  }

  
};
