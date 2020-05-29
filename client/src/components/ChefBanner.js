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

const ChefBanner = ({ chef }) => {
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
      <Grid item className={classes.image}>
        <Avatar className={classes.avatar} src={chef.avatarUrl} />
      </Grid>
      <Grid item className={classes.chefDetails}>
        <Typography variant="h6">{chef.name}</Typography>
        <Box color="text.secondary">
          <Typography>{chef.location}</Typography>
        </Box>
        <Divider classes={{ root: classes.divider }} variant="middle" />
        <Typography>{chef.bio}</Typography>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.button}
        >
          Send Request
        </Button>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: theme.spacing(80),
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
    top: "56%",
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
