import { api, API_ENDPOINTS } from '../config/api';

const adminService = {
  // Home content
  getHomeContent: async () => {
    return await api.get('/content/home');
  },
  
  saveHomeContent: async (data, imageFile) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return await api.post('/content/home', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // About content
  getAboutContent: async () => {
    return await api.get('/content/about');
  },
  
  saveAboutContent: async (data, imageFile) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return await api.post('/content/about/content', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  saveTeamMember: async (data, imageFile) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return await api.post('/content/about/team', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  updateTeamMember: async (id, data, imageFile) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return await api.put(`/content/about/team/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deleteTeamMember: async (id) => {
    return await api.delete(`/content/about/team/${id}`);
  },

  // Products
  getProducts: async () => {
    return await api.get('/content/products');
  },

  saveProduct: async (data, imageFile) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        if (typeof data[key] === 'object') {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return await api.post('/content/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deleteProduct: async (id) => {
    return await api.delete(`/content/products/${id}`);
  },

  // How it works
  getHowItWorks: async () => {
    return await api.get('/content/how-it-works');
  },

  saveStep: async (data) => {
    return await api.post('/content/how-it-works', data);
  },

  updateStep: async (id, data) => {
    return await api.put(`/content/how-it-works/${id}`, data);
  },

  deleteStep: async (id) => {
    return await api.delete(`/content/how-it-works/${id}`);
  },

  // Impact
  getImpact: async () => {
    return await api.get('/content/impact');
  },

  saveStat: async (data) => {
    return await api.post('/content/impact/stats', data);
  },

  saveTestimonial: async (data, imageFile) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return await api.post('/content/impact/testimonials', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  updateTestimonial: async (id, data, imageFile) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return await api.put(`/content/impact/testimonials/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deleteTestimonial: async (id) => {
    return await api.delete(`/content/impact/testimonials/${id}`);
  },

  // Knowledge
  getKnowledge: async () => {
    return await api.get('/content/knowledge');
  },

  saveResource: async (data) => {
    return await api.post('/content/knowledge', data);
  },

  updateResource: async (id, data) => {
    return await api.put(`/content/knowledge/${id}`, data);
  },

  deleteResource: async (id) => {
    return await api.delete(`/content/knowledge/${id}`);
  },

  // Pricing
  getPricing: async () => {
    return await api.get('/content/pricing');
  },

  savePackage: async (data) => {
    const formData = { ...data };
    if (formData.features && typeof formData.features === 'string') {
      formData.features = JSON.parse(formData.features);
    }
    return await api.post('/content/pricing/packages', formData);
  },

  updatePackage: async (id, data) => {
    const formData = { ...data };
    if (formData.features && typeof formData.features === 'string') {
      formData.features = JSON.parse(formData.features);
    }
    return await api.put(`/content/pricing/${id}`, formData);
  },

  deletePackage: async (id) => {
    return await api.delete(`/content/pricing/${id}`);
  },

  // Contact
  getContact: async () => {
    return await api.get('/content/contact');
  },

  saveContactInfo: async (data) => {
    return await api.post('/content/contact/info', data);
  },

  saveBusinessHours: async (data) => {
    return await api.post('/content/contact/hours', data);
  },

  updateBusinessHours: async (id, data) => {
    return await api.put(`/content/contact/hours/${id}`, data);
  },

  updateBusinessHours: async (id, data) => {
    return await api.put(`/content/contact/hours/${id}`, data);
  },

  deleteBusinessHours: async (id) => {
    return await api.delete(`/content/contact/hours/${id}`);
  },

  // Home page specific sections
  saveHeroStat: async (data) => {
    return await api.post('/content/home/hero-stats', data);
  },

  updateHeroStat: async (id, data) => {
    return await api.put(`/content/home/hero-stats/${id}`, data);
  },

  saveProblemStat: async (data) => {
    return await api.post('/content/home/problem-stats', data);
  },

  updateProblemStat: async (id, data) => {
    return await api.put(`/content/home/problem-stats/${id}`, data);
  },

  saveSolutionCard: async (data) => {
    return await api.post('/content/home/solution-cards', data);
  },

  updateSolutionCard: async (id, data) => {
    return await api.put(`/content/home/solution-cards/${id}`, data);
  },

  saveImpactStat: async (data) => {
    return await api.post('/content/home/impact-stats', data);
  },

  updateImpactStat: async (id, data) => {
    return await api.put(`/content/home/impact-stats/${id}`, data);
  },

  // Partners
  getPartners: async () => {
    return await api.get('/content/partners');
  },

  savePartner: async (data, imageFile) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return await api.post('/content/partners', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  updatePartner: async (id, data, imageFile) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return await api.put(`/content/partners/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deletePartner: async (id) => {
    return await api.delete(`/content/partners/${id}`);
  },
};

export default adminService;
