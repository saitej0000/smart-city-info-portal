import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  MapPin, 
  Camera, 
  Send, 
  ArrowLeft,
  Loader2,
  X
} from 'lucide-react';
import { motion } from 'motion/react';

const complaintSchema = z.object({
  department_id: z.string().min(1, 'Please select a department'),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  image_url: z.string().optional(),
});

export default function NewComplaint() {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(complaintSchema),
  });

  useEffect(() => {
    fetch('/api/departments')
      .then(res => res.json())
      .then(setDepartments);
  }, []);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition((pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(loc);
        setValue('latitude', loc.lat);
        setValue('longitude', loc.lng);
        setLocationLoading(false);
      }, (err) => {
        console.error(err);
        setLocationLoading(false);
        alert('Failed to get location. Please ensure location services are enabled.');
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      
      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      setValue('image_url', data.url);
      setPreviewUrl(data.url);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setSubmitError(null);
    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...data,
          department_id: parseInt(data.department_id)
        }),
      });

      if (response.ok) {
        navigate('/complaints');
      } else {
        if (response.status === 401 || response.status === 403) {
          setSubmitError('Session expired. Please login again.');
          // Optional: Redirect to login after a delay
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        let errorMessage = 'Failed to submit complaint';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // If JSON parse fails, try getting text
          const textError = await response.text();
          if (textError) errorMessage = textError;
        }
        setSubmitError(errorMessage);
      }
    } catch (e) {
      console.error('Failed to submit complaint', e);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Report an Issue</h1>
          <p className="text-gray-500">Provide details about the problem you've encountered.</p>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <p className="font-bold">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Department</label>
              <select
                {...register('department_id')}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="">Select Department</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              {errors.department_id && <p className="text-red-500 text-xs mt-1">{(errors.department_id as any).message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select
                {...register('category')}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="">Select Category</option>
                <option value="Roads">Roads & Potholes</option>
                <option value="Waste">Waste Management</option>
                <option value="Water">Water Supply</option>
                <option value="Electricity">Electricity</option>
                <option value="Safety">Public Safety</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{(errors.category as any).message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              placeholder="Describe the issue in detail..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{(errors.description as any).message}</p>}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locationLoading}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border font-bold transition-all disabled:opacity-50",
                location ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
              )}
            >
              {locationLoading ? <Loader2 className="animate-spin" size={20} /> : <MapPin size={20} />}
              {locationLoading ? 'Locating...' : location ? 'Location Tagged' : 'Tag My Location'}
            </button>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-bold hover:bg-gray-100 transition-all disabled:opacity-50"
            >
              {uploading ? <Loader2 className="animate-spin" size={20} /> : <Camera size={20} />}
              {uploading ? 'Uploading...' : 'Add Photo'}
            </button>
          </div>

          {previewUrl && (
            <div className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={() => {
                  setPreviewUrl(null);
                  setValue('image_url', '');
                }}
                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 text-gray-500"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <button
            disabled={isLoading || uploading}
            className="w-full bg-[#3182CE] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Submit Complaint
                <Send size={20} />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex gap-3">
        <AlertCircle className="text-orange-500 shrink-0" />
        <p className="text-sm text-orange-800">
          <strong>Note:</strong> False reporting is a punishable offense. Please ensure the information provided is accurate.
        </p>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
