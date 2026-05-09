import { useEffect, useState } from "react";
import FileUpload from "../components/FileUpload.jsx";
import ObjectCard from "../components/ObjectCard.jsx";
import {
  deleteObjectApi,
  getObjectsApi,
  uploadObjectApi,
} from "../api/objectApi.js";

function Dashboard() {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fetchObjects = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getObjectsApi();
      setObjects(data.objects);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch objects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObjects();
  }, []);

  const handleUpload = async (file) => {
    setUploading(true);
    setError("");

    try {
      await uploadObjectApi(file);
      await fetchObjects();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this 3D object?");
    if (!confirmDelete) return;

    try {
      await deleteObjectApi(id);
      setObjects((previous) => previous.filter((object) => object._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="dashboard-page">
      <section className="page-header">
        <h1>Dashboard</h1>
        <p className="muted">
          Upload GLB files, open them in the viewer, and save your interaction
          state.
        </p>
      </section>

      <FileUpload onUpload={handleUpload} uploading={uploading} />

      {error && <p className="error-message">{error}</p>}

      <section className="objects-section">
        <h2>Your 3D Objects</h2>

        {loading ? (
          <p className="muted">Loading objects...</p>
        ) : objects.length === 0 ? (
          <p className="empty-state">
            No objects uploaded yet. Upload your first GLB model.
          </p>
        ) : (
          <div className="object-grid">
            {objects.map((object) => (
              <ObjectCard
                key={object._id}
                object={object}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
