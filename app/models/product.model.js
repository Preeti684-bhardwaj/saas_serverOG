module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define('product', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        name: Sequelize.STRING,
        description: Sequelize.STRING,
        media: Sequelize.JSON,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
    });
    return Product;
};
