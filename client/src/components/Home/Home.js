import React, { Component } from "react";
import Header from "../Header/Header";
import { Container } from "@material-ui/core";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      content: "No Content"
    };

    this.getTopArtists = this.getTopArtists.bind(this);
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_PROXY_URL}/auth/login/success`, {
      credentials: "include"
    })
      .then(response => {
        if (response.status === 200) return response.json();
        throw new Error("failed to authenticate user");
      })
      .then(responseJson => {
        this.setState({
          authenticated: true,
          user: responseJson.user
        });
      })
      .catch(e => {
        console.error(e);
        this.setState({
          authenticated: false,
          error: "Failed to authenticate user"
        });
      });
  }

  getTopArtists() {
    fetch(`${process.env.REACT_APP_PROXY_URL}/spotify/topArtists`, {
      credentials: "include"
    })
      .then(response => response.json())
      .then(json => this.setState({ content: json }));
  }

  render() {
    return (
      <div className="App">
        <Header user={this.state.user} />
        <Container maxWidth="sm">
          <div>{this.state.user && this.state.user.name}</div>
        </Container>
      </div>
    );
  }
}
export default Home;
