import React, { useState } from "react";
import { marked } from "marked";
import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";
import "./styles.css";

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState(
    "# Hello World\n\nThis is a **markdown** editor."
  );

  const handleChange = (e) => {
    setMarkdown(e.target.value);
  };

  const exportToPDF = () => {
    const preview = document.getElementById("preview");

    htmlToImage
      .toPng(preview)
      .then((dataUrl) => {
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("markdown-preview.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
  };

  const copyToClipboard = () => {
    const preview = document.getElementById("preview");
    const range = document.createRange();
    range.selectNode(preview);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    alert("Rich text copied to clipboard!");
  };

  return (
    <div className="editor-container">
      <div className="editor-pane">
        <h2>Markdown Editor</h2>
        <textarea
          value={markdown}
          onChange={handleChange}
          placeholder="Type your markdown here..."
        />
      </div>
      <div className="preview-pane">
        <div className="preview-header">
          <h2>Preview</h2>
          <div className="buttons">
            <button onClick={exportToPDF}>Export PDF</button>
            <button onClick={copyToClipboard}>Copy</button>
          </div>
        </div>
        <div
          id="preview"
          className="preview-content"
          dangerouslySetInnerHTML={{ __html: marked(markdown) }}
        />
      </div>
    </div>
  );
};

export default MarkdownEditor;
