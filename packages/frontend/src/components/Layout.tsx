import React from 'react';
// tslint:disable-next-line: no-submodule-imports
import styled, { css } from 'styled-components/macro';
import { DashboardOutlined, DirectionsRun } from '@material-ui/icons';
import { createStyles, makeStyles, IconButton, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

const headerHeight = '10vh';
const footerHeight = '5vh';

export const MaxWidthCSS = css`
  max-width: 65vw;
  margin: auto;
`;
const Header = styled.header`
  height: ${headerHeight};
  width: 100%;
  display: flex;
  align-items: center;
  padding: 20px;
  margintop: 2vh;
`;

const Main = styled.main`
  min-height: calc(100vh - ${headerHeight} - ${footerHeight});
  display: flex;
  flex-direction: column;
  ${MaxWidthCSS}
`;

const Footer = styled.footer`
  height: ${footerHeight};
  padding: 10px;
  text-align: center;
`;
const useStyles = makeStyles(() =>
  createStyles({
    logo: {
      marginLeft: '2%',
      fontSize: '65px',
      color: 'white',
      textDecoration: 'none',
    },
    noDecor: {
      textDecoration: 'none',
    },
    title: {
      cursor: 'pointer',
      color: 'white',
    },
    button: {
      color: 'white',
      marginLeft: 'auto',
      marginRight: '2%',
      textDecoration: 'none',
    },
    icon: {
      fontSize: '50px',
    },
  }),
);

export const Layout: React.FC = ({ children }) => {
  const classes = useStyles();

  const Logo = () => {
    return (
      <>
        <Link to={'/dashboard'} title="Dashboard" className={classes.logo}>
          <DirectionsRun className={classes.logo} />{' '}
        </Link>
        <Link to={'/dashboard'} className={classes.noDecor}>
          <Typography variant="h5" title="Dashboard" className={classes.title}>
            <b>Get your job done</b>
          </Typography>
        </Link>
      </>
    );
  };

  const LogoRight = () => {
    return (
      <Link to={'/dashboard'} className={classes.button}>
        <IconButton title="Dashboard" className={classes.button}>
          <DashboardOutlined className={classes.icon} /> Dashboard
        </IconButton>
      </Link>
    );
  };

  return (
    <>
      <Header>
        <Logo />
        <LogoRight />
      </Header>
      <Main>{children}</Main>
      <Footer>© 2020 Task Logger</Footer>
    </>
  );
};
