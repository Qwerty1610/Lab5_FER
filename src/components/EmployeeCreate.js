import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const API_URL = "http://localhost:9999";

function EmployeeCreate() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [empSalary, setEmpSalary] = useState("");
  const [empGender, setEmpGender] = useState("Male");
  const [empBirthdate, setEmpBirthdate] = useState("");
  const [depId, setDepId] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get(`${API_URL}/departments`).then((res) => setDepartments(res.data));
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First Name is required and cannot be empty or only white space";
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Last Name is required and cannot be empty or only white space";
    }
    if (empSalary === "" || isNaN(Number(empSalary)) || Number(empSalary) <= 0) {
      newErrors.empSalary = "Salary is required and must be a positive number greater than 0";
    }
    if (!depId) {
      newErrors.depId = "Please select a department";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Lấy danh sách hiện tại để tính ID kế tiếp (max ID + 1)
    axios.get(`${API_URL}/employees`).then((res) => {
      const maxId = res.data.reduce((max, emp) => {
        const idNum = Number(emp.id);
        return !isNaN(idNum) && idNum > max ? idNum : max;
      }, 0);

      const newEmployee = {
        id: String(maxId + 1),
        empName: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        },
        empSalary: Number(empSalary),
        empGender: empGender,
        empBirthdate: empBirthdate,
        depId: Number(depId),
        // Gán mặc định cho các field nâng cao
        supervisorId: null,
        dependents: [],
      };

      axios.post(`${API_URL}/employees`, newEmployee).then(() => {
        alert("Employee created successfully!");
        navigate("/");
      });
    });
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header as="h4" className="text-center">
              Create New Employee
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name (Họ)</Form.Label>
                  <Form.Control
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    isInvalid={!!errors.lastName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>First Name (Tên)</Form.Label>
                  <Form.Control
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    isInvalid={!!errors.firstName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Salary (Mức lương)</Form.Label>
                  <Form.Control
                    type="number"
                    value={empSalary}
                    onChange={(e) => setEmpSalary(e.target.value)}
                    isInvalid={!!errors.empSalary}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.empSalary}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Gender (Giới tính)</Form.Label>
                  <Form.Select
                    value={empGender}
                    onChange={(e) => setEmpGender(e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Birthdate</Form.Label>
                  <Form.Control
                    type="date"
                    value={empBirthdate}
                    onChange={(e) => setEmpBirthdate(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Department (Phòng ban)</Form.Label>
                  <Form.Select
                    value={depId}
                    onChange={(e) => setDepId(e.target.value)}
                    isInvalid={!!errors.depId}
                  >
                    <option value="">-- Select Department --</option>
                    {departments.map((dep) => (
                      <option key={dep.id} value={dep.id}>
                        {dep.depName}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.depId}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button
                    variant="secondary"
                    className="w-50"
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" className="w-50">
                    Save
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default EmployeeCreate;
