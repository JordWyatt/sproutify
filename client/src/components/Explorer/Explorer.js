import React, { Component } from "react";
import { Container } from "@material-ui/core";
import { trackTransform } from "../../utils";
import CoverGrid from "../CoverGrid/CoverGrid";
import TrackCard from "../TrackCard/TrackCard";
import Grid from "@material-ui/core/Grid";

const MAX_SELECTIONS = 5;

class Explorer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTrack: {},
      playing: false
    };
    this.onMouseOverTrack = this.onMouseOverTrack.bind(this);
    this.onMouseOutTrack = this.onMouseOutTrack.bind(this);
  }

  onMouseOverTrack(selectedTrack) {
    const { selectedTrack: existingSelectedTrack } = this.state;
    if (selectedTrack.id !== existingSelectedTrack.id) {
      this.setState({
        selectedTrack: trackTransform(selectedTrack),
        playing: true
      });
    } else {
      this.setState({ playing: true });
    }
  }

  onMouseOutTrack() {
    this.setState({ playing: false, selectedTrack: {} });
  }

  render() {
    return (
      <div>
        <Grid container>
          <Grid item xs={8}>
            <CoverGrid
              items={this.props.items}
              onMouseOver={this.onMouseOverTrack}
              onMouseOut={this.onMouseOutTrack}
            ></CoverGrid>
          </Grid>
          <Grid item xs={4}>
            {this.state.playing && (
              <TrackCard track={this.state.selectedTrack} />
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}
export default Explorer;
