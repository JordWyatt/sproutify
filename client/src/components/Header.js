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

const Header = props => {
  const { user } = props;
  return (
    <div>
      <AppBar position="static">
        <ToolBar>
          <Typography type="title" variant="h6" style={styles.title}>
            Sproutify
          </Typography>
          {user && (
            <Button
              color="inherit"
              onClick={() => {
                window.location = `${process.env.REACT_APP_SERVER_URL}/auth/logout`;
              }}
            >
              Logout
            </Button>
          )}
        </ToolBar>
      </AppBar>
    </div>
  );
};

Header.propTypes = {
  user: PropTypes.object
};

export default Header;
