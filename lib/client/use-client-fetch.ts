import { useEffect, useState } from 'react';

export const useClientFetch = <T>(url: string | URL | Request, options?: RequestInit): T | null => {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      })
      .then(setData)
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  }, [url, options]);

  return data;
};
