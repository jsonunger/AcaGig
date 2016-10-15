import crypto from 'crypto';
import omit from 'lodash/omit';
import Sequelize from 'sequelize';
import db from '../_db';

function updateUser (user) {
  if (user.changed('password')) {
    user.salt = user.Model.generateSalt();
    user.password = user.Model.encryptPassword(user.password, user.salt);
  }
}

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
  googleId: {
    type: Sequelize.STRING,
    unique: true
  },
  facebookId: {
    type: Sequelize.STRING,
    unique: true
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
};

const options = {
  getterMethods: {
    firstName() {
      return this.fullName.split(' ').slice(0, -1).join(' ');
    },
    lastName() {
      return this.fullName.split(' ').slice(-1).join(' ');
    }
  },
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
    },
    findByEmail(email) {
      return this.findOne({ where: { email } });
    },
    findByProvider(provider, profileId) {
      return this.findOne({ where: { [`${provider}Id`]: profileId } });
    }
  },
  hooks: {
    beforeCreate: updateUser,
    beforeUpdate: updateUser
  }
};

export default db.define('user', definitions, options);
