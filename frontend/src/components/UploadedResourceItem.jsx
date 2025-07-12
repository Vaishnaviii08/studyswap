import React from "react";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Card from "react-bootstrap/esm/Card";
import {FileText} from "react-bootstrap-icons"

const UploadedResourceItem = (props) => {
  return (
    <div onClick={props.onClick} style={{ cursor: "pointer" }}>
      <Card className="shadow-sm border-0 rounded py-2">
          <Row className="align-items-center">
            <Col xs="auto" className="ms-4">
              <div
                className="border rounded d-flex align-items-center justify-content-center"
                style={{ width: "40px", height: "40px", backgroundColor: "#7c3aed", padding: "0" }}
              >
                <FileText size={22  } color="white"/>
              </div>
            </Col>

            <Col xs={9} className="mx-2">
              <div className="fw-semibold fs-5">{props.title}</div>
              <div className="text-muted small">
                <i className="fa-solid fa-arrow-up me-1 text-success"></i>
                <span className="fw-medium">{props.upvotes} upvotes</span>
              </div>
            </Col>
          </Row>

          <hr className="my-2" />

          <div className="text-start ms-4 d-flex align-items-center">
            <small className="text-muted">Uploaded on January 15, 2022</small>
          </div>
        </Card>
    </div>
  );
};

export default UploadedResourceItem;
