import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import Modal from "react-bootstrap/Modal";
import UploadedResourceItem from "./UploadedResourceItem";
import { Person } from "react-bootstrap-icons";

const UploadedResources = ({ resources = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (resource) => {
    setSelectedResource(resource);
    setShow(true);
  }

  return (
    <div className="mb-2">
      <Container fluid className="shadow-sm border-0 rounded">
        <Card className="border-0">
          <Card.Header className="fw-bold bg-white">Uploaded Resources</Card.Header>
          <Card.Body>
            {resources.length === 0 ? (
              <p className="text-muted">No resources uploaded yet.</p>
            ) : (
              resources.map((resource, index) => (
                <div
                  key={resource._id}
                  className="rounded-3 bg-white"
                  style={{
                    border:
                      hoveredIndex === index
                        ? "1px solid #7c3aed"
                        : "1px solid transparent",
                    boxShadow:
                      hoveredIndex === index
                        ? "0 0 8px rgba(124, 58, 237, 0.2)"
                        : "none",
                    transition: "all 0.2s ease",
                    marginBottom: "1rem", 
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <UploadedResourceItem
                    title={resource.title}
                    upvotes={resource.upvotesCount}
                    createdAt={resource.createdAt}
                    tags={resource.tags}
                    fileUrl={resource.fileUrl}
                    onClick={() => handleShow(resource)}
                  />
                </div>
              ))
            )}
          </Card.Body>
        </Card>
      </Container>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header
          className="text-white ps-4"
          closeButton
          style={{ backgroundColor: "#7c3aed" }}
        >
          <div>
            <Modal.Title className="fs-4 fw-bold">{selectedResource?.title || "Resource Title"}</Modal.Title>
            
          </div>
        </Modal.Header>

        <Modal.Body className="px-4 py-3">
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
              <p className="mb-0">{selectedResource?.subject || "Unkown subject"}</p>
            </div>

            <div>
              <h6 className="text-muted fw-semibold mb-1">Semester</h6>
              <p className="mb-0">Semester {selectedResource?.semester || "Semester _"}</p>
            </div>
          </div>

          <div>
            <h6 className="text-muted fw-semibold mb-2">Tags</h6>
            <div className="d-flex flex-wrap gap-4">
              {selectedResource?.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-pill text-white small shadow-sm"
                  style={{ backgroundColor: "#7c3aed" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <div className="d-flex gap-4 justify-content-center w-100">
            <Button style={{ backgroundColor: "#7c3aed", border: "none" }} className="px-4">Preview</Button>
            <Button style={{ backgroundColor: "#7c3aed", border: "none" }} className="px-4">
              Download
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UploadedResources;
