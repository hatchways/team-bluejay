import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Button,
  Box,
  Input,
  Typography,
  Card,
  CardActionArea,
  CardActions,
  CardMedia,
  CardContent,
} from "@material-ui/core";
import { LocationOn, Clear } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { addressToCoords, coordsToAddress } from "api/googleMaps";
import chefImage from "images/chef.png";

const ChefSearch = ({ coords }) => {
  const [chefs, setChefs] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [cuisineTypes, setCuisineTypes] = useState([]);
  const classes = useStyles();
  useEffect(() => {
    // do api call

    // to change later
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
    setChefs([
      {
        name: "Sushi Chef",
        cuisine: ["Japanese"],
        location: "Toronto, Canada",
        description: "Sushi Master",
        img: chefImage,
      },
      {
        name: "Pasta Chef",
        cuisine: ["Italian"],
        location: "Toronto, Canada",
        description: "Pasta Master",
        img: chefImage,
      },
      {
        name: "Burger Maker",
        cuisine: ["American"],
        location: "Toronto, Canada",
        description: "Burger Master",
        img: chefImage,
      },
    ]);
  }, []);

  const getLocation = () => {
    const success = (pos) => {
      const { latitude, longitude } = pos.coords;

      setUserCoordinates({ latitude, longitude });
      coordsToAddress(latitude, longitude).then((data) => {
        setUserAddress(data);
      });
    };
    const error = (err) => {
      console.log(err);
    };
    navigator.geolocation.getCurrentPosition(success, error);
  };

  const handleChange = (e) => {
    setUserAddress(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addressToCoords(userAddress).then(({ address, coordinates }) => {
      if (address && coordinates) {
        const { latitude, longitude } = coordinates;
        setUserCoordinates({ latitude, longitude });
        setUserAddress(address);
      } else {
        alert("failed to find address");
      }
    });
  };

  const addSelectedCuisine = (cuisine) => {
    setSelectedCuisines([...selectedCuisines, cuisine]);
  };

  const removeSelectedCuisine = (cuisine) => {
    let filteredCuisines = selectedCuisines.filter((c) => c !== cuisine);
    setSelectedCuisines(filteredCuisines);
  };

  return (
    <Grid container component="main" className={classes.root}>
      <Grid item xs={12} sm={6} md={3} component={Paper} square>
        <Box className={classes.paper}>
          <Box className={classes.filterGroup}>
            <Typography component="h6" variant="h6">
              Location
            </Typography>
            <form className={classes.locationBox} onSubmit={handleSubmit}>
              <Input
                id="my-input"
                aria-describedby="my-helper-text"
                onChange={handleChange}
                value={userAddress}
                disableUnderline
              />
              <LocationOn
                className={classes.locationIcon}
                color={userCoordinates ? "primary" : "lightgrey"}
                onClick={getLocation}
              />
            </form>
          </Box>
          <Box className={classes.filterGroup}>
            <Typography component="h6" variant="h6">
              Cuisine:
            </Typography>
            <Box className={classes.selectedCuisines}>
              {selectedCuisines.map((cuisine) => (
                <Button
                  className={classes.button}
                  color="secondary"
                  variant="contained"
                  key={cuisine}
                >
                  {cuisine}
                  <Clear onClick={() => removeSelectedCuisine(cuisine)} />
                </Button>
              ))}
            </Box>
          </Box>
          <Box className={classes.filterGroup}>
            <Box className={classes.cuisineTypes}>
              {cuisineTypes
                .filter((cuisine) => !selectedCuisines.includes(cuisine))
                .map((cuisine) => (
                  <Button
                    className={classes.button}
                    color="error"
                    variant="contained"
                    key={cuisine}
                    onClick={() => addSelectedCuisine(cuisine)}
                  >
                    {cuisine}
                  </Button>
                ))}
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={true} sm={4} md={7}>
        <Box className={classes.chefsPage}>
          <Typography component="h4" variant="h4">
            Available Chefs:
          </Typography>
          <Box className={classes.chefTiles}>
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
  const { name, location, cuisine, description } = chef;
  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="Chef Picture"
          image={chefImage}
          title={name}
        />
        <CardContent>
          <Typography variant="h5" component="h5">
            {name}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary" component="p">
            {location}
          </Typography>
          <Button
            mx="auto"
            className={classes.button}
            color="secondary"
            variant="contained"
          >
            {cuisine[0]}
          </Button>
          <Typography variant="body" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: 345,
    margin: theme.spacing(2, 2, 2, 0),
    display: "block",
    "& p": {
      textAlign: "center",
    },
    "& h5": {
      textAlign: "center",
    },
  },
  chefTiles: {
    display: "flex",
  },
  chefsPage: {
    padding: theme.spacing(8, 10, 0, 8),
  },
  filterGroup: {
    marginTop: theme.spacing(2),
  },
  cuisineTypes: {
    display: "inline-block",
  },
  selectedCuisines: {
    display: "inline-block",
  },
  locationBox: {
    padding: theme.spacing(1, 1),
    display: "inline-block",
    border: `1px solid ${"lightgrey"}`,
  },
  locationIcon: {
    float: "right",
  },
  button: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(3),
    padding: theme.spacing(1, 0),
    minWidth: theme.spacing(15),
  },
  root: {
    height: "100vh",
  },
  paper: {
    margin: theme.spacing(8, 10, 0, 8),
  },
}));

export default ChefSearch;
