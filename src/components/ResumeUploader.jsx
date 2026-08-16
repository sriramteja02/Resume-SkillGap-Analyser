import { UploadCloud, FileText, X, RefreshCw } from "lucide-react";
import { useRef, useState } from "react";
import { validateFile } from "../utils/validation";
export default function ResumeUploader({ file, setFile }) {
  const ref = useRef();
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState("");
  const choose = (f) => {
    const e = validateFile(f);
    setError(e);
    if (!e) setFile(f);
  };
  return (
    <div className="upload-wrap">
      <div
        className={`dropzone ${drag ? "drag" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          choose(e.dataTransfer.files[0]);
        }}
        onClick={() => ref.current.click()}
      >
        <input
          ref={ref}
          hidden
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => choose(e.target.files[0])}
        />
        {file ? (
          <div className="file-row" onClick={(e) => e.stopPropagation()}>
            <FileText />
            <div>
              <strong>{file.name}</strong>
              <span>
                {(file.size / 1024).toFixed(1)} KB · {file.type || "document"}
              </span>
            </div>
            <button className="icon-btn" onClick={() => setFile(null)}>
              <X />
            </button>
            <button className="icon-btn" onClick={() => ref.current.click()}>
              <RefreshCw />
            </button>
          </div>
        ) : (
          <>
            <UploadCloud size={38} />
            <strong>Drag & Drop Your Resume Here</strong>
            <span>or Browse Files</span>
            <small>PDF, DOC, DOCX · Max 5 MB</small>
          </>
        )}
      </div>
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}
