import React, { useEffect, useState } from "react";
import $ from "jquery";
import "jstree";
import "jstree/dist/themes/default/style.css";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "./TreeComponent.css";

import "bootstrap/dist/css/bootstrap.min.css";
import Histogram from "./Histogram";

function TreeComponent() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [nodeText, setNodeText] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [searched, setSearched] = useState(false);
  const [openHistogram, setOpenHistogram] = useState(false);
  const [payload, setPayload] = useState([]);
  const [nodeId, setNodeId] = useState(null);


  useEffect(() => {
    initializeTree();

    return () => {
      destroyTree();
    };
  }, []);

  const  changePayload=(searchParams)=>{
    setPayload(searchParams);
  }

  function handleNodeId(value) {
    const arr = value.split("_");
    let a = arr.slice(-1)[0];
    return a;
  }

  const initializeTree = () => {
    fetch("http://localhost:8080/allFeatureDescriptorWithStructure")
      .then((response) => response.json())
      .then((data) => {
        $("#feature-tree")
          .jstree({
            core: {
              data: data,
              check_callback: true,
              themes: {
                name: "default",
                responsive: true,
                icons: false,
              },
            },
            plugins: ["checkbox", "wholerow", "types"],
            types: {
              "#": {
                icon: "far fa-folder",
              },
            },
          })
          .on("select_node.jstree", (e, data) => {
            const nodeId = handleNodeId(data.node.id);
            setSelectedNodeId(nodeId);
            setNodeText(data.node.text);
            setOpenHistogram(true);
            setNodeId(nodeId); 
          });
      });
  };

  const destroyTree = () => {
    $("#feature-tree").jstree("destroy");
  };

  const handleSearch = () => {
    const filteredRules = [];
    const selectedNodes = $("#feature-tree").jstree(true).get_selected("full", true);
    for (let i = 0; i < selectedNodes.length; i++) {
      const arr = selectedNodes[i].id.split("_");
      const lastElement = arr[arr.length - 1];
      filteredRules.push(lastElement);
    }
    let query=payload;
    // let payload = [
    //   {
    //     descriptorId: 223,
    //     minValue: 0.0,
    //     maxValue: 12.12,
    //   },
    // ];

    // const requestBody = {
    //   draw: 100,
    //   columns: [],
    //   order: [],
    //   start: 0,
    //   length: 10,
    //   search: null,
    //   extra: payload,
    // };

    fetch("http://localhost:8080/findPersons/10/10", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    })
      .then((response) => response.json())
      .then((data) => {
        //alert(JSON.stringify(data));
        setUsers(data);
        setSearched(true);
        setSelectedTab(1);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleTabSelect = (index) => {
    if (index === selectedTab && index === 1) {
      
      return;
    }
    setSelectedTab(index);
  };

  const renderTableHeader = () => {
    return (
      <thead>
        <tr>
          <th>PIN</th>
          <th>App Number</th>
          <th>Birth Date</th>
          <th>Count</th>
          <th>Photo</th>
        </tr>
      </thead>
    );
  };

  const renderTableRows = () => {
    return (
      <tbody>
        {users.map((user) => {
          const imageUrl = `http://localhost:8080/getImageByApplicationNumberId/${user.applicationNumber}`;

          return (
            <tr key={user.pin}>
              <td>{user.pin}</td>
              <td>{user.applicationNumber}</td>
              <td>{user.birthDate}</td>
              <td>{user.countrecord}</td>
              <td className="image">
                <img src={imageUrl} alt="Person" className="img-thumbnail" />
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  };

  return (
    <div className="container">
      <div className="left-column">
      <div id="feature-tree"></div>
      </div>

      <div className="right-column">
        <Tabs selectedIndex={selectedTab} onSelect={handleTabSelect}>
        <TabList className="custom-tab-list">
            <Tab>Selected Node</Tab>
            <Tab>Person Search</Tab>
          </TabList>

          <TabPanel>
            <h3>
              Selected Node: {nodeText} {selectedNodeId}
            </h3>
            <Histogram
              open={openHistogram}
              nodeId={selectedNodeId} // Pass the selected nodeId to the Histogram component
              text={nodeText}
              changePayload={changePayload}
            />
            <button id="btn-search" className="btn btn-primary btn-sm mt-3" onClick={handleSearch}>
              Search
            </button>
          </TabPanel>

          <TabPanel>
            <div className="person-search">
              <div className="image-div">
                <div className="col-sm-9">
                  {searched ? (
                    <table className="table">
                      {renderTableHeader()}
                      {renderTableRows()}
                    </table>
                  ) : (
                    <p>No search results yet.</p>
                  )}
                </div>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}
export default TreeComponent;