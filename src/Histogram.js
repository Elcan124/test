import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import TrackInvertedSlider from "./TrackInvertedSlider";
import Box from "@mui/material/Box";
import * as React from "react";
import { v4 as uuidv4 } from "uuid";

import ChartExample from "./ChartExample";
import { useEffect, useState } from "react";
import {
  List
} from "@mui/material";

function Histogram(props) {
  const [selected, setSelected] = useState([]);
  const [searchParams, setSearchParams] = useState([]);
  

  const handleDeleteItem = (uuid) => {
    setSearchParams((prevSelected) => {
      const newSelected = searchParams.filter((item) =>  item.uuid !== uuid);
      setSelected(newSelected)
      props.changePayload(newSelected)
      return newSelected;
    });
    
    
  };

  function handleChangeList(vals) {
    setSearchParams((prevSearchParams) => {
      const updatedParams = vals.map((item) => ({
        ...item,
        uuid:uuidv4(),
        descriptorId: props.nodeId,
      }));
     
      console.log("Əlavədən sonra:", updatedParams);
      props.changePayload(updatedParams)
      return updatedParams;
    });
  }

  

  const Item = ({ item, onDelete }) => {
    return (
      <li
        style={{ fontSize: 14, color: "black", listStyle: "none" }}
        key={item.id}
      >
        <span>{item.nodeId}/</span>
        <span>{item.minValue}-</span>
        <span>{item.maxValue}</span>
        <button
          type="button"
          className="btn-close"
          style={{ color: "red" }}
          aria-label="Close"
          onClick={onDelete}
        ></button>
      </li>
    );
  };

  return (
    <div className="App">
      {props.open && (
        <div>

          <h1>SALAALALA</h1>
          <div className={"col-12"}>
            <ChartExample
              selected={selected}
              onChange={handleChangeList}
              searchParams={searchParams}
              nodeId={props.nodeId}
              text={props.text}
            />
          </div>
          <div className={"col-12"}>
            <Box
              sx={{ width: 600, backgroundColor: "white", textAlign: "right" }}
            >
              <div className="wrapper">
                <List>
                  {searchParams.map((item) => (
                    <Item
                      key={item.uuid}
                      item={item}
                      onDelete={() => handleDeleteItem(item.uuid)}
                    />
                  ))}
                </List>
              </div>
            </Box>
          
          </div>
        </div>
      )}
    </div>
  );
}

export default Histogram;
