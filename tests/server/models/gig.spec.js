import chai, { expect } from 'chai';
import db from '../../../server/db';
import { errorInstance } from '../utils';

chai.use(require('chai-datetime'));

const Gig = db.model('gig');

describe('Gig model', () => {

  beforeEach(() => db.sync({ force: true }));

  describe('Properties', () => {

    describe('name', () => {

      it('cannot be null', () => {
        return Gig.build().validate()
          .then(res => errorInstance(res, 'name cannot be null'));
      });

    });

    describe('start', () => {

      it('is a date object', () => {
        return Gig.create({ name: 'Halloween', start: new Date('October 31 7:30 pm') })
          .then(gig => expect(gig.start).to.exist);
      });

      it('cannot be null', () => {
        return Gig.build({ name: 'Wedding' }).validate()
          .then(res => errorInstance(res, 'start cannot be null'));
      });

    });

    describe('end', () => {

      it('is a date object', () => {
        return Gig.create({ name: 'Halloween', start: new Date('October 31 2016 7:30 pm'), end: new Date('October 31 2016 10:00 pm') })
          .then(gig => {
            expect(gig.end).to.exist;
            expect(gig.end).to.equalDate(new Date('October 31 2016 10:00 pm'));
          });
      });

      it('defaults to 2 hours after start', () => {
        return Gig.create({ name: 'Halloween', start: new Date('October 31 2016 7:30 pm') })
          .then(gig => {
            expect(gig.end).to.exist;
            expect(gig.end).to.equalDate(new Date('October 31 2016 9:30 pm'));
          });
      });

    });

  });

});
