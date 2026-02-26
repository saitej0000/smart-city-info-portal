import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store';
import { Briefcase, Calendar, Clock, Plus, Search, Building2, X, Loader2, ArrowRight, Upload, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { clsx } from 'clsx';
import { format } from 'date-fns';

const jobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  department: z.string().min(2, 'Department is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  deadline: z.string().min(1, 'Deadline is required'),
});

export default function Jobs() {
  const { user, token } = useAuthStore();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [application, setApplication] = useState<any>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<number>>(new Set());

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(jobSchema),
  });

  useEffect(() => {
    fetchJobs();
    if (token && user?.role === 'CITIZEN') fetchMyApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs');
    }
  };

  const fetchMyApplications = async () => {
    try {
      const res = await fetch('/api/jobs/applications/mine', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAppliedJobIds(new Set(data.map((a: any) => a.job_id)));
    } catch { }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        throw new Error('Failed to post job');
      }

      fetchJobs();
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to post job');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openJobDetail = async (job: any) => {
    setSelectedJob(job);
    setResumeFile(null);
    setApplyError('');
    setApplication(null);
    if (token) {
      try {
        const res = await fetch(`/api/jobs/${job.id}/application`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setApplication(data);
      } catch { }
    }
  };

  const handleApply = async () => {
    if (!resumeFile || !selectedJob) return;
    setApplyLoading(true);
    setApplyError('');
    try {
      const formData = new FormData();
      formData.append('image', resumeFile);
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const { url, error: uploadErr } = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadErr || 'Upload failed');

      const applyRes = await fetch(`/api/jobs/${selectedJob.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ resume_url: url })
      });
      const applyData = await applyRes.json();
      if (!applyRes.ok) throw new Error(applyData.error || 'Application failed');
      setApplication({ id: applyData.id, status: 'PENDING', applied_at: new Date().toISOString() });
      setAppliedJobIds(prev => new Set([...prev, selectedJob.id]));
    } catch (e: any) {
      setApplyError(e.message);
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Notifications</h1>
          <p className="text-gray-500">Latest government job postings and opportunities.</p>
        </div>
        {user?.role === 'SUPER_ADMIN' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#3182CE] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Post New Job
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            placeholder="Search jobs by title or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all group flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Briefcase size={24} />
                </div>
                <div className="flex items-center gap-2">
                  {appliedJobIds.has(job.id) && (
                    <span className="flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-lg">
                      <CheckCircle size={12} /> Applied
                    </span>
                  )}
                  <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mb-4 flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Building2 size={16} />
                  <span>{job.department}</span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-3">{job.description}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-red-500">
                    <Calendar size={16} />
                    <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                  </div>
                  <button onClick={() => openJobDetail(job)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
            No active job postings found.
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Briefcase size={28} />
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedJob.title}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Building2 size={16} />
              <span>{selectedJob.department}</span>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">{selectedJob.description}</p>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2 text-sm font-medium text-red-500">
                <Calendar size={16} />
                <span>Deadline: {new Date(selectedJob.deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock size={14} />
                <span>Posted {new Date(selectedJob.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Apply Section for Citizens */}
            {user?.role === 'CITIZEN' && (
              application ? (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                  <CheckCircle className="text-green-600" size={22} />
                  <div>
                    <p className="font-bold text-green-700">Application Submitted!</p>
                    <p className="text-xs text-green-600">Status: <span className="font-semibold">{application.status}</span> · Applied {new Date(application.applied_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700">Upload Resume (PDF)</label>
                  <label className={clsx(
                    'flex items-center gap-3 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors',
                    resumeFile ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  )}>
                    <Upload size={20} className="text-blue-500" />
                    <span className="text-sm text-gray-600">
                      {resumeFile ? resumeFile.name : 'Click to select your resume (PDF, DOC, DOCX)'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  {applyError && <p className="text-red-500 text-sm">{applyError}</p>}
                  <button
                    onClick={handleApply}
                    disabled={!resumeFile || applyLoading}
                    className="w-full bg-[#3182CE] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {applyLoading ? <Loader2 className="animate-spin" size={18} /> : <><ArrowRight size={18} /> Apply Now</>}
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Post New Job</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Job Title</label>
                <input
                  {...register('title')}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Senior Civil Engineer"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{(errors.title as any).message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
                <input
                  {...register('department')}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Public Works"
                />
                {errors.department && <p className="text-red-500 text-xs mt-1">{(errors.department as any).message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Application Deadline</label>
                <input
                  {...register('deadline')}
                  type="date"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {errors.deadline && <p className="text-red-500 text-xs mt-1">{(errors.deadline as any).message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Job responsibilities and requirements..."
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{(errors.description as any).message}</p>}
              </div>

              <button
                disabled={isLoading}
                className="w-full bg-[#3182CE] text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Post Job'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
