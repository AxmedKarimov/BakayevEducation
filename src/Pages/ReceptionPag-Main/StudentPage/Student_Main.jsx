import { useState } from "react";
import "./student.scss";

function Student_Main() {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Ali Valiyev",
      age: 20,
      phone: "+998901234567",
      password: "ali123",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      group: "Group 1",
    },
    {
      id: 2,
      name: "Laylo Karimova",
      age: 19,
      phone: "+998909876543",
      password: "laylo321",
      photo: "https://randomuser.me/api/portraits/women/65.jpg",
      group: "Group 2",
    },
    {
      id: 3,
      name: "Sardor Eshonov",
      age: 21,
      phone: "+998933215432",
      password: "sardor456",
      photo: "https://randomuser.me/api/portraits/men/45.jpg",
      group: "Group 1",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedStudent, setEditedStudent] = useState({});

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleGroupFilter = (e) => {
    setSelectedGroup(e.target.value);
  };

  const handleEdit = (id) => {
    const studentToEdit = students.find((s) => s.id === id);
    setEditingId(id);
    setEditedStudent({ ...studentToEdit });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent({ ...editedStudent, [name]: value });
  };

  const handleSave = () => {
    const updated = students.map((s) =>
      s.id === editingId ? editedStudent : s
    );
    setStudents(updated);
    setEditingId(null);
    setEditedStudent({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedStudent({});
  };

  const handleDelete = (id) => {
    const filtered = students.filter((s) => s.id !== id);
    setStudents(filtered);
  };

  const filteredStudents = students.filter((s) => {
    const matchesName = s.name.toLowerCase().includes(searchTerm);
    const matchesGroup = selectedGroup ? s.group === selectedGroup : true;
    return matchesName && matchesGroup;
  });

  return (
    <div className="student-page">
      <div className="student-header">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          onChange={handleSearch}
        />
        <h2>Students</h2>
        <div className="branch-select">
          <select id="branch" className="select-box">
            <option value="1">Fillial 1</option>
            <option value="2">Fillial 2</option>
          </select>
        </div>

        <select className="group-select" onChange={handleGroupFilter}>
          <option value="">All Groups</option>
          <option value="Group 1">Group 1</option>
          <option value="Group 2">Group 2</option>
        </select>
      </div>

      <div className="table-boxx">
        <table className="student-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Group</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>
                  <img src={student.photo} alt={student.name} />
                </td>
                <td>
                  {editingId === student.id ? (
                    <input
                      name="name"
                      value={editedStudent.name}
                      onChange={handleInputChange}
                      className="input-edit"
                    />
                  ) : (
                    student.name
                  )}
                </td>
                <td>
                  {editingId === student.id ? (
                    <input
                      name="age"
                      type="number"
                      value={editedStudent.age}
                      onChange={handleInputChange}
                      className="input-edit"
                    />
                  ) : (
                    student.age
                  )}
                </td>
                <td>
                  {editingId === student.id ? (
                    <input
                      name="phone"
                      value={editedStudent.phone}
                      onChange={handleInputChange}
                      className="input-edit"
                    />
                  ) : (
                    student.phone
                  )}
                </td>
                <td>
                  {editingId === student.id ? (
                    <select
                      name="group"
                      value={editedStudent.group}
                      onChange={handleInputChange}
                      className="input-edit"
                    >
                      <option value="Group 1">Group 1</option>
                      <option value="Group 2">Group 2</option>
                    </select>
                  ) : (
                    student.group
                  )}
                </td>
                <td>
                  {editingId === student.id ? (
                    <input
                      name="password"
                      value={editedStudent.password}
                      onChange={handleInputChange}
                      className="input-edit"
                    />
                  ) : (
                    student.password
                  )}
                </td>
                <td className="actions">
                  {editingId === student.id ? (
                    <>
                      <div className="edit-actions">
                        <button className="saveBtn" onClick={handleSave}>
                          Save
                        </button>
                        <button className="cancelBtn" onClick={handleCancel}>
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        className="editBtn"
                        onClick={() => handleEdit(student.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="deleteBtn"
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Student_Main;
