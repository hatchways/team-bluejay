import React, { useState } from "react";
import {
  Grid,
  Paper,
  Button,
  Typography,
  Box,
  Hidden,
  Avatar,
  Chip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BackgroundImage from "images/ddb3f7c7b2544f7f1c636f0270f032276c911f02.png";
import GoogleMaps from "components/GoogleMaps";
import { Edit } from "@material-ui/icons";

const EditProfileButton = ({ editing, toggleEditing }) =>
  editing ? (
    <Button variant="contained" color="secondary" onClick={toggleEditing}>
      Save Edits
    </Button>
  ) : (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      onClick={toggleEditing}
    >
      <Edit />
      <Typography variant="body1">Edit Profile</Typography>{" "}
    </div>
  );

const Profile = ({ props }) => {
  const classes = useStyles();
  const favoriteCuisines = ["Japanese", "Chinese", "Mediterranean", "Thai"];
  const loggedInUser = true;
  const [editing, setEditing] = useState(false);
  const toggleEditing = () => setEditing(!editing);

  return (
    <Grid
      container
      component="main"
      justify="center"
      className={classes.mainGrid}
    >
      <Grid
        item
        xs={12}
        sm={4}
        md={3}
        component={Paper}
        className={classes.paper}
      >
        <Avatar
          src={BackgroundImage}
          alt="profile"
          className={classes.avatar}
        />
        <Typography variant="h5" className={classes.bold}>
          Christine Wilson
        </Typography>
        <Typography variant="subtitle1" className={classes.location}>
          Toronto, Canada
        </Typography>
        {loggedInUser ? (
          <EditProfileButton editing={editing} toggleEditing={toggleEditing} />
        ) : (
          <Button variant="outlined" color="primary" size="large">
            Send Message
          </Button>
        )}
      </Grid>

      <Grid item xs={12} sm={6} md={5} component={Paper}>
        <Box py={12} px={10}>
          <Typography variant="h6" paragraph className={classes.bold}>
            {editing && <Edit color="action" />}ABOUT ME:
          </Typography>
          <Box mb={6}>
            <Typography variant="body1" paragraph>
              Hi everyone!
            </Typography>
            <Typography variant="body1" paragraph>
              I'm a foodie and I love to eat healthy and tasty meals. Also I'm a
              mom of two beautiful babies.
            </Typography>
          </Box>

          <Typography variant="h6" paragraph className={classes.bold}>
            FAVORITE CUISINE:
          </Typography>
          {favoriteCuisines.map((cuisine, i) => (
            <Chip label={cuisine} color="primary" key={i} />
          ))}
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        sm={10}
        md={8}
        /* for google-maps-react size must be set with inline-styles on parent container */
        style={{ position: "relative", height: "60vh" }}
      >
        <GoogleMaps />
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(5),
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(7),
  },
  avatar: {
    width: theme.spacing(25),
    height: theme.spacing(25),
    border: "solid white 5px",
    boxShadow: "0 0 10px lightgrey",
    marginBottom: theme.spacing(3),
  },
  bold: {
    fontWeight: "bold",
  },
  location: {
    color: "darkgrey",
    marginBottom: theme.spacing(4),
  },
  icon: {
    height: theme.spacing(3),
    width: theme.spacing(3),
  },
}));

export default Profile;
