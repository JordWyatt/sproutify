import React from "react";
import Chip from "@material-ui/core/Chip";

const truncate = (string, maxLength) =>
  string.length > maxLength ? `${string.substr(0, maxLength - 3)}...` : string;

const Selections = props => {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "5px" }}>
      {props.selections.map(data => (
        <Chip
          key={data.id}
          id={data.id}
          //icon={icon}
          style={{ margin: "5pxc" }}
          label={truncate(data.label, 24)}
          onDelete={() => props.handleDelete(data)}
        />
      ))}
    </div>
  );
};

export default Selections;
