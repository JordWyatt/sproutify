import React, { Component } from "react";
import CoverGrid from "../CoverGrid/CoverGrid";
import TrackCard from "../TrackCard/TrackCard";
import Grid from "@material-ui/core/Grid";

const Explorer = props => (
  <div>
    <Grid container>
      <Grid item xs={8}>
        <CoverGrid
          items={props.items}
          onMouseOver={props.onMouseOver}
          onMouseOut={props.onMouseOut}
        />
      </Grid>
      <Grid item xs={4}>
        {props.selectedTrack.id && <TrackCard track={props.selectedTrack} />}
      </Grid>
    </Grid>
  </div>
);

export default Explorer;
