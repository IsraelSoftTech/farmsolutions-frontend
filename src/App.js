import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import AdminNavigation from './components/AdminNavigation';
import Footer from './components/Footer';
import AdminFooter from './components/AdminFooter';
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
import Admin from './pages/Admin';
import Admin_Home from './pages/Admin_Home';
import Admin_About from './pages/Admin_About';
import Admin_Products from './pages/Admin_Products';
import Admin_HowItWorks from './pages/Admin_HowItWorks';
import Admin_Impact from './pages/Admin_Impact';
import Admin_Knowledge from './pages/Admin_Knowledge';
import Admin_Pricing from './pages/Admin_Pricing';
import Admin_Contact from './pages/Admin_Contact';
import './App.css';

function App() {
  return (
    <Router>
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
                </Routes>
              </main>
              <Footer />
            </>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <>
              <AdminNavigation />
              <main className="main-content">
                <Routes>
                  <Route path="" element={<Admin />} />
                  <Route path="home" element={<Admin_Home />} />
                  <Route path="about" element={<Admin_About />} />
                  <Route path="products" element={<Admin_Products />} />
                  <Route path="how-it-works" element={<Admin_HowItWorks />} />
                  <Route path="impact" element={<Admin_Impact />} />
                  <Route path="knowledge" element={<Admin_Knowledge />} />
                  <Route path="pricing" element={<Admin_Pricing />} />
                  <Route path="contact" element={<Admin_Contact />} />
                </Routes>
              </main>
              <AdminFooter />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
