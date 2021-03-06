import React, { PropTypes } from 'react';
import { push } from 'react-router-redux';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import { logout } from '../../redux/modules/auth';
import Logo from '../../shared/Logo';
import './navbar';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: 'about' },
  { label: 'Documentation', path: 'docs' },
  { label: 'Members Only', path: 'membersOnly', auth: true }
];

const renderNavItems = (user) => {
  return (
    <Nav>
    {
      NAV_ITEMS.map((item, i) => {
        if (item.label === 'Home') {
          return (
            <IndexLinkContainer to={item.path} key={i}>
              <NavItem eventKey={i}>
                {item.label}
              </NavItem>
            </IndexLinkContainer>
          );
        } else if (user || !item.auth) {
          return (
            <LinkContainer to={item.path} key={i}>
              <NavItem eventKey={i}>
                {item.label}
              </NavItem>
            </LinkContainer>
          );
        }
      })
    }
    </Nav>
  );
};

const renderAuthNavItems = (user, dispatch) => {

  function handleLogout () {
    dispatch(logout()).then(() => dispatch(push('/')));
  }

  if (user) {
    return (
      <Nav pullRight>
        <NavItem eventKey={NAV_ITEMS.length} onClick={handleLogout}>
          Logout
        </NavItem>
      </Nav>
    );
  } else {
    return (
      <Nav pullRight>
        <LinkContainer to="signup">
          <NavItem>Sign Up</NavItem>
        </LinkContainer>
        <LinkContainer to="login">
          <NavItem>Login</NavItem>
        </LinkContainer>
      </Nav>
    );
  }
};

const NavBar = ({ user, dispatch }) => {
  return (
    <Navbar inverse staticTop>
      <Navbar.Header>
          <Navbar.Brand>
            <Logo />
          </Navbar.Brand>
      </Navbar.Header>
      {renderNavItems(user)}
      {renderAuthNavItems(user, dispatch)}
  </Navbar>
  );
};

NavBar.propTypes = {
  user: PropTypes.object,
  dispatch: PropTypes.func
};

export default NavBar;
