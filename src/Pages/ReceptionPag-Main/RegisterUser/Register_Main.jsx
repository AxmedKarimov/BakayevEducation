// Register_Main.jsx
import "./register.scss";
import { LuImageUp } from "react-icons/lu";
import { useRef, useState } from "react";
import { PiImageDuotone } from "react-icons/pi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register_Main() {
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phoneLocal: "", // 9 local digits for +998 XXX…
    parentPhoneLocal: "", // 9 local digits for +998 XXX…
    username: "",
    password: "",
    groupId: "",
    role: "",
    discount: "",
  });
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "firstName":
        if (!value) error = "Ismni kiriting!";
        else if (!/^[A-Z]/.test(value))
          error = "Ism katta harf bilan boshlanishi kerak!";
        break;
      case "lastName":
        if (!value) error = "Familiyani kiriting!";
        else if (!/^[A-Z]/.test(value))
          error = "Familiya katta harf bilan boshlanishi kerak!";
        break;
      case "phoneLocal":
        if (value.length !== 9) error = "To‘liq telefon raqam kiriting!";
        break;
      case "parentPhoneLocal":
        if (user.role === "Student" && value.length !== 9)
          error = "Ota-Ona raqamini to‘liq kiriting!";
        break;
      case "username":
        if (!value) error = "Username kiriting!";
        break;
      case "password":
        if (!value) error = "Parol kiriting!";
        else if (value.length < 8)
          error = "Parol kamida 8 ta belgidan iborat bo‘lishi kerak!";
        break;
      case "confirm":
        if (value !== user.password) error = "Parollar mos emas!";
        break;
      case "groupId":
        if (!value) error = "Guruh tanlang!";
        break;
      case "role":
        if (!value) error = "Roleni tanlang!";
        break;
      case "discount":
        if (user.role === "Student" && (!value || Number(value) <= 0))
          error = "Chegirma miqdorini so'mda kiriting!";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const formatWithSpaces = (digits) => {
    // “991234567” → “99 123 45 67”
    return [
      digits.slice(0, 2),
      digits.slice(2, 5),
      digits.slice(5, 7),
      digits.slice(7, 9),
    ]
      .filter(Boolean)
      .join(" ");
  };

  const handleDigitInput = (fieldLocal) => (e) => {
    let all = e.target.value.replace(/\D/g, "");
    // drop extra leading 998 if pasted
    if (all.startsWith("998")) all = all.slice(3);
    const local = all.slice(0, 9);
    setUser((prev) => ({ ...prev, [fieldLocal]: local }));
    validateField(fieldLocal, local);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const valid = [".png", ".jpg", ".jpeg", ".svg", ".webp"];
      const ext = "." + file.name.split(".").pop().toLowerCase();
      if (!valid.includes(ext)) {
        setErrors((p) => ({
          ...p,
          image:
            "Faqat .png, .jpg, .jpeg, .svg, .webp formatdagi rasm yuklang!",
        }));
        return;
      }
      setSelectedImage(URL.createObjectURL(file));
      setErrors((p) => ({ ...p, image: "" }));
    }
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!selectedImage)
      setErrors((p) => ({ ...p, image: "Iltimos, rasm yuklang!" }));
    Object.entries(user).forEach(([k, v]) => validateField(k, v));
    validateField("confirm", confirm);
    if (Object.values(errors).some(Boolean) || !selectedImage) {
      toast.error("Iltimos, formani to‘g‘ri to‘ldiring!");
      return;
    }
    toast.success("Foydalanuvchi muvaffaqiyatli yaratildi!");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((p) => ({ ...p, [name]: value }));
    validateField(name, value);
  };

  return (
    <div className="register-page">
      <div className="form-container">
        <form className="form" onSubmit={handleSaveUser}>
          <h1>Registration</h1>
          <div className="sect-reg">
            {/* Image Upload */}
            <div className="upload-card">
              <div className="image-card">
                {selectedImage ? (
                  <img src={selectedImage} alt="Uploaded" />
                ) : (
                  <PiImageDuotone className="icon" />
                )}
              </div>
              {errors.image && <p className="error">{errors.image}</p>}
              <div
                className="btn-group"
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept=".png,.jpg,.jpeg,.svg,.webp"
                  onChange={handleImageChange}
                />
                <button type="button" className="btn">
                  Rasmni yuklash <LuImageUp className="ico" />
                </button>
              </div>
            </div>

            {/* Info Fields */}
            <div className="info-card">
              <div className="box1">
                <label>
                  <h4>Firstname</h4>
                  <input
                    name="firstName"
                    type="text"
                    placeholder="Ism..."
                    value={user.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && (
                    <p className="error">{errors.firstName}</p>
                  )}
                </label>

                <label>
                  <h4>Lastname</h4>
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Familiya..."
                    value={user.lastName}
                    onChange={handleChange}
                  />
                  {errors.lastName && (
                    <p className="error">{errors.lastName}</p>
                  )}
                </label>

                <label>
                  <h4>Telefon raqami</h4>
                  <input
                    type="text"
                    placeholder="+998 __ ___ __ __"
                    value={"+998 " + formatWithSpaces(user.phoneLocal)}
                    onChange={handleDigitInput("phoneLocal")}
                    maxLength={17}
                  />
                  {errors.phoneLocal && (
                    <p className="error">{errors.phoneLocal}</p>
                  )}
                </label>

                <label>
                  <h4>Ota-Ona raqami</h4>
                  <input
                    type="text"
                    placeholder="+998 __ ___ __ __"
                    value={"+998 " + formatWithSpaces(user.parentPhoneLocal)}
                    onChange={handleDigitInput("parentPhoneLocal")}
                    maxLength={17}
                  />
                  {errors.parentPhoneLocal && (
                    <p className="error">{errors.parentPhoneLocal}</p>
                  )}
                </label>

                <label>
                  <h4>Username</h4>
                  <input
                    name="username"
                    type="text"
                    placeholder="Username..."
                    value={user.username}
                    onChange={handleChange}
                  />
                  {errors.username && (
                    <p className="error">{errors.username}</p>
                  )}
                </label>

                <button type="submit" className="btn-save">
                  Saqlash
                </button>
              </div>

              <div className="box2">
                <label>
                  <h4>Password</h4>
                  <input
                    name="password"
                    type="password"
                    placeholder="Parol..."
                    value={user.password}
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <p className="error">{errors.password}</p>
                  )}
                </label>

                <label>
                  <h4>Confirm Password</h4>
                  <input
                    type="password"
                    placeholder="Parolni tasdiqlang..."
                    value={confirm}
                    onChange={(e) => {
                      setConfirm(e.target.value);
                      validateField("confirm", e.target.value);
                    }}
                  />
                  {errors.confirm && <p className="error">{errors.confirm}</p>}
                </label>

                <label>
                  <h4>Guruh tanlang</h4>
                  <select
                    name="groupId"
                    value={user.groupId}
                    onChange={handleChange}
                  >
                    <option disabled value="">
                      Select Group
                    </option>
                    <option value="group1">group1</option>
                    <option value="group2">group2</option>
                  </select>
                  {errors.groupId && <p className="error">{errors.groupId}</p>}
                </label>

                <label>
                  <h4>Role tanlang</h4>
                  <select name="role" value={user.role} onChange={handleChange}>
                    <option disabled value="">
                      Select Role
                    </option>
                    <option value="Teacher">Teacher</option>
                    <option value="Student">Student</option>
                  </select>
                  {errors.role && <p className="error">{errors.role}</p>}
                </label>

                {user.role === "Student" && (
                  <label>
                    <h4>Chegirma (so'm)</h4>
                    <input
                      name="discount"
                      type="number"
                      placeholder="Chegirma miqdori..."
                      value={user.discount}
                      onChange={handleChange}
                    />
                    {errors.discount && (
                      <p className="error">{errors.discount}</p>
                    )}
                  </label>
                )}
              </div>
            </div>
          </div>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}

export default Register_Main;
