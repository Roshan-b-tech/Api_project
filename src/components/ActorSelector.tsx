import React from 'react';
import { Bot, Calendar, Play } from 'lucide-react';
import type { Actor } from '../types/apify';

interface ActorSelectorProps {
  actors: Actor[];
  selectedActor: Actor | null;
  onActorSelect: (actor: Actor) => void;
  loading: boolean;
}

export const ActorSelector: React.FC<ActorSelectorProps> = ({
  actors,
  selectedActor,
  onActorSelect,
  loading
}) => {
  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Bot className="w-6 h-6 mr-3 text-primary-600" />
        Select an Actor
      </h2>

      {actors.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Bot className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium">No actors found in your account</p>
          <p className="text-gray-400 mt-2">
            Create actors in your Apify Console to see them here
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
          {actors.map((actor) => (
            <button
              key={actor.id}
              onClick={() => onActorSelect(actor)}
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02] ${selectedActor?.id === actor.id
                  ? 'border-primary-500 bg-gradient-to-r from-primary-50 to-primary-100/50 shadow-lg'
                  : 'border-gray-200 hover:border-primary-300 bg-white/50 backdrop-blur-sm'
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate text-lg">
                    {actor.title || actor.name}
                  </h3>
                  <p className="text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                    {actor.description || 'No description available'}
                  </p>
                  <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(actor.modifiedAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Play className="w-4 h-4 mr-2" />
                      {actor.stats.totalRuns} runs
                    </span>
                  </div>
                </div>
                {selectedActor?.id === actor.id && (
                  <div className="ml-4 flex-shrink-0">
                    <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-lg"></div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};