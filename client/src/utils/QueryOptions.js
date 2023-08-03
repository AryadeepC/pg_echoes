const onSuccess = () => {
  console.log("Success");
};
const onError = () => {
  console.log("Error occurred");
};

const options = {
  enabled: true,
  //   cacheTime: 5000,
  staleTime: 120000,
  //   refetchInterval: 160000,
  refetchOnMount: true,
  refetchOnWindowFocus: true,
  refetchIntervalInBackground: true,
  onSuccess,
  onError,
//   select: (data) => { /* Transforms/filters/selects the data returned */
//     return data.data;
//   },
};
export default options;
