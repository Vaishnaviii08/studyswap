import Button from "react-bootstrap/esm/Button";
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/Form";
import UploadCard from "../components/UploadCard";
import ResourceItem from "../components/ResourceItem";
import Leaderboard from "../components/Leaderboard";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import {
  Person,
  Download,
  Eye,
  ExclamationTriangle,
} from "react-bootstrap-icons";

const Home = () => {
  const [query, setQuery] = useState("");
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [semester, setSemester] = useState("");
  const [fileType, setFileType] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [userCredits, setUserCredits] = useState(0);

  const handleClose = () => {
    setShow(false);
    setAlert(null);
  };

  const handleShow = (resource) => {
    setSelectedResource(resource);
    setShow(true);
    setAlert(null);
  };

  const fetchResources = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/resources`,
        {
          params: {
            search: query,
            semester,
            fileType,
          },
        }
      );
      setResources(res.data.resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
      setAlert({
        variant: "danger",
        message: "Failed to fetch resources. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };


  const handleDownload = async () => {
    if (!selectedResource) return;

    try {
      setDownloadLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/resources/${
          selectedResource._id
        }/download`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          validateStatus: () => true, // Don't throw error for HTTP errors
        }
      );

      // ✅ Explicitly handle error status codes
      if (response.status === 401 || response.status === 403) {
        throw new Error(response.data?.message || "Unauthorized access");
      }

      if (!response.data.success || !response.data.downloadUrl) {
        throw new Error(response.data?.message || "Failed to get download URL");
      }

      const { downloadUrl, filename } = response.data;

      // ✅ Trigger browser download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename || selectedResource.title || "download";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (response.data.creditsRemaining !== undefined) {
        setUserCredits(response.data.creditsRemaining);
      }

      setAlert({
        variant: "success",
        message: "Download started successfully!",
      });
    } catch (error) {
      console.error("Download error:", error);

      const errorMessage = error.message;

      if (errorMessage.includes("Insufficient download credits")) {
        setAlert({
          variant: "warning",
          message:
            "Insufficient download credits. Upload more resources to earn credits!",
        });
      } else if (
        errorMessage.includes("Unauthorized") ||
        errorMessage.includes("User not found")
      ) {
        setAlert({
          variant: "danger",
          message: "Please login to download resources.",
        });
      } else {
        setAlert({
          variant: "danger",
          message: errorMessage || "Download failed. Please try again.",
        });
      }
    } finally {
      setDownloadLoading(false);
    }
  };

  const handlePreview = async () => {
    if (!selectedResource) return;

    try {
      setPreviewLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/resources/${
          selectedResource._id
        }/preview`
      );

      if (response.data.success) {
        const { previewUrl } = response.data;

        // Open preview in new tab
        window.open(previewUrl, "_blank");
      }
    } catch (error) {
      console.error("Preview error:", error);
      setAlert({
        variant: "danger",
        message: "Preview not available for this file type",
      });
    } finally {
      setPreviewLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [query, semester, fileType]);

  return (
    <div>
      <Container fluid className="px-0">
        <div
          className="align-items-center"
          style={{
            backgroundColor: "#6366F1",
          }}
        >
          <div className="px-5 pt-5 pb-4 d-flex justify-content-center">
            <h2 className="text-white fw-bold display-4 w-75 text-center">
              Explore, Upload and Swap Study Materials with Students Across
              Campus!
            </h2>
          </div>

          <Form className="pb-5 px-5 d-flex justify-content-center">
            <Form.Control
              type="search"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="rounded-3 px-4 w-50"
            />
          </Form>
        </div>

        <Row style={{ backgroundColor: "#f9f9fb", minHeight: "100vh" }}>
          <Col lg={8}>
            <div>
              <h3 className="ps-5 pt-4 fw-bold display-6">Browse Resources</h3>

              <div className="d-flex px-5 pt-4 gap-4 flex-wrap">
                <Form.Select
                  name="semester"
                  style={{ width: "auto" }}
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                >
                  <option value="">All Semesters</option>
                  {[...Array(8)].map((_, i) => (
                    <option key={i} value={i + 1}>{`Semester ${i + 1}`}</option>
                  ))}
                </Form.Select>

                <Form.Select
                  name="FileType"
                  style={{ width: "auto" }}
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                >
                  <option value="">All File Types</option>
                  <option value="application/pdf">PDF</option>
                  <option value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">
                    Word Document
                  </option>
                  <option value="application/vnd.ms-powerpoint">
                    PowerPoint
                  </option>
                </Form.Select>
              </div>

              <div className="px-5 pt-5">
                {loading ? (
                  <div className="text-center">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="mt-2">Loading resources...</p>
                  </div>
                ) : (
                  <Row className="g-4">
                    {resources.length === 0 ? (
                      <Col xs={12}>
                        <Alert variant="info" className="text-center">
                          <ExclamationTriangle size={24} className="mb-2" />
                          <p className="mb-0">
                            No resources found matching your criteria.
                          </p>
                        </Alert>
                      </Col>
                    ) : (
                      resources.map((resource) => (
                        <Col key={resource._id} xs={12} sm={6} md={4} lg={3}>
                          <ResourceItem
                            data={resource}
                            onClick={() => handleShow(resource)}
                          />
                        </Col>
                      ))
                    )}
                  </Row>
                )}
              </div>
            </div>
          </Col>

          <Col>
            <Row className="m-4">
              <UploadCard />
            </Row>

            <Row className="m-4 pt-4">
              <Leaderboard />
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Enhanced Modal with Download Functionality */}
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header
          className="text-white ps-4"
          closeButton
          style={{ backgroundColor: "#7c3aed" }}
        >
          <div>
            <Modal.Title className="fs-4 fw-bold">
              {selectedResource?.title || "Resource Title"}
            </Modal.Title>
            <div className="d-flex align-items-center gap-2 mt-1">
              <Person size={18} />
              <p className="mb-0">
                {selectedResource?.uploaderUserId?.username || "Unknown author"}
              </p>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body className="px-4 py-3">
          {/* Alert for download status */}
          {alert && (
            <Alert variant={alert.variant} className="mb-3">
              {alert.message}
            </Alert>
          )}

          <div className="mb-4">
            <h6 className="text-muted fw-semibold mb-2">Description</h6>
            <p
              className="p-3 rounded-3 shadow-sm"
              style={{ backgroundColor: "#f9f9fb" }}
            >
              {selectedResource?.description || "Description not added"}
            </p>
          </div>

          <div className="d-flex gap-5 mb-4">
            <div>
              <h6 className="text-muted fw-semibold mb-1">Subject</h6>
              <p className="mb-0">
                {selectedResource?.subject || "Unknown subject"}
              </p>
            </div>

            <div>
              <h6 className="text-muted fw-semibold mb-1">Semester</h6>
              <p className="mb-0">
                Semester {selectedResource?.semester || "_"}
              </p>
            </div>

            <div>
              <h6 className="text-muted fw-semibold mb-1">Downloads</h6>
              <p className="mb-0">{selectedResource?.downloadsCount || 0}</p>
            </div>
          </div>

          <div className="mb-4">
            <h6 className="text-muted fw-semibold mb-1">File Type</h6>
            <p className="mb-0">
              {selectedResource?.fileType?.includes("pdf")
                ? "PDF"
                : selectedResource?.fileType?.includes("word")
                ? "Word Document"
                : selectedResource?.fileType?.includes("powerpoint")
                ? "PowerPoint"
                : "Document"}
            </p>
          </div>

          <div>
            <h6 className="text-muted fw-semibold mb-2">Tags</h6>
            <div className="d-flex flex-wrap gap-2">
              {selectedResource?.tags?.length > 0 ? (
                selectedResource.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-pill text-white small shadow-sm"
                    style={{ backgroundColor: "#7c3aed" }}
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-muted">No tags</span>
              )}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <div className="d-flex gap-3 justify-content-center w-100">
            <Button
              variant="outline-secondary"
              className="px-4 d-flex align-items-center gap-2"
              onClick={handlePreview}
              disabled={previewLoading}
            >
              {previewLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <Eye size={16} />
              )}
              Preview
            </Button>

            <Button
              onClick={handleDownload}
              style={{ backgroundColor: "#7c3aed", border: "none" }}
              className="px-4 d-flex align-items-center gap-2"
            >
              <Download size={16} />
              Download
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
