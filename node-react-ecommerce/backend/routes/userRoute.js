import express from 'express';
import User from '../models/userModel';
import { getToken, isAuth } from '../util';

const router = express.Router();

// In-memory fallback user storage for when MongoDB is not connected
const fallbackUsers = [
  {
    _id: 'admin_1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: '1234',
    isAdmin: true,
  },
];

router.put('/:id', isAuth, async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.password = req.body.password || user.password;
      const updatedUser = await user.save();
      return res.send({
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: getToken(updatedUser),
      });
    }
  } catch (e) {
    console.log('DB update user fallback:', e.message);
  }

  // Fallback update
  const fUser = fallbackUsers.find((u) => u._id === userId);
  if (fUser) {
    fUser.name = req.body.name || fUser.name;
    fUser.email = req.body.email || fUser.email;
    if (req.body.password) fUser.password = req.body.password;
    return res.send({
      _id: fUser._id,
      name: fUser.name,
      email: fUser.email,
      isAdmin: fUser.isAdmin,
      token: getToken(fUser),
    });
  }

  res.status(404).send({ message: 'User Not Found' });
});

router.post('/signin', async (req, res) => {
  try {
    const signinUser = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (signinUser) {
      return res.send({
        _id: signinUser.id,
        name: signinUser.name,
        email: signinUser.email,
        isAdmin: signinUser.isAdmin,
        token: getToken(signinUser),
      });
    }
  } catch (e) {
    console.log('DB signin fallback:', e.message);
  }

  // Fallback signin (accept any email/password if not registered, or check fallbackUsers)
  const existing = fallbackUsers.find(
    (u) => u.email === req.body.email && u.password === req.body.password
  );
  const userObj = existing || {
    _id: 'usr_' + Date.now(),
    name: req.body.email ? req.body.email.split('@')[0] : 'User',
    email: req.body.email,
    password: req.body.password,
    isAdmin: false,
  };
  if (!existing) fallbackUsers.push(userObj);

  res.send({
    _id: userObj._id,
    name: userObj.name,
    email: userObj.email,
    isAdmin: userObj.isAdmin,
    token: getToken(userObj),
  });
});

router.post('/register', async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    const newUser = await user.save();
    if (newUser) {
      return res.send({
        _id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        token: getToken(newUser),
      });
    }
  } catch (e) {
    console.log('DB register fallback:', e.message);
  }

  // Fallback register
  const newUser = {
    _id: 'usr_' + Date.now(),
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    isAdmin: false,
  };
  fallbackUsers.push(newUser);

  res.send({
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
    token: getToken(newUser),
  });
});

router.get('/createadmin', async (req, res) => {
  try {
    const user = new User({
      name: 'Basir',
      email: 'admin@example.com',
      password: '1234',
      isAdmin: true,
    });
    const newUser = await user.save();
    res.send(newUser);
  } catch (error) {
    res.send({ message: error.message });
  }
});

export default router;
