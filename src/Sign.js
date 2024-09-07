import React, { useState, useEffect } from 'react';
import SignatureCanvas from "react-signature-canvas";
import { IoMdDownload } from "react-icons/io";

import { GrPowerReset } from "react-icons/gr";
import { FaEye } from "react-icons/fa";

import "./sign.css";

const Sign = () => {
  const [sign, setsign] = useState(null);
  const [url, seturl] = useState('');
  const [canvasWidth, setCanvasWidth] = useState(600);
  const [canvasHeight, setCanvasHeight] = useState(300); // Added canvasHeight state
  const [penColor, setPenColor] = useState('#000000'); // Default color: black


  // Function to clear the signature
  const clear = () => {
    sign.clear();
    seturl('');
  };

  // Function to save the signature as a data URL
  const save = (format = 'image/png') => {
    seturl(sign.getTrimmedCanvas().toDataURL(format));
  };

 // Function to download the signature in the selected format
const downloadImage = (format = 'png') => {
  const canvas = sign.getTrimmedCanvas();
  const context = canvas.getContext('2d');

  if (format === 'jpeg') {
    // Draw a white background first for JPG format
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempContext = tempCanvas.getContext('2d');

    // Fill the background with white
    tempContext.fillStyle = 'white';
    tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw the signature on top of the white background
    tempContext.drawImage(canvas, 0, 0);

    // Export the final image with white background
    const link = document.createElement('a');
    link.href = tempCanvas.toDataURL(`image/${format}`);
    link.download = `signature.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // For other formats like PNG, use the original canvas
    const link = document.createElement('a');
    link.href = canvas.toDataURL(`image/${format}`);
    link.download = `signature.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};


  // Function to cancel the saved signature
  const cancelImage = () => {
    seturl('');
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setCanvasWidth(300); // Set width to 280px for mobile
        setCanvasHeight(160); // Set height to 200px for mobile
      } else {
        setCanvasWidth(600); // Set width to 600px for larger screens
        setCanvasHeight(300); // Set height to 300px for larger screens
      }
    };

    // Initial setup on mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <section className='sign_sec'>
       <div className="sec_title">
       <span className='title'>SIGNPAD</span>
       <span> A Digital Signature pad</span>
       </div>
        <div className="sign_app">
        <div className="canvas">
       <div className="color_picker">
       <div className="color_picker">
  <button onClick={() => setPenColor('red')} style={{ backgroundColor: 'red' }} className={penColor === 'red' ? "select" : ""}></button>
  <button onClick={() => setPenColor('blue')} style={{ backgroundColor: 'blue' }} className={penColor === 'blue' ? "select" : ""}></button>
  <button onClick={() => setPenColor('black')} style={{ backgroundColor: 'black' }} className={penColor === 'black' ? "select" : ""}></button>
  <button onClick={() => setPenColor('green')} style={{ backgroundColor: 'green' }} className={penColor === 'green' ? "select" : ""}></button>
  <button onClick={() => setPenColor('pink')} style={{ backgroundColor: 'pink' }} className={penColor === 'pink' ? "select" : ""}></button>
</div>

        </div>

        <div className="main" style={{ border: "2px solid black", width: canvasWidth, height: canvasHeight }}>
          <SignatureCanvas
            canvasProps={{ width: canvasWidth, height: canvasHeight, className: 'sigCanvas' }}
            penColor={penColor}  // Apply selected pen color
            minWidth={2}  // Default pen thickness
            maxWidth={2}  // Keep min and max the same for uniform thickness
            ref={(data) => setsign(data)}
            className="sign_canvas"
          />
        </div>

        <div className="btn_grp">
          <button onClick={clear}><GrPowerReset />Reset</button>
          <button onClick={() => save()}><FaEye /> View</button>
        </div>
       </div>
       

        {/* Result and Download Options */}
        <div className="result">
          {url ? (
            <>
              <div className="image">
                <img src={url} alt='Signature display here....' />
              </div>
              <div className='btn_grp2 res'>
                <button onClick={() => downloadImage('png')}><IoMdDownload /> PNG</button>
                <button onClick={() => downloadImage('jpeg')}><IoMdDownload />  JPEG</button>
                <button onClick={cancelImage}><i className="fa-solid fa-xmark"></i> Cancel</button>
              </div>
            </>
          ) : (
            <div className="text">
              <p>Sign display here....</p>
            </div>
          )}
        </div>
        </div>
      </section>
    </>
  );
};

export default Sign;
