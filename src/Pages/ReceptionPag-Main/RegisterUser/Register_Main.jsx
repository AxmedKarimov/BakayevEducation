import "./register.scss";
import { LuImageUp } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { PiImageDuotone } from "react-icons/pi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiCall from "../../../Utils/ApiCall";

function Register_Main() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const [groups, setGroups] = useState([]);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phoneLocal: "",
    parentPhoneLocal: "",
    username: "",
    password: "",
    groupId: "",
    role: "",
    discount: "",
    discountTitle: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    getGroups();
  }, []);

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
        if (user.role === "ROLE_STUDENT" && value.length !== 9)
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
      case "role":
        if (!value) error = "Roleni tanlang!";
        break;
      case "discount":
        if (user.role === "ROLE_STUDENT" && (!value || Number(value) <= 0))
          error = "Chegirma miqdorini so'mda kiriting!";
        break;
      case "discountTitle":
        if (user.role === "ROLE_STUDENT" && !value)
          error = "Chegirma sababi kiriting!";
        break;
      default:
        break;
    }
    return error;
  };

  const formatWithSpaces = (digits) => {
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
    if (all.startsWith("998")) all = all.slice(3);
    const local = all.slice(0, 9);
    setUser((prev) => ({ ...prev, [fieldLocal]: local }));
    setErrors((prev) => ({ ...prev, [fieldLocal]: validateField(fieldLocal, local) }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const valid = [".png", ".jpg", ".jpeg", ".svg", ".webp"];
      const ext = "." + file.name.split(".").pop().toLowerCase();
      if (!valid.includes(ext)) {
        setErrors((p) => ({
          ...p,
          image: "Faqat .png, .jpg, .jpeg, .svg, .webp formatdagi rasm yuklang!",
        }));
        return;
      }
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
      setErrors((p) => ({ ...p, image: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: validateField(name, value) }));
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();

    const newErrors = {};
    for (let [key, value] of Object.entries(user)) {
      const err = validateField(key, value);
      if (err) newErrors[key] = err;
    }

    if (!imageFile) {
      newErrors.image = "Iltimos, rasm yuklang!";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Iltimos, formani to‘g‘ri to‘ldiring!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("firstName", user.firstName);
      formData.append("lastName", user.lastName);
      formData.append("phone", user.phoneLocal);
      formData.append("parentPhone", user.parentPhoneLocal);
      formData.append("username", user.username);
      formData.append("password", user.password);
      if (user.groupId) {
        formData.append("groupId", user.groupId);
      }
      formData.append("role", user.role);
      if (user.role === "ROLE_STUDENT") {
        formData.append("discount", user.discount);
        formData.append("discountTitle", user.discountTitle);
      }
      formData.append("image", imageFile);

      await ApiCall("/auth/register", { method: "POST" }, formData);

      toast.success("Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi!");

      setUser({
        firstName: "",
        lastName: "",
        phoneLocal: "",
        parentPhoneLocal: "",
        username: "",
        password: "",
        groupId: "",
        role: "",
        discount: "",
        discountTitle: "",
      });
      fileInputRef.current.value = null;
      setSelectedImage(null);
      setErrors({});
    } catch (err) {
      toast.error("Ro‘yxatdan o‘tishda xatolik yuz berdi!");
    }
  };

  const getGroups = async () => {
    try {
      const res = await ApiCall("/group/getNames", { method: "GET" });
      setGroups(res.data);
    } catch (error) {
      console.error("Gruppalarni olishda xatolik:", error);
    }
  };

  return (
      <div className="register-page">
        <div className="form-container">
          <form className="form" onSubmit={handleSaveUser}>
            <h1>Registration</h1>
            <div className="sect-reg">
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
                  <div className="btn">
                    Rasmni yuklash <LuImageUp className="ico" />
                  </div>
                </div>
              </div>

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
                    {errors.firstName && <p className="error">{errors.firstName}</p>}
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
                    {errors.lastName && <p className="error">{errors.lastName}</p>}
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
                    {errors.phoneLocal && <p className="error">{errors.phoneLocal}</p>}
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
                    {errors.username && <p className="error">{errors.username}</p>}
                  </label>

                  <button type="submit" className="btn-save">Save</button>
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
                    {errors.password && <p className="error">{errors.password}</p>}
                  </label>

                  <label>
                    <h4>Guruh tanlang</h4>
                    <select name="groupId" value={user.groupId} onChange={handleChange}>
                      <option disabled value="">Select Group</option>
                      {groups.map((group) => (
                          <option key={group.id} value={group.id}>{group.name}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <h4>Role tanlang</h4>
                    <select name="role" value={user.role} onChange={handleChange}>
                      <option disabled value="">Select Role</option>
                      <option value="ROLE_TEACHER">Teacher</option>
                      <option value="ROLE_STUDENT">Student</option>
                    </select>
                    {errors.role && <p className="error">{errors.role}</p>}
                  </label>

                  {user.role === "ROLE_STUDENT" && (
                      <>
                        <label>
                          <h4>Chegirma (so'm)</h4>
                          <input
                              name="discount"
                              type="number"
                              placeholder="Chegirma miqdori..."
                              value={user.discount}
                              onChange={handleChange}
                          />
                          {errors.discount && <p className="error">{errors.discount}</p>}
                        </label>

                        <label>
                          <h4>Discount title</h4>
                          <input
                              name="discountTitle"
                              type="text"
                              placeholder="Discount title..."
                              value={user.discountTitle}
                              onChange={handleChange}
                          />
                          {errors.discountTitle && <p className="error">{errors.discountTitle}</p>}
                        </label>
                      </>
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
