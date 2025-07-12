import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { CloudArrowUp } from "react-bootstrap-icons";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UploadCard = () => {
  const navigate = useNavigate();
  const { fullUser } = useAuth();

  const handleClick = () => {
     if (!fullUser) {
      navigate("/login"); // redirect to login if not authenticated
    } else {
      navigate("/upload"); // proceed to upload if logged in
    }
  }

  return (
    <div>
      <Card className="border-0 shadow rounded-4 overflow-hidden" style={{ maxWidth: "300px", minHeight: "250px"}}>
        <Card.Body
          className="p-4"
          style={{
            background: "linear-gradient(135deg, #b1b2f8, #d2d4ff)",
            color: "#1f1f1f",
            minHeight: "180px"
          }}
        >
          <div className="mb-3 d-flex align-items-start gap-3">
            <div
              className="bg-white text-primary d-flex justify-content-center align-items-center rounded-circle"
              style={{ width: 50, height: 50, minWidth: 50, flexShrink: 0 }}
            >
              <CloudArrowUp size={28} />
            </div>
            <div>
              <Card.Title
                className="fw-bold"
                style={{ fontSize: "1.5rem" }}
              >
                Upload Your Notes
              </Card.Title>
              <Card.Text className="text-dark mb-0">
                Share your study materials and help your peers succeed.
              </Card.Text>
            </div>
          </div>

          <div>
            <Button
              style={{
                backgroundColor: "#6366F1",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.5rem 1.25rem",
                width: "100%"
              }}
              className="fw-semibold justify-content-end"
              onClick={handleClick}
            >
              Upload
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UploadCard;