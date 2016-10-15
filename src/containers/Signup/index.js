import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import AuthForm from '../../shared/AuthForm';
import { signup } from '../../redux/modules/auth';

class Signup extends Component {

  static propTypes = {
    dispatch: PropTypes.func
  }

  handleSignup = (credentials) => {
    const { dispatch } = this.props;
    dispatch(signup(credentials)).then(() => dispatch(push('/membersOnly')));
  }

  render () {
    return (
      <AuthForm
        buttonLabel="Sign Up"
        buttonStyle="success"
        onSubmit={this.handleSignup}
      />
    );
  }
}

export default connect()(Signup);
