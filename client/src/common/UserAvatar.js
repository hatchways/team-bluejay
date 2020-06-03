import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar } from "@material-ui/core";

const UserAvatar = ({ user, className }) => {
  const classes = useStyles();

  return user.avatarUrl ? (
    <Avatar src={user.avatarUrl} className={`${classes.avatar} ${className}`} />
  ) : (
    <Avatar className={`${classes.avatar} ${className}`}>
      {user && user.name ? user.name[0] : ""}
    </Avatar>
  );
};

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(0, 1.5),
  },
}));

export default UserAvatar;
