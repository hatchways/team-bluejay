import React, { useState, useEffect } from "react";
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
import { makeStyles } from "@material-ui/core/styles";
import { addressToCoords, coordsToAddress } from "api/googleMaps";
import imgSushiChef from "images/sushiChef.png";
import imgBurgerChef from "images/burgerChef.png";
import imgPastaChef from "images/pastaChef.png";
import chefPlaceholder from "images/chefPlaceholder.jpeg";

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
        description:
          "Sushi Master. 20 Years of experience working under Sushi Masters in Japan.",
        img: imgSushiChef,
      },
      {
        name: "Pasta Chef",
        cuisine: ["Italian", "American"],
        location: "Toronto, Canada",
        description: "Pasta Master",
        img: imgPastaChef,
      },
      {
        name: "Burger Maker",
        cuisine: ["American", "Chinese", "Mexican"],
        location: "Toronto, Canada",
        description: "Burger Master",
        img: imgBurgerChef,
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

  const ChefFilters = () => (
    <Grid
      item
      xs={12}
      sm={4}
      md={3}
      component={Paper}
      variant="outlined"
      square
    >
      <Box className={classes.filters}>
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
                color="primary"
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
  );

  return (
    <Grid container component="main" className={classes.root}>
      <ChefFilters />
      <Grid item xs={12} sm={8} md={9}>
        <Box className={classes.chefsPage}>
          <Typography component="h4" variant="h4">
            Available Chefs:
          </Typography>
          <Box className={classes.chefTileArea}>
            {/* {chefs.map((chef) => (
              <CustomCard chef={chef} />
            ))} */}
            {chefs
              .filter(({ cuisine }) => {
                if (selectedCuisines.length >= 1) {
                  return cuisine.some((c) => selectedCuisines.includes(c));
                }
                return true;
              })
              .map((chef) => (
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
  const { name, location, cuisine, description, img } = chef;
  return (
    <Card className={classes.chefTile}>
      <CardMedia
        className={classes.chefImage}
        image={chef.img}
        title="Chef Image"
      />
      <CardContent>
        <Typography variant="h5" component="h5">
          {name}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" component="p">
          {location}
        </Typography>
        {chef.cuisine.map((c) => (
          <Chip className={classes.chip} color="primary" label={c} />
        ))}
        {/* gabriel */}
        <Typography color="textSecondary">{description}</Typography>
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
    // width: "100%", //Gabriel note
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
  filters: {
    margin: theme.spacing(8, 1, 1, 8),
  },
}));

export default ChefSearch;
