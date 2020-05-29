import React, { useState } from "react";
import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ChatBubbleOutline } from "@material-ui/icons";
import { ReactComponent as ChefLogo } from "images/chefs_hat_icon.svg";
import { ReactComponent as DishIcon } from "images/dish_icon.svg";
import UserAvatar from "common/UserAvatar";

const BottomNavigationBar = ({ loggedInUser }) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const bottomTabs = [
    {
      value: "chefs",
      label: "Chefs",
      icon: <ChefLogo className={classes.icon} />,
    },
    {
      value: "dishes",
      label: "Dishes",
      icon: <DishIcon className={classes.icon} />,
    },
    {
      value: "messages",
      label: "Messages",
      icon: <ChatBubbleOutline className={classes.icon} />,
    },
    {
      value: "profile",
      label: "Profile",
      icon: <UserAvatar className={classes.avatarIcon} user={loggedInUser} />,
    },
  ];
  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
      className={classes.stickToBottom}
    >
      {bottomTabs.map(({ value, label, icon }) => {
        return (
          <BottomNavigationAction
            label={label}
            value={value}
            icon={icon}
            key={value}
          />
        );
      })}
    </BottomNavigation>
  );
};

const useStyles = makeStyles((theme) => ({
  icon: {
    height: theme.spacing(3),
    width: theme.spacing(3),
  },
  stickToBottom: {
    width: "100%",
    position: "fixed",
    bottom: 0,
  },
  avatarIcon: {
    height: theme.spacing(3),
    width: theme.spacing(3),
  },
}));

export default BottomNavigationBar;
