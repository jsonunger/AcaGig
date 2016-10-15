import { stub, spy } from 'sinon';
import { expect } from 'chai';
import db from '../../../server/db';

const User = db.model('user');

describe('User model', () => {

  beforeEach(() => db.sync({ force: true }));

  const createBasicUser = () => User.create({ email: 'obama@gmail.com', password: 'potus', fullName: 'Barack Obama' });

  describe('password encryption', () => {

    describe('generateSalt method', () => {

      it('should exist', () => {
        expect(User.generateSalt).to.be.a('function');
      });

      it('should return a random string basically', () => {
        expect(User.generateSalt()).to.be.a('string');
      });

    });

    describe('encryptPassword method', () => {

      let cryptoStub;
      let hashUpdateSpy;
      let hashDigestStub;
      beforeEach(() => {
        cryptoStub = stub(require('crypto'), 'createHash');

        hashUpdateSpy = spy();
        hashDigestStub = stub();

        cryptoStub.returns({
          update: hashUpdateSpy,
          digest: hashDigestStub
        });
      });

      afterEach(() => {
        cryptoStub.restore();
      });

      it('should exist', () => {
        expect(User.encryptPassword).to.be.a('function');
      });

      it('should call crypto.createHash with "sha1"', () => {
        User.encryptPassword('asldkjf', 'asd08uf2j');
        expect(cryptoStub.calledWith('sha1')).to.be.ok;
      });

      it('should call hash.update with the password and then the salt', () => {

        const pass = 'testing';
        const salt = '1093jf10j23ej===12j';

        User.encryptPassword(pass, salt);

        expect(hashUpdateSpy.getCall(0).args[0]).to.be.equal(pass);
        expect(hashUpdateSpy.getCall(1).args[0]).to.be.equal(salt);

      });

      it('should call hash.digest with hex and return the result', () => {

        const x = {};
        hashDigestStub.returns(x);

        const encryptedPassword = User.encryptPassword('sdlkfj', 'asldkjflksf');

        expect(hashDigestStub.calledWith('hex')).to.be.ok;
        expect(encryptedPassword).to.be.equal(x);

      });

    });

    describe('on creation', () => {

      let encryptSpy;
      let saltSpy;

      beforeEach(() => {
        encryptSpy = spy(User, 'encryptPassword');
        saltSpy = spy(User, 'generateSalt');
      });

      afterEach(() => {
        encryptSpy.restore();
        saltSpy.restore();
      });

      it('should call User.encryptPassword with the given password and generated salt', () => {
        return createBasicUser()
          .then(() => {
            const generatedSalt = saltSpy.getCall(0).returnValue;
            expect(encryptSpy.calledWith('potus', generatedSalt)).to.be.ok;
          });
      });

      it('should set user.salt to the generated salt', () => {
        return createBasicUser()
          .then(user => {
            const generatedSalt = saltSpy.getCall(0).returnValue;
            expect(user.salt).to.be.equal(generatedSalt);
          });
      });

      it('should set user.password to the encrypted password', () => {
        return createBasicUser()
          .then(user => {
            const createdPassword = encryptSpy.getCall(0).returnValue;
            expect(user.password).to.be.equal(createdPassword);
          });
      });

    });

    describe('sanitize method', () => {

      it('should remove sensitive information from a user object', () => {
        return createBasicUser()
          .then(user => {
            const sanitizedUser = user.sanitize();
            expect(user.password).to.be.ok;
            expect(user.salt).to.be.ok;
            expect(sanitizedUser.password).to.be.undefined;
            expect(sanitizedUser.salt).to.be.undefined;
          });
      });
    });
  });

  describe('default values', () => {

    it('isAdmin is false', () => {
      return createBasicUser()
        .then(user => {
          expect(user.isAdmin).to.be.false;
        });
    });

    it('isActive is true', () => {
      return createBasicUser()
        .then(user => {
          expect(user.isActive).to.be.true;
        });
    });

  });

  describe('getters and setters', () => {
    const checkGetter = (user, field, value) => {
      expect(user.dataValues[field]).to.not.exist;
      expect(user[field]).to.equal(value);
    };

    it('firstName', () => {
      return createBasicUser()
        .then(user => checkGetter(user, 'firstName', 'Barack'));
    });

    it('lastName', () => {
      return createBasicUser()
        .then(user => checkGetter(user, 'lastName', 'Obama'));
    });

  });

  describe('validation', () => {

    const buildBadEmail = User.build({ email: 'obamagmail.com', password: 'potus', fullName: 'Barack Obama' });
    const buildWithNoEmail = User.build({ password: 'potus', fullName: 'Barack Obama' });
    const buildWithExistingEmail = User.build({ email: 'obama@gmail.com', password: 'potus', fullName: 'Barack Obama' });
    const buildWithNoName = User.build({ email: 'obama@gmail.com', password: 'potus' });

    const errorInstance = (res, type) => {
      expect(res).to.be.an.instanceOf(Error);
      expect(res.errors[0].type).to.equal(type);
    };

    describe('email', () => {

      beforeEach(createBasicUser);

      it('rejects a bad email', () => {
        return buildBadEmail.validate()
          .then(res => errorInstance(res, 'Validation error'));
      });

      it('email cannot be null', () => {
        return buildWithNoEmail.validate()
          .then(res => errorInstance(res, 'notNull Violation'));
      });

      it('email has to be unique', () => {
        return buildWithExistingEmail.save()
          .then(result => {
            expect(result).to.not.exist;
          })
          .catch(err => errorInstance(err, 'unique violation'));
      });

    });

    describe('fullName', () => {

      it('fullName cannot be null', () => {
        return buildWithNoName.validate()
          .then(res => errorInstance(res, 'notNull Violation'));
      });

    });

  });

});
