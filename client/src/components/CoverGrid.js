import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { getImageUrl } from "../utils";
const CoverGrid = props => (
  <Grid container spacing={1}>
    {props.items.map(x => {
      const imageUrl = getImageUrl(x);
      return (
        <Grid item key={imageUrl}>
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

CoverGrid.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func
};
