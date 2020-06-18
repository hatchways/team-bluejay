import React, { useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Typography,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Divider,
  Link,
} from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as Logo } from "images/logo.svg";
import UserAvatar from "common/UserAvatar";
import ShoppingCartIcon from "components/ShoppingCartIcon";
import NotificationIcon from "components/NotificationIcon";
import CreateMealForm from "components/CreateMealForm";
import { DialogContext } from "contexts/DialogContext";

const TopNavigationBar = ({ loggedInUser, signOut }) => {
  const classes = useStyles();
  const { openDialog } = useContext(DialogContext);

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
        <Link component={RouterLink} to="/">
          <Logo className={classes.logo} />
        </Link>
        <Button component={RouterLink} to="/chefs" size="large">
          Chefs
        </Button>
        <Button component={RouterLink} to="/profile/orders" size="large">
          Orders
        </Button>
        <div className={classes.grow} />
        <ShoppingCartIcon />
        {!loggedInUser.isChef && (
          <Button size="large" onClick={() => openDialog(<CreateMealForm />)}>
            Become A Chef
          </Button>
        )}
        <NotificationIcon />
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
          <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>
            Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              signOut();
            }}
          >
            Logout
          </MenuItem>
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
