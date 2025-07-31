import { useState, useCallback } from 'react';
import type { Actor, ActorSchema, ExecutionResult } from '../types/apify';

export const useApifyClient = (apiKey: string) => {
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActors = useCallback(async (key?: string) => {
    const keyToUse = key || apiKey;
    if (!keyToUse) return;

    setLoading(true);
    setError(null);

    try {
      // Use direct fetch calls to avoid URL construction issues
      const myActorsResponse = await fetch(`https://api.apify.com/v2/acts?my=true&limit=100&token=${keyToUse}`);

      let allActors: Actor[] = [];

      if (myActorsResponse.ok) {
        const myActorsData = await myActorsResponse.json();
        const myActorsArray = Array.isArray(myActorsData.data?.items) ? myActorsData.data.items : [];
        allActors = [...myActorsArray];
        console.log('My Actors:', myActorsArray);
      }

      // Also try to get store actors
      try {
        const storeActorsResponse = await fetch(`https://api.apify.com/v2/acts?limit=100&token=${keyToUse}`);

        if (storeActorsResponse.ok) {
          const storeActorsData = await storeActorsResponse.json();
          const storeActorsArray = Array.isArray(storeActorsData.data?.items) ? storeActorsData.data.items : [];
          console.log('Store Actors:', storeActorsArray);

          // Combine both arrays, avoiding duplicates
          const existingIds = new Set(allActors.map(actor => actor.id));
          const newStoreActors = storeActorsArray.filter((actor: Actor) => !existingIds.has(actor.id));
          allActors = [...allActors, ...newStoreActors];
        }
      } catch (storeError) {
        console.log('Could not fetch store actors:', storeError);
      }

      console.log('All Actors:', allActors);
      setActors(allActors);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      console.error('Fetch actors error:', err);
      setActors([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const fetchActorSchema = useCallback(async (actorId: string): Promise<ActorSchema | null> => {
    try {
      // Try direct API first, then fallback to proxy if CORS fails
      let response;
      try {
        response = await fetch(`https://api.apify.com/v2/acts/${actorId}/input-schema?token=${apiKey}`);
      } catch (corsError) {
        console.log('CORS error, trying proxy...');
        // Fallback to proxy server
        response = await fetch(`http://localhost:3001/api/acts/${actorId}/input-schema?token=${apiKey}`);
      }

      if (!response.ok) {
        console.error('Schema fetch failed:', response.status, response.statusText);

        // Provide default schema for Google Search Scraper
        if (actorId === 'V8SFJw3gKgULelpok') {
          return {
            title: 'Search Scraper Input (Bing Recommended)',
            type: 'object',
            schemaVersion: 1,
            properties: {
              startUrls: {
                title: 'Start URLs',
                type: 'array',
                description: 'Array of search URLs to scrape (Bing works better with available proxies)',
                items: {
                  title: 'URL Item',
                  type: 'object',
                  properties: {
                    url: {
                      title: 'URL',
                      type: 'string',
                      description: 'Search URL (e.g., https://www.bing.com/search?q=your search term)'
                    }
                  },
                  required: ['url']
                }
              },
              maxRequestRetries: {
                title: 'Max Request Retries',
                type: 'integer',
                description: 'Number of retry attempts for failed requests',
                default: 3
              },
              maxConcurrency: {
                title: 'Max Concurrency',
                type: 'integer',
                description: 'Number of concurrent requests',
                default: 10
              },
              languageCode: {
                title: 'Language Code',
                type: 'string',
                description: 'Language code for search results (e.g., en, es, fr)',
                default: 'en'
              }
            },
            required: ['startUrls']
          };
        }

        return null;
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Failed to fetch actor schema:', err);
      return null;
    }
  }, [apiKey]);

  const executeActor = useCallback(async (actorId: string, input: Record<string, any>): Promise<ExecutionResult> => {
    // Always use the correct proxy configuration for Google Search Scraper
    const inputWithDefaults = {
      startUrls: input.startUrls || [{ "url": "https://duckduckgo.com/?q=artificial+intelligence" }],
      maxRequestRetries: input.maxRequestRetries || 3,
      maxConcurrency: input.maxConcurrency || 10,
      languageCode: input.languageCode || 'en',
      // Use the available proxy group
      proxy: {
        useApifyProxy: true,
        apifyProxyGroups: ['BUYPROXIES94952']
      }
    };

    console.log('Executing actor with input:', JSON.stringify(inputWithDefaults, null, 2));

    // Use direct fetch to avoid CORS issues
    const response = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs?token=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputWithDefaults),
    });

    console.log('Execution response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Execution error:', errorData);
      throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Execution result:', data);

    // Poll for completion
    const runId = data.data.id;
    let finalResult = data.data;

    // Poll every 2 seconds until completion
    while (finalResult.status === 'RUNNING' || finalResult.status === 'READY') {
      await new Promise(resolve => setTimeout(resolve, 2000));

      try {
        const statusResponse = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${apiKey}`);
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          finalResult = statusData.data;
          console.log('Status update:', finalResult.status);
        }
      } catch (error) {
        console.error('Status check failed:', error);
        break;
      }
    }

    return finalResult;
  }, [apiKey]);

  return {
    actors,
    loading,
    error,
    fetchActors,
    fetchActorSchema,
    executeActor,
  };
};