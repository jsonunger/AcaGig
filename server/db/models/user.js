import crypto from 'crypto';
import omit from 'lodash/omit';
import Sequelize from 'sequelize';
import db from '../_db';

const definitions = {
  fullName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING
  },
  salt: {
    type: Sequelize.STRING
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
};

const methods = {
  instanceMethods: {
    sanitize() {
      return omit(this.toJSON(), ['password', 'salt']);
    },
    correctPassword(testPassword) {
      return this.Model.encryptPassword(testPassword, this.salt) === this.password;
    }
  },
  classMethods: {
    generateSalt() {
      return crypto.randomBytes(16).toString('base64');
    },
    encryptPassword(plainText, salt) {
      const hash = crypto.createHash('sha1');
      hash.update(plainText);
      hash.update(salt);
      return hash.digest('hex');
    }
  },
  hooks: {
    beforeCreate(user) {
      if (user.changed('password')) {
        user.salt = user.Model.generateSalt();
        user.password = user.Model.encryptPassword(user.password, user.salt);
      }
    },
    beforeUpdate(user) {
      if (user.changed('password')) {
        user.salt = user.Model.generateSalt();
        user.password = user.Model.encryptPassword(user.password, user.salt);
      }
    }
  }
};

export default db.define('user', definitions, methods);
