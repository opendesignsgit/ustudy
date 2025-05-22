"use client";

import React, { useState, useEffect } from 'react';

interface Field {
  id: string;
  name: string;
  label: string;
  required: boolean;
  blockType: string;
  options?: { id: string; label: string; value: string }[];
}

interface FormData {
  title: string;
  fields: Field[];
  submitButtonLabel: string;
}

const ModalForm: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [formValues, setFormValues] = useState<{ [key: string]: string }>({});
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const fetchFormData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/forms/8');
      const data: FormData = await response.json();
      setFormData(data);
    } catch (error) {
      console.error('Error fetching form:', error);
    }
  };

  const openModal = () => {
    setIsOpen(true);
    if (!formData) {
      fetchFormData();
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setSubmissionStatus(null); // Reset submission status on close
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/forms/8/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        setSubmissionStatus('success');
        alert('Form submitted successfully!');
      } else {
        setSubmissionStatus('error');
        alert('Failed to submit the form!');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionStatus('error');
    }
  };

  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLAnchorElement;
      if (target && target.getAttribute('href') === '#openForm') {
        event.preventDefault();
        openModal();
      }
    };

    document.addEventListener('click', handleLinkClick);

    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  const renderField = (field: Field) => {
    switch (field.blockType) {
      case 'text':
      case 'email':
      case 'country':
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && '*'}
            </label>
            <input
              type={field.blockType}
              name={field.name}
              required={field.required}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        );
      case 'select':
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && '*'}
            </label>
            <select
              name={field.name}
              required={field.required}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {field.options?.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      case 'textarea':
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && '*'}
            </label>
            <textarea
              name={field.name}
              required={field.required}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
          </div>
        );
      case 'checkbox':
        return (
          <div key={field.id} className="mb-4">
            <label className="inline-flex items-center text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name={field.name}
                required={field.required}
                onChange={(e) =>
                  handleInputChange({
                    ...e,
                    target: { ...e.target, value: e.target.checked.toString() }, // Convert checkbox value to string
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
              />
              <span className="ml-2">{field.label}</span>
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            {formData ? (
              <form onSubmit={handleSubmit}>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  {formData.title}
                </h2>
                {formData.fields.map((field: Field) => renderField(field))}
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {formData.submitButtonLabel}
                </button>
              </form>
            ) : (
              <p className="text-gray-500">Loading form...</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ModalForm;