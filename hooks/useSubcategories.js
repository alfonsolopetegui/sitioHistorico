import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export function useSubcategories() {
  const { data, error, isLoading } = useSWR("/api/subcategories", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });
  console.log(data);
  return {
    subcategories: data,
    isLoading,
    error,
  };
}
