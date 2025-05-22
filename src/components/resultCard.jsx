import React from 'react'
import qr from "../assets/qr.png"

function ResultCard() {
  return (
    <div className="rounded-xl shadow-md p-4 bg-white flex items-start space-x-4 max-w-2xl">
      <div className="flex-grow">
        <h2 className="text-lg font-semibold">
          E-learning technology adoption in the Philippines (Example Title 03)
        </h2>
        <p className="text-sm text-gray-600">
          <a href="#" className="text-blue-600 underline">
            MB Garcia
          </a>{" "}
          - The International Journal of E-Learning and ..., 2017 - manuelgarcia.info (Example Author 03)
        </p>
        <p className="text-sm text-gray-700 mt-1">
          students from the Philippines who use Learning Management System (LMS) as part of the Philippines.
          The questionnaires were administered through the learning management system (Example Description 03)
        </p>
      </div>
      <div className="shrink-0">
        <img
          src={qr}
          alt="QR code"
          className="w-12 h-12"
        />
      </div>
    </div> 
  );
}

export default ResultCard