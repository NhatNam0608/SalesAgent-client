import React from "react";
import "./PrivacyPolicy.css";
import Layout from '../../components/Layout/Layout';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="privacy-container">
        <div className="privacy-content">
          <h1 className="privacy-title">Privacy Policy</h1>
          <p className="privacy-intro">
            This Privacy Policy explains how <strong>SalesAgent</strong> ("we", "our", or "us")
            collects, uses, and protects your personal data when you use our application.
          </p>

          <section className="privacy-section">
            <h2>1. Information We Collect</h2>
            <ul>
              <li>Your name</li>
              <li>Email address</li>
              <li>Access tokens used to interact with our Google Spreadsheet datasets</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>2. How We Use Your Data</h2>
            <ul>
              <li>Allow access to datasets stored in Google Sheets</li>
              <li>Authenticate and personalize your experience</li>
              <li>Improve the functionality of SalesAgent</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>3. Data Sharing and Disclosure</h2>
            <p>
              We do not sell, trade, or rent your personal data to third parties. We may share your data
              only in the following circumstances:
            </p>
            <ul>
              <li>With your explicit consent</li>
              <li>When required by law or legal process</li>
              <li>To service providers who help us operate our app (under strict confidentiality agreements)</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal data, including:
            </p>
            <ul>
              <li>Secure HTTPS communication</li>
              <li>OAuth 2.0 authentication for Google services</li>
              <li>Automatic expiration of access tokens</li>
              <li>Access control to limit data visibility based on user authorization</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>5. Third-Party Services</h2>
            <p>
              We use Google Sheets and related APIs. By using SalesAgent, you agree to Google's privacy practices.
              You can review their policies <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">here</a>.
            </p>
          </section>

          <section className="privacy-section">
            <h2>6. International Users</h2>
            <p>
              Your data may be transferred and processed in countries outside your own, in accordance with applicable data protection laws.
            </p>
          </section>

          <section className="privacy-section">
            <h2>7. Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal data by contacting us.
            </p>
          </section>

          <section className="privacy-section">
            <h2>8. Contact Us</h2>
            <p>
              If you have any questions or concerns, feel free to contact us at:{" "}
              <a href="mailto:nhatnamit214@gmail.com">nhatnamit214@gmail.com</a>
            </p>
          </section>

          <p className="privacy-updated">Last updated: May 28, 2025</p>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
