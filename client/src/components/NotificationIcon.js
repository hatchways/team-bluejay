import React, { useState, useEffect } from "react";
import { Button, Badge, Menu, MenuItem, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
//import { Context as MealContext } from "contexts/MealContext";
import { Notifications, NotificationsNone } from "@material-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import API from "api";

const NotificationIcon = () => {
  useEffect(() => {
    (async function getNotifications() {
      const {
        data: { notifications },
      } = await API.get("/notifications");
      setNotifications(notifications);
    })();
  }, []);

  const [notifications, setNotifications] = useState([]);
  /*const notifications = [
    {
      id: 1,
      isRead: false,
      message: "A notification message that happens to be really long",
      date_created: "5 minutes ago",
    },
    {
      id: 2,
      isRead: false,
      message: "A notification message",
      date_created: "5 minutes ago",
    },
    {
      id: 3,
      isRead: true,
      message: "A notification message",
      date_created: "5 minutes ago",
    },
    {
      id: 4,
      isRead: true,
      message: "A notification message",
      date_created: "5 minutes ago",
    },
  ];*/

  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = (event) => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const classes = useStyles();

  const Icon = notifications.length ? (
    <Badge badgeContent={notifications.length} color="primary">
      <Notifications />
    </Badge>
  ) : (
    <NotificationsNone color="secondary" />
  );

  return (
    <>
      <Button
        aria-haspopup="true"
        onClick={openMenu}
        className={classes.navIcon}
      >
        {Icon}
      </Button>
      <Menu
        id="notifications-menu"
        anchorEl={anchorEl}
        keepMounted
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        {notifications.map((notification) => (
          <MenuItem
            component={RouterLink}
            to="/"
            key={notification.id}
            onClick={closeMenu}
            className={classes.menuItem}
          >
            <Box py={0.5} className={notification.isRead ? "" : classes.unread}>
              {notification.message}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  navIcon: {
    "& svg": {
      fontSize: "2rem",
    },
  },
  menuItem: {
    width: theme.spacing(45),
    /* whiteSpace: 'normal' splits MUI MenuItem texts into multiple lines */
    whiteSpace: "normal",
  },
  unread: {
    fontWeight: "bold",
  },
}));

export default NotificationIcon;
