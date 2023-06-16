import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import Service from "./service";
import axios from "axios";

const ChartExample = (props) => {
    const [data, setData] = useState([]);
    const [selectedNode, setSelectedNode] = useState()
    const [selectedNodeMax, setselectedNodeMax] = useState()
  
    useEffect(() => {
      retrieveHistogramData();
    }, []);
  
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
      <input type="text" name="minVal" value={selectedNode} onChange={(val)=>{setSelectedNode(val)}}/>

      <input type="text" name="maxVal" value={selectedNodeMax}/>
      
     <button></button>
    </div>

  );
};

export default ChartExample;
