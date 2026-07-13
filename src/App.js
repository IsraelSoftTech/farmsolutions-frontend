import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Favicon from './components/Favicon';
import AnimatedLogo from './components/AnimatedLogo';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ImpactPage from './pages/ImpactPage';
import KnowledgePage from './pages/KnowledgePage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import Admin from './pages/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <Favicon />
      <AnimatedLogo />
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/*" element={
            <>
              <Navigation />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:productId" element={<ProductDetailPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/impact" element={<ImpactPage />} />
                  <Route path="/knowledge" element={<KnowledgePage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
