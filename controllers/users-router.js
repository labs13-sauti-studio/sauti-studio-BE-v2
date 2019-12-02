const router = require('express').Router();
const Users = require('../models/user-models');

router.get('/', async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id)
    res.status(400).json({ message: 'The id is missing from the request.' });
    
  try {
    const user = await Users.getById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res
        .status(404)
        .json({ message: 'User with specified ID does not exist.' });
    }
  } catch (error) {
    res
      .status(404)
      .json({ message: `The reason you're getting an error: ${error}` });
  }
});

module.exports = router;
