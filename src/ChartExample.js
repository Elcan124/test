import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import Service from "./service";
import axios from "axios";
import { Input } from "@material-ui/core";
import { Button, List, ListItem, ListItemText } from "@mui/material";


const ChartExample = (props) => {
  const [data, setData] = useState([]);
  const [selectedNode, setSelectedNode] = useState();
  const [selectedNodeMax, setselectedNodeMax] = useState();
  const [exampleValue, setExampleValue] = useState(selectedNode);
  const [exampleValueMax, setExampleValueMax] = useState(selectedNodeMax);
  const [rows, setRows] = useState([]);
  const [listItems, setListItems] = useState([]);
  const [nodeId, setnodeId] = useState()
  const [selected, setSelected] = useState([]);
  const [searchParams, setSearchParams] = useState([]);
  const [breadcrumb, setBreadcrumb] = useState([]);

  useEffect(() => {
    setnodeId(props.nodeId);
    setBreadcrumb(props.breadcrumbs)
    setListItems(props.listItems);
    retrieveHistogramData();
  },[props.nodeId, props.breadcrumbs]);

  useEffect(() => {
    setExampleValue(selectedNode);
    setExampleValueMax(selectedNodeMax);
  }, [selectedNode, selectedNodeMax]);

  const retrieveHistogramData = () => {
    if (props.nodeId) { 
      Service.getHistogramData(props.nodeId)
        .then((response) => {
          setData(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const handleAddRow = () => {
    if (exampleValue && exampleValueMax && nodeId) {
      const newRow = {
        descriptorId: nodeId,
        minValue: exampleValue,
        maxValue: exampleValueMax,
      };

      props.changePayload(newRow);

    
    } else {
      alert("Min value and max value cannot be empty.");
    }
  };

  const handleDeleteRow = (index) => {
    props.deleteRow(index);

  };

  
  const option = {
    legend: {
      top: "bottom",
      data: ["Intention"],
    },
    tooltip: {
      triggerOn: "click",
      position: function (pt) {
        return [pt[0], 60];
      },
    },
    xAxis: {
      type: "category",
      axisLabel: {
        show: false,
        interval: "none",
      },
      axisPointer: {
        lineStyle: {
          color: "black",
          width: 2,
        },
        handle: {
          show: true,
          color: "#000000",
          size: 35,
        },
        label: {
          show: true,
          backgroundColor: "#62BFFF",
          formatter: (params) => {
            let arr = params.value.split("-");
            setSelectedNode(arr[0]);
            setselectedNodeMax(arr[1]);
            return params.value;
          },
        },
      },
      data: data.map((datum) => `${datum.minValue}-${datum.maxValue}`),
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: true,
      },
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        name: "Count",
        data: data.map((datum) => datum.count),
        
        type: "bar",
        itemStyle: {
          color: (params) => {
            const value = params.data;
            if (value >= 0 && value <= 300) {
              return "#79B6FF"; // göy
            } else if (value > 300 && value <= 900) {
              return "#ADF611"; // yaşıl
            } else if (value > 900 && value <= 1500) {
              return "#FF923D"; // portağal
            } else if (value > 1500 && value <= 3000) {
              return "#FC3535"; // qırmızı
            } else if (value > 3000 && value <= 6000) {
              return "#D33BF5"; // benovseyi
            } else {
              return "#AD1E01"; // qırmızı +boz
            }
          },
        },
      },
    ],
  };

  return (
    <div className="app-container">
      <ReactEcharts option={option} />
     <Input type="hidden" name="descriptorId" value={props.nodeId} />
<Input type="hidden" name="minValue" value={selectedNode} />
<Input type="hidden" name="maxValue" value={selectedNodeMax} />

      <Input
  type="text"
  name="minValExample"
  value={exampleValue}
  onChange={(val) => {
    setExampleValue(val.target.value);
  }}
/>
<Input
  type="text"
  name="maxValExample"
  value={exampleValueMax}
  onChange={(val) => {
    setExampleValueMax(val.target.value);
  }}
/>
<List>
        {props.listItems.map((item, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`${breadcrumb.join(" > ")} > Min Value: ${item.minValue} - Max Value: ${item.maxValue}`}
            />
            <Button
              onClick={() => handleDeleteRow(index)}
              variant="outlined"
              color="error"
            >
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
      <Button onClick={handleAddRow} variant="outlined" color="success">
        Add
      </Button>
    </div>
  );
};

export default ChartExample;