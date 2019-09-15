import React, { Component } from "react";
import { Container } from "@material-ui/core";
import { searchTransform, trackTransform, loadAudio } from "../utils";
import Search from "./Search";
import Selections from "./Selections";
import Explorer from "./Explorer";

const SEARCH_TYPES = [
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

const MAX_SELECTIONS = 5;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTrack: {},
      playing: false,
      seedItems: [],
      searchResults: [],
      recommendations: [],
      selectedSearchType: SEARCH_TYPES[0],
      searchValue: "",
      audio: null
    };

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchTypeChange = this.onSearchTypeChange.bind(this);
    this.onSearchResultClick = this.onSearchResultClick.bind(this);
    this.onRemoveSelection = this.onRemoveSelection.bind(this);
    this.onMouseOutTrack = this.onMouseOutTrack.bind(this);
    this.onMouseOverTrack = this.onMouseOverTrack.bind(this);
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
    const selectedSearchType = SEARCH_TYPES.find(
      type => type.value === e.target.value
    );
    this.setState({ selectedSearchType }, () =>
      this.onSearchChange(this.state.searchValue)
    );
  }

  onSearchResultClick(item) {
    const { seedItems } = this.state;
    const itemExists = seedItems.map(x => x.id).includes(item.id);

    if (!itemExists && seedItems.length < MAX_SELECTIONS) {
      this.setState({
        seedItems: [...seedItems, item]
      });
    }
  }

  onRemoveSelection(item) {
    const seedItems = this.state.seedItems.filter(x => x.id !== item.id);
    this.setState({
      seedItems
    });
  }

  onMouseOverTrack(selectedTrack) {
    const { selectedTrack: existingSelectedTrack } = this.state;
    if (selectedTrack.id !== existingSelectedTrack.id) {
      this.setState({
        selectedTrack: trackTransform(selectedTrack),
        playing: true,
        audio: loadAudio(selectedTrack.preview_url)
      });
    } else {
      this.setState({ playing: true });
    }
  }

  onMouseOutTrack() {
    this.setState({ playing: false, selectedTrack: {} });
  }

  componentDidUpdate(prevProps, prevState) {
    const { playing, selectedTrack, audio, seedItems } = this.state;

    if (!playing && prevState.playing) {
      audio.pause();
    } else if (playing && selectedTrack) {
      this.state.audio.play();
    }

    if (seedItems.length && prevState.seedItems.length !== seedItems.length) {
      const seedArtists = seedItems
        .filter(x => x.type === "artist")
        .map(x => x.id);
      const seedTracks = seedItems
        .filter(x => x.type === "track")
        .map(x => x.id);

      fetch(
        `${
          process.env.REACT_APP_PROXY_URL
        }/spotify/recommendations?seed_artists=${encodeURI(
          seedArtists
        )}&seed_tracks=${encodeURI(seedTracks)}`,
        { credentials: "include" }
      )
        .then(response => response.json())
        .then(tracks =>
          this.setState({
            recommendations: tracks
          })
        );
    }
  }

  render() {
    const {
      searchResults,
      selectedSearchType,
      searchValue,
      recommendations,
      seedItems,
      selectedTrack
    } = this.state;

    return (
      <div>
        <Container maxWidth="lg">
          <Search
            value={searchValue}
            results={searchResults}
            onChange={this.onSearchChange}
            onSearchResultClick={this.onSearchResultClick}
            selectedSearchType={selectedSearchType}
            searchTypes={SEARCH_TYPES}
            onSearchTypeChange={this.onSearchTypeChange}
          ></Search>
          <Selections
            selections={seedItems}
            handleDelete={this.onRemoveSelection}
          />
          <Explorer
            items={recommendations}
            selectedTrack={selectedTrack}
            onMouseOver={this.onMouseOverTrack}
            onMouseOut={this.onMouseOutTrack}
          />
        </Container>
      </div>
    );
  }
}
export default Home;
