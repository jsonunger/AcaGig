import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promise from '../../../../src/redux/middleware/promise';
import reducer from '../../../../src/redux/modules/auth';
import * as test from './tests/auth';

const middlewares = [ thunk, promise ];
const mockStore = configureMockStore(middlewares);

describe('MODULE - auth:', () => {
  describe('ACTIONS', () => {
    mockStore({ session: {} });

    // isLoaded action test
    test.isLoaded(mockStore);

    // load action tests
    test.load(mockStore);

    // login action tests
    test.login(mockStore);

    // logout action tests
    test.logout(mockStore);

    // signup action test
    test.signup(mockStore);
  });

  describe('REDUCER', () => {

    const initialState = {
      loaded: false
    };

    it('returns the initial state', () => {
      expect(reducer(undefined, {})).to.deep.equal(initialState);
    });

    describe('handles actions', () => {
      // LOAD action tests
      test.loadActions();

      // SIGNUP action tests
      test.signupActions();

      // LOGIN action tests
      test.loginActions();

      // LOGOUT action tests
      test.logoutActions();
    });

  });

});
