// src/App.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = "http://localhost:8000/quotes";

function App() {
  const [quotes, setQuotes] = useState([]);
  const [text, setText] = useState("");

  // Fetch quotes on load
  useEffect(() => {
    axios.get(API).then(res => {
      const data = res.data;
      const formatted = data.map((q, i) => ({ id: i, text: q }));
      setQuotes(formatted);
    });
  }, []);

  // Add a new quote
  const addQuote = async () => {
    if (!text.trim()) return;

    try {
      await axios.post(API, { quote: text });
      const updated = [...quotes, { id: quotes.length, text }];
      setQuotes(updated);
      setText("");
    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  // Delete a quote by index
  const deleteQuote = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      const updated = quotes
        .filter(q => q.id !== id)
        .map((q, i) => ({ id: i, text: q.text }));
      setQuotes(updated);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <>
      <div className="container">
        <h1 className="title">Quote Vault</h1>

        <div className="input-group">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Enter a quote"
            className="input"
          />
          <button onClick={addQuote} className="button">Add</button>
        </div>

        {quotes.length > 0 && (
          <div className="featured-quote">
            <h2>🌟 Featured Quote</h2>
            <p>“{quotes[quotes.length - 1].text}”</p>
          </div>
        )}

        <ul className="quote-list">
          {quotes.map(q => (
            <li key={q.id} className="quote-item">
              <span className="quote-text">“{q.text}”</span>
              <button
                onClick={() => deleteQuote(q.id)}
                className="delete-button"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>

      <footer className="footer">
        Built by <a href="https://github.com/vishveshvar" target="_blank" rel="noopener noreferrer">Vishveshvar</a> 🚀
      </footer>
    </>
  );
}

export default App;