const db = require('../config/db.config.js');
const Customer = db.customers;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mail = require('../mail/mailgun.js');
const { validationResult } = require('express-validator');

// Helper function to generate JWT
const generateToken = (user) => {
    return jwt.sign({ obj: user }, process.env.JWT_SECRET, {
        expiresIn: '72h', // expires in 24 hours
    });
};

// Helper function to send email (stubbed)
const sendVerificationEmail = (email, emailToken) => {
    const url = process.env.EMAIL_BASE_URL+emailToken;
    mail.sendVerificationEmail(email, url);
    console.log(`Sending verification email to ${email} with token ${emailToken}`);
};


exports.create = async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const customer = await Customer.create({
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
        });

        res.status(201).send(customer);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while creating the Customer."
        });
    }
};

exports.signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const existingUser = await Customer.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).send({ message: "Email is already in use." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const emailToken = generateToken({ email }); // This should ideally be a different token, specific for email verification

        const customer = await Customer.create({
            email,
            password: hashedPassword,
            emailToken,
            // Additional fields as necessary
        });

        //sendVerificationEmail(email, emailToken);

        res.status(201).send({
            id: customer.id,
            email: customer.email,
            // Add additional fields as necessary
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred during signup."
        });
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const customer = await Customer.findOne({ where: { email } });
        if (!customer) {
            return res.status(404).send({ message: "Customer not found." });
        }
	//if (!customer.IsActivated) {
        //    return res.status(401).json({ message: "Customer not found" });
        //}
	//if (!customer.IsEmailVerified) {
        //    return res.status(401).json({ message: "Email not verified" });
        //}


        const isPasswordValid = await bcrypt.compare(password, customer.password);
        if (!isPasswordValid) {
            return res.status(403).send({ message: "Invalid password." });
        }

	const obj = {
			type:'CUSTOMER',
			obj:customer
	};

        const token = generateToken(obj);

        res.status(200).send({
            id: customer.id,
            email: customer.email,
            token:token,
            // Add additional fields as necessary
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred during signin."
        });
    }
};

exports.verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const customer = await Customer.findByPk(decoded.id);

        if (!customer) {
            return res.status(404).send({ message: "Customer not found." });
        }

        customer.IsEmailVerified = true;
        customer.IsActivated = true;
        await customer.save();

        res.status(200).send({ message: "Email verified successfully." });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Could not verify email."
        });
    }
};

// Add CRUD methods (findAll, findOne, update, delete) here...
exports.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const customer = await Customer.create({
            email: req.body.email,
            password: hashedPassword,
            phone: req.body.phone,
	    IsEmailVerified: true,
	    IsActivated:true
        });


        res.status(201).send(customer);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while creating the Customer."
        });
    }
};

exports.findAll = async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.send(customers);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving customers."
        });
    }
};

exports.findOne = async (req, res) => {
    const id = req.params.id;
    try {
        const customer = await Customer.findByPk(id);
        if (customer) {
            res.send(customer);
        } else {
            res.status(404).send({
                message: `Cannot find Customer with id=${id}.`
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving Customer with id=" + id
        });
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await Customer.update(req.body, {
            where: { id: id }
        });

        if (num == 1) {
            res.send({
                message: "Customer was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Customer with id=${id}. Maybe Customer was not found or req.body is empty!`
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Error updating Customer with id=" + id
        });
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await Customer.destroy({
            where: { id: id }
        });

        if (num == 1) {
            res.send({
                message: "Customer was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Customer with id=${id}. Maybe Customer was not found!`
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Could not delete Customer with id=" + id
        });
    }
};
exports.findAllPaginated = async (req, res) => {
    // Default values
    const getPagination = (page, size) => {
        const limit = size ? +size : 3; // default limit to 3 items
        const offset = page ? page * limit : 0;
        return { limit, offset };
    };

    const getPageData = (data, page, limit) => {
        const { count: totalItems, rows: customers } = data;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);
        return { totalItems, customers, totalPages, currentPage };
    };

    try {
        const { page, size } = req.query;
        const { limit, offset } = getPagination(page, size);

        const data = await Customer.findAndCountAll({ limit, offset });
        const response = getPageData(data, page, limit);
        res.send(response);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving customers."
        });
    }
};

