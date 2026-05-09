import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ThreeViewer from '../components/ThreeViewer.jsx';
import { getObjectApi, saveCameraStateApi } from '../api/objectApi.js';

function ViewerPage() {
  const { id } = useParams();
  const [object, setObject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchObject = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getObjectApi(id);
        setObject(data.object);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load object');
      } finally {
        setLoading(false);
      }
    };

    fetchObject();
  }, [id]);

  const handleSaveState = async (cameraState) => {
    setMessage('');
    setError('');

    try {
      const data = await saveCameraStateApi(id, cameraState);
      setObject(data.object);
      setMessage('Camera state saved successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save camera state');
    }
  };

  if (loading) {
    return <p className="muted">Loading viewer...</p>;
  }

  if (error && !object) {
    return (
      <div className="page-header">
        <p className="error-message">{error}</p>
        <Link className="btn btn-outline" to="/dashboard">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const fileBaseUrl = import.meta.env.VITE_FILE_BASE_URL;
  const modelUrl = `${fileBaseUrl}${object.fileUrl}`;

  return (
    <div className="viewer-page">
      <div className="page-header viewer-page-header">
        <div>
          <Link to="/dashboard" className="back-link">
            ← Back to Dashboard
          </Link>
          <h1>{object.originalName}</h1>
        </div>
      </div>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <ThreeViewer modelUrl={modelUrl} initialCameraState={object.cameraState} onSaveState={handleSaveState} />
    </div>
  );
}

export default ViewerPage;
