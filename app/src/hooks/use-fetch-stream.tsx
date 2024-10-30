import { useState, useCallback } from "react";
import axios from "axios";

interface UseFetchStreamProps {
  api: string;
  headers?: object;
}

interface FetchStreamBody {
  body?: object;
}

const useFetchStream = ({
  api,
  headers = { "Content-Type": "application/json" },
}: UseFetchStreamProps) => {
  const [completion, setCompletion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Function to fetch streamed text
  const fetchStream = useCallback(
    async (body: FetchStreamBody) => {
      setIsLoading(true);
      setError(null);
      setCompletion(""); // Clear previous data

      try {
        const response = await axios({
          method: "POST",
          url: api,
          headers: headers,
          data: body.body || null,
          responseType: "stream",
          onDownloadProgress: (progressEvent) => {
            const chunk = progressEvent.event.target.response;
            if (chunk) {
              setCompletion((prev) => prev + chunk);
            }
          },
          transformResponse: [
            (data) => {
              // Return the raw data without any transformation
              return data;
            },
          ],
        });

        // Handle the complete response
        if (response.data) {
          const reader = response.data.getReader();
          const decoder = new TextDecoder();
          let resultText = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            resultText += chunk;
          }

          setCompletion(resultText);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(new Error(err.message));
        } else if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("An unknown error occurred"));
        }
      } finally {
        setIsLoading(false);
      }
    },
    [api]
  );

  // Function to complete the request with a new body
  const complete = async (value: string, body: FetchStreamBody) => {
    await fetchStream(body);
    return value;
  };

  // Function to reset the state
  const reset = () => {
    setCompletion("");
    setIsLoading(false);
    setError(null);
  };

  return { completion, isLoading, error, complete, reset };
};

export default useFetchStream;
