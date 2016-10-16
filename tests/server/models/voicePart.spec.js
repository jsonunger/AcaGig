import { expect } from 'chai';
import db from '../../../server/db';
import { errorInstance } from '../utils';

const VoicePart = db.model('voicePart');

describe('VoicePart model', () => {

  beforeEach(() => db.sync({ force: true }));

  describe('Properties', () => {

    describe('name', () => {

      it('cannot be null', () => {
        return VoicePart.build({}).validate()
          .then(res => errorInstance(res, 'name cannot be null'));
      });

      it('has a minimum length of 2', () => {
        return VoicePart.build({ name: 'I' }).validate()
          .then(res => errorInstance(res, 'Must be at least 2 characters long', 'name'));
      });

      it('should be stored as lowercase', () => {
        const voicePart = VoicePart.build({ name: 'Lower Tenor' });

        expect(voicePart.name).to.equal('lower tenor');
      });

    });

  });
});
