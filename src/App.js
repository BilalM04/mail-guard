import React, { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (result) {
      setResult('');
    }
  };

  const handleClear = () => {
    setEmail('');
    setResult('');
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      setResult('Please enter text in the textbox.');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/predict?message=${encodeURIComponent(email)}`,
        { method: 'GET' }
      );

      const data = await response.json();
      setResult(data.prediction);
    } catch (error) {
      console.error('Error:', error);
      setResult('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="header">
        <i className="fas fa-envelope"></i>
        <h1>MailGuard</h1>
        <i className="fas fa-shield"></i>
      </div>

      <p>Email Spam Classifier</p>

      <textarea
        id="emailInput"
        name="emailInput"
        value={email}
        onChange={handleInputChange}
        placeholder="Enter your email here..."
        disabled={loading}
      />

      <div className="button-container">
        <button onClick={handleClear} disabled={loading}>
          Clear
        </button>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Checking...' : 'Enter'}
        </button>
      </div>

      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p className="loading-text">Analyzing email...</p>
        </div>
      )}

      {result && !loading && (
        <p className="result">
          {result === 'Please enter text in the textbox.' ? (
            result
          ) : (
            <>
              <b>Classification:</b>{' '}
              <span className={result === 'Spam' ? 'spam' : 'not-spam'}>
                {result}
              </span>
            </>
          )}
        </p>
      )}
    </div>
  );
}

export default App;
