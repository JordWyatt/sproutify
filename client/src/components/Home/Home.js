import React, { Component } from "react";
import { Container } from "@material-ui/core";
import { searchTransform } from "../../utils";
import Header from "../Header/Header";
import Search from "../Search/Search";
import Selections from "../Selections/Selections";
import Explorer from "../Explorer/Explorer";

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
      selectedItems: [],
      searchResults: [],
      selectedSearchType: SEARCH_TYPES[0],
      searchValue: ""
    };

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchTypeChange = this.onSearchTypeChange.bind(this);
    this.onSearchResultClick = this.onSearchResultClick.bind(this);
    this.onRemoveSelection = this.onRemoveSelection.bind(this);
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
    const { selectedItems } = this.state;
    const itemExists = selectedItems.map(x => x.id).includes(item.id);

    if (!itemExists && selectedItems.length < MAX_SELECTIONS) {
      this.setState({
        selectedItems: [...selectedItems, item]
      });
    }
  }

  onRemoveSelection(item) {
    const selectedItems = this.state.selectedItems.filter(
      x => x.id !== item.id
    );
    this.setState({
      selectedItems
    });
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

  render() {
    const { searchResults, selectedSearchType, searchValue } = this.state;
    return (
      <div className="App">
        <Header user={this.state.user} />
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
            selections={this.state.selectedItems}
            handleDelete={this.onRemoveSelection}
          />
          <Explorer items={mockRecommendations.tracks} />
        </Container>
      </div>
    );
  }
}
export default Home;

