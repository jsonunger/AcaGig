'use strict';

import { expect } from 'chai';
import nock from 'nock';
import {
  logout,
  LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAILURE
} from '../../../../../../src/redux/modules/auth';

export default function (mockStore) {
  describe('logout', () => {
    let store;

    beforeEach(() => {
      store = mockStore({ session: {} });
    });

    afterEach(() => {
      nock.cleanAll();
    });

    const logoutAPICall = nock(`http://localhost:8080`).get('/logout');

    it('creates LOGOUT when initially dispatched', () => {
      logoutAPICall.reply(200);

      return store.dispatch(logout())
      .then(() => {
        const actionTypes = store.getActions().map(action => action.type);
        expect(actionTypes).to.include(LOGOUT);
      });
    });

    it('creates LOGOUT_SUCCESS when login was successfully done', () => {
      logoutAPICall.reply(200);

      return store.dispatch(logout())
      .then(() => {
        const actionTypes = store.getActions().map(action => action.type);
        expect(actionTypes).to.include(LOGOUT_SUCCESS);
      });
    });

    it('creates LOGOUT_FAILURE when login request fails', () => {
      logoutAPICall.replyWithError({ message: 'Logout Failed' });

      return store.dispatch(logout())
      .then(() => {
        const actionTypes = store.getActions().map(action => action.type);
        expect(actionTypes).to.include(LOGOUT_FAILURE);
      });
    });
  });
}
