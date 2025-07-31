import { useState } from 'react';
import { AuthForm } from './components/AuthForm';
import { ActorSelector } from './components/ActorSelector';
import { SchemaViewer } from './components/SchemaViewer';
import { ExecutionPanel } from './components/ExecutionPanel';
import { Header } from './components/Header';
import { useApifyClient } from './hooks/useApifyClient';
import type { Actor, ActorSchema } from './types/apify';

function App() {
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  const [actorSchema, setActorSchema] = useState<ActorSchema | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { actors, loading, error, fetchActors, fetchActorSchema, executeActor } = useApifyClient(apiKey);

  const handleAuth = async (key: string) => {
    setApiKey(key);
    try {
      await fetchActors(key);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Authentication failed:', err);
    }
  };

  const handleActorSelect = async (actor: Actor) => {
    setSelectedActor(actor);
    try {
      const schema = await fetchActorSchema(actor.id);
      setActorSchema(schema);
    } catch (err) {
      console.error('Failed to fetch schema:', err);
      setActorSchema(null);
    }
  };

  const handleExecution = async (inputs: Record<string, any>) => {
    if (!selectedActor) {
      throw new Error('No actor selected');
    }

    try {
      const result = await executeActor(selectedActor.id, inputs);
      if (!result) {
        throw new Error('Execution failed - no result returned');
      }
      return result;
    } catch (err) {
      console.error('Execution failed:', err);
      throw err;
    }
  };

  const handleLogout = () => {
    setApiKey('');
    setIsAuthenticated(false);
    setSelectedActor(null);
    setActorSchema(null);
  };

  return (
    <div className="min-h-screen">
      {/* Enhanced background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full blur-2xl floating-animation" style={{ animationDelay: '4s' }}></div>
      </div>

      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      <main className="container mx-auto px-6 py-12 max-w-7xl relative z-10">
        {!isAuthenticated ? (
          <div className="max-w-5xl mx-auto">
            <AuthForm onAuth={handleAuth} loading={loading} error={error} />
          </div>
        ) : (
          <div className="space-y-12 animate-slide-up">
            <ActorSelector
              actors={actors}
              selectedActor={selectedActor}
              onActorSelect={handleActorSelect}
              loading={loading}
            />

            {selectedActor && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                <SchemaViewer
                  actor={selectedActor}
                  schema={actorSchema}
                />

                <ExecutionPanel
                  actor={selectedActor}
                  schema={actorSchema}
                  onExecute={handleExecution}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;