import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import Cookie from 'js-cookie';
import {
  productListReducer,
  productDetailsReducer,
  productSaveReducer,
  productDeleteReducer,
  productReviewSaveReducer,
} from './reducers/productReducers';
import { cartReducer } from './reducers/cartReducers';
import {
  userSigninReducer,
  userRegisterReducer,
  userUpdateReducer,
} from './reducers/userReducers';
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  myOrderListReducer,
  orderListReducer,
  orderDeleteReducer,
  orderCancelReducer,
  orderReturnReducer,
} from './reducers/orderReducers';

let cartItems = [];
try {
  const cookieCart = Cookie.get('cartItems');
  if (cookieCart && cookieCart !== 'undefined') {
    cartItems = JSON.parse(cookieCart);
  }
} catch (e) {
  cartItems = [];
}

let userInfo = null;
try {
  const cookieUser = Cookie.get('userInfo');
  if (cookieUser && cookieUser !== 'undefined') {
    userInfo = JSON.parse(cookieUser);
  }
} catch (e) {
  userInfo = null;
}

const initialState = {
  cart: { cartItems, shipping: {}, payment: {} },
  userSignin: { userInfo },
};

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
  userSignin: userSigninReducer,
  userRegister: userRegisterReducer,
  productSave: productSaveReducer,
  productDelete: productDeleteReducer,
  productReviewSave: productReviewSaveReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderCancel: orderCancelReducer,
  orderReturn: orderReturnReducer,
  userUpdate: userUpdateReducer,
  myOrderList: myOrderListReducer,
  orderList: orderListReducer,
  orderDelete: orderDeleteReducer,
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  initialState,
  composeEnhancer(applyMiddleware(thunk))
);

export default store;
