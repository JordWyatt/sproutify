import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const TrackCard = props => {
  const { track } = props;
  return (
    <Card style={{ position: "fixed" }}>
      <CardActionArea>
        <CardMedia component="img" image={track.imageUrl} title={track.name} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {track.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TrackCard;
