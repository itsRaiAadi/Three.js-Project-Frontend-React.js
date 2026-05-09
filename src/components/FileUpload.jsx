import { useRef, useState } from "react";

function FileUpload({ onUpload, uploading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [localError, setLocalError] = useState("");
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setLocalError("");

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".glb")) {
      setLocalError("Only .glb files are allowed.");
      inputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setLocalError("Please select a .glb file first.");
      return;
    }

    await onUpload(selectedFile);
    setSelectedFile(null);
    inputRef.current.value = "";
  };

  return (
    <form className="upload-card" onSubmit={handleSubmit}>
      <div>
        <h2>Upload 3D Object</h2>
        <p className="muted">
          Upload GLB model files and view them in the browser.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".glb"
        onChange={handleFileChange}
      />

      {selectedFile && (
        <p className="selected-file">Selected: {selectedFile.name}</p>
      )}
      {localError && <p className="error-message">{localError}</p>}

      <button type="submit" className="btn btn-primary" disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Model"}
      </button>
    </form>
  );
}

export default FileUpload;
