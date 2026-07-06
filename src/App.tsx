import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import WordDetail from './components/WordDetail';
import Alphabet from './components/Alphabet';
import ScrollToTop from './components/ScrollToTop';
import { useLanguage } from './hooks/useLanguage';

function AppContent() {
  const { lang, changeLanguage } = useLanguage();
  const [wpm, setWpm] = useState(20);
  const [frequency, setFrequency] = useState(600);

  return (
    <Layout lang={lang} changeLanguage={changeLanguage}>
      <ScrollToTop />
      <Routes>
        {/* English (Default) Routes */}
        <Route 
          path="/" 
          element={
            <Home 
              lang="en"
              wpm={wpm} 
              setWpm={setWpm} 
              frequency={frequency} 
              setFrequency={setFrequency} 
            />
          } 
        />
        <Route path="/alphabet" element={<Alphabet lang="en" />} />
        <Route 
          path="/words/:slug" 
          element={
            <WordDetail 
              lang="en"
              wpm={wpm} 
              setWpm={setWpm} 
              frequency={frequency} 
              setFrequency={setFrequency} 
            />
          } 
        />

        {/* Localized routes per supported language prefix */}
        {['es', 'pt', 'fr', 'tr', 'de'].map((l) => (
          <React.Fragment key={l}>
            <Route 
              path={`/${l}`} 
              element={
                <Home 
                  lang={l as any}
                  wpm={wpm} 
                  setWpm={setWpm} 
                  frequency={frequency} 
                  setFrequency={setFrequency} 
                />
              } 
            />
            <Route path={`/${l}/alphabet`} element={<Alphabet lang={l as any} />} />
            <Route 
              path={`/${l}/words/:slug`} 
              element={
                <WordDetail 
                  lang={l as any}
                  wpm={wpm} 
                  setWpm={setWpm} 
                  frequency={frequency} 
                  setFrequency={setFrequency} 
                />
              } 
            />
          </React.Fragment>
        ))}
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

