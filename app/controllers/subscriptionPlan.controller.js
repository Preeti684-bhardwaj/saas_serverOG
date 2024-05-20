const db = require('../config/db.config.js');
const Product  = db.products;
const SubscriptionPlan = db.subscriptionPlans;
const { validationResult } = require('express-validator');
const Sequelize = require('sequelize');

// Create and Save a new Subscription Plan with Transaction
exports.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { frequency, price, productId } = req.body;

    const transaction = await db.sequelize.transaction();

    try {
        // Ensure the Product exists
        const product = await Product.findByPk(productId, { transaction });
        if (!product) {
            await transaction.rollback();
            return res.status(404).send({ message: "Product not found" });
        }

        const subscriptionPlan = await SubscriptionPlan.create({
            frequency,
            price,
            productId
        }, { transaction });

        await transaction.commit();
        res.status(201).send(subscriptionPlan);
    } catch (error) {
        await transaction.rollback();
        res.status(500).send({
            message: error.message || "Some error occurred while creating the Subscription Plan."
        });
    }
};

// Retrieve all Subscription Plans from the database (with pagination)
exports.findAll = async (req, res) => {
    const { page, size, productId } = req.query;
    const condition = productId ? { productId: productId } : null;
    const limit = size ? +size : 10; // default size
    const offset = page ? page * limit : 0;

    try {
        const data = await SubscriptionPlan.findAndCountAll({ where: condition, limit, offset });
        res.send({
            totalItems: data.count,
            subscriptionPlans: data.rows,
            totalPages: Math.ceil(data.count / limit),
            currentPage: page ? +page : 0
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving subscription plans."
        });
    }
};

// Find a single Subscription Plan with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    try {
        const subscriptionPlan = await SubscriptionPlan.findByPk(id);
        if (subscriptionPlan) {
            res.send(subscriptionPlan);
        } else {
            res.status(404).send({
                message: `Cannot find Subscription Plan with id=${id}.`
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving Subscription Plan with id=" + id
        });
    }
};

// Update a Subscription Plan by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await SubscriptionPlan.update(req.body, { where: { id: id } });
        if (num == 1) {
            res.send({
                message: "Subscription Plan was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Subscription Plan with id=${id}. Maybe Subscription Plan was not found or req.body is empty!`
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Error updating Subscription Plan with id=" + id
        });
    }
};

// Delete a Subscription Plan with the specified id in the request
exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await SubscriptionPlan.destroy({ where: { id: id } });
        if (num == 1) {
            res.send({
                message: "Subscription Plan was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Subscription Plan with id=${id}. Maybe Subscription Plan was not found!`
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Could not delete Subscription Plan with id=" + id
        });
    }
};

// List all Subscription Plans for a specific Product
exports.findByProductId = async (req, res) => {
    const productId = req.params.productId;

    try {
        const subscriptionPlans = await SubscriptionPlan.findAll({
            where: { productId: productId }
        });

        if (subscriptionPlans.length > 0) {
            res.send(subscriptionPlans);
        } else {
            res.status(404).send({
                message: `No Subscription Plans found for Product with id=${productId}.`
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving Subscription Plans for Product with id=" + productId
        });
    }
};
