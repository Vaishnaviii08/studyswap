import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FileUploader from "./FileUploader";
import axios from "../api/axios";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    semester: "",
    tags: "",
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please select a file!");

    const data = new FormData();
    data.append("file", selectedFile);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("subject", formData.subject);
    data.append("semester", formData.semester);
    data.append("tags", formData.tags);

    try {
      const res = await axios.post("/resources/upload", data);
      setMessage({ type: "success", text: res.data.message });
    } catch (err) {
      console.error(err);
      const errorText =
        err?.response?.data?.errors?.[0]?.msg ||
        err?.response?.data?.error ||
        "Upload failed";
      setMessage({ type: "danger", text: errorText });
    }
  };

  return (
    <div className="p-4">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <FileUploader onFileSelect={handleFileSelect} />
          {selectedFile && (
            <p className="mt-2 text-sm text-green-600">
              Selected file: {selectedFile.name}
            </p>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="resourceTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            placeholder="Enter resource title"
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="resourceDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="description"
            placeholder="Enter description"
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="resourceSubject">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                name="subject"
                placeholder="Enter subject"
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="resourceSemester">
              <Form.Label>Semester</Form.Label>
              <Form.Select name="semester" onChange={handleChange} required>
                <option value="">Select semester</option>
                {[...Array(8)].map((_, i) => (
                  <option key={i} value={i + 1}>{`Semester ${i + 1}`}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="resourceTags">
          <Form.Label>Tags (comma-separated)</Form.Label>
          <Form.Control
            type="text"
            name="tags"
            placeholder="e.g. DSA, algorithms"
            onChange={handleChange}
          />
        </Form.Group>

        <div className="text-center">
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>

      {message && (
        <div className={`mt-3 alert alert-${message.type}`}>{message.text}</div>
      )}
    </div>
  );
};

export default UploadForm;