const mockRecommendations = {
  tracks: [
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/6wdvERzX4CUCOXu6hSS95x"
            },
            href: "https://api.spotify.com/v1/artists/6wdvERzX4CUCOXu6hSS95x",
            id: "6wdvERzX4CUCOXu6hSS95x",
            name: "Natalia Kills",
            type: "artist",
            uri: "spotify:artist:6wdvERzX4CUCOXu6hSS95x"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/1XdmaPUzFqEPwowQ0UPiRp"
        },
        href: "https://api.spotify.com/v1/albums/1XdmaPUzFqEPwowQ0UPiRp",
        id: "1XdmaPUzFqEPwowQ0UPiRp",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/f5f5033173863e65d59c2a8d0bac2facfe37a3f0",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/bba8712adfdc7e14c5aaa012871e0ec1f86f127e",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/36406f1e45a7d118e6c97cf0cbf61a735aed1ff9",
            width: 64
          }
        ],
        name: "Trouble",
        release_date: "2013-01-01",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:1XdmaPUzFqEPwowQ0UPiRp"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/6wdvERzX4CUCOXu6hSS95x"
          },
          href: "https://api.spotify.com/v1/artists/6wdvERzX4CUCOXu6hSS95x",
          id: "6wdvERzX4CUCOXu6hSS95x",
          name: "Natalia Kills",
          type: "artist",
          uri: "spotify:artist:6wdvERzX4CUCOXu6hSS95x"
        }
      ],
      disc_number: 1,
      duration_ms: 277866,
      explicit: false,
      external_ids: {
        isrc: "USUM71310317"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/1OBrEfDbOdV0v0L0iiOu8h"
      },
      href: "https://api.spotify.com/v1/tracks/1OBrEfDbOdV0v0L0iiOu8h",
      id: "1OBrEfDbOdV0v0L0iiOu8h",
      is_local: false,
      is_playable: true,
      name: "Devils Don't Fly",
      popularity: 59,
      preview_url: null,
      track_number: 7,
      type: "track",
      uri: "spotify:track:1OBrEfDbOdV0v0L0iiOu8h"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/6Dd3NScHWwnW6obMFbl1BH"
            },
            href: "https://api.spotify.com/v1/artists/6Dd3NScHWwnW6obMFbl1BH",
            id: "6Dd3NScHWwnW6obMFbl1BH",
            name: "Daya",
            type: "artist",
            uri: "spotify:artist:6Dd3NScHWwnW6obMFbl1BH"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/5Wb43vZwNAsAV97dHAIXYl"
        },
        href: "https://api.spotify.com/v1/albums/5Wb43vZwNAsAV97dHAIXYl",
        id: "5Wb43vZwNAsAV97dHAIXYl",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/9100e9291a50ab8f3b45b249eb6850f03cd1db1e",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/09ec4df8e86be58d3d757ad72dfa07e240c5c70a",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/952e686d5d20b88e94596edac5d265113085b442",
            width: 64
          }
        ],
        name: "Left Me Yet",
        release_date: "2019-06-21",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:5Wb43vZwNAsAV97dHAIXYl"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/6Dd3NScHWwnW6obMFbl1BH"
          },
          href: "https://api.spotify.com/v1/artists/6Dd3NScHWwnW6obMFbl1BH",
          id: "6Dd3NScHWwnW6obMFbl1BH",
          name: "Daya",
          type: "artist",
          uri: "spotify:artist:6Dd3NScHWwnW6obMFbl1BH"
        }
      ],
      disc_number: 1,
      duration_ms: 191340,
      explicit: false,
      external_ids: {
        isrc: "USUG11901583"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/6k2t5GhwOIKep31iyJ8S0L"
      },
      href: "https://api.spotify.com/v1/tracks/6k2t5GhwOIKep31iyJ8S0L",
      id: "6k2t5GhwOIKep31iyJ8S0L",
      is_local: false,
      is_playable: true,
      name: "Left Me Yet",
      popularity: 67,
      preview_url: null,
      track_number: 1,
      type: "track",
      uri: "spotify:track:6k2t5GhwOIKep31iyJ8S0L"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/4NHQUGzhtTLFvgF5SZesLK"
            },
            href: "https://api.spotify.com/v1/artists/4NHQUGzhtTLFvgF5SZesLK",
            id: "4NHQUGzhtTLFvgF5SZesLK",
            name: "Tove Lo",
            type: "artist",
            uri: "spotify:artist:4NHQUGzhtTLFvgF5SZesLK"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/6jggnLM3SdDnjQ3GWmIZ4L"
        },
        href: "https://api.spotify.com/v1/albums/6jggnLM3SdDnjQ3GWmIZ4L",
        id: "6jggnLM3SdDnjQ3GWmIZ4L",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/dc7bbcd3d046104c6e16b3edc8eb276081ac6b50",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/73e8f30d32e685503f62655ebd3998e2c9818604",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/733658e11a2481fa80df775209b9cd185de2a033",
            width: 64
          }
        ],
        name: "BLUE LIPS (lady wood phase II)",
        release_date: "2017-11-17",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:6jggnLM3SdDnjQ3GWmIZ4L"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/4NHQUGzhtTLFvgF5SZesLK"
          },
          href: "https://api.spotify.com/v1/artists/4NHQUGzhtTLFvgF5SZesLK",
          id: "4NHQUGzhtTLFvgF5SZesLK",
          name: "Tove Lo",
          type: "artist",
          uri: "spotify:artist:4NHQUGzhtTLFvgF5SZesLK"
        }
      ],
      disc_number: 1,
      duration_ms: 223794,
      explicit: true,
      external_ids: {
        isrc: "SEUM71700736"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/1TIiWomS4i0Ikaf9EKdcLn"
      },
      href: "https://api.spotify.com/v1/tracks/1TIiWomS4i0Ikaf9EKdcLn",
      id: "1TIiWomS4i0Ikaf9EKdcLn",
      is_local: false,
      is_playable: true,
      name: "disco tits",
      popularity: 63,
      preview_url: null,
      track_number: 2,
      type: "track",
      uri: "spotify:track:1TIiWomS4i0Ikaf9EKdcLn"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/6M2wZ9GZgrQXHCFfjv46we"
            },
            href: "https://api.spotify.com/v1/artists/6M2wZ9GZgrQXHCFfjv46we",
            id: "6M2wZ9GZgrQXHCFfjv46we",
            name: "Dua Lipa",
            type: "artist",
            uri: "spotify:artist:6M2wZ9GZgrQXHCFfjv46we"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/0obMz8EHnr3dg6NCUK4xWp"
        },
        href: "https://api.spotify.com/v1/albums/0obMz8EHnr3dg6NCUK4xWp",
        id: "0obMz8EHnr3dg6NCUK4xWp",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/a59ba61362a7301facba81a94c9cb1d9d4496b3a",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/52bd057ad49ec5490735ed2768fe2e0c29787f3d",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/41574527c517fa0abcb95224eb86c594caa219f0",
            width: 64
          }
        ],
        name: "Dua Lipa (Complete Edition)",
        release_date: "2018-10-19",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:0obMz8EHnr3dg6NCUK4xWp"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/6M2wZ9GZgrQXHCFfjv46we"
          },
          href: "https://api.spotify.com/v1/artists/6M2wZ9GZgrQXHCFfjv46we",
          id: "6M2wZ9GZgrQXHCFfjv46we",
          name: "Dua Lipa",
          type: "artist",
          uri: "spotify:artist:6M2wZ9GZgrQXHCFfjv46we"
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/41MozSoPIsD1dJM0CLPjZF"
          },
          href: "https://api.spotify.com/v1/artists/41MozSoPIsD1dJM0CLPjZF",
          id: "41MozSoPIsD1dJM0CLPjZF",
          name: "BLACKPINK",
          type: "artist",
          uri: "spotify:artist:41MozSoPIsD1dJM0CLPjZF"
        }
      ],
      disc_number: 1,
      duration_ms: 189173,
      explicit: false,
      external_ids: {
        isrc: "GBAHT1800505"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/7jr3iPu4O4bTCVwLMbdU2i"
      },
      href: "https://api.spotify.com/v1/tracks/7jr3iPu4O4bTCVwLMbdU2i",
      id: "7jr3iPu4O4bTCVwLMbdU2i",
      is_local: false,
      is_playable: true,
      name: "Kiss and Make Up",
      popularity: 78,
      preview_url:
        "https://p.scdn.co/mp3-preview/7328fdaa04a8b5cada8b8e95a3dfe59913f9183c?cid=774b29d4f13844c495f206cafdad9c86",
      track_number: 20,
      type: "track",
      uri: "spotify:track:7jr3iPu4O4bTCVwLMbdU2i"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/1o2NpYGqHiCq7FoiYdyd1x"
            },
            href: "https://api.spotify.com/v1/artists/1o2NpYGqHiCq7FoiYdyd1x",
            id: "1o2NpYGqHiCq7FoiYdyd1x",
            name: "Bea Miller",
            type: "artist",
            uri: "spotify:artist:1o2NpYGqHiCq7FoiYdyd1x"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/6qLQLAHnS54MLHY8wxXDX5"
        },
        href: "https://api.spotify.com/v1/albums/6qLQLAHnS54MLHY8wxXDX5",
        id: "6qLQLAHnS54MLHY8wxXDX5",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/af95afe4e3a0999ca0cad498b295cb46e242071d",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/8987590faf56bc1468cbc635812a85abe618ca12",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/14fe91d0f94ab6fd4eb2f4ca731965b8add5babd",
            width: 64
          }
        ],
        name: "feel something",
        release_date: "2019-06-21",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:6qLQLAHnS54MLHY8wxXDX5"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/1o2NpYGqHiCq7FoiYdyd1x"
          },
          href: "https://api.spotify.com/v1/artists/1o2NpYGqHiCq7FoiYdyd1x",
          id: "1o2NpYGqHiCq7FoiYdyd1x",
          name: "Bea Miller",
          type: "artist",
          uri: "spotify:artist:1o2NpYGqHiCq7FoiYdyd1x"
        }
      ],
      disc_number: 1,
      duration_ms: 180161,
      explicit: true,
      external_ids: {
        isrc: "USHR11939250"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/7JDWhC422Gtk1Bq0mL3OTC"
      },
      href: "https://api.spotify.com/v1/tracks/7JDWhC422Gtk1Bq0mL3OTC",
      id: "7JDWhC422Gtk1Bq0mL3OTC",
      is_local: false,
      is_playable: true,
      name: "feel something",
      popularity: 64,
      preview_url: null,
      track_number: 1,
      type: "track",
      uri: "spotify:track:7JDWhC422Gtk1Bq0mL3OTC"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/1dgdvbogmctybPrGEcnYf6"
            },
            href: "https://api.spotify.com/v1/artists/1dgdvbogmctybPrGEcnYf6",
            id: "1dgdvbogmctybPrGEcnYf6",
            name: "Route 94",
            type: "artist",
            uri: "spotify:artist:1dgdvbogmctybPrGEcnYf6"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/63WK5Kd7J5kp7ctAC4l92Q"
        },
        href: "https://api.spotify.com/v1/albums/63WK5Kd7J5kp7ctAC4l92Q",
        id: "63WK5Kd7J5kp7ctAC4l92Q",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/54f43ef3e6d4b9d6a4b111dfd20938efa21bc4bd",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/f30573ced4aaaec2bcff5342b79edd51f599407d",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/01f3abb6f47cd612d41ba92fe44901f6a6e86603",
            width: 64
          }
        ],
        name: "My Love (feat. Jess Glynne)",
        release_date: "2014-02-28",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:63WK5Kd7J5kp7ctAC4l92Q"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/1dgdvbogmctybPrGEcnYf6"
          },
          href: "https://api.spotify.com/v1/artists/1dgdvbogmctybPrGEcnYf6",
          id: "1dgdvbogmctybPrGEcnYf6",
          name: "Route 94",
          type: "artist",
          uri: "spotify:artist:1dgdvbogmctybPrGEcnYf6"
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/4ScCswdRlyA23odg9thgIO"
          },
          href: "https://api.spotify.com/v1/artists/4ScCswdRlyA23odg9thgIO",
          id: "4ScCswdRlyA23odg9thgIO",
          name: "Jess Glynne",
          type: "artist",
          uri: "spotify:artist:4ScCswdRlyA23odg9thgIO"
        }
      ],
      disc_number: 1,
      duration_ms: 259934,
      explicit: false,
      external_ids: {
        isrc: "GBQGW1300182"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/61UQzeiIluhpzpMdY4ag3q"
      },
      href: "https://api.spotify.com/v1/tracks/61UQzeiIluhpzpMdY4ag3q",
      id: "61UQzeiIluhpzpMdY4ag3q",
      is_local: false,
      is_playable: true,
      name: "My Love (feat. Jess Glynne)",
      popularity: 68,
      preview_url:
        "https://p.scdn.co/mp3-preview/651d239d3bb7ed5333971e7c34adb09a64476b60?cid=774b29d4f13844c495f206cafdad9c86",
      track_number: 1,
      type: "track",
      uri: "spotify:track:61UQzeiIluhpzpMdY4ag3q"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/0C8ZW7ezQVs4URX5aX7Kqx"
            },
            href: "https://api.spotify.com/v1/artists/0C8ZW7ezQVs4URX5aX7Kqx",
            id: "0C8ZW7ezQVs4URX5aX7Kqx",
            name: "Selena Gomez",
            type: "artist",
            uri: "spotify:artist:0C8ZW7ezQVs4URX5aX7Kqx"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/7lDBDk8OQarV5dBMu3qrdz"
        },
        href: "https://api.spotify.com/v1/albums/7lDBDk8OQarV5dBMu3qrdz",
        id: "7lDBDk8OQarV5dBMu3qrdz",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/ee45013ffd4e68f43afd8961e919d8c80e54e35e",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/b2795eec580b34876bf48bd450bc0fd840293c13",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/467dce0617bec81b834a30a5d8d332c6f43a2933",
            width: 64
          }
        ],
        name: "Revival (Deluxe)",
        release_date: "2015-10-09",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:7lDBDk8OQarV5dBMu3qrdz"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/0C8ZW7ezQVs4URX5aX7Kqx"
          },
          href: "https://api.spotify.com/v1/artists/0C8ZW7ezQVs4URX5aX7Kqx",
          id: "0C8ZW7ezQVs4URX5aX7Kqx",
          name: "Selena Gomez",
          type: "artist",
          uri: "spotify:artist:0C8ZW7ezQVs4URX5aX7Kqx"
        }
      ],
      disc_number: 1,
      duration_ms: 217906,
      explicit: false,
      external_ids: {
        isrc: "USUM71513588"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/1QNoKVgA758HFLu3TW2q7R"
      },
      href: "https://api.spotify.com/v1/tracks/1QNoKVgA758HFLu3TW2q7R",
      id: "1QNoKVgA758HFLu3TW2q7R",
      is_local: false,
      is_playable: true,
      linked_from: {
        external_urls: {
          spotify: "https://open.spotify.com/track/7KxhSJOYiqCDclXDBNlFSZ"
        },
        href: "https://api.spotify.com/v1/tracks/7KxhSJOYiqCDclXDBNlFSZ",
        id: "7KxhSJOYiqCDclXDBNlFSZ",
        type: "track",
        uri: "spotify:track:7KxhSJOYiqCDclXDBNlFSZ"
      },
      name: "Kill Em With Kindness",
      popularity: 61,
      preview_url: null,
      track_number: 2,
      type: "track",
      uri: "spotify:track:1QNoKVgA758HFLu3TW2q7R"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/3LjhVl7GzYsza1biQjTpaN"
            },
            href: "https://api.spotify.com/v1/artists/3LjhVl7GzYsza1biQjTpaN",
            id: "3LjhVl7GzYsza1biQjTpaN",
            name: "Hayley Kiyoko",
            type: "artist",
            uri: "spotify:artist:3LjhVl7GzYsza1biQjTpaN"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/1DBeQGiRdap7iuvuxSx3bD"
        },
        href: "https://api.spotify.com/v1/albums/1DBeQGiRdap7iuvuxSx3bD",
        id: "1DBeQGiRdap7iuvuxSx3bD",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/03dc1a009e2dec953f53aa10b69024b0d9db2b7d",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/8b77eef2e945a5a001dcf9b29451ee9204885155",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/addec8ad07c98233c7c6e03d15731e26e568b733",
            width: 64
          }
        ],
        name: "This Side of Paradise - EP",
        release_date: "2015-02-03",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:1DBeQGiRdap7iuvuxSx3bD"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/3LjhVl7GzYsza1biQjTpaN"
          },
          href: "https://api.spotify.com/v1/artists/3LjhVl7GzYsza1biQjTpaN",
          id: "3LjhVl7GzYsza1biQjTpaN",
          name: "Hayley Kiyoko",
          type: "artist",
          uri: "spotify:artist:3LjhVl7GzYsza1biQjTpaN"
        }
      ],
      disc_number: 1,
      duration_ms: 229655,
      explicit: false,
      external_ids: {
        isrc: "USUYG1060445"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/3dNjUFt6EFU4Gq6Q5vfJqf"
      },
      href: "https://api.spotify.com/v1/tracks/3dNjUFt6EFU4Gq6Q5vfJqf",
      id: "3dNjUFt6EFU4Gq6Q5vfJqf",
      is_local: false,
      is_playable: true,
      name: "Girls Like Girls",
      popularity: 63,
      preview_url:
        "https://p.scdn.co/mp3-preview/51dda7a781e64464d832e4f1f5b963146a6e09bb?cid=774b29d4f13844c495f206cafdad9c86",
      track_number: 4,
      type: "track",
      uri: "spotify:track:3dNjUFt6EFU4Gq6Q5vfJqf"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/4NHQUGzhtTLFvgF5SZesLK"
            },
            href: "https://api.spotify.com/v1/artists/4NHQUGzhtTLFvgF5SZesLK",
            id: "4NHQUGzhtTLFvgF5SZesLK",
            name: "Tove Lo",
            type: "artist",
            uri: "spotify:artist:4NHQUGzhtTLFvgF5SZesLK"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/6jggnLM3SdDnjQ3GWmIZ4L"
        },
        href: "https://api.spotify.com/v1/albums/6jggnLM3SdDnjQ3GWmIZ4L",
        id: "6jggnLM3SdDnjQ3GWmIZ4L",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/dc7bbcd3d046104c6e16b3edc8eb276081ac6b50",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/73e8f30d32e685503f62655ebd3998e2c9818604",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/733658e11a2481fa80df775209b9cd185de2a033",
            width: 64
          }
        ],
        name: "BLUE LIPS (lady wood phase II)",
        release_date: "2017-11-17",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:6jggnLM3SdDnjQ3GWmIZ4L"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/4NHQUGzhtTLFvgF5SZesLK"
          },
          href: "https://api.spotify.com/v1/artists/4NHQUGzhtTLFvgF5SZesLK",
          id: "4NHQUGzhtTLFvgF5SZesLK",
          name: "Tove Lo",
          type: "artist",
          uri: "spotify:artist:4NHQUGzhtTLFvgF5SZesLK"
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/0LSjb1pZ3uHwuvIaVzhdyT"
          },
          href: "https://api.spotify.com/v1/artists/0LSjb1pZ3uHwuvIaVzhdyT",
          id: "0LSjb1pZ3uHwuvIaVzhdyT",
          name: "Daye Jack",
          type: "artist",
          uri: "spotify:artist:0LSjb1pZ3uHwuvIaVzhdyT"
        }
      ],
      disc_number: 1,
      duration_ms: 211648,
      explicit: false,
      external_ids: {
        isrc: "SEUM71701028"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/45CiDBvF0HNtAHXQFfnSzD"
      },
      href: "https://api.spotify.com/v1/tracks/45CiDBvF0HNtAHXQFfnSzD",
      id: "45CiDBvF0HNtAHXQFfnSzD",
      is_local: false,
      is_playable: true,
      name: "romantics",
      popularity: 52,
      preview_url: null,
      track_number: 9,
      type: "track",
      uri: "spotify:track:45CiDBvF0HNtAHXQFfnSzD"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/5CCwRZC6euC8Odo6y9X8jr"
            },
            href: "https://api.spotify.com/v1/artists/5CCwRZC6euC8Odo6y9X8jr",
            id: "5CCwRZC6euC8Odo6y9X8jr",
            name: "Rita Ora",
            type: "artist",
            uri: "spotify:artist:5CCwRZC6euC8Odo6y9X8jr"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/415fhs8Ft2VMFY0rWLK4BD"
        },
        href: "https://api.spotify.com/v1/albums/415fhs8Ft2VMFY0rWLK4BD",
        id: "415fhs8Ft2VMFY0rWLK4BD",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/ddb8bf8ce31280744a48f0e1df2a18f51411a60b",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/d8e36c8a0ec02808ff871762c9391074a033bfb3",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/55442c14689b4a65f16136eda371edb6d7ac3967",
            width: 64
          }
        ],
        name: "I Will Never Let You Down",
        release_date: "2014-03-31",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:415fhs8Ft2VMFY0rWLK4BD"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/5CCwRZC6euC8Odo6y9X8jr"
          },
          href: "https://api.spotify.com/v1/artists/5CCwRZC6euC8Odo6y9X8jr",
          id: "5CCwRZC6euC8Odo6y9X8jr",
          name: "Rita Ora",
          type: "artist",
          uri: "spotify:artist:5CCwRZC6euC8Odo6y9X8jr"
        }
      ],
      disc_number: 1,
      duration_ms: 203466,
      explicit: false,
      external_ids: {
        isrc: "USQX91400359"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/2ia7iiEtpiOL2ZVuWxBZGB"
      },
      href: "https://api.spotify.com/v1/tracks/2ia7iiEtpiOL2ZVuWxBZGB",
      id: "2ia7iiEtpiOL2ZVuWxBZGB",
      is_local: false,
      is_playable: true,
      name: "I Will Never Let You Down",
      popularity: 65,
      preview_url:
        "https://p.scdn.co/mp3-preview/70d65e1fdbf17773c1b9ea73b35785deb6a659a9?cid=774b29d4f13844c495f206cafdad9c86",
      track_number: 1,
      type: "track",
      uri: "spotify:track:2ia7iiEtpiOL2ZVuWxBZGB"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/4JNfz6aO9ZFz0gp5GY88am"
            },
            href: "https://api.spotify.com/v1/artists/4JNfz6aO9ZFz0gp5GY88am",
            id: "4JNfz6aO9ZFz0gp5GY88am",
            name: "Hey Violet",
            type: "artist",
            uri: "spotify:artist:4JNfz6aO9ZFz0gp5GY88am"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/6ZZbMKUghvClcRLF5pZT6Y"
        },
        href: "https://api.spotify.com/v1/albums/6ZZbMKUghvClcRLF5pZT6Y",
        id: "6ZZbMKUghvClcRLF5pZT6Y",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/cabdaf47653c1a2664bca082d30f7b5e0b7c106e",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/2ffc03bad063d007f41f37a811a76ca7cc123c1c",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/45607fdf2366e47640e0e65901f4eac581343062",
            width: 64
          }
        ],
        name: "From The Outside",
        release_date: "2017-06-16",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:6ZZbMKUghvClcRLF5pZT6Y"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/4JNfz6aO9ZFz0gp5GY88am"
          },
          href: "https://api.spotify.com/v1/artists/4JNfz6aO9ZFz0gp5GY88am",
          id: "4JNfz6aO9ZFz0gp5GY88am",
          name: "Hey Violet",
          type: "artist",
          uri: "spotify:artist:4JNfz6aO9ZFz0gp5GY88am"
        }
      ],
      disc_number: 1,
      duration_ms: 213694,
      explicit: true,
      external_ids: {
        isrc: "USUG11600812"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/0Xm8tw6qikotb8FAOZ2ks7"
      },
      href: "https://api.spotify.com/v1/tracks/0Xm8tw6qikotb8FAOZ2ks7",
      id: "0Xm8tw6qikotb8FAOZ2ks7",
      is_local: false,
      is_playable: true,
      name: "Guys My Age",
      popularity: 61,
      preview_url: null,
      track_number: 3,
      type: "track",
      uri: "spotify:track:0Xm8tw6qikotb8FAOZ2ks7"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/26VFTg2z8YR0cCuwLzESi2"
            },
            href: "https://api.spotify.com/v1/artists/26VFTg2z8YR0cCuwLzESi2",
            id: "26VFTg2z8YR0cCuwLzESi2",
            name: "Halsey",
            type: "artist",
            uri: "spotify:artist:26VFTg2z8YR0cCuwLzESi2"
          },
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/7CajNmpbOovFoOoasH2HaY"
            },
            href: "https://api.spotify.com/v1/artists/7CajNmpbOovFoOoasH2HaY",
            id: "7CajNmpbOovFoOoasH2HaY",
            name: "Calvin Harris",
            type: "artist",
            uri: "spotify:artist:7CajNmpbOovFoOoasH2HaY"
          },
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/2ExGrw6XpbtUAJHTLtUXUD"
            },
            href: "https://api.spotify.com/v1/artists/2ExGrw6XpbtUAJHTLtUXUD",
            id: "2ExGrw6XpbtUAJHTLtUXUD",
            name: "Stefflon Don",
            type: "artist",
            uri: "spotify:artist:2ExGrw6XpbtUAJHTLtUXUD"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/2RLbKom2FQkaes7qf3xLoa"
        },
        href: "https://api.spotify.com/v1/albums/2RLbKom2FQkaes7qf3xLoa",
        id: "2RLbKom2FQkaes7qf3xLoa",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/8c1ae0bc43cd635cddd6153acafc2d3c0ecd1d11",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/13620cfb3fa7f78e859e30b0a693308253e196b0",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/e311a4a87e01f85a1eb5a687c8aefb2d901cf4a6",
            width: 64
          }
        ],
        name: "Alone (Calvin Harris Remix) (Feat. Stefflon Don)",
        release_date: "2018-04-20",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:2RLbKom2FQkaes7qf3xLoa"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/26VFTg2z8YR0cCuwLzESi2"
          },
          href: "https://api.spotify.com/v1/artists/26VFTg2z8YR0cCuwLzESi2",
          id: "26VFTg2z8YR0cCuwLzESi2",
          name: "Halsey",
          type: "artist",
          uri: "spotify:artist:26VFTg2z8YR0cCuwLzESi2"
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/2ExGrw6XpbtUAJHTLtUXUD"
          },
          href: "https://api.spotify.com/v1/artists/2ExGrw6XpbtUAJHTLtUXUD",
          id: "2ExGrw6XpbtUAJHTLtUXUD",
          name: "Stefflon Don",
          type: "artist",
          uri: "spotify:artist:2ExGrw6XpbtUAJHTLtUXUD"
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/7CajNmpbOovFoOoasH2HaY"
          },
          href: "https://api.spotify.com/v1/artists/7CajNmpbOovFoOoasH2HaY",
          id: "7CajNmpbOovFoOoasH2HaY",
          name: "Calvin Harris",
          type: "artist",
          uri: "spotify:artist:7CajNmpbOovFoOoasH2HaY"
        }
      ],
      disc_number: 1,
      duration_ms: 199199,
      explicit: false,
      external_ids: {
        isrc: "USUM71804468"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/5K09638EBQjVMrZYXA89aC"
      },
      href: "https://api.spotify.com/v1/tracks/5K09638EBQjVMrZYXA89aC",
      id: "5K09638EBQjVMrZYXA89aC",
      is_local: false,
      is_playable: true,
      name: "Alone (Calvin Harris Remix) (Feat. Stefflon Don)",
      popularity: 64,
      preview_url: null,
      track_number: 1,
      type: "track",
      uri: "spotify:track:5K09638EBQjVMrZYXA89aC"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/0C8ZW7ezQVs4URX5aX7Kqx"
            },
            href: "https://api.spotify.com/v1/artists/0C8ZW7ezQVs4URX5aX7Kqx",
            id: "0C8ZW7ezQVs4URX5aX7Kqx",
            name: "Selena Gomez",
            type: "artist",
            uri: "spotify:artist:0C8ZW7ezQVs4URX5aX7Kqx"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/78GeZ5IA1KSbI0MiR4bAhH"
        },
        href: "https://api.spotify.com/v1/albums/78GeZ5IA1KSbI0MiR4bAhH",
        id: "78GeZ5IA1KSbI0MiR4bAhH",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/42c114e238e8522cae1549fa16aa6be7d33219ca",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/015479c89b50cb22e93b12a527fba0cc87a649b6",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/93501003885723d20c98d855fb7d8a6ea38dd01b",
            width: 64
          }
        ],
        name: "For You",
        release_date: "2014-11-24",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:78GeZ5IA1KSbI0MiR4bAhH"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/0C8ZW7ezQVs4URX5aX7Kqx"
          },
          href: "https://api.spotify.com/v1/artists/0C8ZW7ezQVs4URX5aX7Kqx",
          id: "0C8ZW7ezQVs4URX5aX7Kqx",
          name: "Selena Gomez",
          type: "artist",
          uri: "spotify:artist:0C8ZW7ezQVs4URX5aX7Kqx"
        }
      ],
      disc_number: 1,
      duration_ms: 227360,
      explicit: false,
      external_ids: {
        isrc: "USHR11435979"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/2dRvMEW4EwySxRUtEamSfG"
      },
      href: "https://api.spotify.com/v1/tracks/2dRvMEW4EwySxRUtEamSfG",
      id: "2dRvMEW4EwySxRUtEamSfG",
      is_local: false,
      is_playable: true,
      name: "The Heart Wants What It Wants",
      popularity: 70,
      preview_url: null,
      track_number: 1,
      type: "track",
      uri: "spotify:track:2dRvMEW4EwySxRUtEamSfG"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/1l8Fu6IkuTP0U5QetQJ5Xt"
            },
            href: "https://api.spotify.com/v1/artists/1l8Fu6IkuTP0U5QetQJ5Xt",
            id: "1l8Fu6IkuTP0U5QetQJ5Xt",
            name: "Fifth Harmony",
            type: "artist",
            uri: "spotify:artist:1l8Fu6IkuTP0U5QetQJ5Xt"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/0zAsh6hObeNmFgFPrUiFcP"
        },
        href: "https://api.spotify.com/v1/albums/0zAsh6hObeNmFgFPrUiFcP",
        id: "0zAsh6hObeNmFgFPrUiFcP",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/702ea459eef6df07fec7756a0a38b2452e9c9d4d",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/950b08d0cb572289f53bdbca413e4a797794a435",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/e2187e0654f7d6bbb600ea0c2f65d1dc89a4d84f",
            width: 64
          }
        ],
        name: "Reflection (Deluxe)",
        release_date: "2015-01-30",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:0zAsh6hObeNmFgFPrUiFcP"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/1l8Fu6IkuTP0U5QetQJ5Xt"
          },
          href: "https://api.spotify.com/v1/artists/1l8Fu6IkuTP0U5QetQJ5Xt",
          id: "1l8Fu6IkuTP0U5QetQJ5Xt",
          name: "Fifth Harmony",
          type: "artist",
          uri: "spotify:artist:1l8Fu6IkuTP0U5QetQJ5Xt"
        }
      ],
      disc_number: 1,
      duration_ms: 171413,
      explicit: false,
      external_ids: {
        isrc: "USSM11404393"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/1COvXs6jaykXC73h9OSBVM"
      },
      href: "https://api.spotify.com/v1/tracks/1COvXs6jaykXC73h9OSBVM",
      id: "1COvXs6jaykXC73h9OSBVM",
      is_local: false,
      is_playable: true,
      name: "BO$$",
      popularity: 63,
      preview_url:
        "https://p.scdn.co/mp3-preview/91e0550a0b3a741db6fd57233469bc57fb713a60?cid=774b29d4f13844c495f206cafdad9c86",
      track_number: 2,
      type: "track",
      uri: "spotify:track:1COvXs6jaykXC73h9OSBVM"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/4NHQUGzhtTLFvgF5SZesLK"
            },
            href: "https://api.spotify.com/v1/artists/4NHQUGzhtTLFvgF5SZesLK",
            id: "4NHQUGzhtTLFvgF5SZesLK",
            name: "Tove Lo",
            type: "artist",
            uri: "spotify:artist:4NHQUGzhtTLFvgF5SZesLK"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/47C7w4o1resDhr7jvYEpxE"
        },
        href: "https://api.spotify.com/v1/albums/47C7w4o1resDhr7jvYEpxE",
        id: "47C7w4o1resDhr7jvYEpxE",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/10e359ca5c32b609274c8fcde447fcd9c4cb31fe",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/003397ef673672fc37b9d9178c6e52e65fe48c31",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/214e5d43690c718994a429c6c814976657c51d32",
            width: 64
          }
        ],
        name: "Queen Of The Clouds",
        release_date: "2014-01-01",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:47C7w4o1resDhr7jvYEpxE"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/4NHQUGzhtTLFvgF5SZesLK"
          },
          href: "https://api.spotify.com/v1/artists/4NHQUGzhtTLFvgF5SZesLK",
          id: "4NHQUGzhtTLFvgF5SZesLK",
          name: "Tove Lo",
          type: "artist",
          uri: "spotify:artist:4NHQUGzhtTLFvgF5SZesLK"
        }
      ],
      disc_number: 1,
      duration_ms: 209160,
      explicit: false,
      external_ids: {
        isrc: "SE3NM1300101"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/14OxJlLdcHNpgsm4DRwDOB"
      },
      href: "https://api.spotify.com/v1/tracks/14OxJlLdcHNpgsm4DRwDOB",
      id: "14OxJlLdcHNpgsm4DRwDOB",
      is_local: false,
      is_playable: true,
      linked_from: {
        external_urls: {
          spotify: "https://open.spotify.com/track/18AJRdgUoO9EYn11N7xzaT"
        },
        href: "https://api.spotify.com/v1/tracks/18AJRdgUoO9EYn11N7xzaT",
        id: "18AJRdgUoO9EYn11N7xzaT",
        type: "track",
        uri: "spotify:track:18AJRdgUoO9EYn11N7xzaT"
      },
      name: "Habits (Stay High)",
      popularity: 64,
      preview_url: null,
      track_number: 13,
      type: "track",
      uri: "spotify:track:14OxJlLdcHNpgsm4DRwDOB"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/2kRfqPViCqYdSGhYSM9R0Q"
            },
            href: "https://api.spotify.com/v1/artists/2kRfqPViCqYdSGhYSM9R0Q",
            id: "2kRfqPViCqYdSGhYSM9R0Q",
            name: "Madison Beer",
            type: "artist",
            uri: "spotify:artist:2kRfqPViCqYdSGhYSM9R0Q"
          },
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/4DdkRBBYG6Yk9Ka8tdJ9BW"
            },
            href: "https://api.spotify.com/v1/artists/4DdkRBBYG6Yk9Ka8tdJ9BW",
            id: "4DdkRBBYG6Yk9Ka8tdJ9BW",
            name: "Offset",
            type: "artist",
            uri: "spotify:artist:4DdkRBBYG6Yk9Ka8tdJ9BW"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/4FAW4D50oWaQ3EoRcsJduh"
        },
        href: "https://api.spotify.com/v1/albums/4FAW4D50oWaQ3EoRcsJduh",
        id: "4FAW4D50oWaQ3EoRcsJduh",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/2aea63740960681ead732698d7a68b0d94845665",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/fcc76864cfffd5e932014e3670371da53848a3ae",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/f7554250d8c41fff93ab30994be13e5dc228d8da",
            width: 64
          }
        ],
        name: "Hurts Like Hell (feat. Offset)",
        release_date: "2018-11-09",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:4FAW4D50oWaQ3EoRcsJduh"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/2kRfqPViCqYdSGhYSM9R0Q"
          },
          href: "https://api.spotify.com/v1/artists/2kRfqPViCqYdSGhYSM9R0Q",
          id: "2kRfqPViCqYdSGhYSM9R0Q",
          name: "Madison Beer",
          type: "artist",
          uri: "spotify:artist:2kRfqPViCqYdSGhYSM9R0Q"
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/4DdkRBBYG6Yk9Ka8tdJ9BW"
          },
          href: "https://api.spotify.com/v1/artists/4DdkRBBYG6Yk9Ka8tdJ9BW",
          id: "4DdkRBBYG6Yk9Ka8tdJ9BW",
          name: "Offset",
          type: "artist",
          uri: "spotify:artist:4DdkRBBYG6Yk9Ka8tdJ9BW"
        }
      ],
      disc_number: 1,
      duration_ms: 207108,
      explicit: true,
      external_ids: {
        isrc: "UKELY1800123"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/3WefHNGtjexZvi66ZEx9u4"
      },
      href: "https://api.spotify.com/v1/tracks/3WefHNGtjexZvi66ZEx9u4",
      id: "3WefHNGtjexZvi66ZEx9u4",
      is_local: false,
      is_playable: true,
      name: "Hurts Like Hell (feat. Offset)",
      popularity: 75,
      preview_url:
        "https://p.scdn.co/mp3-preview/709c7fd9ba3d3422d3c77ff9b70029746b7d9233?cid=774b29d4f13844c495f206cafdad9c86",
      track_number: 1,
      type: "track",
      uri: "spotify:track:3WefHNGtjexZvi66ZEx9u4"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/34v5MVKeQnIo0CWYMbbrPf"
            },
            href: "https://api.spotify.com/v1/artists/34v5MVKeQnIo0CWYMbbrPf",
            id: "34v5MVKeQnIo0CWYMbbrPf",
            name: "John Newman",
            type: "artist",
            uri: "spotify:artist:34v5MVKeQnIo0CWYMbbrPf"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/7ybleSrN0ZT3bci5WZ6puk"
        },
        href: "https://api.spotify.com/v1/albums/7ybleSrN0ZT3bci5WZ6puk",
        id: "7ybleSrN0ZT3bci5WZ6puk",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/6f2db2fe804514f78887cdeb4cf7cb483c196b3b",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/753a0664a170fa610735167bbdcbf3e524b86781",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/2e0e3f1f0b4b9cfe4e03928adfd8b6cae1533891",
            width: 64
          }
        ],
        name: "Tribute",
        release_date: "2013-01-01",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:7ybleSrN0ZT3bci5WZ6puk"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/34v5MVKeQnIo0CWYMbbrPf"
          },
          href: "https://api.spotify.com/v1/artists/34v5MVKeQnIo0CWYMbbrPf",
          id: "34v5MVKeQnIo0CWYMbbrPf",
          name: "John Newman",
          type: "artist",
          uri: "spotify:artist:34v5MVKeQnIo0CWYMbbrPf"
        }
      ],
      disc_number: 1,
      duration_ms: 239894,
      explicit: false,
      external_ids: {
        isrc: "GBUM71301538"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/5VSCgNlSmTV2Yq5lB40Eaw"
      },
      href: "https://api.spotify.com/v1/tracks/5VSCgNlSmTV2Yq5lB40Eaw",
      id: "5VSCgNlSmTV2Yq5lB40Eaw",
      is_local: false,
      is_playable: true,
      name: "Love Me Again",
      popularity: 63,
      preview_url: null,
      track_number: 2,
      type: "track",
      uri: "spotify:track:5VSCgNlSmTV2Yq5lB40Eaw"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/163tK9Wjr9P9DmM0AVK7lm"
            },
            href: "https://api.spotify.com/v1/artists/163tK9Wjr9P9DmM0AVK7lm",
            id: "163tK9Wjr9P9DmM0AVK7lm",
            name: "Lorde",
            type: "artist",
            uri: "spotify:artist:163tK9Wjr9P9DmM0AVK7lm"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/0rmhjUgoVa17LZuS8xWQ3v"
        },
        href: "https://api.spotify.com/v1/albums/0rmhjUgoVa17LZuS8xWQ3v",
        id: "0rmhjUgoVa17LZuS8xWQ3v",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/f06f0658ccc185e6e884fe4af76b217c4fe478c7",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/41ee9f770ffc9c4df6b60fb079613d16417e918c",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/f06052875eedef30d81cf6c67ee6ea74093f61e9",
            width: 64
          }
        ],
        name: "Pure Heroine",
        release_date: "2013-01-01",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:0rmhjUgoVa17LZuS8xWQ3v"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/163tK9Wjr9P9DmM0AVK7lm"
          },
          href: "https://api.spotify.com/v1/artists/163tK9Wjr9P9DmM0AVK7lm",
          id: "163tK9Wjr9P9DmM0AVK7lm",
          name: "Lorde",
          type: "artist",
          uri: "spotify:artist:163tK9Wjr9P9DmM0AVK7lm"
        }
      ],
      disc_number: 1,
      duration_ms: 190185,
      explicit: false,
      external_ids: {
        isrc: "NZUM71200031"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/2dLLR6qlu5UJ5gk0dKz0h3"
      },
      href: "https://api.spotify.com/v1/tracks/2dLLR6qlu5UJ5gk0dKz0h3",
      id: "2dLLR6qlu5UJ5gk0dKz0h3",
      is_local: false,
      is_playable: true,
      name: "Royals",
      popularity: 74,
      preview_url: null,
      track_number: 3,
      type: "track",
      uri: "spotify:track:2dLLR6qlu5UJ5gk0dKz0h3"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/2wUjUUtkb5lvLKcGKsKqsR"
            },
            href: "https://api.spotify.com/v1/artists/2wUjUUtkb5lvLKcGKsKqsR",
            id: "2wUjUUtkb5lvLKcGKsKqsR",
            name: "Alessia Cara",
            type: "artist",
            uri: "spotify:artist:2wUjUUtkb5lvLKcGKsKqsR"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/3rDbA12I5duZnlwakqDdZa"
        },
        href: "https://api.spotify.com/v1/albums/3rDbA12I5duZnlwakqDdZa",
        id: "3rDbA12I5duZnlwakqDdZa",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/20755ee01f5b4938209b61e918f790f38cd35f83",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/8ba083f8f23082a6254315d2327bda30c20214bc",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/efb1a00ab1e42333d033140af3ec5730d184f253",
            width: 64
          }
        ],
        name: "Know-It-All (Deluxe)",
        release_date: "2015-11-13",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:3rDbA12I5duZnlwakqDdZa"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/2wUjUUtkb5lvLKcGKsKqsR"
          },
          href: "https://api.spotify.com/v1/artists/2wUjUUtkb5lvLKcGKsKqsR",
          id: "2wUjUUtkb5lvLKcGKsKqsR",
          name: "Alessia Cara",
          type: "artist",
          uri: "spotify:artist:2wUjUUtkb5lvLKcGKsKqsR"
        }
      ],
      disc_number: 1,
      duration_ms: 188493,
      explicit: false,
      external_ids: {
        isrc: "USUM71504407"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/2ZyuwVvV6Z3XJaXIFbspeE"
      },
      href: "https://api.spotify.com/v1/tracks/2ZyuwVvV6Z3XJaXIFbspeE",
      id: "2ZyuwVvV6Z3XJaXIFbspeE",
      is_local: false,
      is_playable: true,
      name: "Wild Things",
      popularity: 63,
      preview_url: null,
      track_number: 6,
      type: "track",
      uri: "spotify:track:2ZyuwVvV6Z3XJaXIFbspeE"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/3WGpXCj9YhhfX11TToZcXP"
            },
            href: "https://api.spotify.com/v1/artists/3WGpXCj9YhhfX11TToZcXP",
            id: "3WGpXCj9YhhfX11TToZcXP",
            name: "Troye Sivan",
            type: "artist",
            uri: "spotify:artist:3WGpXCj9YhhfX11TToZcXP"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/3MYJYd73u0SatCnRVvRJ3M"
        },
        href: "https://api.spotify.com/v1/albums/3MYJYd73u0SatCnRVvRJ3M",
        id: "3MYJYd73u0SatCnRVvRJ3M",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/73636b424853d6619c4d29d9c9c19ffceee83077",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/25beed8bee91bbe74059f12d2944351464bdd6f0",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/f2eca45834b93376b859e16d9f45474029484e7e",
            width: 64
          }
        ],
        name: "Bloom",
        release_date: "2018-08-31",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:3MYJYd73u0SatCnRVvRJ3M"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/3WGpXCj9YhhfX11TToZcXP"
          },
          href: "https://api.spotify.com/v1/artists/3WGpXCj9YhhfX11TToZcXP",
          id: "3WGpXCj9YhhfX11TToZcXP",
          name: "Troye Sivan",
          type: "artist",
          uri: "spotify:artist:3WGpXCj9YhhfX11TToZcXP"
        }
      ],
      disc_number: 1,
      duration_ms: 208967,
      explicit: false,
      external_ids: {
        isrc: "AUUM71800526"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/4RoArPM0AsuW3h8hW8xtnr"
      },
      href: "https://api.spotify.com/v1/tracks/4RoArPM0AsuW3h8hW8xtnr",
      id: "4RoArPM0AsuW3h8hW8xtnr",
      is_local: false,
      is_playable: true,
      name: "Lucky Strike",
      popularity: 66,
      preview_url: null,
      track_number: 3,
      type: "track",
      uri: "spotify:track:4RoArPM0AsuW3h8hW8xtnr"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/4NHQUGzhtTLFvgF5SZesLK"
            },
            href: "https://api.spotify.com/v1/artists/4NHQUGzhtTLFvgF5SZesLK",
            id: "4NHQUGzhtTLFvgF5SZesLK",
            name: "Tove Lo",
            type: "artist",
            uri: "spotify:artist:4NHQUGzhtTLFvgF5SZesLK"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/1tuekzsMZQOuiMejKP6t2Y"
        },
        href: "https://api.spotify.com/v1/albums/1tuekzsMZQOuiMejKP6t2Y",
        id: "1tuekzsMZQOuiMejKP6t2Y",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/5259a2b0bf2a72d69ae0d0677be7daa1efc145f7",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/544f22d618493d4647bd00f6b27584896971d3bc",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/48276ccb52fe2451262554b69725aa4b4adfa248",
            width: 64
          }
        ],
        name: "Lady Wood",
        release_date: "2016-10-28",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:1tuekzsMZQOuiMejKP6t2Y"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/4NHQUGzhtTLFvgF5SZesLK"
          },
          href: "https://api.spotify.com/v1/artists/4NHQUGzhtTLFvgF5SZesLK",
          id: "4NHQUGzhtTLFvgF5SZesLK",
          name: "Tove Lo",
          type: "artist",
          uri: "spotify:artist:4NHQUGzhtTLFvgF5SZesLK"
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/137W8MRPWKqSmrBGDBFSop"
          },
          href: "https://api.spotify.com/v1/artists/137W8MRPWKqSmrBGDBFSop",
          id: "137W8MRPWKqSmrBGDBFSop",
          name: "Wiz Khalifa",
          type: "artist",
          uri: "spotify:artist:137W8MRPWKqSmrBGDBFSop"
        }
      ],
      disc_number: 1,
      duration_ms: 224507,
      explicit: true,
      external_ids: {
        isrc: "SEUM71601195"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/6IFwG4pnVPcpwX4kXFUbsV"
      },
      href: "https://api.spotify.com/v1/tracks/6IFwG4pnVPcpwX4kXFUbsV",
      id: "6IFwG4pnVPcpwX4kXFUbsV",
      is_local: false,
      is_playable: true,
      name: "Influence",
      popularity: 50,
      preview_url: null,
      track_number: 2,
      type: "track",
      uri: "spotify:track:6IFwG4pnVPcpwX4kXFUbsV"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/1BhWF9W2PngtPSyobKg0rP"
            },
            href: "https://api.spotify.com/v1/artists/1BhWF9W2PngtPSyobKg0rP",
            id: "1BhWF9W2PngtPSyobKg0rP",
            name: "Pia Mia",
            type: "artist",
            uri: "spotify:artist:1BhWF9W2PngtPSyobKg0rP"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/0jShwn8Ig9WsY0O9T7lIyh"
        },
        href: "https://api.spotify.com/v1/albums/0jShwn8Ig9WsY0O9T7lIyh",
        id: "0jShwn8Ig9WsY0O9T7lIyh",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/d97fdc152976606410f6096bdc38244cf9f5f4ac",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/84bc9933626329c11bfdfe09f5176bcc6c0344f8",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/578b7dc80f0e3a626001ad0fd9ac06bacff8c0d7",
            width: 64
          }
        ],
        name: "F**k With U",
        release_date: "2015-03-31",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:0jShwn8Ig9WsY0O9T7lIyh"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/1BhWF9W2PngtPSyobKg0rP"
          },
          href: "https://api.spotify.com/v1/artists/1BhWF9W2PngtPSyobKg0rP",
          id: "1BhWF9W2PngtPSyobKg0rP",
          name: "Pia Mia",
          type: "artist",
          uri: "spotify:artist:1BhWF9W2PngtPSyobKg0rP"
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/02kJSzxNuaWGqwubyUba0Z"
          },
          href: "https://api.spotify.com/v1/artists/02kJSzxNuaWGqwubyUba0Z",
          id: "02kJSzxNuaWGqwubyUba0Z",
          name: "G-Eazy",
          type: "artist",
          uri: "spotify:artist:02kJSzxNuaWGqwubyUba0Z"
        }
      ],
      disc_number: 1,
      duration_ms: 193802,
      explicit: true,
      external_ids: {
        isrc: "USUM71500834"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/59wcUkUV5EeMgvRl2cibwW"
      },
      href: "https://api.spotify.com/v1/tracks/59wcUkUV5EeMgvRl2cibwW",
      id: "59wcUkUV5EeMgvRl2cibwW",
      is_local: false,
      is_playable: true,
      name: "F**k With U",
      popularity: 60,
      preview_url: null,
      track_number: 1,
      type: "track",
      uri: "spotify:track:59wcUkUV5EeMgvRl2cibwW"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/2kRfqPViCqYdSGhYSM9R0Q"
            },
            href: "https://api.spotify.com/v1/artists/2kRfqPViCqYdSGhYSM9R0Q",
            id: "2kRfqPViCqYdSGhYSM9R0Q",
            name: "Madison Beer",
            type: "artist",
            uri: "spotify:artist:2kRfqPViCqYdSGhYSM9R0Q"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/0Uc4E6Y5h36pCjptIv0EZB"
        },
        href: "https://api.spotify.com/v1/albums/0Uc4E6Y5h36pCjptIv0EZB",
        id: "0Uc4E6Y5h36pCjptIv0EZB",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/a88f04bd8ba49fa0de928aeac2ab185a3e6cb99e",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/bbb3e8c2432ba5efa0bcba1b1c789edf10e2c098",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/c3288f5d1f409003296500621ce101cd66a4cb76",
            width: 64
          }
        ],
        name: "Dead",
        release_date: "2017-05-19",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:0Uc4E6Y5h36pCjptIv0EZB"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/2kRfqPViCqYdSGhYSM9R0Q"
          },
          href: "https://api.spotify.com/v1/artists/2kRfqPViCqYdSGhYSM9R0Q",
          id: "2kRfqPViCqYdSGhYSM9R0Q",
          name: "Madison Beer",
          type: "artist",
          uri: "spotify:artist:2kRfqPViCqYdSGhYSM9R0Q"
        }
      ],
      disc_number: 1,
      duration_ms: 194826,
      explicit: true,
      external_ids: {
        isrc: "UKELY1700020"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/5kApwSRDqF5CKclVLw1FBM"
      },
      href: "https://api.spotify.com/v1/tracks/5kApwSRDqF5CKclVLw1FBM",
      id: "5kApwSRDqF5CKclVLw1FBM",
      is_local: false,
      is_playable: true,
      name: "Dead",
      popularity: 64,
      preview_url:
        "https://p.scdn.co/mp3-preview/165bfaf36c6a647f897b55ffe304b8d13ea35f2d?cid=774b29d4f13844c495f206cafdad9c86",
      track_number: 1,
      type: "track",
      uri: "spotify:track:5kApwSRDqF5CKclVLw1FBM"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/5yG7ZAZafVaAlMTeBybKAL"
            },
            href: "https://api.spotify.com/v1/artists/5yG7ZAZafVaAlMTeBybKAL",
            id: "5yG7ZAZafVaAlMTeBybKAL",
            name: "Iggy Azalea",
            type: "artist",
            uri: "spotify:artist:5yG7ZAZafVaAlMTeBybKAL"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/3r51pg8BwnjazLJlW6dJIh"
        },
        href: "https://api.spotify.com/v1/albums/3r51pg8BwnjazLJlW6dJIh",
        id: "3r51pg8BwnjazLJlW6dJIh",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/2a2d26533def4c43fddfc51f59facfcd0e97ff04",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/0fb9e9d98444d9fea149c04c7c4d6b1cdff7635e",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/995534f69135fc7c72c5c5f79c4b030540af2bd5",
            width: 64
          }
        ],
        name: "The New Classic",
        release_date: "2014-01-01",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:3r51pg8BwnjazLJlW6dJIh"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/5yG7ZAZafVaAlMTeBybKAL"
          },
          href: "https://api.spotify.com/v1/artists/5yG7ZAZafVaAlMTeBybKAL",
          id: "5yG7ZAZafVaAlMTeBybKAL",
          name: "Iggy Azalea",
          type: "artist",
          uri: "spotify:artist:5yG7ZAZafVaAlMTeBybKAL"
        }
      ],
      disc_number: 1,
      duration_ms: 223196,
      explicit: true,
      external_ids: {
        isrc: "GBUM71301347"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/3yx6eryOZgO54bt3B671cn"
      },
      href: "https://api.spotify.com/v1/tracks/3yx6eryOZgO54bt3B671cn",
      id: "3yx6eryOZgO54bt3B671cn",
      is_local: false,
      is_playable: true,
      name: "Work",
      popularity: 56,
      preview_url: null,
      track_number: 7,
      type: "track",
      uri: "spotify:track:3yx6eryOZgO54bt3B671cn"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/26VFTg2z8YR0cCuwLzESi2"
            },
            href: "https://api.spotify.com/v1/artists/26VFTg2z8YR0cCuwLzESi2",
            id: "26VFTg2z8YR0cCuwLzESi2",
            name: "Halsey",
            type: "artist",
            uri: "spotify:artist:26VFTg2z8YR0cCuwLzESi2"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/7GjG91tyHQNGEHzKJaqOi0"
        },
        href: "https://api.spotify.com/v1/albums/7GjG91tyHQNGEHzKJaqOi0",
        id: "7GjG91tyHQNGEHzKJaqOi0",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/c8af4aa7e5b7a022d9cb49471eb0b9e367ca23a8",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/9373fab2538eefd183cdd8ae086726b7ddeee001",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/f5fc62b1bad0786614c6c3b257acc9d53022773d",
            width: 64
          }
        ],
        name: "hopeless fountain kingdom (Deluxe)",
        release_date: "2017-06-02",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:7GjG91tyHQNGEHzKJaqOi0"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/26VFTg2z8YR0cCuwLzESi2"
          },
          href: "https://api.spotify.com/v1/artists/26VFTg2z8YR0cCuwLzESi2",
          id: "26VFTg2z8YR0cCuwLzESi2",
          name: "Halsey",
          type: "artist",
          uri: "spotify:artist:26VFTg2z8YR0cCuwLzESi2"
        }
      ],
      disc_number: 1,
      duration_ms: 181279,
      explicit: false,
      external_ids: {
        isrc: "USUM71702220"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/7y9iMe8SOB6z3NoHE2OfXl"
      },
      href: "https://api.spotify.com/v1/tracks/7y9iMe8SOB6z3NoHE2OfXl",
      id: "7y9iMe8SOB6z3NoHE2OfXl",
      is_local: false,
      is_playable: true,
      name: "Bad At Love",
      popularity: 75,
      preview_url: null,
      track_number: 11,
      type: "track",
      uri: "spotify:track:7y9iMe8SOB6z3NoHE2OfXl"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/4bL2B6hmLlMWnUEZnorEtG"
            },
            href: "https://api.spotify.com/v1/artists/4bL2B6hmLlMWnUEZnorEtG",
            id: "4bL2B6hmLlMWnUEZnorEtG",
            name: "Felix Jaehn",
            type: "artist",
            uri: "spotify:artist:4bL2B6hmLlMWnUEZnorEtG"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/2S56F6bIk01HboGbJJJ1IQ"
        },
        href: "https://api.spotify.com/v1/albums/2S56F6bIk01HboGbJJJ1IQ",
        id: "2S56F6bIk01HboGbJJJ1IQ",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/060e6c9f236c9cabecc2e2480217df55a75f563f",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/70684630b37906e03606a0ce4f4c68890c48fb3c",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/c55a91136b16664125a144becd693cd3ae82cd38",
            width: 64
          }
        ],
        name: "I",
        release_date: "2018-02-16",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:2S56F6bIk01HboGbJJJ1IQ"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/4bL2B6hmLlMWnUEZnorEtG"
          },
          href: "https://api.spotify.com/v1/artists/4bL2B6hmLlMWnUEZnorEtG",
          id: "4bL2B6hmLlMWnUEZnorEtG",
          name: "Felix Jaehn",
          type: "artist",
          uri: "spotify:artist:4bL2B6hmLlMWnUEZnorEtG"
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/2TL8gYTNgD6nXkyuUdDrMg"
          },
          href: "https://api.spotify.com/v1/artists/2TL8gYTNgD6nXkyuUdDrMg",
          id: "2TL8gYTNgD6nXkyuUdDrMg",
          name: "Jasmine Thompson",
          type: "artist",
          uri: "spotify:artist:2TL8gYTNgD6nXkyuUdDrMg"
        }
      ],
      disc_number: 2,
      duration_ms: 186146,
      explicit: false,
      external_ids: {
        isrc: "DEUM71500425"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/3c8iiZGfEammKJuWTErE5x"
      },
      href: "https://api.spotify.com/v1/tracks/3c8iiZGfEammKJuWTErE5x",
      id: "3c8iiZGfEammKJuWTErE5x",
      is_local: false,
      is_playable: true,
      name: "Ain't Nobody (Loves Me Better) (feat. Jasmine Thompson)",
      popularity: 70,
      preview_url: null,
      track_number: 1,
      type: "track",
      uri: "spotify:track:3c8iiZGfEammKJuWTErE5x"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/163tK9Wjr9P9DmM0AVK7lm"
            },
            href: "https://api.spotify.com/v1/artists/163tK9Wjr9P9DmM0AVK7lm",
            id: "163tK9Wjr9P9DmM0AVK7lm",
            name: "Lorde",
            type: "artist",
            uri: "spotify:artist:163tK9Wjr9P9DmM0AVK7lm"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/2B87zXm9bOWvAJdkJBTpzF"
        },
        href: "https://api.spotify.com/v1/albums/2B87zXm9bOWvAJdkJBTpzF",
        id: "2B87zXm9bOWvAJdkJBTpzF",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/0623e4c3a9a49f50c07b89f02b7f303c78b4c6ab",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/3f085d0987f6bff578cb8351b3bd9bce2e4a9825",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/ec1611fcf300ce0220aabbe19c2bce53b6e36ed0",
            width: 64
          }
        ],
        name: "Melodrama",
        release_date: "2017-06-16",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:2B87zXm9bOWvAJdkJBTpzF"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/163tK9Wjr9P9DmM0AVK7lm"
          },
          href: "https://api.spotify.com/v1/artists/163tK9Wjr9P9DmM0AVK7lm",
          id: "163tK9Wjr9P9DmM0AVK7lm",
          name: "Lorde",
          type: "artist",
          uri: "spotify:artist:163tK9Wjr9P9DmM0AVK7lm"
        }
      ],
      disc_number: 1,
      duration_ms: 234652,
      explicit: false,
      external_ids: {
        isrc: "NZUM71700063"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/6ie2Bw3xLj2JcGowOlcMhb"
      },
      href: "https://api.spotify.com/v1/tracks/6ie2Bw3xLj2JcGowOlcMhb",
      id: "6ie2Bw3xLj2JcGowOlcMhb",
      is_local: false,
      is_playable: true,
      name: "Green Light",
      popularity: 70,
      preview_url: null,
      track_number: 1,
      type: "track",
      uri: "spotify:track:6ie2Bw3xLj2JcGowOlcMhb"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/3LjhVl7GzYsza1biQjTpaN"
            },
            href: "https://api.spotify.com/v1/artists/3LjhVl7GzYsza1biQjTpaN",
            id: "3LjhVl7GzYsza1biQjTpaN",
            name: "Hayley Kiyoko",
            type: "artist",
            uri: "spotify:artist:3LjhVl7GzYsza1biQjTpaN"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/2oRkkW6ZudviRBd6mx4CfL"
        },
        href: "https://api.spotify.com/v1/albums/2oRkkW6ZudviRBd6mx4CfL",
        id: "2oRkkW6ZudviRBd6mx4CfL",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/c72d42255bf2965481b7e07ca71e11b64fd8ad21",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/a7c3d0660dc7a13ba80d43148df1efb482160e89",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/7d802f532a29b8ec820bed79fd1238938b7b136d",
            width: 64
          }
        ],
        name: "Expectations",
        release_date: "2018-03-30",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:2oRkkW6ZudviRBd6mx4CfL"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/3LjhVl7GzYsza1biQjTpaN"
          },
          href: "https://api.spotify.com/v1/artists/3LjhVl7GzYsza1biQjTpaN",
          id: "3LjhVl7GzYsza1biQjTpaN",
          name: "Hayley Kiyoko",
          type: "artist",
          uri: "spotify:artist:3LjhVl7GzYsza1biQjTpaN"
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/0cGUm45nv7Z6M6qdXYQGTX"
          },
          href: "https://api.spotify.com/v1/artists/0cGUm45nv7Z6M6qdXYQGTX",
          id: "0cGUm45nv7Z6M6qdXYQGTX",
          name: "Kehlani",
          type: "artist",
          uri: "spotify:artist:0cGUm45nv7Z6M6qdXYQGTX"
        }
      ],
      disc_number: 1,
      duration_ms: 219520,
      explicit: false,
      external_ids: {
        isrc: "USAT21800189"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/5nFyaoBWwwMJ9fv33tZ2MB"
      },
      href: "https://api.spotify.com/v1/tracks/5nFyaoBWwwMJ9fv33tZ2MB",
      id: "5nFyaoBWwwMJ9fv33tZ2MB",
      is_local: false,
      is_playable: true,
      name: "What I Need (feat. Kehlani)",
      popularity: 64,
      preview_url:
        "https://p.scdn.co/mp3-preview/2b20bda7614d696ed0c9d339fad1b08379ba53fc?cid=774b29d4f13844c495f206cafdad9c86",
      track_number: 3,
      type: "track",
      uri: "spotify:track:5nFyaoBWwwMJ9fv33tZ2MB"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/6KcmUwBzfwLaYxdfIboqcp"
            },
            href: "https://api.spotify.com/v1/artists/6KcmUwBzfwLaYxdfIboqcp",
            id: "6KcmUwBzfwLaYxdfIboqcp",
            name: "Kyla La Grange",
            type: "artist",
            uri: "spotify:artist:6KcmUwBzfwLaYxdfIboqcp"
          },
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/23fqKkggKUBHNkbKtXEls4"
            },
            href: "https://api.spotify.com/v1/artists/23fqKkggKUBHNkbKtXEls4",
            id: "23fqKkggKUBHNkbKtXEls4",
            name: "Kygo",
            type: "artist",
            uri: "spotify:artist:23fqKkggKUBHNkbKtXEls4"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/2i4AbvFA9e6XszmH1x4G2h"
        },
        href: "https://api.spotify.com/v1/albums/2i4AbvFA9e6XszmH1x4G2h",
        id: "2i4AbvFA9e6XszmH1x4G2h",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/37f930dc0cd8b2ac1bb01f7661190d0ae8e751ea",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/40a3088056262388522db78ae22e967ccaaf298d",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/c91fd84807baa3d0afe1301114f72e20857fa44d",
            width: 64
          }
        ],
        name: "Cut Your Teeth (Kygo Remix)",
        release_date: "2014-03-14",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:2i4AbvFA9e6XszmH1x4G2h"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/6KcmUwBzfwLaYxdfIboqcp"
          },
          href: "https://api.spotify.com/v1/artists/6KcmUwBzfwLaYxdfIboqcp",
          id: "6KcmUwBzfwLaYxdfIboqcp",
          name: "Kyla La Grange",
          type: "artist",
          uri: "spotify:artist:6KcmUwBzfwLaYxdfIboqcp"
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/23fqKkggKUBHNkbKtXEls4"
          },
          href: "https://api.spotify.com/v1/artists/23fqKkggKUBHNkbKtXEls4",
          id: "23fqKkggKUBHNkbKtXEls4",
          name: "Kygo",
          type: "artist",
          uri: "spotify:artist:23fqKkggKUBHNkbKtXEls4"
        }
      ],
      disc_number: 1,
      duration_ms: 399013,
      explicit: false,
      external_ids: {
        isrc: "GBARL1400295"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/1y4Kln6VEjQMpmHW7j9GeY"
      },
      href: "https://api.spotify.com/v1/tracks/1y4Kln6VEjQMpmHW7j9GeY",
      id: "1y4Kln6VEjQMpmHW7j9GeY",
      is_local: false,
      is_playable: true,
      name: "Cut Your Teeth - Kygo Remix",
      popularity: 61,
      preview_url:
        "https://p.scdn.co/mp3-preview/5a6052090dd3213dedc68351838f67f9ebad35b0?cid=774b29d4f13844c495f206cafdad9c86",
      track_number: 1,
      type: "track",
      uri: "spotify:track:1y4Kln6VEjQMpmHW7j9GeY"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/66TrUkUZ3RM29dqeDQRgyA"
            },
            href: "https://api.spotify.com/v1/artists/66TrUkUZ3RM29dqeDQRgyA",
            id: "66TrUkUZ3RM29dqeDQRgyA",
            name: "Ella Eyre",
            type: "artist",
            uri: "spotify:artist:66TrUkUZ3RM29dqeDQRgyA"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/5J69OYtRXeI9dHDK2R95h5"
        },
        href: "https://api.spotify.com/v1/albums/5J69OYtRXeI9dHDK2R95h5",
        id: "5J69OYtRXeI9dHDK2R95h5",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/2952c3500a4904dadb7b40d935665258c97ebdc6",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/09651399d528f808e7916353501fbf428fdb3b12",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/152fc2d1e38f1d5ba5e67389d3e3ccfeca8dd646",
            width: 64
          }
        ],
        name: "Ella Eyre",
        release_date: "2015-01-12",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:5J69OYtRXeI9dHDK2R95h5"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/66TrUkUZ3RM29dqeDQRgyA"
          },
          href: "https://api.spotify.com/v1/artists/66TrUkUZ3RM29dqeDQRgyA",
          id: "66TrUkUZ3RM29dqeDQRgyA",
          name: "Ella Eyre",
          type: "artist",
          uri: "spotify:artist:66TrUkUZ3RM29dqeDQRgyA"
        }
      ],
      disc_number: 1,
      duration_ms: 183329,
      explicit: false,
      external_ids: {
        isrc: "GBUM71401947"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/5JO7yGfeJKYjbOXRRdNk64"
      },
      href: "https://api.spotify.com/v1/tracks/5JO7yGfeJKYjbOXRRdNk64",
      id: "5JO7yGfeJKYjbOXRRdNk64",
      is_local: false,
      is_playable: true,
      linked_from: {
        external_urls: {
          spotify: "https://open.spotify.com/track/4R6TWBDqFeJBQnBtha4zDh"
        },
        href: "https://api.spotify.com/v1/tracks/4R6TWBDqFeJBQnBtha4zDh",
        id: "4R6TWBDqFeJBQnBtha4zDh",
        type: "track",
        uri: "spotify:track:4R6TWBDqFeJBQnBtha4zDh"
      },
      name: "If I Go",
      popularity: 44,
      preview_url: null,
      track_number: 1,
      type: "track",
      uri: "spotify:track:5JO7yGfeJKYjbOXRRdNk64"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/6VD4UEUPvtsemqD3mmTqCR"
            },
            href: "https://api.spotify.com/v1/artists/6VD4UEUPvtsemqD3mmTqCR",
            id: "6VD4UEUPvtsemqD3mmTqCR",
            name: "Deorro",
            type: "artist",
            uri: "spotify:artist:6VD4UEUPvtsemqD3mmTqCR"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/2H2Cv9mrQq4PSzGLXmxkw3"
        },
        href: "https://api.spotify.com/v1/albums/2H2Cv9mrQq4PSzGLXmxkw3",
        id: "2H2Cv9mrQq4PSzGLXmxkw3",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/301504039c07ee7ac33047c09fe73b7a29760d40",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/9ee01cf6f67481e8beff2cbd72e3013e9d94c029",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/2f0af19f958deac60f145a83ce1c2e2b1c19d241",
            width: 64
          }
        ],
        name: "Perdoname (feat. DyCy & Adrian Delgado)",
        release_date: "2014-12-01",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:2H2Cv9mrQq4PSzGLXmxkw3"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/6VD4UEUPvtsemqD3mmTqCR"
          },
          href: "https://api.spotify.com/v1/artists/6VD4UEUPvtsemqD3mmTqCR",
          id: "6VD4UEUPvtsemqD3mmTqCR",
          name: "Deorro",
          type: "artist",
          uri: "spotify:artist:6VD4UEUPvtsemqD3mmTqCR"
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/2qdqYad94Al0HLIgmUGQM5"
          },
          href: "https://api.spotify.com/v1/artists/2qdqYad94Al0HLIgmUGQM5",
          id: "2qdqYad94Al0HLIgmUGQM5",
          name: "DyCy",
          type: "artist",
          uri: "spotify:artist:2qdqYad94Al0HLIgmUGQM5"
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/0D2VCZf17n5XVzgFAnO9cA"
          },
          href: "https://api.spotify.com/v1/artists/0D2VCZf17n5XVzgFAnO9cA",
          id: "0D2VCZf17n5XVzgFAnO9cA",
          name: "Adrian Delgado",
          type: "artist",
          uri: "spotify:artist:0D2VCZf17n5XVzgFAnO9cA"
        }
      ],
      disc_number: 1,
      duration_ms: 270053,
      explicit: false,
      external_ids: {
        isrc: "USUS11203096"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/5cR7culxUEPLhzIC0KWAH1"
      },
      href: "https://api.spotify.com/v1/tracks/5cR7culxUEPLhzIC0KWAH1",
      id: "5cR7culxUEPLhzIC0KWAH1",
      is_local: false,
      is_playable: true,
      name: "Perdoname (feat. DyCy & Adrian Delgado)",
      popularity: 61,
      preview_url:
        "https://p.scdn.co/mp3-preview/dbb76e6872b8a33af09a6cd8bc90ac54453ee027?cid=774b29d4f13844c495f206cafdad9c86",
      track_number: 1,
      type: "track",
      uri: "spotify:track:5cR7culxUEPLhzIC0KWAH1"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/4NHQUGzhtTLFvgF5SZesLK"
            },
            href: "https://api.spotify.com/v1/artists/4NHQUGzhtTLFvgF5SZesLK",
            id: "4NHQUGzhtTLFvgF5SZesLK",
            name: "Tove Lo",
            type: "artist",
            uri: "spotify:artist:4NHQUGzhtTLFvgF5SZesLK"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/1teQxZPWNILIowWpQA6qfm"
        },
        href: "https://api.spotify.com/v1/albums/1teQxZPWNILIowWpQA6qfm",
        id: "1teQxZPWNILIowWpQA6qfm",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/10e359ca5c32b609274c8fcde447fcd9c4cb31fe",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/003397ef673672fc37b9d9178c6e52e65fe48c31",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/214e5d43690c718994a429c6c814976657c51d32",
            width: 64
          }
        ],
        name: "Queen Of The Clouds",
        release_date: "2014-09-24",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:1teQxZPWNILIowWpQA6qfm"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/4NHQUGzhtTLFvgF5SZesLK"
          },
          href: "https://api.spotify.com/v1/artists/4NHQUGzhtTLFvgF5SZesLK",
          id: "4NHQUGzhtTLFvgF5SZesLK",
          name: "Tove Lo",
          type: "artist",
          uri: "spotify:artist:4NHQUGzhtTLFvgF5SZesLK"
        }
      ],
      disc_number: 1,
      duration_ms: 238426,
      explicit: true,
      external_ids: {
        isrc: "SEUM71401533"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/2tpfxAXiI52znho4WE3XFA"
      },
      href: "https://api.spotify.com/v1/tracks/2tpfxAXiI52znho4WE3XFA",
      id: "2tpfxAXiI52znho4WE3XFA",
      is_local: false,
      is_playable: true,
      linked_from: {
        external_urls: {
          spotify: "https://open.spotify.com/track/7cgu4JBW3hq1GwTM1ilkKQ"
        },
        href: "https://api.spotify.com/v1/tracks/7cgu4JBW3hq1GwTM1ilkKQ",
        id: "7cgu4JBW3hq1GwTM1ilkKQ",
        type: "track",
        uri: "spotify:track:7cgu4JBW3hq1GwTM1ilkKQ"
      },
      name: "Talking Body",
      popularity: 64,
      preview_url: null,
      track_number: 4,
      type: "track",
      uri: "spotify:track:2tpfxAXiI52znho4WE3XFA"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/1l8Fu6IkuTP0U5QetQJ5Xt"
            },
            href: "https://api.spotify.com/v1/artists/1l8Fu6IkuTP0U5QetQJ5Xt",
            id: "1l8Fu6IkuTP0U5QetQJ5Xt",
            name: "Fifth Harmony",
            type: "artist",
            uri: "spotify:artist:1l8Fu6IkuTP0U5QetQJ5Xt"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/0pF0oyuPNdOObniB1Ng0kW"
        },
        href: "https://api.spotify.com/v1/albums/0pF0oyuPNdOObniB1Ng0kW",
        id: "0pF0oyuPNdOObniB1Ng0kW",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/c6b8d1bdc7b02768d0b0478475768ad802ffbbae",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/3c54c9104cffee90367dae387123229a572602fa",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/53d306c042b3737d197158956f74b6e58c7dafee",
            width: 64
          }
        ],
        name: "7/27 (Deluxe)",
        release_date: "2016-05-27",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:0pF0oyuPNdOObniB1Ng0kW"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/1l8Fu6IkuTP0U5QetQJ5Xt"
          },
          href: "https://api.spotify.com/v1/artists/1l8Fu6IkuTP0U5QetQJ5Xt",
          id: "1l8Fu6IkuTP0U5QetQJ5Xt",
          name: "Fifth Harmony",
          type: "artist",
          uri: "spotify:artist:1l8Fu6IkuTP0U5QetQJ5Xt"
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/6PXS4YHDkKvl1wkIl4V8DL"
          },
          href: "https://api.spotify.com/v1/artists/6PXS4YHDkKvl1wkIl4V8DL",
          id: "6PXS4YHDkKvl1wkIl4V8DL",
          name: "Fetty Wap",
          type: "artist",
          uri: "spotify:artist:6PXS4YHDkKvl1wkIl4V8DL"
        }
      ],
      disc_number: 1,
      duration_ms: 210573,
      explicit: false,
      external_ids: {
        isrc: "USSM11601121"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/7nD9nN3jord9wWcfW3Gkcm"
      },
      href: "https://api.spotify.com/v1/tracks/7nD9nN3jord9wWcfW3Gkcm",
      id: "7nD9nN3jord9wWcfW3Gkcm",
      is_local: false,
      is_playable: true,
      name: "All In My Head (Flex) (feat. Fetty Wap)",
      popularity: 65,
      preview_url:
        "https://p.scdn.co/mp3-preview/c3c593d81c48111296aa5c777d8191305914845e?cid=774b29d4f13844c495f206cafdad9c86",
      track_number: 6,
      type: "track",
      uri: "spotify:track:7nD9nN3jord9wWcfW3Gkcm"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/0X2BH1fck6amBIoJhDVmmJ"
            },
            href: "https://api.spotify.com/v1/artists/0X2BH1fck6amBIoJhDVmmJ",
            id: "0X2BH1fck6amBIoJhDVmmJ",
            name: "Ellie Goulding",
            type: "artist",
            uri: "spotify:artist:0X2BH1fck6amBIoJhDVmmJ"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/1BhppSJet8I7mHzvacPpZD"
        },
        href: "https://api.spotify.com/v1/albums/1BhppSJet8I7mHzvacPpZD",
        id: "1BhppSJet8I7mHzvacPpZD",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/236ea2fb3add864e88483fa03077b6ed179d9869",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/31ffb3fbc455f72ec4445b0719b476bbc41b6005",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/5916a7f6125c1ff918edc3f5dcb650918b86acbb",
            width: 64
          }
        ],
        name: "Flux",
        release_date: "2019-03-01",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:1BhppSJet8I7mHzvacPpZD"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/0X2BH1fck6amBIoJhDVmmJ"
          },
          href: "https://api.spotify.com/v1/artists/0X2BH1fck6amBIoJhDVmmJ",
          id: "0X2BH1fck6amBIoJhDVmmJ",
          name: "Ellie Goulding",
          type: "artist",
          uri: "spotify:artist:0X2BH1fck6amBIoJhDVmmJ"
        }
      ],
      disc_number: 1,
      duration_ms: 229783,
      explicit: false,
      external_ids: {
        isrc: "GBUM71807638"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/4zb3kFL9fXrrfTwIY4CcDy"
      },
      href: "https://api.spotify.com/v1/tracks/4zb3kFL9fXrrfTwIY4CcDy",
      id: "4zb3kFL9fXrrfTwIY4CcDy",
      is_local: false,
      is_playable: true,
      name: "Flux",
      popularity: 69,
      preview_url: null,
      track_number: 1,
      type: "track",
      uri: "spotify:track:4zb3kFL9fXrrfTwIY4CcDy"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/6M2wZ9GZgrQXHCFfjv46we"
            },
            href: "https://api.spotify.com/v1/artists/6M2wZ9GZgrQXHCFfjv46we",
            id: "6M2wZ9GZgrQXHCFfjv46we",
            name: "Dua Lipa",
            type: "artist",
            uri: "spotify:artist:6M2wZ9GZgrQXHCFfjv46we"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/11u8ZjrMHunQFg7l3nfDaX"
        },
        href: "https://api.spotify.com/v1/albums/11u8ZjrMHunQFg7l3nfDaX",
        id: "11u8ZjrMHunQFg7l3nfDaX",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/566756191dc74fd250df8b26573c86067952d797",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/0cc4897dd281f59bb87ca84e4cbd059f3c5c5a44",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/56240e7ffafd8efbd1c5fd53d05d73b10fed6ed9",
            width: 64
          }
        ],
        name: 'Swan Song (From the Motion Picture "Alita: Battle Angel")',
        release_date: "2019-01-24",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:11u8ZjrMHunQFg7l3nfDaX"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/6M2wZ9GZgrQXHCFfjv46we"
          },
          href: "https://api.spotify.com/v1/artists/6M2wZ9GZgrQXHCFfjv46we",
          id: "6M2wZ9GZgrQXHCFfjv46we",
          name: "Dua Lipa",
          type: "artist",
          uri: "spotify:artist:6M2wZ9GZgrQXHCFfjv46we"
        }
      ],
      disc_number: 1,
      duration_ms: 182074,
      explicit: false,
      external_ids: {
        isrc: "GBAHT1900097"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/5600nq7TiBraBX2jobyJ3l"
      },
      href: "https://api.spotify.com/v1/tracks/5600nq7TiBraBX2jobyJ3l",
      id: "5600nq7TiBraBX2jobyJ3l",
      is_local: false,
      is_playable: true,
      name: 'Swan Song (From the Motion Picture "Alita: Battle Angel")',
      popularity: 69,
      preview_url:
        "https://p.scdn.co/mp3-preview/7831c93a13a52b26319278f2f483a8703e9939b4?cid=774b29d4f13844c495f206cafdad9c86",
      track_number: 1,
      type: "track",
      uri: "spotify:track:5600nq7TiBraBX2jobyJ3l"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/2FwJwEswyIUAljqgjNSHgP"
            },
            href: "https://api.spotify.com/v1/artists/2FwJwEswyIUAljqgjNSHgP",
            id: "2FwJwEswyIUAljqgjNSHgP",
            name: "Snakehips",
            type: "artist",
            uri: "spotify:artist:2FwJwEswyIUAljqgjNSHgP"
          },
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/4LAz9VRX8Nat9kvIzgkg2v"
            },
            href: "https://api.spotify.com/v1/artists/4LAz9VRX8Nat9kvIzgkg2v",
            id: "4LAz9VRX8Nat9kvIzgkg2v",
            name: "Rivers Cuomo",
            type: "artist",
            uri: "spotify:artist:4LAz9VRX8Nat9kvIzgkg2v"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/6PRuFI0MKWIhPvjzSFtUjy"
        },
        href: "https://api.spotify.com/v1/albums/6PRuFI0MKWIhPvjzSFtUjy",
        id: "6PRuFI0MKWIhPvjzSFtUjy",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/24c55a477782dd716a488878a6646d005e5e22c7",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/90b0ac2f501809b098784fd40ec953251aaa9bbd",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/fb96d252132f2dbfc333e309bede3bc5b9d28bc4",
            width: 64
          }
        ],
        name: "Gucci Rock N Rolla (feat. Rivers Cuomo & KYLE)",
        release_date: "2019-02-01",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:6PRuFI0MKWIhPvjzSFtUjy"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/2FwJwEswyIUAljqgjNSHgP"
          },
          href: "https://api.spotify.com/v1/artists/2FwJwEswyIUAljqgjNSHgP",
          id: "2FwJwEswyIUAljqgjNSHgP",
          name: "Snakehips",
          type: "artist",
          uri: "spotify:artist:2FwJwEswyIUAljqgjNSHgP"
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/4LAz9VRX8Nat9kvIzgkg2v"
          },
          href: "https://api.spotify.com/v1/artists/4LAz9VRX8Nat9kvIzgkg2v",
          id: "4LAz9VRX8Nat9kvIzgkg2v",
          name: "Rivers Cuomo",
          type: "artist",
          uri: "spotify:artist:4LAz9VRX8Nat9kvIzgkg2v"
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/4qBgvVog0wzW75IQ48mU7v"
          },
          href: "https://api.spotify.com/v1/artists/4qBgvVog0wzW75IQ48mU7v",
          id: "4qBgvVog0wzW75IQ48mU7v",
          name: "KYLE",
          type: "artist",
          uri: "spotify:artist:4qBgvVog0wzW75IQ48mU7v"
        }
      ],
      disc_number: 1,
      duration_ms: 159587,
      explicit: true,
      external_ids: {
        isrc: "GBARL1801816"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/2VBYFWgwIlJjyzidPTHQqp"
      },
      href: "https://api.spotify.com/v1/tracks/2VBYFWgwIlJjyzidPTHQqp",
      id: "2VBYFWgwIlJjyzidPTHQqp",
      is_local: false,
      is_playable: true,
      name: "Gucci Rock N Rolla (feat. Rivers Cuomo & KYLE)",
      popularity: 60,
      preview_url:
        "https://p.scdn.co/mp3-preview/d6100b033f8456ef709e6417c167c9e809dc40ee?cid=774b29d4f13844c495f206cafdad9c86",
      track_number: 1,
      type: "track",
      uri: "spotify:track:2VBYFWgwIlJjyzidPTHQqp"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/5r5Va4lVQ1zjEfbJSrmCsS"
            },
            href: "https://api.spotify.com/v1/artists/5r5Va4lVQ1zjEfbJSrmCsS",
            id: "5r5Va4lVQ1zjEfbJSrmCsS",
            name: "Broods",
            type: "artist",
            uri: "spotify:artist:5r5Va4lVQ1zjEfbJSrmCsS"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/3KzbSN2H2bqf9b8NKiCIL0"
        },
        href: "https://api.spotify.com/v1/albums/3KzbSN2H2bqf9b8NKiCIL0",
        id: "3KzbSN2H2bqf9b8NKiCIL0",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/c3bd58a71f8e764beb7ff9e69a9bf295d8fa9f12",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/b2fbe6ca624c072d1b042a353f3bb787cdb7e599",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/41dbf025f10902e592256f41b608960b63cf47d9",
            width: 64
          }
        ],
        name: "Don't Feed The Pop Monster",
        release_date: "2019-02-01",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:3KzbSN2H2bqf9b8NKiCIL0"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/5r5Va4lVQ1zjEfbJSrmCsS"
          },
          href: "https://api.spotify.com/v1/artists/5r5Va4lVQ1zjEfbJSrmCsS",
          id: "5r5Va4lVQ1zjEfbJSrmCsS",
          name: "Broods",
          type: "artist",
          uri: "spotify:artist:5r5Va4lVQ1zjEfbJSrmCsS"
        }
      ],
      disc_number: 1,
      duration_ms: 255397,
      explicit: false,
      external_ids: {
        isrc: "NZDY11800023"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/6M8qU2rDpeRQLE88DF2xtq"
      },
      href: "https://api.spotify.com/v1/tracks/6M8qU2rDpeRQLE88DF2xtq",
      id: "6M8qU2rDpeRQLE88DF2xtq",
      is_local: false,
      is_playable: true,
      name: "Peach",
      popularity: 63,
      preview_url:
        "https://p.scdn.co/mp3-preview/5f2d9e66f3c02facc0d9c8efd0209cfb9bbee931?cid=774b29d4f13844c495f206cafdad9c86",
      track_number: 3,
      type: "track",
      uri: "spotify:track:6M8qU2rDpeRQLE88DF2xtq"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/0LyfQWJT6nXafLPZqxe9Of"
            },
            href: "https://api.spotify.com/v1/artists/0LyfQWJT6nXafLPZqxe9Of",
            id: "0LyfQWJT6nXafLPZqxe9Of",
            name: "Various Artists",
            type: "artist",
            uri: "spotify:artist:0LyfQWJT6nXafLPZqxe9Of"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/5VML6S956h4YfoYPooqLEi"
        },
        href: "https://api.spotify.com/v1/albums/5VML6S956h4YfoYPooqLEi",
        id: "5VML6S956h4YfoYPooqLEi",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/9c1ba089336e2b67a7bb8d385bada87481852ede",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/90c27c1485f86ef894b3927c9cfba304da8f2a0c",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/b4f03fa9db537f51816af3e7a64f959921ee1d67",
            width: 64
          }
        ],
        name: "Fifty Shades Darker (Original Motion Picture Soundtrack)",
        release_date: "2017-02-10",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:5VML6S956h4YfoYPooqLEi"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/4NHQUGzhtTLFvgF5SZesLK"
          },
          href: "https://api.spotify.com/v1/artists/4NHQUGzhtTLFvgF5SZesLK",
          id: "4NHQUGzhtTLFvgF5SZesLK",
          name: "Tove Lo",
          type: "artist",
          uri: "spotify:artist:4NHQUGzhtTLFvgF5SZesLK"
        }
      ],
      disc_number: 1,
      duration_ms: 221440,
      explicit: false,
      external_ids: {
        isrc: "SEUM71601876"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/53UKOu8knQIiceqiPiudV3"
      },
      href: "https://api.spotify.com/v1/tracks/53UKOu8knQIiceqiPiudV3",
      id: "53UKOu8knQIiceqiPiudV3",
      is_local: false,
      is_playable: true,
      name: "Lies In The Dark",
      popularity: 53,
      preview_url: null,
      track_number: 4,
      type: "track",
      uri: "spotify:track:53UKOu8knQIiceqiPiudV3"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/6CwfuxIqcltXDGjfZsMd9A"
            },
            href: "https://api.spotify.com/v1/artists/6CwfuxIqcltXDGjfZsMd9A",
            id: "6CwfuxIqcltXDGjfZsMd9A",
            name: "MARINA",
            type: "artist",
            uri: "spotify:artist:6CwfuxIqcltXDGjfZsMd9A"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/0CUxS3KfHNuDpUUjbAewV3"
        },
        href: "https://api.spotify.com/v1/albums/0CUxS3KfHNuDpUUjbAewV3",
        id: "0CUxS3KfHNuDpUUjbAewV3",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/8ed2618fa7e905d9dc0763549dd298f66fb78cc5",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/321207538b159b3e11210400a77b651d183b34b6",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/cbe7aaaf84c69a1db38c52f02622a363b7407a24",
            width: 64
          }
        ],
        name: "LOVE + FEAR",
        release_date: "2019-04-26",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:0CUxS3KfHNuDpUUjbAewV3"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/6CwfuxIqcltXDGjfZsMd9A"
          },
          href: "https://api.spotify.com/v1/artists/6CwfuxIqcltXDGjfZsMd9A",
          id: "6CwfuxIqcltXDGjfZsMd9A",
          name: "MARINA",
          type: "artist",
          uri: "spotify:artist:6CwfuxIqcltXDGjfZsMd9A"
        }
      ],
      disc_number: 1,
      duration_ms: 246059,
      explicit: false,
      external_ids: {
        isrc: "GBAHS1900201"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/75pQd26khpV9EMVBRIeDm6"
      },
      href: "https://api.spotify.com/v1/tracks/75pQd26khpV9EMVBRIeDm6",
      id: "75pQd26khpV9EMVBRIeDm6",
      is_local: false,
      is_playable: true,
      name: "To Be Human",
      popularity: 59,
      preview_url:
        "https://p.scdn.co/mp3-preview/825aeabf5bc213ab82de9a77849c234b64d0ae14?cid=774b29d4f13844c495f206cafdad9c86",
      track_number: 7,
      type: "track",
      uri: "spotify:track:75pQd26khpV9EMVBRIeDm6"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/6oBm8HB0yfrIc9IHbxs6in"
            },
            href: "https://api.spotify.com/v1/artists/6oBm8HB0yfrIc9IHbxs6in",
            id: "6oBm8HB0yfrIc9IHbxs6in",
            name: "Lykke Li",
            type: "artist",
            uri: "spotify:artist:6oBm8HB0yfrIc9IHbxs6in"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/28AjCPTvrM4gQIiwo0CEOE"
        },
        href: "https://api.spotify.com/v1/albums/28AjCPTvrM4gQIiwo0CEOE",
        id: "28AjCPTvrM4gQIiwo0CEOE",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/742d1af62f7dad41db55a7d1183c06946dfa721d",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/0ee6b1f152c662257d2f158e820b9985a60bc23f",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/543b6f74b3b50e5268a087133772214e5e90827b",
            width: 64
          }
        ],
        name: "so sad so sexy",
        release_date: "2018-06-08",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:28AjCPTvrM4gQIiwo0CEOE"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/6oBm8HB0yfrIc9IHbxs6in"
          },
          href: "https://api.spotify.com/v1/artists/6oBm8HB0yfrIc9IHbxs6in",
          id: "6oBm8HB0yfrIc9IHbxs6in",
          name: "Lykke Li",
          type: "artist",
          uri: "spotify:artist:6oBm8HB0yfrIc9IHbxs6in"
        }
      ],
      disc_number: 1,
      duration_ms: 139840,
      explicit: true,
      external_ids: {
        isrc: "USRC11801750"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/0g4fzRkbLeCDUCoe5iUOcf"
      },
      href: "https://api.spotify.com/v1/tracks/0g4fzRkbLeCDUCoe5iUOcf",
      id: "0g4fzRkbLeCDUCoe5iUOcf",
      is_local: false,
      is_playable: true,
      name: "sex money feelings die",
      popularity: 66,
      preview_url:
        "https://p.scdn.co/mp3-preview/fd247b2ee0dd902941b6349759b93391014b97ec?cid=774b29d4f13844c495f206cafdad9c86",
      track_number: 6,
      type: "track",
      uri: "spotify:track:0g4fzRkbLeCDUCoe5iUOcf"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/0X2BH1fck6amBIoJhDVmmJ"
            },
            href: "https://api.spotify.com/v1/artists/0X2BH1fck6amBIoJhDVmmJ",
            id: "0X2BH1fck6amBIoJhDVmmJ",
            name: "Ellie Goulding",
            type: "artist",
            uri: "spotify:artist:0X2BH1fck6amBIoJhDVmmJ"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/6YIaqFvhOWma5gbjcB18Nu"
        },
        href: "https://api.spotify.com/v1/albums/6YIaqFvhOWma5gbjcB18Nu",
        id: "6YIaqFvhOWma5gbjcB18Nu",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/180502769c90fcccd6d01ecef5c7f00f9f56e909",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/f26da4f9e971059e9c8fe82ceffe56b7566d08fe",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/da64f855de759f9bcf362f8f8bda21350319d944",
            width: 64
          }
        ],
        name:
          'Still Falling For You (From "Bridget Jones\'s Baby" Original Motion Picture Soundtrack)',
        release_date: "2016-08-19",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:6YIaqFvhOWma5gbjcB18Nu"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/0X2BH1fck6amBIoJhDVmmJ"
          },
          href: "https://api.spotify.com/v1/artists/0X2BH1fck6amBIoJhDVmmJ",
          id: "0X2BH1fck6amBIoJhDVmmJ",
          name: "Ellie Goulding",
          type: "artist",
          uri: "spotify:artist:0X2BH1fck6amBIoJhDVmmJ"
        }
      ],
      disc_number: 1,
      duration_ms: 240867,
      explicit: false,
      external_ids: {
        isrc: "GBUM71603863"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/3odrUVQ9tvRpkC9II2oWzx"
      },
      href: "https://api.spotify.com/v1/tracks/3odrUVQ9tvRpkC9II2oWzx",
      id: "3odrUVQ9tvRpkC9II2oWzx",
      is_local: false,
      is_playable: true,
      name: 'Still Falling For You - From "Bridget Jones\'s Baby"',
      popularity: 64,
      preview_url: null,
      track_number: 1,
      type: "track",
      uri: "spotify:track:3odrUVQ9tvRpkC9II2oWzx"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/1IELhvOMg5VQlU7syRm6CS"
            },
            href: "https://api.spotify.com/v1/artists/1IELhvOMg5VQlU7syRm6CS",
            id: "1IELhvOMg5VQlU7syRm6CS",
            name: "CAZZETTE",
            type: "artist",
            uri: "spotify:artist:1IELhvOMg5VQlU7syRm6CS"
          },
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/5mKNjpx3SmjNqtxQTmuo9Z"
            },
            href: "https://api.spotify.com/v1/artists/5mKNjpx3SmjNqtxQTmuo9Z",
            id: "5mKNjpx3SmjNqtxQTmuo9Z",
            name: "The High",
            type: "artist",
            uri: "spotify:artist:5mKNjpx3SmjNqtxQTmuo9Z"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/03RGNAEAzMcff5wg8FzbE2"
        },
        href: "https://api.spotify.com/v1/albums/03RGNAEAzMcff5wg8FzbE2",
        id: "03RGNAEAzMcff5wg8FzbE2",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/9f3b5fde2699df52f96f0e0d89961ef8d47ce21b",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/ee10a178814dffae716cbd0c19dd2c1052de2c21",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/d71abf2bce89bc9f39112512bae288c545ab95c3",
            width: 64
          }
        ],
        name: "Sleepless",
        release_date: "2014-05-06",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:03RGNAEAzMcff5wg8FzbE2"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/1IELhvOMg5VQlU7syRm6CS"
          },
          href: "https://api.spotify.com/v1/artists/1IELhvOMg5VQlU7syRm6CS",
          id: "1IELhvOMg5VQlU7syRm6CS",
          name: "CAZZETTE",
          type: "artist",
          uri: "spotify:artist:1IELhvOMg5VQlU7syRm6CS"
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/5mKNjpx3SmjNqtxQTmuo9Z"
          },
          href: "https://api.spotify.com/v1/artists/5mKNjpx3SmjNqtxQTmuo9Z",
          id: "5mKNjpx3SmjNqtxQTmuo9Z",
          name: "The High",
          type: "artist",
          uri: "spotify:artist:5mKNjpx3SmjNqtxQTmuo9Z"
        }
      ],
      disc_number: 1,
      duration_ms: 221421,
      explicit: false,
      external_ids: {
        isrc: "CH3131340410"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/6zWpqo98M9Ai6TK3qmm55o"
      },
      href: "https://api.spotify.com/v1/tracks/6zWpqo98M9Ai6TK3qmm55o",
      id: "6zWpqo98M9Ai6TK3qmm55o",
      is_local: false,
      is_playable: true,
      name: "Sleepless - Radio Edit",
      popularity: 54,
      preview_url:
        "https://p.scdn.co/mp3-preview/6f0964c00cc600ffdd5afb2e73eba66f11afd416?cid=774b29d4f13844c495f206cafdad9c86",
      track_number: 1,
      type: "track",
      uri: "spotify:track:6zWpqo98M9Ai6TK3qmm55o"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/1IueXOQyABrMOprrzwQJWN"
            },
            href: "https://api.spotify.com/v1/artists/1IueXOQyABrMOprrzwQJWN",
            id: "1IueXOQyABrMOprrzwQJWN",
            name: "Sigala",
            type: "artist",
            uri: "spotify:artist:1IueXOQyABrMOprrzwQJWN"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/5rr0xAQfk01cPi1N37jX11"
        },
        href: "https://api.spotify.com/v1/albums/5rr0xAQfk01cPi1N37jX11",
        id: "5rr0xAQfk01cPi1N37jX11",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/3e95fde8b7cc244d295688d6c384e433a1f9bf9a",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/63b40fe6774c8ce8a36aba4d43aa7ccb4090ced2",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/5d0e8e9fac787ecca66f787d60cee4f2efdef25e",
            width: 64
          }
        ],
        name: "Brighter Days",
        release_date: "2018-09-28",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:5rr0xAQfk01cPi1N37jX11"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/1IueXOQyABrMOprrzwQJWN"
          },
          href: "https://api.spotify.com/v1/artists/1IueXOQyABrMOprrzwQJWN",
          id: "1IueXOQyABrMOprrzwQJWN",
          name: "Sigala",
          type: "artist",
          uri: "spotify:artist:1IueXOQyABrMOprrzwQJWN"
        }
      ],
      disc_number: 1,
      duration_ms: 229813,
      explicit: false,
      external_ids: {
        isrc: "GBCEN1500481"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/5s7xgzXtmY4gMjeSlgisjy"
      },
      href: "https://api.spotify.com/v1/tracks/5s7xgzXtmY4gMjeSlgisjy",
      id: "5s7xgzXtmY4gMjeSlgisjy",
      is_local: false,
      is_playable: true,
      name: "Easy Love",
      popularity: 64,
      preview_url:
        "https://p.scdn.co/mp3-preview/6d19019e3cf1fc3e8cf5ecc86029020d51151c7e?cid=774b29d4f13844c495f206cafdad9c86",
      track_number: 16,
      type: "track",
      uri: "spotify:track:5s7xgzXtmY4gMjeSlgisjy"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/5CCwRZC6euC8Odo6y9X8jr"
            },
            href: "https://api.spotify.com/v1/artists/5CCwRZC6euC8Odo6y9X8jr",
            id: "5CCwRZC6euC8Odo6y9X8jr",
            name: "Rita Ora",
            type: "artist",
            uri: "spotify:artist:5CCwRZC6euC8Odo6y9X8jr"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/3syh4e0H2YnXmzGzP5Rd3G"
        },
        href: "https://api.spotify.com/v1/albums/3syh4e0H2YnXmzGzP5Rd3G",
        id: "3syh4e0H2YnXmzGzP5Rd3G",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/a431109bfb8cffb84c37b006fa3620ef9777615d",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/5d3cb7b942ab96ae45076b1139721923b68e5d24",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/16aceb7631e50495b0ddca6f607d7e0ddf6a4972",
            width: 64
          }
        ],
        name: "Anywhere",
        release_date: "2017-10-20",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:3syh4e0H2YnXmzGzP5Rd3G"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/5CCwRZC6euC8Odo6y9X8jr"
          },
          href: "https://api.spotify.com/v1/artists/5CCwRZC6euC8Odo6y9X8jr",
          id: "5CCwRZC6euC8Odo6y9X8jr",
          name: "Rita Ora",
          type: "artist",
          uri: "spotify:artist:5CCwRZC6euC8Odo6y9X8jr"
        }
      ],
      disc_number: 1,
      duration_ms: 215064,
      explicit: false,
      external_ids: {
        isrc: "GBAHS1701111"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/7EI6Iki24tBHAMxtb4xQN2"
      },
      href: "https://api.spotify.com/v1/tracks/7EI6Iki24tBHAMxtb4xQN2",
      id: "7EI6Iki24tBHAMxtb4xQN2",
      is_local: false,
      is_playable: true,
      name: "Anywhere",
      popularity: 73,
      preview_url:
        "https://p.scdn.co/mp3-preview/ec024df926734cd185ae9fde8d081cc4d451c4d9?cid=774b29d4f13844c495f206cafdad9c86",
      track_number: 1,
      type: "track",
      uri: "spotify:track:7EI6Iki24tBHAMxtb4xQN2"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/3WGpXCj9YhhfX11TToZcXP"
            },
            href: "https://api.spotify.com/v1/artists/3WGpXCj9YhhfX11TToZcXP",
            id: "3WGpXCj9YhhfX11TToZcXP",
            name: "Troye Sivan",
            type: "artist",
            uri: "spotify:artist:3WGpXCj9YhhfX11TToZcXP"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/3MYJYd73u0SatCnRVvRJ3M"
        },
        href: "https://api.spotify.com/v1/albums/3MYJYd73u0SatCnRVvRJ3M",
        id: "3MYJYd73u0SatCnRVvRJ3M",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/73636b424853d6619c4d29d9c9c19ffceee83077",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/25beed8bee91bbe74059f12d2944351464bdd6f0",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/f2eca45834b93376b859e16d9f45474029484e7e",
            width: 64
          }
        ],
        name: "Bloom",
        release_date: "2018-08-31",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:3MYJYd73u0SatCnRVvRJ3M"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/3WGpXCj9YhhfX11TToZcXP"
          },
          href: "https://api.spotify.com/v1/artists/3WGpXCj9YhhfX11TToZcXP",
          id: "3WGpXCj9YhhfX11TToZcXP",
          name: "Troye Sivan",
          type: "artist",
          uri: "spotify:artist:3WGpXCj9YhhfX11TToZcXP"
        }
      ],
      disc_number: 1,
      duration_ms: 222096,
      explicit: false,
      external_ids: {
        isrc: "AUUM71800411"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/0oTyoTKEKMdF3rXcOLyEfN"
      },
      href: "https://api.spotify.com/v1/tracks/0oTyoTKEKMdF3rXcOLyEfN",
      id: "0oTyoTKEKMdF3rXcOLyEfN",
      is_local: false,
      is_playable: true,
      name: "Bloom",
      popularity: 67,
      preview_url: null,
      track_number: 2,
      type: "track",
      uri: "spotify:track:0oTyoTKEKMdF3rXcOLyEfN"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/4NHQUGzhtTLFvgF5SZesLK"
            },
            href: "https://api.spotify.com/v1/artists/4NHQUGzhtTLFvgF5SZesLK",
            id: "4NHQUGzhtTLFvgF5SZesLK",
            name: "Tove Lo",
            type: "artist",
            uri: "spotify:artist:4NHQUGzhtTLFvgF5SZesLK"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/4lzSIrSVUev9y5o8IuXxAo"
        },
        href: "https://api.spotify.com/v1/albums/4lzSIrSVUev9y5o8IuXxAo",
        id: "4lzSIrSVUev9y5o8IuXxAo",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/8e28607c8cf05f4b2a03c011d197959666846192",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/95b412c641c7cf6e9e28fec80ab4129f80f34884",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/361f1c3c28ec3383ef571ccde9903d460c1b569a",
            width: 64
          }
        ],
        name: "bitches (feat. Charli XCX, Icona Pop, Elliphant, ALMA)",
        release_date: "2018-06-07",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:4lzSIrSVUev9y5o8IuXxAo"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/4NHQUGzhtTLFvgF5SZesLK"
          },
          href: "https://api.spotify.com/v1/artists/4NHQUGzhtTLFvgF5SZesLK",
          id: "4NHQUGzhtTLFvgF5SZesLK",
          name: "Tove Lo",
          type: "artist",
          uri: "spotify:artist:4NHQUGzhtTLFvgF5SZesLK"
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/25uiPmTg16RbhZWAqwLBy5"
          },
          href: "https://api.spotify.com/v1/artists/25uiPmTg16RbhZWAqwLBy5",
          id: "25uiPmTg16RbhZWAqwLBy5",
          name: "Charli XCX",
          type: "artist",
          uri: "spotify:artist:25uiPmTg16RbhZWAqwLBy5"
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/1VBflYyxBhnDc9uVib98rw"
          },
          href: "https://api.spotify.com/v1/artists/1VBflYyxBhnDc9uVib98rw",
          id: "1VBflYyxBhnDc9uVib98rw",
          name: "Icona Pop",
          type: "artist",
          uri: "spotify:artist:1VBflYyxBhnDc9uVib98rw"
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/134GdR5tUtxJrf8cpsfpyY"
          },
          href: "https://api.spotify.com/v1/artists/134GdR5tUtxJrf8cpsfpyY",
          id: "134GdR5tUtxJrf8cpsfpyY",
          name: "Elliphant",
          type: "artist",
          uri: "spotify:artist:134GdR5tUtxJrf8cpsfpyY"
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/6c0mTNAxJxlp9HpKTUZwA8"
          },
          href: "https://api.spotify.com/v1/artists/6c0mTNAxJxlp9HpKTUZwA8",
          id: "6c0mTNAxJxlp9HpKTUZwA8",
          name: "ALMA",
          type: "artist",
          uri: "spotify:artist:6c0mTNAxJxlp9HpKTUZwA8"
        }
      ],
      disc_number: 1,
      duration_ms: 191795,
      explicit: true,
      external_ids: {
        isrc: "SEUM71800278"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/0S0rlh59DhpPheILyXYX76"
      },
      href: "https://api.spotify.com/v1/tracks/0S0rlh59DhpPheILyXYX76",
      id: "0S0rlh59DhpPheILyXYX76",
      is_local: false,
      is_playable: true,
      name: "bitches (feat. Charli XCX, Icona Pop, Elliphant, ALMA)",
      popularity: 54,
      preview_url: null,
      track_number: 1,
      type: "track",
      uri: "spotify:track:0S0rlh59DhpPheILyXYX76"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/1KP6TWI40m7p3QBTU6u2xo"
            },
            href: "https://api.spotify.com/v1/artists/1KP6TWI40m7p3QBTU6u2xo",
            id: "1KP6TWI40m7p3QBTU6u2xo",
            name: "BØRNS",
            type: "artist",
            uri: "spotify:artist:1KP6TWI40m7p3QBTU6u2xo"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/17l7MIu0Jh0tdgK7or9ovw"
        },
        href: "https://api.spotify.com/v1/albums/17l7MIu0Jh0tdgK7or9ovw",
        id: "17l7MIu0Jh0tdgK7or9ovw",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/e4e7f22f85d0ba17060c74cb4bb0f20f501a5d91",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/44ff5da65239b49d86156eb963322e5cd7509ac6",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/9f1b6752e2cb0fd74cea422e92761f5de4f55e0b",
            width: 64
          }
        ],
        name: "Dopamine",
        release_date: "2015-10-16",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:17l7MIu0Jh0tdgK7or9ovw"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/1KP6TWI40m7p3QBTU6u2xo"
          },
          href: "https://api.spotify.com/v1/artists/1KP6TWI40m7p3QBTU6u2xo",
          id: "1KP6TWI40m7p3QBTU6u2xo",
          name: "BØRNS",
          type: "artist",
          uri: "spotify:artist:1KP6TWI40m7p3QBTU6u2xo"
        }
      ],
      disc_number: 1,
      duration_ms: 260986,
      explicit: false,
      external_ids: {
        isrc: "USUM71510887"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/4AewKenHXKBt643p473xCk"
      },
      href: "https://api.spotify.com/v1/tracks/4AewKenHXKBt643p473xCk",
      id: "4AewKenHXKBt643p473xCk",
      is_local: false,
      is_playable: true,
      name: "American Money",
      popularity: 61,
      preview_url: null,
      track_number: 4,
      type: "track",
      uri: "spotify:track:4AewKenHXKBt643p473xCk"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/26VFTg2z8YR0cCuwLzESi2"
            },
            href: "https://api.spotify.com/v1/artists/26VFTg2z8YR0cCuwLzESi2",
            id: "26VFTg2z8YR0cCuwLzESi2",
            name: "Halsey",
            type: "artist",
            uri: "spotify:artist:26VFTg2z8YR0cCuwLzESi2"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/5OZJflQcQCdZLQjtUudCin"
        },
        href: "https://api.spotify.com/v1/albums/5OZJflQcQCdZLQjtUudCin",
        id: "5OZJflQcQCdZLQjtUudCin",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/2b5650c63fdcb3f867dd8d68d49d3cbe02ef491a",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/ee23bace59be7fa7f6e29ea0aaace106b33155cf",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/7f0e5b577fa4629fa82059bbbb0b3696aeb6c4d5",
            width: 64
          }
        ],
        name: "BADLANDS (Deluxe)",
        release_date: "2015-08-28",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:5OZJflQcQCdZLQjtUudCin"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/26VFTg2z8YR0cCuwLzESi2"
          },
          href: "https://api.spotify.com/v1/artists/26VFTg2z8YR0cCuwLzESi2",
          id: "26VFTg2z8YR0cCuwLzESi2",
          name: "Halsey",
          type: "artist",
          uri: "spotify:artist:26VFTg2z8YR0cCuwLzESi2"
        }
      ],
      disc_number: 1,
      duration_ms: 180088,
      explicit: true,
      external_ids: {
        isrc: "USUM71507635"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/5x2XIAdvFxWCwIOMNkbWUj"
      },
      href: "https://api.spotify.com/v1/tracks/5x2XIAdvFxWCwIOMNkbWUj",
      id: "5x2XIAdvFxWCwIOMNkbWUj",
      is_local: false,
      is_playable: true,
      name: "Young God",
      popularity: 58,
      preview_url: null,
      track_number: 15,
      type: "track",
      uri: "spotify:track:5x2XIAdvFxWCwIOMNkbWUj"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/1l8Fu6IkuTP0U5QetQJ5Xt"
            },
            href: "https://api.spotify.com/v1/artists/1l8Fu6IkuTP0U5QetQJ5Xt",
            id: "1l8Fu6IkuTP0U5QetQJ5Xt",
            name: "Fifth Harmony",
            type: "artist",
            uri: "spotify:artist:1l8Fu6IkuTP0U5QetQJ5Xt"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/0pF0oyuPNdOObniB1Ng0kW"
        },
        href: "https://api.spotify.com/v1/albums/0pF0oyuPNdOObniB1Ng0kW",
        id: "0pF0oyuPNdOObniB1Ng0kW",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/c6b8d1bdc7b02768d0b0478475768ad802ffbbae",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/3c54c9104cffee90367dae387123229a572602fa",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/53d306c042b3737d197158956f74b6e58c7dafee",
            width: 64
          }
        ],
        name: "7/27 (Deluxe)",
        release_date: "2016-05-27",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:0pF0oyuPNdOObniB1Ng0kW"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/1l8Fu6IkuTP0U5QetQJ5Xt"
          },
          href: "https://api.spotify.com/v1/artists/1l8Fu6IkuTP0U5QetQJ5Xt",
          id: "1l8Fu6IkuTP0U5QetQJ5Xt",
          name: "Fifth Harmony",
          type: "artist",
          uri: "spotify:artist:1l8Fu6IkuTP0U5QetQJ5Xt"
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/7c0XG5cIJTrrAgEC3ULPiq"
          },
          href: "https://api.spotify.com/v1/artists/7c0XG5cIJTrrAgEC3ULPiq",
          id: "7c0XG5cIJTrrAgEC3ULPiq",
          name: "Ty Dolla $ign",
          type: "artist",
          uri: "spotify:artist:7c0XG5cIJTrrAgEC3ULPiq"
        }
      ],
      disc_number: 1,
      duration_ms: 214480,
      explicit: false,
      external_ids: {
        isrc: "USSM11600251"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/4tCtwWceOPWzenK2HAIJSb"
      },
      href: "https://api.spotify.com/v1/tracks/4tCtwWceOPWzenK2HAIJSb",
      id: "4tCtwWceOPWzenK2HAIJSb",
      is_local: false,
      is_playable: true,
      name: "Work from Home (feat. Ty Dolla $ign)",
      popularity: 76,
      preview_url:
        "https://p.scdn.co/mp3-preview/b2d6e6ea9163eb361f5406f75264de490243964a?cid=774b29d4f13844c495f206cafdad9c86",
      track_number: 2,
      type: "track",
      uri: "spotify:track:4tCtwWceOPWzenK2HAIJSb"
    },
    {
      album: {
        album_type: "ALBUM",
        artists: [
          {
            external_urls: {
              spotify: "https://open.spotify.com/artist/5vBSrE1xujD2FXYRarbAXc"
            },
            href: "https://api.spotify.com/v1/artists/5vBSrE1xujD2FXYRarbAXc",
            id: "5vBSrE1xujD2FXYRarbAXc",
            name: "Years & Years",
            type: "artist",
            uri: "spotify:artist:5vBSrE1xujD2FXYRarbAXc"
          }
        ],
        external_urls: {
          spotify: "https://open.spotify.com/album/1OUGPngAngAxjliRlrAc6v"
        },
        href: "https://api.spotify.com/v1/albums/1OUGPngAngAxjliRlrAc6v",
        id: "1OUGPngAngAxjliRlrAc6v",
        images: [
          {
            height: 640,
            url:
              "https://i.scdn.co/image/51a420cc36bb1c0e9c5c6326174057bce769ac59",
            width: 640
          },
          {
            height: 300,
            url:
              "https://i.scdn.co/image/77314597ec1dcec33aa6df42f21c1c5cc606e99a",
            width: 300
          },
          {
            height: 64,
            url:
              "https://i.scdn.co/image/47ae5a1b62df8412c083b1e00ebae3714b0e239e",
            width: 64
          }
        ],
        name: "Palo Santo (Deluxe)",
        release_date: "2019-02-14",
        release_date_precision: "day",
        total_tracks: 0,
        type: "album",
        uri: "spotify:album:1OUGPngAngAxjliRlrAc6v"
      },
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/5vBSrE1xujD2FXYRarbAXc"
          },
          href: "https://api.spotify.com/v1/artists/5vBSrE1xujD2FXYRarbAXc",
          id: "5vBSrE1xujD2FXYRarbAXc",
          name: "Years & Years",
          type: "artist",
          uri: "spotify:artist:5vBSrE1xujD2FXYRarbAXc"
        }
      ],
      disc_number: 1,
      duration_ms: 193880,
      explicit: true,
      external_ids: {
        isrc: "GBUM71801550"
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/2zcPV7NeGyhSZJK0WjETx7"
      },
      href: "https://api.spotify.com/v1/tracks/2zcPV7NeGyhSZJK0WjETx7",
      id: "2zcPV7NeGyhSZJK0WjETx7",
      is_local: false,
      is_playable: true,
      name: "Karma",
      popularity: 57,
      preview_url: null,
      track_number: 4,
      type: "track",
      uri: "spotify:track:2zcPV7NeGyhSZJK0WjETx7"
    }
  ],
  seeds: [
    {
      initialPoolSize: 250,
      afterFilteringSize: 203,
      afterRelinkingSize: 203,
      id: "4NHQUGzhtTLFvgF5SZesLK",
      type: "ARTIST",
      href: "https://api.spotify.com/v1/artists/4NHQUGzhtTLFvgF5SZesLK"
    },
    {
      initialPoolSize: 249,
      afterFilteringSize: 79,
      afterRelinkingSize: 74,
      id: "0c6xIDDpzE81m2q797ordA",
      type: "TRACK",
      href: "https://api.spotify.com/v1/tracks/0c6xIDDpzE81m2q797ordA"
    }
  ]
};
