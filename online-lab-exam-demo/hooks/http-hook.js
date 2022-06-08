import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorDetails, setErrorDetails] = useState([]);

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          setErrorTitle(responseData.error);
          if (responseData.errorDetails[0].msg) {
            setErrorDetails([responseData.errorDetails[0].msg]);
          } else {
            setErrorDetails(responseData.errorDetails);
          }
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setErrorTitle("Server Error");
        setErrorDetails([
          "Error connecting to server, please try again later."
        ]);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setErrorTitle("");
    setErrorDetails([]);
  };

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, errorTitle, errorDetails, sendRequest, clearError };
};
