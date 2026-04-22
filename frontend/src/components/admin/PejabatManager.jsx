import React, { useState, useEffect, useRef } from "react";
import pejabatService from "../../services/pejabatService";

const PejabatManager = () => {
  const [pejabatList, setPejabatList] = useState([]);
  const [formData, setFormData] = useState({
    nama: "",
    jabatan: "",
    photo: null,
  });
  const [editId, setEditId] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  // ================= GET DATA =================
  useEffect(() => {
    fetchPejabat();
  }, []);

  const fetchPejabat = async () => {
    try {
      const data = await pejabatService.getPejabat();
      setPejabatList(data);
    } catch (error) {
      console.error(error);
    }
  };

  // ================= INPUT =================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ================= UPLOAD IMAGE =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // validasi sederhana
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Maksimal 5MB");
      return;
    }

    setFormData({ ...formData, photo: file });

    // preview
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImagePreview("");
    setFormData({ ...formData, photo: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ================= SUBMIT =================
  const handleAddOrUpdatePejabat = async (e) => {
    e.preventDefault();

    const formDataUpload = new FormData();
    formDataUpload.append("nama", formData.nama);
    formDataUpload.append("jabatan", formData.jabatan);

    if (formData.photo) {
      formDataUpload.append("foto", formData.photo);
    }

    try {
      if (editId) {
        await pejabatService.updatePejabat(editId, formDataUpload);
        setEditId(null);
      } else {
        await pejabatService.addPejabat(formDataUpload);
      }

      await fetchPejabat();

      // reset
      setFormData({ nama: "", jabatan: "", photo: null });
      setImagePreview("");
      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (error) {
      console.error(error);
    }
  };

  // ================= EDIT =================
  const handleEdit = (pejabat) => {
    setEditId(pejabat.id);
    setFormData({
      nama: pejabat.nama,
      jabatan: pejabat.jabatan,
      photo: null,
    });

    setImagePreview(
      pejabat.foto_url
        ? `http://localhost:5000${pejabat.foto_url}`
        : ""
    );
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus data?")) return;

    await pejabatService.deletePejabat(id);
    fetchPejabat();
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold">Kelola Pejabat Struktural</h2>
        <p className="text-sm text-gray-500">
          Tambah dan kelola data pejabat
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleAddOrUpdatePejabat} className="space-y-4">

          <input
            type="text"
            name="nama"
            placeholder="Nama"
            value={formData.nama}
            onChange={handleInputChange}
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            name="jabatan"
            placeholder="Jabatan"
            value={formData.jabatan}
            onChange={handleInputChange}
            required
            className="w-full border p-2 rounded"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          {imagePreview && (
            <div className="relative w-fit">
              <img
                src={imagePreview}
                className="w-40 h-28 object-cover rounded"
                alt="preview"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-0 right-0 bg-red-500 text-white px-2"
              >
                x
              </button>
            </div>
          )}

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            {editId ? "Update" : "Tambah"}
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="bg-white p-4 rounded-lg shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th>Foto</th>
              <th>Nama</th>
              <th>Jabatan</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {pejabatList.map((p) => (
              <tr key={p.id} className="border-b">
                <td>
                  <img
                    src={
                      p.foto_url
                        ? `http://localhost:5000${p.foto_url}`
                        : <img src="https://picsum.photos/100" />
                    }
                    className="w-12 h-12 object-cover"
                  />
                </td>
                <td>{p.nama}</td>
                <td>{p.jabatan}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Edit</button>
                  <button onClick={() => handleDelete(p.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PejabatManager;