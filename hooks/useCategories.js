import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export function useCategories() {
  const { data, error, isLoading } = useSWR('/api/categories', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });

  return {
    categories: data,
    isLoading,
    error,
  };
}