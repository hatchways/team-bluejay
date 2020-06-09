import React from "react";
import {
  Grid,
  Paper,
  Avatar,
  Chip,
  Button,
  Box,
  Typography,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Image from "material-ui-image";
import ChefBannerBackground from "images/chef_banner.png";
import EditProfileButton from "components/EditProfileButton";

const ChefBanner = ({ chef, editable }) => {
  const classes = useStyles();
  return (
    <Grid
      item
      xs={12}
      sm={12}
      md={4}
      lg={3}
      component="main"
      className={classes.root}
    >
      <Paper className={classes.paper} elevation={2}>
        <Grid item className={classes.image}>
          <Avatar className={classes.avatar} src={chef.avatarUrl} />
        </Grid>
        <Grid item className={classes.chefDetails}>
          <Typography variant="h6">{chef.name}</Typography>
          <Box color="text.secondary">
            <Typography>{chef.generalLocation}</Typography>
          </Box>
          <Divider classes={{ root: classes.divider }} variant="middle" />
          <Typography>{chef.chefProfile}</Typography>
          <Chip
            className={classes.cuisineChip}
            size="large"
            label={`${chef.chefCuisine}`}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Send Request
          </Button>
          {editable && <EditProfileButton />}
        </Grid>
      </Paper>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  cuisineChip: {
    color: theme.palette.primary.main,
    backgroundColor: "transparent",
    fontSize: "1.5rem",
  },
  root: {
    minHeight: theme.spacing(80),
    backgroundColor: "#fff",
    maxHeight: "600px",
  },
  paper: {
    width: "100%",
    height: "100%",
  },
  image: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage: `url(${ChefBannerBackground})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    position: "relative",
    backgroundPosition: "center",
    height: "30%",
    width: "100%",
  },
  avatar: {
    position: "absolute",
    width: theme.spacing(20),
    height: theme.spacing(20),
    border: "3px solid #fff",
    top: "60%",
  },
  chefDetails: {
    marginTop: theme.spacing(14),
    display: "flex",
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
    padding: theme.spacing(0, 5),
  },
  divider: {
    margin: theme.spacing(2, 0),
    minWidth: theme.spacing(5),
    backgroundColor: theme.palette.primary,
  },
  button: {
    margin: theme.spacing(3, 0),
    padding: theme.spacing(2),
  },
}));

export default ChefBanner;
