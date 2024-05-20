module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define('order', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        date: Sequelize.DATE,
        Invoice_number: Sequelize.STRING,
        subscription: Sequelize.JSON,
        payment: Sequelize.JSON,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
    });
    return Order;
};

