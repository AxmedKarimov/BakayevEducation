import { useState } from "react";
import "./group.scss";

function Group_Main() {
  const currentUser = { type: "main" };
  const teacherList = [
    { id: "Teacher 1", name: "Teacher 1" },
    { id: "Teacher 2", name: "Teacher 2" },
    { id: "Teacher 3", name: "Teacher 3" },
    { id: "Teacher 4", name: "Teacher 4" },
  ];

  const [groups, setGroups] = useState([
    {
      name: "Group 1",
      degree: "Degree 1",
      RoomId: "Room 1",
      teacherId: ["Teacher 1"],
      startTime: "09:00",
      endTime: "10:30",
      branch: "1-filial",
    },
    {
      name: "Group 2",
      degree: "Degree 2",
      RoomId: "Room 2",
      teacherId: ["Teacher 2"],
      startTime: "11:00",
      endTime: "12:30",
      branch: "2-filial",
    },
  ]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editedGroup, setEditedGroup] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    degree: "",
    RoomId: "",
    teacherId: [],
    startTime: "",
    endTime: "",
    branch: "",
  });

  const handleEdit = (idx) => {
    setEditingIndex(idx);
    setEditedGroup({ ...groups[idx] });
    setIsModalOpen(false);
  };

  const handleCheckboxChange = (e, isEditing = false) => {
    const { value, checked } = e.target;
    const selected = isEditing
      ? [...editedGroup.teacherId]
      : [...newGroup.teacherId];

    if (checked) {
      if (!selected.includes(value)) selected.push(value);
    } else {
      const index = selected.indexOf(value);
      if (index > -1) selected.splice(index, 1);
    }

    if (isEditing) {
      setEditedGroup({ ...editedGroup, teacherId: selected });
    } else {
      setNewGroup({ ...newGroup, teacherId: selected });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedGroup({ ...editedGroup, [name]: value });
  };

  const handleSave = () => {
    const updated = [...groups];
    updated[editingIndex] = editedGroup;
    setGroups(updated);
    setEditingIndex(null);
    setEditedGroup({});
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditedGroup({});
  };

  const handleDelete = (idx) => {
    const updated = [...groups];
    updated.splice(idx, 1);
    setGroups(updated);
  };

  const handleNewGroupChange = (e) => {
    const { name, value } = e.target;
    setNewGroup({ ...newGroup, [name]: value });
  };

  const handleAddGroup = () => {
    setGroups([...groups, newGroup]);
    setNewGroup({
      name: "",
      degree: "",
      RoomId: "",
      teacherId: [],
      startTime: "",
      endTime: "",
      branch: "",
    });
    setIsModalOpen(false);
  };

  return (
    <div className="group-page">
      {/* Branch Selector for Main User */}
      {currentUser.type === "main" && (
        <div className="branch-selectG">
          <select id="branch" className="select-box">
            <option value="1">Filial 1</option>
            <option value="2">Filial 2</option>
          </select>
        </div>
      )}

      <h1 className="groupTitle">Groups</h1>
      {currentUser.type === "main" && (
        <button className="addBtn" onClick={() => setIsModalOpen(true)}>
          + Add Group
        </button>
      )}

      {/* Add Group Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Group</h2>
            <input
              type="text"
              name="name"
              placeholder="Group Name"
              value={newGroup.name}
              onChange={handleNewGroupChange}
            />

            <select
              name="degree"
              value={newGroup.degree}
              onChange={handleNewGroupChange}
            >
              <option value="">Select Degree</option>
              {Array.from({ length: 4 }, (_, i) => (
                <option key={i} value={`Degree ${i + 1}`}>{`Degree ${
                  i + 1
                }`}</option>
              ))}
            </select>

            <select
              name="RoomId"
              value={newGroup.RoomId}
              onChange={handleNewGroupChange}
            >
              <option value="">Select Room</option>
              {Array.from({ length: 4 }, (_, i) => (
                <option key={i} value={`Room ${i + 1}`}>{`Room ${
                  i + 1
                }`}</option>
              ))}
            </select>

            <div className="teacher-checkboxes">
              {teacherList.map((t) => (
                <label key={t.id}>
                  <input
                    type="checkbox"
                    value={t.id}
                    checked={newGroup.teacherId.includes(t.id)}
                    onChange={(e) => handleCheckboxChange(e, false)}
                  />
                  {t.name}
                </label>
              ))}
            </div>

            {currentUser.type === "main" && (
              <select
                name="branch"
                value={newGroup.branch}
                onChange={handleNewGroupChange}
              >
                <option value="">Select Branch</option>
                <option value="1-filial">1-filial</option>
                <option value="2-filial">2-filial</option>
              </select>
            )}

            <div className="time-row">
              <input
                type="time"
                name="startTime"
                value={newGroup.startTime}
                onChange={handleNewGroupChange}
              />
              <span>-</span>
              <input
                type="time"
                name="endTime"
                value={newGroup.endTime}
                onChange={handleNewGroupChange}
              />
            </div>

            <div className="modal-actions">
              <button className="saveBtn" onClick={handleAddGroup}>
                Add
              </button>
              <button
                className="cancelBtn"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Groups Table */}
      <div className="table-boxx">
        <table className="GroupTable">
          <thead>
            <tr>
              <th className="idHead">#</th>
              <th>Name</th>
              <th>Degree</th>
              <th>Room</th>
              <th>Teachers</th>
              {currentUser.type === "main" && <th>Branch</th>}
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  {editingIndex === i ? (
                    <input
                      type="text"
                      name="name"
                      value={editedGroup.name}
                      onChange={handleInputChange}
                    />
                  ) : (
                    g.name
                  )}
                </td>
                <td>
                  {editingIndex === i ? (
                    <select
                      name="degree"
                      value={editedGroup.degree}
                      onChange={handleInputChange}
                    >
                      {Array.from({ length: 4 }, (_, idx) => (
                        <option
                          key={idx}
                          value={`Degree ${idx + 1}`}
                        >{`Degree ${idx + 1}`}</option>
                      ))}
                    </select>
                  ) : (
                    g.degree
                  )}
                </td>
                <td>
                  {editingIndex === i ? (
                    <select
                      name="RoomId"
                      value={editedGroup.RoomId}
                      onChange={handleInputChange}
                    >
                      {Array.from({ length: 4 }, (_, idx) => (
                        <option key={idx} value={`Room ${idx + 1}`}>{`Room ${
                          idx + 1
                        }`}</option>
                      ))}
                    </select>
                  ) : (
                    g.RoomId
                  )}
                </td>
                <td>
                  {editingIndex === i ? (
                    <div className="teacher-checkboxes">
                      {teacherList.map((t) => (
                        <label key={t.id}>
                          <input
                            type="checkbox"
                            value={t.id}
                            checked={editedGroup.teacherId.includes(t.id)}
                            onChange={(e) => handleCheckboxChange(e, true)}
                          />
                          {t.name}
                        </label>
                      ))}
                    </div>
                  ) : (
                    g.teacherId.join(", ")
                  )}
                </td>
                {currentUser.type === "main" && (
                  <td>
                    {editingIndex === i ? (
                      <select
                        name="branch"
                        value={editedGroup.branch}
                        onChange={handleInputChange}
                      >
                        <option value="1-filial">1-filial</option>
                        <option value="2-filial">2-filial</option>
                      </select>
                    ) : (
                      g.branch
                    )}
                  </td>
                )}
                <td>
                  {editingIndex === i ? (
                    <div className="time-row">
                      <input
                        type="time"
                        name="startTime"
                        value={editedGroup.startTime}
                        onChange={handleInputChange}
                      />
                      <span>-</span>
                      <input
                        type="time"
                        name="endTime"
                        value={editedGroup.endTime}
                        onChange={handleInputChange}
                      />
                    </div>
                  ) : (
                    `${g.startTime} - ${g.endTime}`
                  )}
                </td>
                <td className="actions">
                  {editingIndex === i ? (
                    <>
                      <button className="saveBtn" onClick={handleSave}>
                        Save
                      </button>
                      <button className="cancelBtn" onClick={handleCancel}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="editBtn" onClick={() => handleEdit(i)}>
                        Edit
                      </button>
                      <button
                        className="deleteBtn"
                        onClick={() => handleDelete(i)}
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

export default Group_Main;

/* SCSS is unchanged and supports .teacher-checkboxes styling */
