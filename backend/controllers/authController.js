// backend/controllers/authController.js
const users = []; // This will store users temporarily (for demonstration purposes)

exports.signup = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }
  const user = users.find(user => user.email === email);
  if(user)
  {
    return res.status(400).send('User already exists');
  }
  // Add user to "database"
  users.push({ email, password });
  res.status(201).send('User signed up successfully');
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  const user = users.find(user => user.email === email && user.password === password);
  if (user) {
    res.status(200).send('User signed in successfully');
  } else {
    res.status(401).send('Invalid email or password');
  }
};

