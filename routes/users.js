const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * components:
 *  schemas:
 *   User:
 *    type: object
 *    properties:
 *     name:
 *      type: string
 *      description: the user name
 *     username:
 *      type: string
 *      description: the user username
 *     email:
 *      type: string
 *      description: the user email
 *     password:
 *      type: string
 *      description: the user password
 *     phone:
 *      type: string
 *      description: the user phone
 *     isAdmin:
 *      type: boolean
 *      description: is user admin?
 *     address:
 *      type: string
 *      description: the user address
 *     postalCode:
 *      type: string
 *      description: the user postalCode
 *     city:
 *      type: string
 *      description: the user city
 *     country:
 *      type: string
 *      description: the user country
 *    required:
 *     - name
 *     - username
 *     - email
 *     - password
 *    example:
 *     name: Alex Doe
 *     username: alexdoe
 *     email: alex@test.com
 *     password: '123456'
 *     phone: '21548974'
 *     isAdmin: false
 *     address: street 25
 *     postalCode: '543215'
 *     city: NewYork
 *     country: USA
 */

/**
 * @swagger
 * /api/v1/users:
 *  get:
 *   summary: return all users
 *   tags: [User]
 *   responses:
 *    200:
 *     description: return all users successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/User'
 */
router.get(`/`, userController.getUsers);

/**
 * @swagger
 * /api/v1/users/{id}:
 *  get:
 *   summary: return a user
 *   tags: [User]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      description: the user id
 *   responses:
 *    200:
 *     description: return a user successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        $ref: '#/components/schemas/User'
 *    404:
 *     description: user not found
 */
router.get(`/:id`, userController.getUserById);

router.get(`/get/count`, userController.getUsersCount);

/**
 * @swagger
 * /api/v1/users:
 *  post:
 *   summary: create a new suer
 *   tags: [User]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       $ref: '#/components/schemas/User'
 *   responses:
 *    201:
 *     description: new user created successfully
 */
router.post(`/`, userController.addUser);

/**
 * @swagger
 * /api/v1/users/{id}:
 *  put:
 *   summary: update a user
 *   tags: [User]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       $ref: '#/components/schemas/User'
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      description: the user id
 *   responses:
 *    200:
 *     description: user updated successfully
 *    404:
 *     description: user not found
 */
router.put('/:id', userController.updateUser);
/**
 * @swagger
 * /api/v1/users/{id}:
 *  delete:
 *   summary: delete a user
 *   tags: [User]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      description: the user id
 *   responses:
 *    200:
 *     description: user deleted successfully
 *    404:
 *     description: user not found
 */
router.delete('/:id', userController.deleteUser);

module.exports = router;
