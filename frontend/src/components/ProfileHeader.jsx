import React from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { PersonFill } from "react-bootstrap-icons";

const ProfileHeader = (props) => {
  return (
    <div className="py-4">
      <Container fluid className="px-3">
        <Card className="border-0 shadow-sm rounded-4 w-100 p-4">
          <Row className="align-items-center gx-5 gy-3">
            {/* Profile Icon */}
            <Col xs="auto">
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 30% 30%, #7c3aed, #a78bfa)",
                  position: "relative",
                }}
              >
                <PersonFill
                  size={65}
                  color="white"
                  style={{ position: "absolute", top: "14px", left: "17px" }}
                />
              </div>
            </Col>

            {/* User Info */}
            <Col md>
              <h2 className="mb-1 fw-bold text-dark">{props.username}</h2>
              <p className="mb-1 text-secondary" style={{ fontSize: "0.95rem" }}>{props.email}</p>
              <p className="mb-3 text-muted" style={{ fontSize: "0.9rem" }}>Joined on {props.created}</p>

              <div className="d-flex justify-content-center">
                <Row className="g-3 text-center bg-light rounded-3 py-2 my-2 mx-5 w-75" style={{ width:"auto"}}>
                <Col>
                  <p className="fw-bold fs-3 mb-0" style={{color: "#7c3aed"}}>{props.reputation}</p>
                  <small className="text-muted">Reputation</small>
                </Col>
                <Col>
                  <p className="fw-bold fs-3 mb-0" style={{color: "#7c3aed"}}>{props.downloads}</p>
                  <small className="text-muted">Downloads</small>
                </Col>
                <Col>
                  <p className="fw-bold fs-3 mb-0" style={{color: "#7c3aed"}}>{props.uploads}</p>
                  <small className="text-muted">Resources</small>
                </Col>
              </Row>
              </div>
            </Col>

            {/* Edit Button */}
            <Col xs="auto">
              <Button
                className="border-0 px-4 py-2"
                style={{ backgroundColor: "#7c3aed" }}
              >
                Edit Profile
              </Button>
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
};

export default ProfileHeader;
