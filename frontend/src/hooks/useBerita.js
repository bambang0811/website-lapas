import { useState, useEffect } from 'react';
import beritaService from '../services/beritaService';

export const useBerita = () => {
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchBerita = async () => {
      try {
        const data = await beritaService.getPublished();

        if (isMounted) {
          setBerita(data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Terjadi kesalahan');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBerita();

    return () => {
      isMounted = false;
    };
  }, []);

  return { berita, loading, error };
};