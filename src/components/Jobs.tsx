import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store';
import { Briefcase, Calendar, Clock, Plus, Search, Building2, X, Loader2, ArrowRight, Upload, CheckCircle, Bookmark, Sparkles, Trash2, Bus, Zap, Droplets, Shield, Heart, MapPin, Users, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const jobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  department: z.string().min(2, 'Department is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  deadline: z.string().min(1, 'Deadline is required'),
});

const deptIcons: Record<string, any> = {
  'Waste Management': Trash2,
  'Transport': Bus,
  'Electricity': Zap,
  'Water Supply': Droplets,
  'Municipal Affairs': Building2,
  'Public Health': Heart,
};

const deptColors: Record<string, string> = {
  'Waste Management': 'bg-green-50 text-green-600',
  'Transport': 'bg-blue-50 text-blue-600',
  'Electricity': 'bg-yellow-50 text-yellow-600',
  'Water Supply': 'bg-cyan-50 text-cyan-600',
  'Municipal Affairs': 'bg-purple-50 text-purple-600',
  'Public Health': 'bg-red-50 text-red-600',
};

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
  const [deptFilter, setDeptFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'deadline'>('newest');

  // States for viewing applicants
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
  const [applicantsData, setApplicantsData] = useState<any[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

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
      setJobs(await res.json());
    } catch { }
  };

  const fetchApplicants = async (jobId: string) => {
    setLoadingApplicants(true);
    setIsApplicantsModalOpen(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}/applicants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setApplicantsData(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const res = await fetch('/api/jobs/applications/mine', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setAppliedJobIds(new Set(data.map((a: any) => a.job_id)));
    } catch { }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed');
      fetchJobs();
      setIsModalOpen(false);
      reset();
    } catch { } finally { setIsLoading(false); }
  };

  const departments = Array.from(new Set(jobs.map((j: any) => j.department).filter(Boolean))) as string[];
  const deptCounts = departments.reduce((acc, d) => {
    acc[d] = jobs.filter(j => j.department === d).length;
    return acc;
  }, {} as Record<string, number>);

  const filteredJobs = jobs
    .filter(job =>
      (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (deptFilter === 'All' || job.department === deptFilter)
    )
    .sort((a: any, b: any) =>
      sortBy === 'deadline'
        ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  const openJobDetail = async (job: any) => {
    setSelectedJob(job);
    setResumeFile(null);
    setApplyError('');
    setApplication(null);
    if (token) {
      try {
        const res = await fetch(`/api/jobs/${job.id}/application`, { headers: { Authorization: `Bearer ${token}` } });
        setApplication(await res.json());
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
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
          <div className="w-full h-full bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold mb-4">
            <Sparkles size={12} /> OPPORTUNITIES UPDATED HOURLY
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Build the Future of <span className="text-green-400">Your City.</span>
          </h1>
          <p className="text-gray-300 max-w-xl mb-6 text-sm leading-relaxed">
            Explore diverse careers across 127 municipal departments. From urban planning to advanced AI research, your skills power our growth.
          </p>
          <div className="relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by role, department, or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur text-white placeholder-gray-400 border border-white/10 focus:border-white/30 outline-none transition-all"
            />
          </div>
        </div>
        {user?.role === 'SUPER_ADMIN' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute top-6 right-6 bg-white/20 backdrop-blur text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/30 transition-colors"
          >
            <Plus size={16} /> Post Job
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex gap-6">
        {/* Departments Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
              <Building2 size={14} /> Departments
            </h3>
            <div className="space-y-1">
              {departments.map((dept) => {
                const Icon = deptIcons[dept] || Briefcase;
                const colorCls = deptColors[dept] || 'bg-gray-50 text-gray-600';
                return (
                  <button
                    key={dept}
                    onClick={() => setDeptFilter(deptFilter === dept ? 'All' : dept)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${deptFilter === dept ? 'bg-blue-50 text-[#3182CE] font-semibold' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <div className={`p-1.5 rounded-lg ${colorCls}`}>
                      <Icon size={14} />
                    </div>
                    <span className="flex-1 text-left truncate">{dept}</span>
                    <span className="text-xs text-gray-400 font-medium">{deptCounts[dept]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider">
              Open Positions ({filteredJobs.length})
            </h2>
            <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1">
              <button
                onClick={() => setSortBy('newest')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sortBy === 'newest' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'
                  }`}
              >
                Latest
              </button>
              <button
                onClick={() => setSortBy('deadline')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sortBy === 'deadline' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'
                  }`}
              >
                Expiring Soon
              </button>
            </div>
          </div>

          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Tags */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{job.department?.toUpperCase()}</span>
                      <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded">FULL TIME</span>
                      {appliedJobIds.has(job.id) && (
                        <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded flex items-center gap-0.5">
                          <CheckCircle size={8} /> Applied
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{job.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> Deadline: {new Date(job.deadline).toLocaleDateString('en-CA')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 size={12} /> {job.department || 'Hyderabad Metro'}
                      </span>
                    </div>
                  </div>
                  {user?.role === 'SUPER_ADMIN' ? (
                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        fetchApplicants(job.id);
                      }}
                      className="bg-purple-500 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-purple-600 transition-colors flex items-center gap-1"
                    >
                      View Applicants <Users size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={() => openJobDetail(job)}
                      className="bg-red-500 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-red-600 transition-colors flex items-center gap-1"
                    >
                      Apply Now <ArrowRight size={14} />
                    </button>
                  )}

                  {user?.role === 'CITIZEN' && (
                    <button className="bg-white border border-gray-200 text-gray-600 px-5 py-2 rounded-xl text-sm font-medium hover:border-gray-300 transition-colors">
                      Save
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
              No active job postings found.
            </div>
          )}
        </div>
      </div>

      {/* Job Detail Modal */}
      {
        selectedJob && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Briefcase size={28} /></div>
                <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedJob.title}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Building2 size={16} /><span>{selectedJob.department}</span>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">{selectedJob.description}</p>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2 text-sm font-medium text-red-500">
                  <Calendar size={16} /><span>Deadline: {new Date(selectedJob.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock size={14} /><span>Posted {new Date(selectedJob.created_at).toLocaleDateString()}</span>
                </div>
              </div>
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
                    <label className={`flex items-center gap-3 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors ${resumeFile ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                      }`}>
                      <Upload size={20} className="text-blue-500" />
                      <span className="text-sm text-gray-600">
                        {resumeFile ? resumeFile.name : 'Click to select your resume (PDF, DOC, DOCX)'}
                      </span>
                      <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
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
        )
      }

      {/* Post Job Modal */}
      {
        isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Post New Job</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Job Title</label>
                  <input {...register('title')} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Senior Civil Engineer" />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{(errors.title as any).message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
                  <input {...register('department')} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Public Works" />
                  {errors.department && <p className="text-red-500 text-xs mt-1">{(errors.department as any).message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Application Deadline</label>
                  <input {...register('deadline')} type="date" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                  {errors.deadline && <p className="text-red-500 text-xs mt-1">{(errors.deadline as any).message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                  <textarea {...register('description')} rows={4} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Job responsibilities and requirements..." />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{(errors.description as any).message}</p>}
                </div>
                <button disabled={isLoading} className="w-full bg-[#3182CE] text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Post Job'}
                </button>
              </form>
            </div>
          </div>
        )
      }

      {/* Applicants Modal (Admin Only) */}
      {
        isApplicantsModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="text-purple-600" />
                  Applicants for {selectedJob?.title}
                </h2>
                <button onClick={() => setIsApplicantsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>

              <div className="overflow-y-auto flex-1 pr-2 space-y-4">
                {loadingApplicants ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-purple-600" size={32} />
                  </div>
                ) : applicantsData.length > 0 ? (
                  applicantsData.map((app) => (
                    <div key={app.id} className="border border-gray-100 rounded-xl p-4 hover:border-purple-200 transition-colors bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{app.citizen?.name || 'Unknown User'}</h3>
                          <p className="text-sm text-gray-500 mb-2">{app.citizen?.email || 'No email provided'}</p>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">Status: {app.status}</span>
                            <span className="text-gray-400">Applied: {new Date(app.applied_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <a
                          href={app.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white border border-gray-200 text-purple-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:border-purple-300 hover:text-purple-700 transition-all shadow-sm"
                        >
                          <FileText size={16} /> View Resume
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <Users size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No applications have been submitted for this position yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      }

    </div >
  );
}
