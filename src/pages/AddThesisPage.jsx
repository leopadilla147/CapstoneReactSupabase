import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from 'lucide-react';
import logo from "../assets/logo.png";
import bg from "../assets/bg-gradient.png";
import {supabase} from "../connect-supabase.js";
import QRCode from "qrcode";

const AddThesisPage = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [abstract, setAbstract] = useState('');
  const [college, setCollege] = useState('');
  const [batch, setBatch] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState('');

  const generateAndUploadQRCode = async (fileUrl) => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(fileUrl, {
        width: 400,
        margin: 2
      });

      const blob = await fetch(qrCodeDataUrl).then(res => res.blob());
      
      const qrFileName = `qr-code/qr-${Date.now()}.png`;
      
      // Upload QR code to storage
      const { error: uploadError } = await supabase.storage
        .from('thesis-files')
        .upload(qrFileName, blob, {
          contentType: 'image/png'
        });

      if (uploadError) throw uploadError;

      // Get public URL of the uploaded QR code
      const { data: { publicUrl } } = supabase.storage
        .from('thesis-files')
        .getPublicUrl(qrFileName);

      return publicUrl;
    } catch (err) {
      console.error('QR Code generation/upload failed:', err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !author || !abstract || !college || !batch || !file) {
      setError('Please fill in all fields and upload a file.');
      return;
    }

    try {
      // Upload thesis PDF file
      const fileExt = file.name.split('.').pop();
      const originalFileName = file.name.replace(`.${fileExt}`, '');
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const fileName = `${originalFileName}-${uniqueId}.${fileExt}`;
      const filePath = `thesis-pdfs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('thesis-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL of the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('thesis-files')
        .getPublicUrl(filePath);

      // Generate and upload QR code
      const qrCodeImageUrl = await generateAndUploadQRCode(publicUrl);

      // Insert thesis data into database
      const { data, error: insertError } = await supabase
        .from('thesestwo')
        .insert([
          { 
            title, 
            author, 
            abstract, 
            college, 
            batch, 
            file_url: publicUrl,
            file_name: fileName,
            qr_code_url: qrCodeImageUrl,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (insertError) throw insertError;

      // Show success and QR code
      setSuccess('Thesis added successfully!');
      setQrCodeUrl(publicUrl);
      setShowQrModal(true);
      
      // Reset form
      setTitle('');
      setAuthor('');
      setAbstract('');
      setCollege('');
      setBatch('');
      setFile(null);

    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to add thesis. Please try again.');
    }
  };

  const handleBack = () => {
    navigate("/admin-homepage");
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      setError('Please upload a PDF file only.');
    }
  };

  const closeQrModal = () => {
    setShowQrModal(false);
    setQrCodeUrl('');
  };

  const handleLogOut = () => {
    navigate('/')
  }

  return (
    <div className="w-screen h-screen bg-cover bg-center bg-no-repeat font-sans flex flex-col" style={{ backgroundImage: `url(${bg})` }}>
      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 py-4 text-white">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="CNSC Logo" className="w-16 h-16" />
          <div>
            <h1 className="font-bold text-lg leading-tight">CAMARINES NORTE STATE COLLEGE</h1>
            <p className="text-sm">F. Pimentel Avenue, Daet, Camarines Norte, Philippines</p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative">
          <Bell className="text-white cursor-pointer" onClick={toggleNotifications} />
          {showNotifications && (
            <div className="absolute top-8 right-0 bg-white text-black p-4 rounded-xl shadow-lg w-60 animate-fadeIn z-50">
              <p className="font-bold text-[#7d0010] mb-2">Notifications</p>
              <ul className="text-sm space-y-2">
                <li className="border-b pb-1">1 new thesis uploaded</li>
                <li className="border-b pb-1">Student borrowed a thesis</li>
                <li>System backup completed</li>
              </ul>
            </div>
          )}
          <button onClick={handleBack} className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md font-semibold">Back</button>
          <button onClick={handleLogOut} className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md font-semibold">Log Out</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="bg-white/60 backdrop-blur-sm mx-8 my-6 p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-[#990000]">THESIS HUB</h2>
        <p className="text-lg font-semibold text-[#990000] mb-6">Adding of Thesis</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}

          <input
            type="text"
            placeholder="Thesis Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-4 rounded-lg bg-gray-300 text-black text-base"
          />
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="p-4 rounded-lg bg-gray-300 text-black text-base"
          />

          <select 
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="p-4 rounded-lg bg-gray-300 text-black text-base"
          >
            <option value="">Select College</option>
            <option value="College of Arts and Sciences">College of Arts and Sciences</option>
            <option value="College of Business and Public Administration">College of Business and Public Administration</option>
            <option value="College of Education">College of Education</option>
            <option value="College of Engineering">College of Engineering</option>
            <option value="College of Information and Communications Technology">College of Information and Communications Technology</option>
          </select>

          <select 
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            className="p-4 rounded-lg bg-gray-300 text-black text-base"
          >
            <option value="">Select Batch</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>

          <textarea
            placeholder="Abstract"
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            className="p-4 rounded-lg bg-gray-300 text-black text-base w-full h-40 resize-none"
          />

          <div className="flex justify-between items-center">
            <div>
              {file && (
                <p className="text-sm text-gray-700">
                  Selected file: {file.name}
                </p>
              )}
            </div>
            <label htmlFor="fileUpload" className="cursor-pointer bg-red-800 text-white px-4 py-2 rounded-lg">
              {file ? 'Change PDF File' : 'Upload PDF File'}
            </label>
            <input 
              type="file" 
              id="fileUpload" 
              accept="application/pdf" 
              onChange={handleFileChange}
              hidden 
            />
          </div>
          
          <button
            type="submit"
            className="bg-red-800 text-white px-6 py-2 rounded-lg text-base font-semibold self-end mt-2"
          >
            Add Thesis
          </button>
        </form>
      </main>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold text-[#990000] mb-4">Thesis Added Successfully!</h3>
            <p className="mb-4">Scan this QR code to access the thesis:</p>
            
            <div className="flex justify-center mb-4 p-2 bg-white">
              {qrCodeImage && (
                <img src={qrCodeImage} alt="QR Code" className="w-48 h-48" />
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-4 break-words">
              <span className="font-semibold">URL:</span> {qrCodeUrl}
            </p>
            
            <button
              onClick={closeQrModal}
              className="bg-red-800 text-white px-4 py-2 rounded-lg w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddThesisPage;