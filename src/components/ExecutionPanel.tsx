import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import type { Actor, ActorSchema, ExecutionResult } from '../types/apify';
import { InputRenderer } from './InputRenderer';

interface ExecutionPanelProps {
  actor: Actor;
  schema: ActorSchema | null;
  onExecute: (inputs: Record<string, any>) => Promise<ExecutionResult>;
}

export const ExecutionPanel: React.FC<ExecutionPanelProps> = ({
  schema,
  onExecute
}) => {
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (key: string, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    setError(null);
    setResult(null);

    try {
      const executionResult = await onExecute(inputs);
      setResult(executionResult);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Execution failed';
      setError(message);
    } finally {
      setIsExecuting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCEEDED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'RUNNING':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDuration = (durationMillis: number) => {
    const seconds = Math.floor(durationMillis / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Play className="w-6 h-6 mr-3 text-primary-600" />
        Execute Actor
      </h2>

      {schema?.properties && Object.keys(schema.properties).length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Input Parameters</h3>
          <div className="space-y-6">
            {Object.entries(schema.properties).map(([key, property]) => (
              <InputRenderer
                key={key}
                name={key}
                property={property}
                value={inputs[key]}
                onChange={(value) => handleInputChange(key, value)}
                required={schema.required?.includes(key)}
              />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleExecute}
        disabled={isExecuting}
        className="group relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] border-0 overflow-hidden mb-8"
      >
        {/* Animated background overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

        {/* Button content */}
        <div className="relative flex items-center justify-center space-x-3">
          {isExecuting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg font-semibold">Executing Actor...</span>
            </>
          ) : (
            <>
              <div className="p-1.5 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-300">
                <Play className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold">Execute Actor</span>
              <div className="w-4 h-4 border-2 border-white border-l-transparent rounded-full animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </>
          )}
        </div>
      </button>

      {error && (
        <div className="mb-8 p-5 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-red-700 font-semibold">Execution Failed</p>
          </div>
          <p className="text-red-600 mt-2">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 text-lg">Execution Result</h3>
              <div className="flex items-center space-x-3">
                {getStatusIcon(result.status)}
                <span className="font-semibold text-gray-700">{result.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <span className="text-gray-500 font-medium">Duration:</span>
                <span className="ml-3 font-semibold text-gray-900">
                  {formatDuration(result.stats.durationMillis)}
                </span>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Compute Units:</span>
                <span className="ml-3 font-semibold text-gray-900">{result.stats.computeUnits}</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Memory (Max):</span>
                <span className="ml-3 font-semibold text-gray-900">
                  {Math.round(result.stats.memMaxBytes / 1024 / 1024)} MB
                </span>
              </div>
              <div>
                <span className="text-gray-500 font-medium">CPU (Avg):</span>
                <span className="ml-3 font-semibold text-gray-900">{result.stats.cpuAvgUsage}%</span>
              </div>
            </div>
          </div>

          {result.output && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-lg">Output</h4>
              <pre className="bg-gray-900 text-gray-100 p-6 rounded-2xl text-sm overflow-x-auto max-h-80 overflow-y-auto font-mono border border-gray-700">
                {JSON.stringify(result.output, null, 2)}
              </pre>
            </div>
          )}

          {result.error && (
            <div>
              <h4 className="font-semibold text-red-700 mb-3 text-lg">Error Details</h4>
              <pre className="bg-red-50 text-red-800 p-6 rounded-2xl text-sm overflow-x-auto font-mono border border-red-200">
                {result.error}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};