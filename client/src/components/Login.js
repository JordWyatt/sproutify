import React from "react";
import { Button, Box } from "@material-ui/core";

const Login = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    flexDirection="column"
    style={{ height: "100%" }}
  >
    <Box p={1}>
      <h2> Discover new music with the help of old favorites. </h2>
    </Box>
    <Box p={1}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          window.location = `${process.env.REACT_APP_SERVER_URL}/auth/spotify`;
        }}
      >
        Connect with Spotify
      </Button>
    </Box>
  </Box>
);

export default Login;
