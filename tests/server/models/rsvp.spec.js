import { expect } from 'chai';
import db from '../../../server/db';
import { errorInstance } from '../utils';

const RSVP = db.model('rsvp');

describe('RSVP model', () => {

  beforeEach(() => db.sync({ force: true }));

  describe('Properties', () => {

    describe('reply', () => {

      it('cannot be null', () => {
        return RSVP.build({}).validate()
          .then(res => errorInstance(res, 'reply cannot be null'));
      });

      it('must be one of the options', () => {
        return RSVP.build({ reply: 'hello' }).validate()
          .then(res => errorInstance(res, 'Must be either yes, no, or maybe', 'reply'));
      });

      it('should be stored as uppercase', () => {
        return RSVP.create({ reply: 'yes' })
          .then(rsvp => {
            expect(rsvp).to.exist;
            expect(rsvp.reply).to.equal('YES');
          });
      });

    });

  });

});
