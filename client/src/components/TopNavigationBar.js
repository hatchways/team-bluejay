import React, { useState } from "react";
import {
  AppBar,
  Typography,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Divider,
} from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as Logo } from "images/logo.svg";
import UserAvatar from "common/UserAvatar";
import BecomeChefButton from "components/BecomeChefButton";

const TopNavigationBar = ({ loggedInUser }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <AppBar style={{ background: "#fff" }} position="static">
      <Toolbar>
        <Logo className={classes.logo} />
        <Button size="large">Chefs</Button>
        <Button size="large">Dishes</Button>
        <div className={classes.grow} />
        <BecomeChefButton />
        <Button onClick={handleMenu}>
          <UserAvatar user={loggedInUser} />
          <Typography>{loggedInUser.name}</Typography>
          <ArrowDropDown />
        </Button>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          keepMounted
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem className={classes.menuItem} onClick={handleClose}>
            Messages
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  avatar: {
    margin: theme.spacing(0, 1.5),
  },
  button: {
    borderRadius: "50%",
    margin: theme.spacing(1),
  },
  menuItem: {
    minWidth: theme.spacing(20),
  },
  logo: {
    marginRight: theme.spacing(1),
  },
}));

export default TopNavigationBar;
