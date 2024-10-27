import { useState, useCallback } from "react";

interface UseFetchStreamProps {
  api: string;
}

interface FetchStreamBody {
  body?: object;
}

const useFetchStream = ({ api }: UseFetchStreamProps) => {
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
        const response = await fetch(api, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: body.body ? JSON.stringify(body.body) : null,
        });


        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        if (!response.body) {
          throw new Error("ReadableStream not supported");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let resultText = ""; // Initialize to store entire response

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          resultText += chunk; // Append chunk to resultText
          setCompletion((prev) => prev + chunk); // Update completion incrementally
        }

        setCompletion(resultText); 
      } catch (err) {
        if (err instanceof Error) {
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
    console.log(value);
    await fetchStream(body);
  };

  return { completion, isLoading, error, complete };
};

export default useFetchStream;
