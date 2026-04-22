// src/hooks/useBerita.js
import { useState, useEffect } from 'react';
import beritaService from '../services/beritaService';

export const useBerita = () => {
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const publishedBerita = await beritaService.getPublished();
        setBerita(publishedBerita);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, []);

  return { berita, loading, error };
};