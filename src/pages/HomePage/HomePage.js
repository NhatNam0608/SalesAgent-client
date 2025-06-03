import React from 'react';
import Layout from '../../components/Layout/Layout';
import './HomePage.css';

const HomePage = () => {
  return (
    <Layout>
      <div className="homepage-container">
        <h1 className="homepage-title">Welcome to SalesAgent</h1>
        <p className="homepage-subtitle">
          Your smart assistant for selling Solar Panels on LinkedIn.
        </p>

        <div className="steps-container">
          <div className="step">
            <h2>1. Create Your Account</h2>
            <p>Start by signing up to gain access to all features of our platform.</p>
          </div>

          <div className="step">
            <h2>2. Create a Campaign</h2>
            <p>Launch a campaign to find and engage potential customers.</p>
          </div>

          <div className="step">
            <h2>3. Choose Target Locations</h2>
            <p>
              Use our interactive map to select specific locations. You can either click directly on the map
              or search by city, region, or coordinates.
            </p>
          </div>

          <div className="step">
            <h2>4. Get Customer Insights</h2>
            <p>
              We'll show you a filtered list of factories that <strong>do not have solar panels installed</strong> on their rooftops.
            </p>
          </div>

          <div className="step">
            <h2>5. Crawl LinkedIn Data</h2>
            <p>We help you collect public data of your target customers from LinkedIn profiles.</p>
          </div>

          <div className="step">
            <h2>6. Generate Outreach Message</h2>
            <p>Our system assists you in creating effective and personalized messages for your outreach.</p>
          </div>

          <div className="step">
            <h2>7. Send Messages Automatically</h2>
            <p>Finally, we help you send those messages to your prospects directly through LinkedIn.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
