import React, { useEffect, useState } from "react";
import $ from "jquery";
import "jstree";
import "jstree/dist/themes/default/style.css";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "./TreeComponent.css";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import "bootstrap/dist/css/bootstrap.min.css";
import Histogram from "./Histogram";
import ChartExample from "./ChartExample";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import { Pagination } from "@mui/lab";
import { Select, MenuItem } from "@mui/material";
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
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [listItems, setListItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [personsPerPage, setPersonsPerPage] = useState(10);
  const personsPerPageOptions = [10, 25, 50, 100];
  const [bread, setBread] = useState([])

  useEffect(() => {
    initializeTree();

    return () => {
      destroyTree();
    };
  }, []);

  const changePayload = (searchParams) => {
    setPayload(searchParams);
  };

  function handleNodeId(value) {
    const arr = value.split("_");
    return arr;
  }

  const handleAddRow = (newRow) => {
    const updatedListItems = [...listItems, newRow];
    setListItems(updatedListItems);
    changePayload(updatedListItems);
  };

  const handleDeleteRow = (index) => {
    const updatedListItems = [...listItems];
    updatedListItems.splice(index, 1);
    setListItems(updatedListItems);
    changePayload(updatedListItems);
  };
  const initializeTree = () => {
    fetch("http://localhost:8080/allFeatureDescriptorWithStructure")
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter((node) => node.text !== "Future");

        $("#feature-tree")
          .jstree({
            core: {
              data: filteredData,
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
            const nodeIds = handleNodeId(data.node.id);
            setSelectedNodeId(nodeIds[nodeIds.length - 1]);
            setNodeText(data.node.text);

            setOpenHistogram(true);
            setNodeId(nodeIds[nodeIds.length - 1]);

            const parentTexts = data.node.parents
              .map((parentId) => {
                const parentNode = data.instance.get_node(parentId);
                return parentNode.text;
              })
              .reverse();
            console.log("salam salam salam");
            setBreadcrumbs([...parentTexts, data.node.text]);
          });
      });
  };

  const destroyTree = () => {
    $("#feature-tree").jstree("destroy");
  };

  const handleSearch = () => {
    const filteredRules = [];
    const selectedNodes = $("#feature-tree")
      .jstree(true)
      .get_selected("full", true);
    for (let i = 0; i < selectedNodes.length; i++) {
      const arr = selectedNodes[i].id.split("_");
      const lastElement = arr[arr.length - 1];
      filteredRules.push(lastElement);
    }

    let query = payload;

    const limitCount = 1000;
    const offsetCount = (page - 1) * personsPerPage;

    fetch(`http://localhost:8080/findPersons/${limitCount}/${offsetCount}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setSearched(true);
        setSelectedTab(1);

        const totalCount = data.length > 0 ? data[0].totalCount : 0;
        const totalPages = Math.ceil(totalCount / limitCount);
        setTotalPages(totalPages);

        if (page > totalPages) {
          setPage(1);
        }
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
    const startIndex = (page - 1) * personsPerPage;
    return (
      <tbody>
        {users.slice(startIndex, startIndex + personsPerPage).map((user) => {
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
            <Tab>
              <span>Selected Node</span>
              <TouchAppIcon />
            </Tab>
            <Tab>
              <span>Person Search</span>
              <PersonSearchIcon />
            </Tab>
          </TabList>

          <TabPanel>
            <Breadcrumbs
              separator={<ArrowForwardIosIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              {breadcrumbs.map((breadcrumb, index) => (
                <span key={index}>{breadcrumb}</span>
              ))}
            </Breadcrumbs>
            <ChartExample
              selected={selectedNodeId}
              changePayload={handleAddRow}
              nodeId={selectedNodeId}
              text={nodeText}
              breadcrumbs={breadcrumbs}
              listItems={listItems}
              deleteRow={handleDeleteRow}
            />
            <button
              id="btn-search"
              className="btn btn-primary btn-sm mt-3"
              onClick={handleSearch}
            >
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

                  <div>
                    <span>Persons per page:</span>
                    <Select
                      value={personsPerPage}
                      onChange={(e) =>
                        setPersonsPerPage(parseInt(e.target.value))
                      }
                      sx={{
                        borderRadius: "29px",
                        minWidth: 95,
                        marginLeft: "10px",
                        paddingTop: "2px",
                        paddingBottom: "2px",
                        paddingLeft: "8px",
                        paddingRight: "8px",
                        width: "100px",
                        height: "31px",
                      }}
                    >
                      {personsPerPageOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>

                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    color="primary"
                    size="small"
                    className="pagination"
                  />
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
