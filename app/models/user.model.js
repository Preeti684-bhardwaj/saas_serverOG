module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('user', {
	  id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
    	  },
	  email: {
		type: Sequelize.STRING,
		allowNull: false,
		validate:{
			notNull:{
				msg: 'Login cant be null'
			}
		},
                unique: true
	  },
	  phone: {
                type: Sequelize.STRING,
          },
  	  password: {
		  type:Sequelize.STRING(256)
	  },
	  isActivated: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
          },
	  emailVerified: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	  },
	  createdAt: {
        	type: Sequelize.DATE, 
        	field: 'createdat'
      	  },

          updatedAt: {
                type: Sequelize.DATE,
        	field: 'updatedat'
      	  }
	});
	
        return User;
};
