const db = require('../config/db.config.js');
const { Order, Customer } = db;
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;

exports.createOrder = async (req, res) => {
    const { subscription, obj, type } = req.body;

    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
        // Check if the type is CUSTOMER and obj contains the customer ID
        if (type !== 'CUSTOMER' || !obj || !obj.id) {
            throw new Error('Invalid customer information');
        }

        // Verify the Customer exists
        const customer = await Customer.findByPk(obj.id, { transaction });
        if (!customer) {
            throw new Error('Customer not found');
        }

        // Generate Invoice_number from sequence within the transaction
        const seqValue = await sequelize.query("SELECT nextval('order_seq_number') AS seq_number", {
            type: Sequelize.QueryTypes.SELECT,
            transaction // Include the transaction in the query options
        });

        const invoiceNumber = `CONSTANT_STRING${seqValue[0].seq_number}`;
        const date = new Date(); // Current system date and time

        // Create Order object with the Customer ID, within the same transaction
        const order = await Order.create({
            date,
            Invoice_number: invoiceNumber,
            subscription: JSON.stringify(subscription), // Assuming subscription is a JSON object
            customerId: obj.id // Setting the foreign key to the Customer ID
        }, { transaction });

        // Commit the transaction if everything is successful
        await transaction.commit();

        res.status(201).send(order);
    } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();

        res.status(500).send({
            message: error.message || "Some error occurred while creating the Order."
        });
    }
};

