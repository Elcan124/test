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

import {
  TableContainer,
  Select,
  MenuItem,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import faceIcon from "./images/face.png";
import { Pagination, Button } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import PaginationItem from "@mui/material/PaginationItem";
import Fancybox  from "./Fancybox";
import "@fancyapps/ui/dist/fancybox/fancybox.css";


function TreeComponent() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [nodeText, setNodeText] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openHistogram, setOpenHistogram] = useState(false);
  const [payload, setPayload] = useState([]);
  const [nodeId, setNodeId] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [listItems, setListItems] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [personsPerPage, setPersonsPerPage] = useState(10);
  const personsPerPageOptions = [10, 25, 50, 100];
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    initializeTree();

    return () => {
      destroyTree();
    };
  }, []);
  useEffect(() => {
    if (!initialLoad && searched) {
      fetchSearchResults();
    } else {
      setInitialLoad(false);
    }
  }, [page, personsPerPage]);

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
            setSelectedTab(0);
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
  const fetchSearchResults = () => {
    const offset = (page - 1) * personsPerPage;
    setLoading(true);
    fetch(`http://localhost:8080/findPersons/${personsPerPage}/${offset}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        const count = data.totalCount;
        setUsers(data.searchedPersons);
        setSearched(true);
        setSelectedTab(1);
        setTotalPages(Math.ceil(count / personsPerPage));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  const handleSearch = () => {
    fetchSearchResults();
  };

  const handleTabSelect = (index) => {
    if (index === selectedTab && index === 1) {
      return;
    }
    setSelectedTab(index);
  };

  const handlePageChange = (value) => {
    setPage(value);
  };

  const renderTableHeader = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell>PIN</TableCell>
          <TableCell>App Number</TableCell>
          <TableCell>Birth Date</TableCell>
          <TableCell>Count</TableCell>
          <TableCell>Photo</TableCell>
        </TableRow>
      </TableHead>
    );
  };

  return (<>

    <div className="container">
      <div className="left-column ">
        <div id="feature-tree"></div>
      </div>

      {/* <div style={{ position: "absolute", top: 0, left: 0 }}>
  <img src={faceIcon} alt="Face Icon" />
</div> */}
      <div className="right-column ">
        <Tabs selectedIndex={selectedTab} onSelect={handleTabSelect}>
          <TabList className="custom-tab-list">
            <Tab className="custom-tab-list-item">
              <span>Selected Node</span>
              <TouchAppIcon />
            </Tab>
            <Tab className="custom-tab-list-item">
              <span>Person Search</span>
              <PersonSearchIcon />
            </Tab>
          </TabList>

          <TabPanel>
            {selectedNodeId !== null && (
              <>
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
                <Button variant="outlined" size="medium" onClick={handleSearch}>
                  {loading ? (
                    <div className="d-flex align-items-center">
                      <span>Loading...</span>
                      <Stack sx={{ color: "black" }}>
                        <CircularProgress
                          color="inherit"
                          size={20}
                          className="ms-2"
                        />
                      </Stack>
                    </div>
                  ) : (
                    <span>Search</span>
                  )}
                </Button>
              </>
            )}
          </TabPanel>

          <TabPanel>
            <div>
              <span>Persons per page:</span>
              <Select
                value={personsPerPage}
                onChange={(e) => {
                  setPersonsPerPage(parseInt(e.target.value));
                  setPage(1);
                }}
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
            <div className="person-search">
              <div className="image-div">
                <div className="col-sm-12">
                  {searched ? (
                    <TableContainer>
                      <Table>
                        {renderTableHeader()}
                        <TableBody>
                          {users.map((user) => {
                            const imageUrl = `http://localhost:8080/getImageByApplicationNumberId/${user.applicationNumber}/P`;

                            return (
                              <TableRow key={user.pin}>
                                <TableCell>{user.pin}</TableCell>
                                <TableCell>{user.applicationNumber}</TableCell>
                                <TableCell>{user.birthDate}</TableCell>
                                <TableCell>{user.countrecord}</TableCell>
                                <TableCell className="image">
                                  <Fancybox
                                    options={{
                                      Carousel: {
                                        infinite: false,
                                        fullscreen:false,
                                      },
                                    }}
                                  >
                                    <a
                                      data-fancybox="gallery"
                                      href={imageUrl}
                                    >
                                      <img
                                        src={imageUrl}
                                        width="200"
                                        height="150"
                                      />
                                    </a>
                                  </Fancybox>
                                  {/* <img src={imageUrl} alt="Person" className="img-thumbnail" /> */}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <p>No search results yet.</p>
                  )}
                  {searched ? (
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      size="small"
                      className="pagination"
                      boundaryCount={2}
                      showFirstButton
                      showLastButton
                      siblingCount={2}
                      renderItem={(item) => (
                        <PaginationItem
                          component={Button}
                          {...item}
                          disabled={loading}
                          onClick={() => {
                            setPage(item.page);
                            handlePageChange(item.page);
                          }}
                        />
                      )}
                      nextIconButtonProps={{
                        size: "small",
                        disabled: page === totalPages || loading,
                      }}
                      previousIconButtonProps={{
                        size: "small",
                        disabled: page === 1 || loading,
                      }}
                      nextIcon={<KeyboardArrowRight />}
                      prevIcon={<KeyboardArrowLeft />}
                    />
                  ) : (
                    <p></p>
                  )}
                </div>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
      </>
  );
}

export default TreeComponent;
