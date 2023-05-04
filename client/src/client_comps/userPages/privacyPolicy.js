import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
    const location = useLocation();
    const nav = useNavigate();
    const formData = location.state?.formData || {};
  
    const goBack = () => {
      nav("/signup", { state: { formData: formData } });
    };
  
    return (
      <div className="container-fluid p-4 bg-light">
        <div className="row justify-content-center">
          <div className="col-11 col-md-6 p-4 bg-white shadow rounded-2">
            <h1 className="text-center mb-4">Privacy Policy</h1>
            <p>This is the privacy policy for our non-profit quiz app web application.</p>
            <p>We collect certain personal information from our users in order to provide the quiz app service. This information may include your name and email address.</p>
            <p>We take the privacy of our users seriously and will never sell or share this information with third parties without your consent.</p>
            <p>By using our service, you agree to the terms of this privacy policy.</p>
            <div className="mt-4 text-center">
              <button className="btn btn-primary w-50 mt-3" onClick={goBack}>
                Go back to sign up form
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  