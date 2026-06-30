"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type PollingState<T> = {
  data: T | null;
  error: string;
  isLoading: boolean;
  lastUpdatedAt: number | null;
  isFresh: boolean;
};

type PollingOptions = {
  enabled: boolean;
  intervalMs?: number;
  refreshKey?: number;
};

export function useNexoPolling<T>(
  fetcher: () => Promise<T>,
  { enabled, intervalMs, refreshKey = 0 }: PollingOptions,
): PollingState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const [isFresh, setIsFresh] = useState(false);
  const isFetchingRef = useRef(false);
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    if (!enabled || isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setError("");

    try {
      const nextData = await fetcher();
      setData(nextData);
      setLastUpdatedAt(Date.now());
      setIsFresh(true);

      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current);
      }

      pulseTimeoutRef.current = setTimeout(() => {
        setIsFresh(false);
      }, 900);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Error al conectar con Nexo Backend");
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [enabled, fetcher]);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    void load();

    if (!intervalMs) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      void load();
    }, intervalMs);

    return () => {
      window.clearInterval(interval);
    };
  }, [enabled, intervalMs, load, refreshKey]);

  useEffect(
    () => () => {
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current);
      }
    },
    [],
  );

  return {
    data,
    error,
    isLoading,
    lastUpdatedAt,
    isFresh,
  };
}
