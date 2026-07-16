import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Container, Row, Col, Table, Form, Button, Card} from "react-bootstrap";

const API_URL = "http://localhost:9999";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [workons, setWorkons] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDeps, setSelectedDeps] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/employees`).then((res) => setEmployees(res.data));
    axios.get(`${API_URL}/departments`).then((res) => setDepartments(res.data));
    axios.get(`${API_URL}/projects`).then((res) => setProjects(res.data));
    axios.get(`${API_URL}/workons`).then((res) => setWorkons(res.data));
  }, []);

  const getDepartmentName = (depId) => {
    const dep = departments.find((d) => String(d.id) === String(depId));
    return dep ? dep.depName : "Unknown";
  };

  const getProjectInfo = (empId) => {
    const joined = workons.filter((w) => String(w.empId) === String(empId));
    if (joined.length === 0) {
      return "Chưa tham gia";
    }
    return joined
      .map((w) => {
        const pro = projects.find((p) => String(p.id) === String(w.proId));
        const proName = pro ? pro.proName : "Unknown";
        return `${proName} (${w.workHours} giờ)`;
      })
      .join(", ");
  };

  const handleDepCheck = (depId) => {
    setSelectedDeps((prev) =>
      prev.includes(depId)
        ? prev.filter((id) => id !== depId)
        : [...prev, depId]
    );
  };

  const handleDelete = (emp) => {
    const fullName = `${emp.empName.firstName} ${emp.empName.lastName}`;
    if (window.confirm(`Are you sure you want to delete employee "${fullName}"?`)) {
      axios.delete(`${API_URL}/employees/${emp.id}`).then(() => {
        setEmployees((prev) => prev.filter((e) => e.id !== emp.id));
      });
    }
  };

  const displayedEmployees = employees
    .filter((emp) => {
      const fullName =
        `${emp.empName.firstName} ${emp.empName.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.trim().toLowerCase());
    })
    .filter(
      (emp) =>
        selectedDeps.length === 0 ||
        selectedDeps.includes(String(emp.depId))
    )
    .sort((a, b) => b.empSalary - a.empSalary);

  return (
    <Container fluid className="py-4">
      <h2 className="text-center mb-4">Employee Management System</h2>
      <Row>
        <Col md={3}>
          <Card>
            <Card.Header as="h5">Departments</Card.Header>
            <Card.Body>
              {departments.map((dep) => (
                <Form.Check
                  key={dep.id}
                  type="checkbox"
                  id={`dep-${dep.id}`}
                  label={dep.depName}
                  checked={selectedDeps.includes(String(dep.id))}
                  onChange={() => handleDepCheck(String(dep.id))}
                />
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          <Row className="mb-3">
            <Col md={8}>
              <Form.Control
                type="text"
                placeholder="Tìm kiếm nhân viên theo họ tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={4} className="text-end">
              <Link to="/employee/create">
                <Button variant="success">Create New Employee</Button>
              </Link>
            </Col>
          </Row>

          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Salary</th>
                <th>Gender</th>
                <th>Department</th>
                <th>Dependents</th>
                <th>Projects (Total Hours)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center">
                    No employees found
                  </td>
                </tr>
              ) : (
                displayedEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td>
                      {emp.empName.firstName} {emp.empName.lastName}
                    </td>
                    <td>{emp.empSalary.toLocaleString()}</td>
                    <td>{emp.empGender}</td>
                    <td>{getDepartmentName(emp.depId)}</td>
                    <td>{emp.dependents ? emp.dependents.length : 0} người</td>
                    <td>{getProjectInfo(emp.id)}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(emp)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default EmployeeList;
