import React, { useState, useEffect } from "react";
import API from "api/index";
import {
  Grid,
  Paper,
  Button,
  Box,
  Input,
  Typography,
  Chip,
  Card,
  CardActionArea,
  CardActions,
  CardMedia,
  CardContent,
} from "@material-ui/core";
import { LocationOn, Clear } from "@material-ui/icons";
import ChefFilters from "components/ChefFilters";
import { makeStyles } from "@material-ui/core/styles";
import { addressToCoords, coordsToAddress } from "api/googleMaps";
import chefImage from "images/chef.png";
import chefPlaceholder from "images/chefPlaceholder.jpeg";

const ChefSearch = ({ coords }) => {
  const [chefs, setChefs] = useState([
    {
      name: "Sushi Chef",
      cuisine: ["Japanese"],
      location: "Toronto, Canada",
      description:
        "Sushi Master. 20 Years of experience working under Sushi Masters in Japan.",
      img: chefImage,
    },
    {
      name: "Pasta Chef",
      cuisine: ["Italian", "American"],
      location: "Toronto, Canada",
      description: "Pasta Master",
      img: chefImage,
    },
  ]);
  const [cuisineTypes, setCuisineTypes] = useState([
    "Japanese",
    "Chinese",
    "American",
    "French",
    "Mexican",
    "Italian",
  ]);
  const [userAddress, setUserAddress] = useState("");
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [distanceFilter, setDistanceFilter] = useState(null);

  const classes = useStyles();
  useEffect(() => {
    // do api call
    searchChefs();
    // to change later
    setDummyData();
  }, [userAddress, userCoordinates, selectedCuisines, distanceFilter]);

  const setDummyData = () => {
    // dummy cuisine types
    setCuisineTypes([
      "Japanese",
      "Chinese",
      "American",
      "French",
      "Mexican",
      "Italian",
    ]);
    // dummy chefs
  };

  const searchChefs = async () => {
    try {
      const { data } = await API.get("/chefs", {
        // chef has stub cuisines of ""Japanese, Chinese, Mexican""
        params: {
          userCuisines: selectedCuisines.join(","),
          userLat: userCoordinates ? userCoordinates.latitude : null,
          userLon: userCoordinates ? userCoordinates.longitude : null,
          maxDistance: distanceFilter > 0 ? distanceFilter : null,
        },
      });
      setChefs(data["Search Result"]);
      console.log(data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <Grid container component="main" className={classes.root}>
      <ChefFilters
        userAddress={userAddress}
        setUserAddress={setUserAddress}
        userCoordinates={userCoordinates}
        setUserCoordinates={setUserCoordinates}
        selectedCuisines={selectedCuisines}
        setSelectedCuisines={setSelectedCuisines}
        cuisineTypes={cuisineTypes}
        distanceFilter={distanceFilter}
        setDistanceFilter={setDistanceFilter}
      />
      <Grid item sm={12} md={9}>
        <Box className={classes.chefsPage}>
          <Typography component="h4" variant="h4">
            Available Chefs:
          </Typography>
          <Box className={classes.chefTileArea}>
            {chefs.map((chef) => (
              <CustomCard chef={chef} />
            ))}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

const CustomCard = ({ chef }) => {
  const classes = useStyles();
  const { name, generalLocation, chefProfile } = chef;
  return (
    <Card className={classes.chefTile}>
      <CardMedia
        className={classes.chefImage}
        image={chefImage}
        title="Chef Image"
      />
      <CardContent>
        <Typography variant="h5" component="h5">
          {name}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" component="p">
          {generalLocation || "City, Country"}
        </Typography>
        {["American", "Japanese", "Mexican"].map((c) => (
          <Chip className={classes.chip} color="primary" label={c} />
        ))}

        <Typography variant="body" color="textSecondary" component="p">
          {chefProfile ? chefProfile : "Chef Profile"}
        </Typography>
      </CardContent>
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  chip: {
    borderRadius: "2px",
    marginLeft: theme.spacing(2),
  },
  chefImage: {
    minWidth: "200px",
    minHeight: "200px",
    borderRadius: "50%",
  },
  chefTile: {
    width: "340px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    margin: theme.spacing(2, 2, 2, 0),
    padding: theme.spacing(2, 2, 2, 2),
    "& h5": {
      margin: theme.spacing(1, 0, 1, 0),
    },
    "& p": {
      margin: theme.spacing(1, 0, 1, 0),
    },
  },
  chefTileArea: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chefsPage: {
    padding: theme.spacing(8, 10, 0, 8),
    width: "100%",
  },
  root: {
    height: "100vh",
    display: "flex",
    flexWrap: "wrap",
  },
}));

export default ChefSearch;
