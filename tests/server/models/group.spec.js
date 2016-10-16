import { stub, spy } from 'sinon';
import { expect } from 'chai';
import db from '../../../server/db';
import { errorInstance } from '../utils';

const Group = db.model('group');

describe('Group model', () => {

  beforeEach(() => db.sync({ force: true }));

  describe('Properties', () => {

    describe('name', () => {

      it('cannot be null', () => {
        return Group.build({}).validate()
          .then(res => errorInstance(res, 'name cannot be null'));
      });

      it('must be longer than 2 letters', () => {
        return Group.build({ name: 'I', timezone: 'America/New_York'  }).validate()
          .then(res => errorInstance(res, 'Must be at least 2 characters long', 'name'));
      });

    });

    describe('timezone', () => {

      it('cannot be null', () => {
        return Group.build({ name: 'Concrete' }).validate()
          .then(res => errorInstance(res, 'timezone cannot be null'));
      });

      it('must be one of the US timezones', () => {
        return Group.build({ name: 'Concrete', timezone: 'America/NewYork' }).validate()
          .then(res => errorInstance(res, 'Must be American timezone'));
      });

    });

  });
});
