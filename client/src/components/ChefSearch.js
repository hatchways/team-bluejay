import React from "react";
import { Grid, Paper, Button, Box, Hidden, TextField, Input, InputLabel, FormControl, FormGroup } from "@material-ui/core";
import { LocationOn, BorderColor } from '@material-ui/icons';
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import BackgroundImage from "images/ddb3f7c7b2544f7f1c636f0270f032276c911f02.png";
import { ReactComponent as Logo } from "images/logo.svg";

import WhiteTextTypography from "common/WhiteTextTypography";

const ChefSearch = (props) => {
  const classes = useStyles();
  let history = useHistory();
  return (
    <Grid container component="main" className={classes.root}>
      <Grid item xs={12} sm={6} md={3} component={Paper} square>
        <Box className={classes.paper}>
          <FormGroup className={classes.formGroup}>
            <InputLabel color='primary'>Location</InputLabel>
            <Box className={classes.locationBox} >
              <Input id="my-input" aria-describedby="my-helper-text" flexGrow={0.8} disableUnderline/>
              <LocationOn className={classes.locationIcon} color='primary'/>
            </Box> 
          </FormGroup>
          <FormGroup className={classes.formGroup}>
            <InputLabel color='primary'>Cuisine: </InputLabel>
            
          </FormGroup>   
          
        </Box>
      </Grid>
      {/* <Hidden xsDown> */}
        <Grid item xs={true} sm={4} md={7}>
          <Box component="div" className={classes.navigationHelper}>
            <WhiteTextTypography>{"linkTitle"}</WhiteTextTypography>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
            >
              {"navigateToLabel"}
            </Button>
          </Box>
        </Grid>
      {/* </Hidden> */}
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  formGroup: {
    margin: theme.spacing(3,0)
  },
  locationBox: {
    
    padding: theme.spacing(1,1),
    display:"block",
    border: `1px solid ${"lightgrey"}`
  },
  locationIcon: {
    float: "right"
  },
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
    margin: theme.spacing(1, 1),
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

export default ChefSearch;
