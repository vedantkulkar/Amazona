import express from 'express';
import Order from '../models/orderModel';
import { isAuth, isAdmin } from '../util';

const router = express.Router();

// In-memory order fallback store
const fallbackOrders = [];

router.get("/", isAuth, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user');
    if (orders && orders.length > 0) return res.send(orders);
  } catch (e) {
    console.log('DB orders fallback:', e.message);
  }
  res.send(fallbackOrders);
});

router.get("/mine", isAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    if (orders && orders.length > 0) return res.send(orders);
  } catch (e) {
    console.log('DB mine orders fallback:', e.message);
  }
  const myOrders = fallbackOrders.filter((o) => o.user === req.user._id || !o.user);
  res.send(myOrders);
});

router.get("/:id", isAuth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id });
    if (order) return res.send(order);
  } catch (e) {
    console.log('DB order by id fallback:', e.message);
  }
  const order = fallbackOrders.find((o) => o._id === req.params.id);
  if (order) {
    res.send(order);
  } else {
    res.status(404).send("Order Not Found.");
  }
});

router.delete("/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id });
    if (order) {
      const deletedOrder = await order.remove();
      return res.send(deletedOrder);
    }
  } catch (e) {
    console.log('DB delete order fallback:', e.message);
  }
  const idx = fallbackOrders.findIndex((o) => o._id === req.params.id);
  if (idx !== -1) {
    const [deleted] = fallbackOrders.splice(idx, 1);
    res.send(deleted);
  } else {
    res.status(404).send("Order Not Found.");
  }
});

router.post("/", isAuth, async (req, res) => {
  const orderObj = {
    _id: 'ord_' + Date.now(),
    orderItems: req.body.orderItems,
    user: req.user ? req.user._id : 'guest',
    shipping: req.body.shipping,
    payment: req.body.payment,
    itemsPrice: req.body.itemsPrice,
    taxPrice: req.body.taxPrice,
    shippingPrice: req.body.shippingPrice,
    totalPrice: req.body.totalPrice,
    isPaid: false,
    isDelivered: false,
    createdAt: new Date().toISOString(),
  };

  try {
    const newOrder = new Order({
      orderItems: req.body.orderItems,
      user: req.user._id,
      shipping: req.body.shipping,
      payment: req.body.payment,
      itemsPrice: req.body.itemsPrice,
      taxPrice: req.body.taxPrice,
      shippingPrice: req.body.shippingPrice,
      totalPrice: req.body.totalPrice,
    });
    const newOrderCreated = await newOrder.save();
    return res.status(201).send({ message: "New Order Created", data: newOrderCreated });
  } catch (e) {
    console.log('DB create order fallback:', e.message);
  }

  fallbackOrders.push(orderObj);
  res.status(201).send({ message: "New Order Created", data: orderObj });
});

router.put("/:id/pay", isAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.payment = {
        paymentMethod: req.body.paymentMethod || (order.payment && order.payment.paymentMethod) || 'upi',
        paymentResult: {
          payerID: req.body.payerID || 'USER',
          orderID: req.body.orderID || req.params.id,
          paymentID: req.body.paymentID || 'PAY_' + Date.now()
        }
      };
      const updatedOrder = await order.save();
      return res.send({ message: 'Order Paid.', order: updatedOrder });
    }
  } catch (e) {
    console.log('DB pay order fallback:', e.message);
  }

  const fOrder = fallbackOrders.find((o) => o._id === req.params.id);
  if (fOrder) {
    fOrder.isPaid = true;
    fOrder.paidAt = new Date().toISOString();
    res.send({ message: 'Order Paid.', order: fOrder });
  } else {
    res.status(404).send({ message: 'Order not found.' });
  }
});

router.put("/:id/cancel", isAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      if (order.isCanceled) {
        return res.status(400).send({ message: 'Order is already canceled.' });
      }
      order.isCanceled = true;
      order.canceledAt = Date.now();
      order.cancelReason = req.body.reason || 'Canceled by user';
      order.orderStatus = 'Canceled';
      const updatedOrder = await order.save();
      return res.send({ message: 'Order Canceled Successfully.', order: updatedOrder });
    }
  } catch (e) {
    console.log('DB cancel order fallback:', e.message);
  }

  const fOrder = fallbackOrders.find((o) => o._id === req.params.id);
  if (fOrder) {
    fOrder.isCanceled = true;
    fOrder.canceledAt = new Date().toISOString();
    fOrder.cancelReason = req.body.reason || 'Canceled by user';
    fOrder.orderStatus = 'Canceled';
    res.send({ message: 'Order Canceled Successfully.', order: fOrder });
  } else {
    res.status(404).send({ message: 'Order not found.' });
  }
});

router.put("/:id/return", isAuth, async (req, res) => {
  const { returnType, reason } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isReturned = true;
      order.returnedAt = Date.now();
      order.returnType = returnType || 'return';
      order.returnReason = reason || 'Customer requested return/replacement';
      order.orderStatus = returnType === 'replace' ? 'Replacement Requested' : 'Return Requested';
      const updatedOrder = await order.save();
      return res.send({ message: `${returnType === 'replace' ? 'Replacement' : 'Return'} Requested Successfully.`, order: updatedOrder });
    }
  } catch (e) {
    console.log('DB return order fallback:', e.message);
  }

  const fOrder = fallbackOrders.find((o) => o._id === req.params.id);
  if (fOrder) {
    fOrder.isReturned = true;
    fOrder.returnedAt = new Date().toISOString();
    fOrder.returnType = returnType || 'return';
    fOrder.returnReason = reason || 'Customer requested return/replacement';
    fOrder.orderStatus = returnType === 'replace' ? 'Replacement Requested' : 'Return Requested';
    res.send({ message: `${returnType === 'replace' ? 'Replacement' : 'Return'} Requested Successfully.`, order: fOrder });
  } else {
    res.status(404).send({ message: 'Order not found.' });
  }
});

export default router;