import React from "react";
import Card from "react-bootstrap/Card";
import {
  FileEarmarkTextFill,
  Bookmark,
  ArrowUp,
  Download,
} from "react-bootstrap-icons";

const ResourceItem = ({ data, onClick }) => {
  const {
    title,
    uploaderUserId,
    subject,
    semester,
    tags,
    downloadsCount,
    upvotesCount,
  } = data;
  const uploaderName = data.uploaderUserId?.username || "Unknown User";

  return (
    <div className="d-flex my-3">
      <Card
        style={{
          width: "250px", // more compact width
          borderRadius: "0.75rem",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          padding: "0.5rem",
          cursor: "pointer"
        }}
        onClick={onClick}
      >
        <Card.Body className="p-2 d-flex">
          {/* Left Icon Section */}
          <div className="me-2 mt-1 d-flex flex-column align-items-center">
            <FileEarmarkTextFill size={32} style={{ color: "rgba(0, 0, 0, 0.4)" }}/>
          </div>

          {/* Right Content Section */}
          <div className="flex-grow-1">
            {/* Subject Title */}
            <div
              className="fw-bold"
              style={{ fontSize: "1.15rem", lineHeight: "1.2" }}
            >
              {title}
            </div>

            {/* Author */}
            <div className="text-muted mb-2" style={{ fontSize: "1rem" }}>
              {uploaderName}
            </div>

            {/* Tags */}
            <div className="mb-2" style={{ fontSize: "1rem" }}>
              {tags &&
                tags.slice(0, 2).map((tag, index) => (
                  <div key={index} className="d-flex align-items-center mb-1">
                    <Bookmark size={14} className="me-2" />
                    {tag}
                  </div>
                ))}
            </div>

            {/* Upvotes & Downloads */}
            <div
              className="d-flex align-items-center"
              style={{ fontSize: "1rem" }}
            >
              <ArrowUp size={16} className="me-1" /> {upvotesCount}
              <Download size={16} className="ms-3 me-1" /> {downloadsCount}
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ResourceItem;
