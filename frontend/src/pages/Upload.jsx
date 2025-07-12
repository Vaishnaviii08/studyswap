import React from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import UploadForm from "../components/UploadForm";

const Upload = () => {
  return (
    <div style={{ backgroundColor: "#f9f9fb", minHeight: "100vh" }}>
      <Container fluid className="px-0">
        <div className="border-0 shadow-sm overflow-hidden">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              height: "150px",
              backgroundColor: "#6366F1",
            }}
          >
            <h2 className="text-white fw-bold display-4">Upload</h2>
          </div>

          <div className="d-flex justify-content-center py-5">
            <Card
              className="w-100 shadow rounded-4 p-4"
              style={{ maxWidth: "720px" }}
            >
              <UploadForm />
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Upload;
