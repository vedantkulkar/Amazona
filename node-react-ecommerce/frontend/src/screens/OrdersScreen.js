import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { listOrders, deleteOrder } from '../actions/orderActions';

function OrdersScreen(props) {
  const orderList = useSelector(state => state.orderList);
  const { loading, orders, error } = orderList;

  const orderDelete = useSelector(state => state.orderDelete);
  const { loading: loadingDelete, success: successDelete, error: errorDelete } = orderDelete;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listOrders());
    return () => {
      //
    };
  }, [successDelete]);

  const deleteHandler = (order) => {
    dispatch(deleteOrder(order._id));
  }
  return loading ? <div>Loading...</div> :
    <div className="content content-margined">

      <div className="order-header">
        <h3>Orders</h3>
      </div>
      <div className="order-list">

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>USER</th>
              <th>PAID</th>
              <th>PAID AT</th>
              <th>DELIVERED</th>
              <th>DELIVERED AT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.map(order => (<tr key={order._id}>
              <td style={{ fontFamily: 'monospace', fontSize: '1.2rem' }}>{order._id.substring(0, 10)}…</td>
              <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
              <td style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>₹{Number(order.totalPrice).toLocaleString('en-IN')}</td>
              <td>{order.user ? order.user.name || order.user.email : 'Guest'}</td>
              <td>
                {order.isPaid ? <span className="badge badge-success">✓ Paid</span> : <span className="badge badge-danger">✕ Unpaid</span>}
              </td>
              <td>{order.paidAt ? new Date(order.paidAt).toLocaleDateString() : '-'}</td>
              <td>
                {order.isDelivered ? <span className="badge badge-success">✓ Delivered</span> : <span className="badge badge-warning">⏳ Pending</span>}
              </td>
              <td>{order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : '-'}</td>
              <td>
                <Link to={"/order/" + order._id} className="btn-table btn-table-edit" >Details</Link>
                {' '}
                <button type="button" onClick={() => deleteHandler(order)} className="btn-table btn-table-delete">Delete</button>
              </td>
            </tr>))}
          </tbody>
        </table>

      </div>
    </div>
}
export default OrdersScreen;