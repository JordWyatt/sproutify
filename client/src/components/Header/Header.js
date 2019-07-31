import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import ToolBar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const styles = {
  title: {
    flex: 1
  }
};

export default function Header(props) {
  const { user } = props;
  return (
    <div>
      <AppBar position="static">
        <ToolBar>
          <Typography type="title" variant="h6" style={styles.title}>
            Sproutify
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              window.location = `${process.env.REACT_APP_PROXY_URL}/auth/${
                user ? "logout" : "spotify"
              }`;
            }}
          >
            {user ? "Logout" : "Connect with Spotify"}
          </Button>
        </ToolBar>
      </AppBar>
    </div>
  );
}

Header.propTypes = {
  user: PropTypes.object
};
