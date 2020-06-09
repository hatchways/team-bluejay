import React, { useContext } from "react";
import {
  Grid,
  Paper,
  Button,
  Typography,
  Box,
  Avatar,
  Chip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import EditProfileButton from "components/EditProfileButton";
import GoogleMaps from "components/GoogleMaps";
import ChefProfile from "components/ChefProfile";
import { Context as UserContext } from "contexts/AuthContext";

const Profile = ({ props }) => {
  const classes = useStyles();
  const {
    state: { user },
  } = useContext(UserContext);

  const googleCoords =
    user.latitude && user.longitude
      ? { lat: user.latitude, lng: user.longitude }
      : null;

  if (user.isChef) return <ChefProfile user={user} />;

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
          src={user.profileImage || ""}
          alt="profile"
          className={classes.avatar}
        />
        <Typography variant="h5" className={classes.bold}>
          {user.name}
        </Typography>
        <Typography variant="subtitle1" className={classes.location}>
          {user.generalLocation}
        </Typography>
        {user ? (
          <EditProfileButton />
        ) : (
          <Button variant="outlined" color="primary" size="large">
            Send Message
          </Button>
        )}
      </Grid>

      <Grid item xs={12} sm={6} md={5} component={Paper}>
        <Box py={12} px={10}>
          <Typography variant="h6" paragraph className={classes.bold}>
            ABOUT ME:
          </Typography>
          <Box mb={6}>
            {/* Todo: See if paragraph splitting works on Mac */}
            {user.aboutMe &&
              user.aboutMe.split(/(\r\n|\n|\r)/gm).map((p, i) => (
                <Typography variant="body1" paragraph key={i}>
                  {p}
                </Typography>
              ))}
          </Box>

          <Typography variant="h6" paragraph className={classes.bold}>
            FAVORITE CUISINE:
          </Typography>
          {user.cuisines &&
            user.cuisines.map((cuisine, i) => (
              <Chip label={cuisine.name} color="primary" key={i} />
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
        <GoogleMaps coords={googleCoords} />
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(5),
    },
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
}));

export default Profile;
