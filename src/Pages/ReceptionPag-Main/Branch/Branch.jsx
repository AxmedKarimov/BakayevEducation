/* BranchPage.jsx */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./branch.scss";

function Branch() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [expandedBranch, setExpandedBranch] = useState(null);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    location: "",
    description: "",
    image: "",
  });
  const [roomData, setRoomData] = useState({ id: "", name: "", number: "" });

  const resetForm = () =>
    setFormData({ id: "", name: "", location: "", description: "", image: "" });
  const resetRoom = () => setRoomData({ id: "", name: "", number: "" });

  const openBranchModal = (branch = null) => {
    if (branch) setFormData(branch);
    else resetForm();
    setShowBranchModal(true);
  };

  const saveBranch = () => {
    const { id, name, location, description, image } = formData;
    if (!name || !location || !description) return;
    if (branches.find((b) => b.id === id)) {
      setBranches(
        branches.map((b) => (b.id === id ? { ...formData, rooms: b.rooms } : b))
      );
    } else {
      setBranches([
        ...branches,
        { ...formData, id: Date.now().toString(), rooms: [] },
      ]);
    }
    setShowBranchModal(false);
  };

  const deleteBranch = (id) => setBranches(branches.filter((b) => b.id !== id));
  const toggleExpand = (id) =>
    setExpandedBranch(expandedBranch === id ? null : id);

  const openRoomModal = (branch, room = null) => {
    setSelectedBranch(branch);
    if (room) setRoomData(room);
    else resetRoom();
    setShowRoomModal(true);
  };

  const saveRoom = () => {
    const { id, name, number } = roomData;
    if (!name || !number) return;
    const updatedBranch = { ...selectedBranch };
    if (id) {
      updatedBranch.rooms = updatedBranch.rooms.map((r) =>
        r.id === id ? roomData : r
      );
    } else {
      updatedBranch.rooms = [
        ...updatedBranch.rooms,
        { ...roomData, id: Date.now().toString() },
      ];
    }
    setBranches(
      branches.map((b) => (b.id === updatedBranch.id ? updatedBranch : b))
    );
    setShowRoomModal(false);
  };

  const deleteRoom = (branchId, roomId) => {
    setBranches(
      branches.map((b) =>
        b.id === branchId
          ? { ...b, rooms: b.rooms.filter((r) => r.id !== roomId) }
          : b
      )
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, image: url });
    }
  };

  return (
    <div className="branch-page">
      <h1>Branches</h1>
      <button className="btn-add" onClick={() => openBranchModal()}>
        + Add Branch
      </button>

      <div className="branch-list">
        {branches.map((branch) => (
          <motion.div
            layout
            key={branch.id}
            className="branch-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {branch.image && (
              <div className="branch-photo">
                <img src={branch.image} alt={branch.name} />
              </div>
            )}
            <div className="card-header">
              <div>
                <h2>{branch.name}</h2>
                <p>{branch.location}</p>
              </div>
              <div className="actions">
                <button onClick={() => openBranchModal(branch)}>Edit</button>
                <button onClick={() => deleteBranch(branch.id)}>Delete</button>
                <button onClick={() => toggleExpand(branch.id)}>
                  {expandedBranch === branch.id ? "Hide Rooms" : "Show Rooms"}
                </button>
                <button
                  className="addRoom"
                  onClick={() => openRoomModal(branch)}
                >
                  + Room
                </button>
              </div>
            </div>
            <p className="description">{branch.description}</p>

            <AnimatePresence>
              {expandedBranch === branch.id && (
                <motion.div
                  className="rooms"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <h3>Rooms:</h3>
                  {branch.rooms.map((room) => (
                    <motion.div
                      key={room.id}
                      className="room-card"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                    >
                      <span>
                        (№{room.number}) {room.name}
                      </span>
                      <div className="room-actions">
                        <button onClick={() => openRoomModal(branch, room)}>
                          Edit
                        </button>
                        <button onClick={() => deleteRoom(branch.id, room.id)}>
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Branch Modal */}
      <AnimatePresence>
        {showBranchModal && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2>{formData.id ? "Edit Branch" : "Add Branch"}</h2>
              <input
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <input
                placeholder="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
              <div className="image-upload">
                <label htmlFor="branchImage">Choose Photo</label>
                <input
                  type="file"
                  id="branchImage"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {formData.image && (
                  <div className="image-preview">
                    <img src={formData.image} alt="Preview" />
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button onClick={() => setShowBranchModal(false)}>
                  Cancel
                </button>
                <button onClick={saveBranch}>Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Room Modal */}
      <AnimatePresence>
        {showRoomModal && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2>
                {roomData.id
                  ? `Edit Room in ${selectedBranch.name}`
                  : `Add Room to ${selectedBranch.name}`}
              </h2>
              <input
                placeholder="Room Name"
                value={roomData.name}
                onChange={(e) =>
                  setRoomData({ ...roomData, name: e.target.value })
                }
                required
              />
              <input
                placeholder="Room Number"
                value={roomData.number}
                onChange={(e) =>
                  setRoomData({ ...roomData, number: e.target.value })
                }
                required
              />
              <div className="modal-actions">
                <button onClick={() => setShowRoomModal(false)}>Cancel</button>
                <button onClick={saveRoom}>Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Branch;
