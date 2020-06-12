import React, { useState, useEffect, useContext } from "react";
import { Button, Badge, Menu, MenuItem, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Notifications, NotificationsNone } from "@material-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import API from "api";
import { SocketContext } from "contexts/SocketContext";

const NotificationIcon = () => {
  //TODO: fix error of socket notifications not being recieved if notification menu is open!!!

  const { socket } = useContext(SocketContext);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications();
  }, []);

  useEffect(() => {
    socket.on("new notification", (notification) => {
      setNotifications([notification, ...notifications]);
    });
    return () => socket.off("new notification");
  }, [socket, notifications]);

  async function getNotifications() {
    const {
      data: { notifications },
    } = await API.get("/notifications");
    setNotifications(notifications);
  }

  async function markNotificationsRead() {
    const {
      data: { notifications },
    } = await API.put("/notifications");
    setNotifications(notifications);
  }

  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
    markNotificationsRead();
  };

  const classes = useStyles();

  const unreadMessageCount = notifications.reduce(
    (acc, { isRead }) => acc + !isRead,
    0
  );

  const Icon =
    unreadMessageCount > 0 ? (
      <Badge badgeContent={unreadMessageCount} color="primary">
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
            to="/profile/orders"
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
