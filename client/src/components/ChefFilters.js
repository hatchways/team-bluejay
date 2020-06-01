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
import chefImage from "images/chef.png";
import chefPlaceholder from "images/chefPlaceholder.jpeg";

const ChefFilters = ({
  userAddress,
  setUserAddress,
  userCoordinates,
  setUserCoordinates,
  selectedCuisines,
  setSelectedCuisines,
  cuisineTypes,
}) => {
  const classes = useStyles();

  const toggleLocation = () => {
    if (!userCoordinates) {
      getLocation();
    } else {
      setUserCoordinates(null);
      setUserAddress("");
    }
  };

  const addSelectedCuisine = (cuisine) => {
    setSelectedCuisines([...selectedCuisines, cuisine]);
  };

  const removeSelectedCuisine = (cuisine) => {
    let filteredCuisines = selectedCuisines.filter((c) => c !== cuisine);
    setSelectedCuisines(filteredCuisines);
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
        setUserCoordinates(null);
        setUserAddress("");
      }
    });
  };

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
  return (
    <Grid item sm={12} md={3} component={Paper} variant="outlined" square>
      <Box className={classes.filters}>
        <Box className={classes.filterGroup}>
          <Typography component="h6" variant="h6">
            Location
          </Typography>
          <form className={classes.locationBox} onSubmit={handleSubmit}>
            <Input
              id="my-input"
              autoFocus
              aria-describedby="my-helper-text"
              onChange={handleChange}
              value={userAddress}
              disableUnderline
            />
            <LocationOn
              className={classes.locationIcon}
              color={userCoordinates ? "primary" : "lightgrey"}
              onClick={toggleLocation}
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
  );
};

const useStyles = makeStyles((theme) => ({
  chip: {
    borderRadius: "2px",
    marginLeft: theme.spacing(2),
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
  filters: {
    margin: theme.spacing(8, 1, 1, 8),
  },
}));

export default ChefFilters;
