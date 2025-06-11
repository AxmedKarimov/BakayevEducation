// AddReception.js
import React, { useState, useRef } from "react";
import "./AddReception.scss";
import { FaFileUpload } from "react-icons/fa";

export default function AddReception() {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    number: "+998 ",
    photoBase64: "",
    username: "",
    password: "",
    confirmPassword: "",
    roles: [],
    branch: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "number") {
      let digits = value.replace(/\D/g, "").slice(0, 12);
      if (!digits.startsWith("998"))
        digits = "998" + digits.replace(/^998/, "");
      const parts = [
        digits.slice(0, 3),
        digits.slice(3, 5),
        digits.slice(5, 8),
        digits.slice(8, 10),
        digits.slice(10, 12),
      ].filter((p) => p);
      setFormData((f) => ({ ...f, number: "+" + parts.join(" ") }));
    } else if (type === "checkbox") {
      setFormData((f) => ({
        ...f,
        roles: checked
          ? [...f.roles, value]
          : f.roles.filter((r) => r !== value),
      }));
    } else {
      setFormData((f) => ({ ...f, [name]: value }));
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setFormData((f) => ({ ...f, photoBase64: reader.result }));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!formData.name) e.name = "Ism kiriting";
    if (!formData.lastname) e.lastname = "Familiya kiriting";
    if (!/^\+998 \d{2} \d{3} \d{2} \d{2}$/.test(formData.number))
      e.number = "Telefon +998 99 999 99 99 formatida bo‘lsin";
    if (!formData.username) e.username = "Username kiriting";
    if (!formData.password) e.password = "Parol kiriting";
    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = "Parollar mos emas";
    if (formData.roles.length === 0) e.roles = "Kamida bitta rol tanlang";
    if (!formData.branch) e.branch = "Filialni tanlang";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ve = validate();
    if (Object.keys(ve).length) {
      setErrors(ve);
    } else {
      console.log(formData);
      alert("Muvaffaqiyatli qo'shildi!");
    }
  };

  return (
    <div className="rec-page">
      <h1>Add Reception</h1>
      <div className="content">
        <div className="image-section">
          <div className="preview-box">
            {formData.photoBase64 ? (
              <img src={formData.photoBase64} alt="preview" />
            ) : (
              <span className="placeholder">
                <FaFileUpload />
              </span>
            )}
          </div>
          <button
            type="button"
            className="upload-btn"
            onClick={() => fileInputRef.current.click()}
          >
            Rasmni yuklash
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFile}
            style={{ display: "none" }}
          />
        </div>

        <div className="form-container">
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Firstname</label>
              <input
                name="name"
                placeholder="Ism..."
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Lastname</label>
              <input
                name="lastname"
                placeholder="Familiya..."
                value={formData.lastname}
                onChange={handleChange}
              />
              {errors.lastname && (
                <span className="error">{errors.lastname}</span>
              )}
            </div>

            <div className="form-group">
              <label>Telefon raqami</label>
              <input
                name="number"
                placeholder="+998 99 999 99 99"
                value={formData.number}
                onChange={handleChange}
              />
              {errors.number && <span className="error">{errors.number}</span>}
            </div>

            <div className="form-group">
              <label>Username</label>
              <input
                name="username"
                placeholder="Username..."
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <span className="error">{errors.username}</span>
              )}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                placeholder="Parol..."
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Parolni tasdiqlang..."
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <span className="error">{errors.confirmPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label>Filial</label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
              >
                <option value="">Tanlang...</option>
                <option value="1-fillial">1-fillial</option>
                <option value="2-fillial">2-fillial</option>
              </select>
              {errors.branch && <span className="error">{errors.branch}</span>}
            </div>

            <div className="form-group roles">
              <label>
                <input
                  type="checkbox"
                  name="roles"
                  value="reception"
                  checked={formData.roles.includes("reception")}
                  onChange={handleChange}
                />
                Reception
              </label>
              <label>
                <input
                  type="checkbox"
                  name="roles"
                  value="teacher"
                  checked={formData.roles.includes("teacher")}
                  onChange={handleChange}
                />
                Teacher
              </label>
              {errors.roles && <span className="error">{errors.roles}</span>}
            </div>

            <button type="submit" className="submit-btn">
              Qo'shish
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
