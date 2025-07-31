import React from 'react';
import type { SchemaProperty } from '../types/apify';

interface InputRendererProps {
  name: string;
  property: SchemaProperty;
  value: any;
  onChange: (value: any) => void;
  required?: boolean;
}

export const InputRenderer: React.FC<InputRendererProps> = ({
  name,
  property,
  value,
  onChange,
  required
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    let newValue: any = e.target.value;

    // Type conversion based on schema type
    switch (property.type) {
      case 'number':
      case 'integer':
        newValue = newValue === '' ? undefined : Number(newValue);
        break;
      case 'boolean':
        newValue = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : newValue === 'true';
        break;
      case 'array':
        try {
          newValue = newValue === '' ? [] : JSON.parse(newValue);
        } catch {
          // Keep as string if JSON parsing fails
        }
        break;
      case 'object':
        try {
          newValue = newValue === '' ? {} : JSON.parse(newValue);
        } catch {
          // Keep as string if JSON parsing fails
        }
        break;
    }

    onChange(newValue);
  };

  const renderInput = () => {
    const baseProps = {
      id: name,
      name,
      required,
      className: "input-field",
    };

    // Handle enum (select dropdown)
    if (property.enum) {
      return (
        <select
          {...baseProps}
          value={value || ''}
          onChange={handleChange}
        >
          <option value="">Select an option...</option>
          {property.enum.map((option, index) => (
            <option key={index} value={option}>
              {String(option)}
            </option>
          ))}
        </select>
      );
    }

    // Handle different input types
    switch (property.type) {
      case 'boolean':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={name}
              name={name}
              checked={value || false}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
            />
            <label htmlFor={name} className="ml-2 text-sm text-gray-700">
              {property.title || name}
            </label>
          </div>
        );

      case 'number':
      case 'integer':
        return (
          <input
            {...baseProps}
            type="number"
            value={value || ''}
            onChange={handleChange}
            placeholder={property.default !== undefined ? String(property.default) : ''}
            step={property.type === 'integer' ? 1 : 'any'}
          />
        );

      case 'array':
      case 'object':
        return (
          <textarea
            {...baseProps}
            value={value ? JSON.stringify(value, null, 2) : ''}
            onChange={handleChange}
            placeholder={
              property.type === 'array' 
                ? '[]' 
                : property.default !== undefined 
                  ? JSON.stringify(property.default, null, 2)
                  : '{}'
            }
            rows={4}
            className="input-field font-mono text-sm"
          />
        );

      default:
        // Handle long text with textarea
        if (property.description && property.description.length > 100) {
          return (
            <textarea
              {...baseProps}
              value={value || ''}
              onChange={handleChange}
              placeholder={property.default !== undefined ? String(property.default) : ''}
              rows={3}
            />
          );
        }

        return (
          <input
            {...baseProps}
            type="text"
            value={value || ''}
            onChange={handleChange}
            placeholder={property.default !== undefined ? String(property.default) : ''}
          />
        );
    }
  };

  return (
    <div>
      <label htmlFor={name} className="block font-semibold text-gray-700 mb-2">
        {property.title || name}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {renderInput()}
      
      {property.description && (
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">{property.description}</p>
      )}
    </div>
  );
};