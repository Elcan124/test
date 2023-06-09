import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
//import ChartExample from "./components/ChartExample";
import TrackInvertedSlider from "./TrackInvertedSlider";
import Box from "@mui/material/Box";
import * as React from "react";

import ChartExample from "./ChartExample";
import {useEffect, useState} from "react";
import {List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
//import ChartExample from "./components/ChartExample";

function Histogram(props) {

    const [selected, setSelected] = useState();
    const[searchParams,setSearchParams]=useState([]);







    const onChangeVolume=(val)=>{
       setSelected(val)
    }

    function handleChangeList(vals){
        setSearchParams(vals.concat(""));
       // alert(JSON.stringify(searchParams))

    }



    const Item = ({item}) => {
        if (item.id) {
            return (
                <li style={{fontSize: 14, color: "black", listStyle: "none"}}>

                    <span>{item.id}/</span>
                    <span>{item.minValue}-</span>
                    <span>{item.maxValue}</span>
                    <button type="button" className="btn-close" style={{color: "red"}} aria-label="Close"></button>

                </li>)
        }

    };

  return (

    <div className="App">
        {props.open &&
      <header className="App-header">
          <div className={"row"}>
              <div className={"col-6"}>
                    <ChartExample
                    selected={selected}
                    onChange={handleChangeList}
                    nodeId={props.nodeId}
                    text={props.text}
                    />
              
                    <TrackInvertedSlider
                        olcu={[20,42]}
                        sendToParent={onChangeVolume}
                    />

              </div>
              <div className={"col-6"} >

                  <Box sx={{ width: 600,backgroundColor:"white",textAlign:"right" }}>
                      <div className="wrapper">
                          <List>
                              {searchParams.map((item) => {
                                
                                  return (<Item key={item.id} item={item}/>)

                              })}


                          </List>
                      </div>
                  </Box>
              </div>
          </div>
      </header>
}
    </div>
  );

    
}
export default Histogram;