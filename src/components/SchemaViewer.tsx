import React from 'react';
import { FileText, Info } from 'lucide-react';
import type { Actor, ActorSchema, SchemaProperty } from '../types/apify';

interface SchemaViewerProps {
  actor: Actor;
  schema: ActorSchema | null;
}

export const SchemaViewer: React.FC<SchemaViewerProps> = ({ actor, schema }) => {
  const renderProperty = (key: string, property: SchemaProperty, level = 0) => {
    const indent = level * 16;
    const isRequired = schema?.required?.includes(key);

    return (
      <div key={key} className="border-l-2 border-gray-100 pl-4 py-2" style={{ marginLeft: indent }}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm font-medium text-gray-900">{key}</span>
              {isRequired && (
                <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                  required
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                {property.type}
              </span>
              {property.default !== undefined && (
                <span className="text-xs text-gray-500">
                  default: {JSON.stringify(property.default)}
                </span>
              )}
            </div>
            {property.description && (
              <p className="text-sm text-gray-600 mt-1">{property.description}</p>
            )}
            {property.enum && (
              <div className="mt-1">
                <span className="text-xs text-gray-500">Options: </span>
                <span className="text-xs font-mono text-gray-700">
                  {property.enum.map(val => JSON.stringify(val)).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {property.properties && (
          <div className="mt-2">
            {Object.entries(property.properties).map(([subKey, subProperty]) =>
              renderProperty(subKey, subProperty, level + 1)
            )}
          </div>
        )}
        
        {property.items && property.type === 'array' && (
          <div className="mt-2">
            <span className="text-xs text-gray-500 block mb-1">Array items:</span>
            {renderProperty('item', property.items, level + 1)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <FileText className="w-6 h-6 mr-3 text-primary-600" />
        Input Schema
      </h2>
      
      <div className="mb-6 p-5 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl border border-gray-100">
        <h3 className="font-semibold text-gray-900 text-lg">{actor.title || actor.name}</h3>
        {actor.description && (
          <p className="text-gray-600 mt-2 leading-relaxed">{actor.description}</p>
        )}
      </div>

      {!schema ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full mx-auto mb-6"></div>
          <p className="text-gray-500 text-lg font-medium">Loading schema...</p>
        </div>
      ) : !schema.properties || Object.keys(schema.properties).length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Info className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium">No input schema available</p>
          <p className="text-gray-400 mt-2">This actor doesn't require any input parameters</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
          {Object.entries(schema.properties).map(([key, property]) =>
            renderProperty(key, property)
          )}
        </div>
      )}
    </div>
  );
};