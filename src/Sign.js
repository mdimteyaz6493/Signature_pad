import React, { useState, useEffect } from 'react';
import SignatureCanvas from "react-signature-canvas";
import "./sign.css";

const Sign = () => {
  const [sign, setsign] = useState(null);
  const [url, seturl] = useState('');
  const [canvasWidth, setCanvasWidth] = useState(600);

  const clear = () => {
    sign.clear();
    seturl('');
  };

  const save = () => {
    seturl(sign.getTrimmedCanvas().toDataURL('image/png'));
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'signature.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cancelImage = () => {
    seturl('');
  };

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth <= 600 ? 350 : 600;
      setCanvasWidth(newWidth);
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
      <span className='title'>Digital Signature.</span>
      <div className="main" style={{ border: "2px solid black", width: canvasWidth, height: 200 }}>
        <SignatureCanvas
          canvasProps={{ width: canvasWidth, height: 200, className: 'sigCanvas' }}
          ref={(data) => setsign(data)}
        />
      </div>
      <div className="btn_grp">
        <button onClick={clear}><i className="fa-solid fa-eraser"></i> Clear</button>
        <button onClick={save}><i className="fa-solid fa-floppy-disk"></i> Save</button>
      </div>
      <div className="result">
        {url ? (
          <>
            <div className="image">
              <img src={url} alt='Signature display here....' />
            </div>
            <div className='btn_grp res'>
              <button onClick={downloadImage}><i className="fa-solid fa-download"></i></button>
              <button onClick={cancelImage}><i className="fa-solid fa-xmark"></i></button>
            </div>
          </>
        ) : (
          <div className="text">
            <p>Sign display here....</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Sign;
