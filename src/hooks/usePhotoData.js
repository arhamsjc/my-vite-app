import { useEffect } from 'react';
import { useTable } from '../hooks/useTable';
import { fetchPhotos } from '../services/api';

export const usePhotoData = () => {
  const { setData } = useTable();

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const photos = await fetchPhotos();
        setData(photos);
      } catch (error) {
        console.error('Failed to load photos:', error);
      }
    };

    loadPhotos();
  }, [setData]);
};