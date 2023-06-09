import "./App.css";
import QRCode from "react-qr-code";
import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // State variables
  const [value, setValue] = useState("");
  const [qrVisible, setQrVisible] = useState(false);
  const [qrCodeSize, setQrCodeSize] = useState(256); // QR code size state
  const qrCodeRef = useRef(null);
  const [theme, setTheme] = useState("light");

  // Event handler for generating QR Code
  const generateQrCodeHandler = () => {
    if (!value) {
      toast.error("Please fill in the input field.");
      return;
    }
    setQrVisible(true);
  };

  // Event handler for copying QR Code as Image
  const copyQrCodeImage = () => {
    if (!qrVisible) {
      toast.error("No QR code available to copy.");
      return;
    }
    html2canvas(qrCodeRef.current).then((canvas) => {
      canvas.toBlob((blob) => {
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item]).then(() => {
          toast.success("QR Code image copied to clipboard.");
        });
      });
    });
  };

  // Event handler for downloading QR Code
  const downloadQrCode = () => {
    if (!qrVisible) {
      toast.error("No QR code available to download.");
      return;
    }
    html2canvas(qrCodeRef.current).then((canvas) => {
      const qrCodeImage = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = qrCodeImage;
      link.download = "qr_code.png";
      link.click();
    });
  };

  // Update QR code size based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setQrCodeSize(200);
      } else if (window.innerWidth > 768 && window.innerWidth <= 1024) {
        setQrCodeSize(256);
      } else {
        setQrCodeSize(300);
      }
    };

    // Initial size set
    handleResize();

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Apply selected theme
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className={`container ${theme}`}>
      {/* App Title */}
      <h1>🌟 Welcome to the QR Code Generator App! 📱</h1>

      {/* Input field */}
      <input
        type="text"
        placeholder="Type URL here"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={value ? "input-filled" : "input-blink"}
      />

      {/* Generate QR Code button */}
      <button onClick={generateQrCodeHandler}>Generate QR Code</button>

      {/* Display QR Code if visible */}
      {qrVisible && (
        <div className="qr-code" ref={qrCodeRef}>
          <QRCode size={qrCodeSize} value={value} /> {/* Use dynamic size */}
        </div>
      )}

      {/* Clear button */}
      <button
        onClick={() => {
          setQrVisible(false);
          setValue("");
        }}
      >
        Clear
      </button>

      {/* Copy QR Code as Image button */}
      <button onClick={copyQrCodeImage}>Copy QR Code as Image</button>

      {/* Download QR Code button */}
      <button onClick={downloadQrCode}>Download QR Code</button>

      {/* Toggle Theme button */}
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Switch Theme
      </button>

      {/* Toast container for displaying notifications */}
      <ToastContainer />
    </div>
  );
}

export default App;
