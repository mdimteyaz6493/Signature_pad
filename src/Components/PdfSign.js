import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const JpgSign = () => {
  const [baseImage, setBaseImage] = useState(null);
  const [overlayImage, setOverlayImage] = useState(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [overlaySize, setOverlaySize] = useState(100); // State for overlay image size
  const [isBaseImageRendered, setIsBaseImageRendered] = useState(false); // To check if base image is rendered
  const [error, setError] = useState(''); // Error message state
  const canvasRef = useRef(null);

  // Base image upload handler
  const onDropBase = (acceptedFiles) => {
    const file = acceptedFiles[0];

    // Check if the file size is less than 500KB
    if (file.size > 500 * 1024) {
      setError('Base image size must be less than 500KB.');
      return; // Prevent the upload
    }

    setError(''); // Clear error message if any
    setBaseImage(URL.createObjectURL(file));
  };

  // Overlay image upload handler
  const onDropOverlay = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setOverlayImage(URL.createObjectURL(file));
  };

  // Dropzone for base image
  const { getRootProps: getBaseRootProps, getInputProps: getBaseInputProps } = useDropzone({
    accept: 'image/jpeg, image/png',
    onDrop: onDropBase,
  });

  // Dropzone for overlay image (signature)
  const { getRootProps: getOverlayRootProps, getInputProps: getOverlayInputProps } = useDropzone({
    accept: 'image/jpeg, image/png',
    onDrop: onDropOverlay,
  });

  // Handle mouse drag
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left - overlaySize / 2, // Adjust to the overlay size
        y: e.clientY - rect.top - overlaySize / 2,
      });
    }
  };

  // Handle download of the combined image
  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/jpeg');
    link.download = 'signed-image.jpg';
    link.click();
  };

  // Effect to update canvas with images
  useEffect(() => {
    if (baseImage) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const baseImg = new Image();
      baseImg.src = baseImage;

      baseImg.onload = () => {
        canvas.width = baseImg.width;
        canvas.height = baseImg.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before redrawing
        ctx.drawImage(baseImg, 0, 0);
        setIsBaseImageRendered(true); // Set state to true when base image is rendered
      };
    }
  }, [baseImage]);

  // Effect to update the canvas when overlay image and position/size change
  useEffect(() => {
    if (baseImage && overlayImage) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const baseImg = new Image();
      const overlayImg = new Image();

      baseImg.src = baseImage;
      overlayImg.src = overlayImage;

      // Redraw the base image and overlay image on each update
      baseImg.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing again
        ctx.drawImage(baseImg, 0, 0); // Draw the base image
        overlayImg.onload = () => {
          ctx.drawImage(overlayImg, position.x, position.y, overlaySize, overlaySize); // Draw the overlay image
        };
      };
    }
  }, [baseImage, overlayImage, position, overlaySize]);

  return (
    <>
      <section className="jpgSigner_sec">
        <h1>JPG Signer</h1>

        {/* Display Error Message */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Base Image Upload */}
        {!baseImage && (
          <div {...getBaseRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', margin: '20px' }} className='upload_box'>
            <input {...getBaseInputProps()} />
            <p>Drag 'n' drop a JPG/PNG image here, or click to select one</p>
          </div>
        )}

        {/* Canvas for Displaying Base Image */}
       <div className="edit_base">
       {baseImage && (
          <div
            style={{ position: 'relative', cursor: 'pointer' }}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            className='baseImg_cont'
          >
            <canvas ref={canvasRef} style={{ border: '1px solid #ccc' }}  className='base_canvas'/>
          </div>
        )}

        {/* Overlay Image Upload after Base Image is Rendered */}
        {isBaseImageRendered && !overlayImage && (
          <div {...getOverlayRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', margin: '20px' }}>
            <input {...getOverlayInputProps()} />
            <p>Drag 'n' drop a signature image (JPG/PNG) here, or click to select one</p>
          </div>
        )}
       </div>

        {/* Slider to adjust overlay image size */}
        {overlayImage && (
          <div style={{ marginTop: '20px' }}>
            <label>
              Signature Size:
              <input
                type="range"
                min="50"
                max="300"
                value={overlaySize}
                onChange={(e) => setOverlaySize(parseInt(e.target.value))}
              />
            </label>
          </div>
        )}

        {/* Download Button */}
        {baseImage && overlayImage && (
          <button onClick={handleDownload} style={{ marginTop: '20px' }}>
            Download Signed Image
          </button>
        )}
      </section>
    </>
  );
};

export default JpgSign;
