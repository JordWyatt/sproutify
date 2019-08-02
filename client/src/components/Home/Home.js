import React, { Component } from "react";
import Header from "../Header/Header";
import Search from "../Search/Search";
import { Container } from "@material-ui/core";
import { searchTransform } from "../../utils";
// import tracks from "../../mock_data/tracks";

const searchTypes = [
  {
    value: "tracks",
    label: "Tracks",
    endpoint: "searchTracks"
  },
  {
    value: "artists",
    label: "Artists",
    endpoint: "searchArtists"
  }
];

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      searchResults: [],
      selectedSearchType: searchTypes[0],
      content: "No Content",
      searchValue: ""
    };

    // this.getTopArtists = this.getTopArtists.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchTypeChange = this.onSearchTypeChange.bind(this);
  }

  onSearchChange(value) {
    const { endpoint: searchEndpoint } = this.state.selectedSearchType;

    if (value) {
      fetch(
        `${
          process.env.REACT_APP_PROXY_URL
        }/spotify/${searchEndpoint}?q=${encodeURI(value)}`,
        { credentials: "include" }
      )
        .then(response => response.json())
        .then(searchResults =>
          this.setState({
            searchResults: searchTransform(searchResults),
            searchValue: value
          })
        );
    }
  }

  onSearchTypeChange(e) {
    const selectedSearchType = searchTypes.find(
      type => type.value === e.target.value
    );
    this.setState({ selectedSearchType }, () =>
      this.onSearchChange(this.state.searchValue)
    );
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

  // getTopArtists() {
  //   fetch(`${process.env.REACT_APP_PROXY_URL}/spotify/topArtists`, {
  //     credentials: "include"
  //   })
  //     .then(response => response.json())
  //     .then(json => this.setState({ content: json }));
  // }

  render() {
    const { searchResults, selectedSearchType, searchValue } = this.state;
    return (
      <div className="App">
        <Header user={this.state.user} />
        <Container maxWidth="md">
          <Search
            value={searchValue}
            results={searchResults}
            onChange={this.onSearchChange}
            selectedSearchType={selectedSearchType}
            searchTypes={searchTypes}
            onSearchTypeChange={this.onSearchTypeChange}
          ></Search>
        </Container>
      </div>
    );
  }
}
export default Home;
