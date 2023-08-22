const express = require('express')
const router = express.Router()

const { getAllUsers, createUser, getAllUsersTesting, updateUser, deleteUser } = require('../controllers/users')



router.get('/',getAllUsers)
router.post('/',createUser)
router.patch('/:userId',updateUser)
router.delete('/:userId',deleteUser)
router.route('/testing').get(getAllUsersTesting)

module.exports = router