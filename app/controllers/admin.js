const db = require('../config/db.config.js');
const Admin = db.admins;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Helper function to generate JWT
const generateToken = (user) => {
    return jwt.sign({ email: email }, process.env.JWT_SECRET, {
        expiresIn: '24h', // expires in 24 hours
    });
};

// Helper function to send email (stubbed)
const sendVerificationEmail = (email, emailToken) => {
    // This function should integrate with an email service to send the verification email
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

        const admin = await Admin.create({
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
            // Additional fields as necessary
        });

        res.status(201).send(admin);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while creating the Admin."
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
        const existingUser = await Admin.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).send({ message: "Email is already in use." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const emailToken = generateToken({ email }); // This should ideally be a different token, specific for email verification

        const admin = await Admin.create({
            email,
            password: hashedPassword,
            emailToken,
            // Additional fields as necessary
        });

        sendVerificationEmail(email, emailToken);

        res.status(201).send({
            id: admin.id,
            email: admin.email,
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
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
            return res.status(404).send({ message: "Admin not found." });
        }

        if (!admin.IsActivated) {
            return res.status(401).json({ message: "Admin not found" });
        }
        if (!admin.IsEmailVerified) {
            return res.status(401).json({ message: "Email not verified" });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: "Invalid password." });
        }

	const obj = {
                        type:'ADMIN',
                        obj:customer
        };


        const token = generateToken(admin);

        res.status(200).send({
            id: admin.id,
            email: admin.email,
            token:token,
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
        const admin = await Admin.findByPk(decoded.id);

        if (!admin) {
            return res.status(404).send({ message: "Admin not found." });
        }

        admin.IsEmailVerified = true;
        await admin.save();

        res.status(200).send({ message: "Email verified successfully." });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Could not verify email."
        });
    }
};

// Add CRUD methods (findAll, findOne, update, delete) here...
exports.create = async (req, res) => {
    // Validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create admin
        const admin = await Admin.create({
            email: req.body.email,
            password: hashedPassword,
            phone: req.body.phone,
            emailToken: 'generate-token-here' // Implement token generation logic
        });

        // Send verification email
        // Implement email sending logic here

        res.status(201).send(admin);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while creating the Admin."
        });
    }
};

exports.findAll = async (req, res) => {
    try {
        const admins = await Admin.findAll();
        res.send(admins);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving admins."
        });
    }
};

exports.findOne = async (req, res) => {
    const id = req.params.id;
    try {
        const admin = await Admin.findByPk(id);
        if (admin) {
            res.send(admin);
        } else {
            res.status(404).send({
                message: `Cannot find Admin with id=${id}.`
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving Admin with id=" + id
        });
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await Admin.update(req.body, {
            where: { id: id }
        });

        if (num == 1) {
            res.send({
                message: "Admin was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Admin with id=${id}. Maybe Admin was not found or req.body is empty!`
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Error updating Admin with id=" + id
        });
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await Admin.destroy({
            where: { id: id }
        });

        if (num == 1) {
            res.send({
                message: "Admin was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Admin with id=${id}. Maybe Admin was not found!`
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Could not delete Admin with id=" + id
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

