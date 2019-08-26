import React from "react";
import Grid from "@material-ui/core/Grid";
import { getImageUrl } from "../../utils";
const CoverGrid = props => (
  <Grid container spacing={1}>
    {props.items.map(x => {
      const imageUrl = getImageUrl(x);
      return (
        <Grid item>
          <img
            key={imageUrl}
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
