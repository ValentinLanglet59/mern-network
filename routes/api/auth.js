const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');


const User = require('../../models/User');

router.get('/', auth, async(req, res,) => {
    
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user)
    } catch(err) {
        console.log(err.message)
        res.status(500).json({msg: 'erreur serveur'})
    }
})

router.post('/', [
    check('email', 'Please type a valid email').isEmail(),
    check('password', 'Password is required').exists()
],
async (req, res,) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }
    const {email, password} = req.body

    try {
      let user = await User.findOne({email})
      if (!user) {
        return res.status(400).json({message: 'Invalid credentials'});
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({message: 'Invalid credentials'})
      }

      const payload = {
        user: {
            id: user.id
        }
      }

      jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000}, (err, token) => {
        if(err) throw err;
        res.json({ token });
      })

    } catch(err) {
        console.log(err.message)
        res.status(500).json({message : ' Erreur serveur'})

    }
    
})

module.exports = router;