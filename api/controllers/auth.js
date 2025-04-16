const User = require('../models/User');
const cookieToken = require('../utils/cookieToken');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  let userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password, role });
  cookieToken(user, res);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.isValidatedPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  cookieToken(user, res);
};
