import React, { Component } from "react";
import { Container, Button } from "@material-ui/core";

class Login extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Container maxWidth="md">
          <Button
            color="inherit"
            onClick={() => {
              window.location = `${process.env.REACT_APP_PROXY_URL}/auth/spotify`;
            }}
          >
            Connect with Spotify
          </Button>
        </Container>
      </div>
    );
  }
}

export default Login;
