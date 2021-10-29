import useSWR from "swr";

export default function useData() {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR(
    "https://api.wheretheiss.at/v1/satellites/25544",
    fetcher,
  );

  return {
    dataUse: data,
    isLoading: !error && !data,
    isError: error,
  };
}
