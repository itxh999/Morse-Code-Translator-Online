import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import WordDetail from './components/WordDetail';
import Alphabet from './components/Alphabet';

function App() {
  const [wpm, setWpm] = useState(20);
  const [frequency, setFrequency] = useState(600);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                wpm={wpm} 
                setWpm={setWpm} 
                frequency={frequency} 
                setFrequency={setFrequency} 
              />
            } 
          />
          <Route path="/alphabet" element={<Alphabet />} />
          <Route 
            path="/words/:slug" 
            element={
              <WordDetail 
                wpm={wpm} 
                setWpm={setWpm} 
                frequency={frequency} 
                setFrequency={setFrequency} 
              />
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
