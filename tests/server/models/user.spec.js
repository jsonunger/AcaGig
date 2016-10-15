import { stub, spy } from 'sinon';
import { expect } from 'chai';
import db from '../../../server/db';

const User = db.model('user');

describe('User model', function() {

  beforeEach('Sync DB', function() {
    return db.sync({ force: true });
  });

  describe('password encryption', function() {

    describe('generateSalt method', function() {

      it('should exist', function() {
        expect(User.generateSalt).to.be.a('function');
      });

      it('should return a random string basically', function() {
        expect(User.generateSalt()).to.be.a('string');
      });

    });

    describe('encryptPassword', function() {

      let cryptoStub;
      let hashUpdateSpy;
      let hashDigestStub;
      beforeEach(function() {
        cryptoStub = stub(require('crypto'), 'createHash');

        hashUpdateSpy = spy();
        hashDigestStub = stub();

        cryptoStub.returns({
          update: hashUpdateSpy,
          digest: hashDigestStub
        });
      });

      afterEach(function() {
        cryptoStub.restore();
      });

      it('should exist', function() {
        expect(User.encryptPassword).to.be.a('function');
      });

      it('should call crypto.createHash with "sha1"', function() {
        User.encryptPassword('asldkjf', 'asd08uf2j');
        expect(cryptoStub.calledWith('sha1')).to.be.ok;
      });

      it('should call hash.update with the first and second argument', function() {

        const pass = 'testing';
        const salt = '1093jf10j23ej===12j';

        User.encryptPassword(pass, salt);

        expect(hashUpdateSpy.getCall(0).args[0]).to.be.equal(pass);
        expect(hashUpdateSpy.getCall(1).args[0]).to.be.equal(salt);

      });

      it('should call hash.digest with hex and return the result', function() {

        var x = {};
        hashDigestStub.returns(x);

        var e = User.encryptPassword('sdlkfj', 'asldkjflksf');

        expect(hashDigestStub.calledWith('hex')).to.be.ok;
        expect(e).to.be.equal(x);

      });

    });

    describe('on creation', function() {

      var encryptSpy;
      var saltSpy;

      var createUser = function() {
        return User.create({ email: 'obama@gmail.com', password: 'potus', fullName: 'Barack Obama' });
      };

      beforeEach(function() {
        encryptSpy = spy(User, 'encryptPassword');
        saltSpy = spy(User, 'generateSalt');
      });

      afterEach(function() {
        encryptSpy.restore();
        saltSpy.restore();
      });

      it('should call User.encryptPassword with the given password and generated salt', function(done) {
        return createUser()
          .then(function() {
            var generatedSalt = saltSpy.getCall(0).returnValue;
            expect(encryptSpy.calledWith('potus', generatedSalt)).to.be.ok;
            done();
          })
          .catch(done);
      });

      it('should set user.salt to the generated salt', function(done) {
        return createUser()
          .then(function(user) {
            var generatedSalt = saltSpy.getCall(0).returnValue;
            expect(user.salt).to.be.equal(generatedSalt);
            done();
          })
          .catch(done);
      });

      it('should set user.password to the encrypted password', function(done) {
        return createUser()
          .then(function(user) {
            var createdPassword = encryptSpy.getCall(0).returnValue;
            expect(user.password).to.be.equal(createdPassword);
            done();
          })
          .catch(done);
      });

    });

    describe('sanitize method', function() {

      var createUser = function() {
        return User.create({ email: 'obama@gmail.com', password: 'potus', fullName: 'Barack Obama' });
      };

      it('should remove sensitive information from a user object', function(done) {
        return createUser()
          .then(function(user) {
            var sanitizedUser = user.sanitize();
            expect(user.password).to.be.ok;
            expect(user.salt).to.be.ok;
            expect(sanitizedUser.password).to.be.undefined;
            expect(sanitizedUser.salt).to.be.undefined;
            done();
          })
          .catch(done);
      });
    });
  });

  // Our tests below:
  describe('email creation and validation', function() {

    const buildBadEmail = User.build({ email: 'obamamail.com', password: 'potus', fullName: 'Mr. President' });
    const buildWithNoEmail = User.build({ password: 'potus', fullName: 'Mr. President' });
    const buildWithExistingEmail = User.build({ email: 'obama@gmail.com', password: '123', fullName: 'What Ever' });


    beforeEach(function() {
      return User.create({ email: 'obama@gmail.com', password: 'potus', fullName: 'Mr. President' });
    });


    it('rejects a bad email',
      function() {
        // return User.create({email: 'jackalope@bob.com', password: 'passwrd', name: 'Bob'})
        return buildBadEmail.validate()
          .then(function(response) {
            // expect(response.id).to.be.undefined;
            expect(response).to.be.an.instanceOf(Error);
          })
      }
    );

    it('email cannot be null', function() {
      return buildWithNoEmail.validate()
        .then(function(response) {
          expect(response).to.be.an.instanceOf(Error);
        })
    })

    it('email has to be unique', function() {
      return buildWithExistingEmail.save()
        .then(function(result) {
          expect(result).to.not.exist;
        })
        .catch(function(err) {
          expect(err).to.exist;
          expect(err.errors[0].message).to.equal('email must be unique')
        })
    })

  });
  describe('name creation and validation', function() {
    var buildWithNoName = User.build({ email: 'mynonameemail@gmail.com', password: '123' });

    it('name cannot be null', function() {
      return buildWithNoName.validate()
        .then(function(response) {
          expect(response).to.be.an.instanceOf(Error);
        })
    })
  })

});
