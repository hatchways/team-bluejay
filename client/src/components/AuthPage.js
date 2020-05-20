import React from "react";
import {
  Grid,
  Paper,
  Button,
  Typography,
  Box,
  Hidden,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import BackgroundImage from "../images/ddb3f7c7b2544f7f1c636f0270f032276c911f02.png";
import { ReactComponent as Logo } from "../images/logo.svg";

const WhiteTextTypography = withStyles({
  root: {
    color: "#FFFFFF",
  },
})(Typography);

const SignUpScreen = ({ Form, navigateToLabel, navigateTo, linkTitle }) => {
  const classes = useStyles();
  let history = useHistory();
  return (
    <Grid container component="main" className={classes.root}>
      <Grid item xs={12} sm={8} md={5} component={Paper} square>
        <Logo className={classes.logo} />
        <Box className={classes.paper}>
          <Form />
          <Box display={{ xs: "block", sm: "none" }} component="div">
            <Button
              className={classes.navigationLink}
              onClick={() => history.push(navigateTo)}
              color="primary"
            >
              {linkTitle}
            </Button>
          </Box>
        </Box>
      </Grid>
      <Hidden xsDown>
        <Grid item xs={true} sm={4} md={7} className={classes.image}>
          <Box component="div" className={classes.navigationHelper}>
            <WhiteTextTypography>{linkTitle}</WhiteTextTypography>
            <Button
              className={classes.button}
              onClick={() => history.push(navigateTo)}
              variant="contained"
              color="primary"
            >
              {navigateToLabel}
            </Button>
          </Box>
        </Grid>
      </Hidden>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  logo: {
    margin: theme.spacing(4, 5),
  },
  button: {
    marginLeft: theme.spacing(3),
    padding: theme.spacing(1, 0),
    minWidth: theme.spacing(15),
  },
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url(${BackgroundImage})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  navigationHelper: {
    margin: theme.spacing(4, 5),
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexWrap: "wrap",
  },
  paper: {
    margin: theme.spacing(8, 10, 0, 8),
  },
  navigationLink: {
    padding: theme.spacing(0),
  },
}));

export default SignUpScreen;
