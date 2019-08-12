import React from "react";
import Grid from "@material-ui/core/Grid";

const CoverGrid = props => (
  <Grid container spacing={1}>
    {props.items.map(x => {
      const imageUrl = (x.album.images && x.album.images[1].url) || "";
      return (
        <Grid item>
          <img
            alt=""
            src={imageUrl}
            onMouseOver={() => props.onMouseOver(x)}
            onMouseOut={props.onMouseOut}
            width="96px"
            height="96px"
          />
        </Grid>
      );
    })}
  </Grid>
);

export default CoverGrid;
