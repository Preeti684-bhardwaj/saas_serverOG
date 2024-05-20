const env = require('./env.js');
 
const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,
 
  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.customers = require('../models/customer.model.js')(sequelize, Sequelize);
//db.admins = require('../models/admin.model.js')(sequelize, Sequelize);
db.products = require('../models/product.model.js')(sequelize, Sequelize);
db.subscriptionPlans = require('../models/subscription_plan.model.js')(sequelize, Sequelize);
db.subscriptions = require('../models/subscription.model.js')(sequelize, Sequelize);
db.orders = require('../models/order.model.js')(sequelize, Sequelize);

// Relationships
db.products.hasMany(db.subscriptionPlans, { as: 'subscriptionPlans' });
db.subscriptionPlans.belongsTo(db.products, {
    foreignKey: 'productId',
    as: 'product'
});

db.customers.hasMany(db.subscriptions, { as: 'subscriptions' });
db.subscriptions.belongsTo(db.customers, {
    foreignKey: 'customerId',
    as: 'customer'
});

db.customers.hasMany(db.orders, { as: 'orders' });
db.orders.belongsTo(db.customers, {
    foreignKey: 'customerId',
    as: 'customer'
});


module.exports = db;
