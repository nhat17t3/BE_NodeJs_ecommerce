const mongoose = require("mongoose");
const shortid = require("shortid");
const orderSchema = new mongoose.Schema(
  {
    codeBill: {
      type: String,
      default: "ORD" + shortid.generate()+Math.floor(Math.random()*100000).toString(),
      // unique: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      // required: true,
      trim: true,
      // unique: true,
      // lowercase: true,
    },
    address: {
      type: String,
      required: true,
      default: "",
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    // address: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Customer.address",
    //   required: true,
    //   default:""
    // },
    totalAmount: {
      type: Number,
      required: true,
    },
    productDetail: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        payablePrice: {
          type: Number,
          required: true,
        },
        purchasedQty: {
          type: Number,
          required: true,
        },
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "cancelled", "refund"],
      required: true,
      default: "pending",
    },
    paymentType: {
      type: String,
      enum: ["cod", "card"],
      required: true,
      default: "cod",
    },
    orderStatus: [
      {
        type: {
          type: String,
          enum: ["ordered", "packed", "shipped", "delivered"],
          default: "ordered",
        },
        date: {
          type: Date,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
