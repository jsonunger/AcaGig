import db from '../../../server/db';
import { errorInstance } from '../utils';

const Song = db.model('song');

describe('Song model', () => {

  beforeEach(() => db.sync({ force: true }));

  describe('Properties', () => {

    describe('title', () => {

      it('cannot be null', () => {
        return Song.build({ artist: 'Bruno Mars' }).validate()
          .then(res => errorInstance(res, 'title cannot be null'));
      });

    });

    describe('artist', () => {

      it('cannot be null', () => {
        return Song.build({ title: 'Just the Way You Are' }).validate()
          .then(res => errorInstance(res, 'artist cannot be null'));
      });

    });

  });
});
