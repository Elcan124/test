import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import Service from "./service";
import axios from "axios";
import { Input } from "@material-ui/core";
import { Button } from "@mui/material";


const ChartExample = ({ nodeId }) => {
  const [data, setData] = useState([]);
  const [selectedNode, setSelectedNode] = useState()
    const [selectedNodeMax, setselectedNodeMax] = useState();
    const [exampleValue,setExampleValue]=useState(selectedNode);
    const [exampleValueMax,setExampleValueMax]=useState(selectedNodeMax);

  useEffect(() => {
    retrieveHistogramData();
  }, [nodeId]); // Fetch data whenever nodeId changes
  useEffect(() => {
    setExampleValue(selectedNode);
    setExampleValueMax(selectedNodeMax)
  }, [selectedNode,selectedNodeMax]);

  const retrieveHistogramData = () => {
    if (nodeId) {
      Service.getHistogramData(nodeId)
        .then((response) => {
          setData(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
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
        // value: "0",
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
          backgroundColor: "red",
          formatter:(params)=>{
            let arr = params.value.split("-");
            setSelectedNode(arr[0]);
            setselectedNodeMax(arr[1])
              return params.value;
          }
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
          color: (params) => (params.data > 200 ? "green" : "blue"),
        },
      },
    ],
  };

  return (
    <div className="app-container">
      <ReactEcharts option={option} />
      <Input type="hidden" name="minVal" value={selectedNode} />
      <Input type="hidden" name="maxVal" value={selectedNodeMax} />
      <Input type="text" name="minValExample" value={exampleValue} onChange={(val)=>{setExampleValue(val.target.value)}}/>
      <Input type="text" name="maxValExample" value={exampleValueMax} onChange={(val)=>{setExampleValueMax(val.target.value)}}/>

      <Button onClick={()=>{return null}} variant={"outlined"} color={"success"} >Add</Button>
      
     <button></button>
    </div>

  );
};

export default ChartExample;
