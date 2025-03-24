import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export function usePublications() {
  const { data, error, isLoading } = useSWR('/api/publications', fetcher, {
    revalidateOnFocus: false,  // No volver a hacer fetch al cambiar de pestaña
    revalidateOnReconnect: false, // No hacer fetch al recuperar la conexión
    refreshInterval: 0,  // No refrescar automáticamente los datos
  });

  return {
    publications: data,
    isLoading,
    error,
  };
}