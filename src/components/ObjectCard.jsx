import { Link } from "react-router-dom";
import { formatFileSize } from "../utils/formatFileSize.js";

function ObjectCard({ object, onDelete }) {
  return (
    <article className="object-card">
      <div>
        <h3>{object.originalName}</h3>
        <p className="muted">Size: {formatFileSize(object.size)}</p>
        <p className="muted">
          Uploaded: {new Date(object.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="object-actions">
        <Link className="btn btn-primary" to={`/viewer/${object._id}`}>
          Open Viewer
        </Link>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => onDelete(object._id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default ObjectCard;
