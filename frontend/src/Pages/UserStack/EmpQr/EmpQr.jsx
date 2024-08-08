import React, { useEffect, useRef, useState } from 'react'
import QRCode from "react-qr-code";
import LocalStore from '../../../Store/LocalStore';
import html2canvas from 'html2canvas';
import jsQR from 'jsqr';
import EmpService from '../../../Services/Emp/EmpService';
import DateFormatter from '../../../Utils/Constants/DateFormatter';

export default function EmpQr() {
  const empMail = LocalStore.getToken().email
  const emptoken = LocalStore.getToken().token
  const [employee, setEmployee] = useState({})

  const elementRef = useRef(null);
  const captureElement = () => {
    const element = elementRef.current;
    html2canvas(element)
      .then((canvas) => {
        const image = canvas.toDataURL('image/png');
        console.log(image);
        downloadPng(image)
      })
      .catch((error) => {
        console.error('Error capturing element:', error);
      });
  };
  const downloadPng = (baseImg) => {
    const byteString = atob(baseImg.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [scanResultWebCam, setScanResultWebCam] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleErrorWebCam = (error) => {
    console.log(error);
  };

  const handleScanWebCam = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) {
      fetchEmployeeDetails()
      setScanResultWebCam(code.data);
      setTimeout(() => {
        window.location.reload();
        setEmployee({})
      }, 5000);
    } else {
      requestAnimationFrame(handleScanWebCam);
    }
  };
  const fetchEmployeeDetails = async () => {
    try {
      const response = await EmpService.getEmployee(empMail);
      if (response.data.code === 200) {
        const employee = response.data.data;
        setEmployee(employee);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const constraints = { video: { facingMode: 'environment' } };
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <div className="body-wrapper">
      <div className="container-fluid">
      <div className="row">
          <div className="col-4"></div>
          <div className="col-5">
            <div className="card p-4 w-100 shadow-sm">
              <h1 className='fw-bolder'>SCAN QR</h1>
              <h5 className='mt-3 opacity-75'>
                Scan the QR code for instant payments" suggests utilizing QR code technology for swift transaction processing. QR codes encode payment details, allowing users to scan them with their mobile devices to initiate payments instantly. This efficient method enhances convenience and security, facilitating seamless transactions between parties.
              </h5>
              <h5 className='mt-3 opacity-75'>
                This technology simplifies payments by encoding transaction details for quick scanning. Users can effortlessly initiate payments with their mobile devices, ensuring convenience and security. This method streamlines transactions, providing a seamless experience for both merchants and customers.
              </h5>
              <h6 className='mt-3 text-end text-success fw-bolder font-italic'>100% Trusted Portal</h6>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-1"></div>
          <div className="col-5">
            <div className="card p-4 w-100 shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className='fw-bolder'>QR Code</h6>
                <h6>📳</h6>
              </div>
              <div className='p-4 bg-white' ref={elementRef}>
                <QRCode
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={empMail}
                  viewBox={`0 0 256 256`}
                />
              </div>
              <button className="btn btn-primary mt-3" onClick={captureElement}>Download QR Code</button>
            </div>
          </div>
          <div className="col-5">
            <div className="card p-4">
              <video style={{ width: '100%' }} ref={videoRef} autoPlay playsInline muted onCanPlay={() => handleScanWebCam()} />
              <canvas style={{ display: 'none' }} ref={canvasRef} width={640} height={480} />
              <>
                <div className="row">
                  <h2 className='text-center fw-bolder my-3 text-primary'>User Details</h2>
                </div>
                <div className="row mt-3">
                  <div className="col-6">
                    <h5>Name: {employee.name}</h5>
                  </div>
                  <div className="col-6">
                    <h5>Email: {employee.email}</h5>
                  </div>
                  <div className="col-6">
                    <h5>Age: {employee.age}</h5>
                  </div>
                  <div className="col-6">
                    <h5>Role: {employee.role}</h5>
                  </div>
                  <div className="col-6">
                    <h5>Gender: {employee.gender}</h5>
                  </div>
                  <div className="col-6">
                    <h5>Nic: {employee.nic}</h5>
                  </div>
                  <div className="col-12">
                    <h5>Address: {employee.address}</h5>
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
       
      </div>
    </div>
  )
}
