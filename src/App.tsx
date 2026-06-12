import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import WordDetail from './components/WordDetail';
import Alphabet from './components/Alphabet';
import { useLanguage } from './hooks/useLanguage';

function AppContent() {
  const { lang, changeLanguage } = useLanguage();
  const [wpm, setWpm] = useState(20);
  const [frequency, setFrequency] = useState(600);

  return (
    <Layout lang={lang} changeLanguage={changeLanguage}>
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              lang={lang}
              wpm={wpm} 
              setWpm={setWpm} 
              frequency={frequency} 
              setFrequency={setFrequency} 
            />
          } 
        />
        <Route path="/alphabet" element={<Alphabet lang={lang} />} />
        <Route 
          path="/words/:slug" 
          element={
            <WordDetail 
              lang={lang}
              wpm={wpm} 
              setWpm={setWpm} 
              frequency={frequency} 
              setFrequency={setFrequency} 
            />
          } 
        />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
