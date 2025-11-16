import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  CalendarBlank,
  Clock,
  MapPin,
  Users,
  Briefcase,
  CurrencyDollar,
  Check,
  X
} from '@phosphor-icons/react';
import { BartenderSchedule, JobPosting, DayOfWeek, JobApplication } from '@/lib/types';
import { MOCK_VENUES } from '@/lib/mock-data';
import { toast } from 'sonner';
import { JobApplicationModal } from '@/components/JobApplicationModal';

interface BartenderSchedulingProps {
  bartenderId?: string;
  venueId?: string;
  userRole: 'the-pourer' | 'the-venue' | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar: string;
}

const DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function BartenderScheduling({
  bartenderId,
  venueId,
  userRole,
  open,
  onOpenChange,
  currentUserId,
  currentUserName,
  currentUserAvatar
}: BartenderSchedulingProps) {
  const [schedules, setSchedules] = useKV<BartenderSchedule[]>('bartender-schedules', []);
  const [jobPostings, setJobPostings] = useKV<JobPosting[]>('job-postings', []);
  const [applications, setApplications] = useKV<JobApplication[]>('job-applications', []);
  const [activeTab, setActiveTab] = useState(userRole === 'the-venue' ? 'postings' : 'schedule');
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const mySchedule = schedules?.filter(s =>
    bartenderId ? s.bartenderId === bartenderId : true
  ) || [];

  const myPostings = jobPostings?.filter(p =>
    venueId ? p.venueId === venueId : true
  ) || [];

  const availableJobs = jobPostings?.filter(p => p.status === 'open') || [];

  const myApplications = applications?.filter(a =>
    a.applicantId === currentUserId
  ) || [];

  const postingApplications = (postingId: string) =>
    applications?.filter(a => a.jobId === postingId) || [];

  const handleApplyJob = (job: JobPosting) => {
    // Check if already applied
    const alreadyApplied = applications?.some(a =>
      a.jobId === job.id && a.applicantId === currentUserId
    );

    if (alreadyApplied) {
      toast.error('You have already applied to this position');
      return;
    }

    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleSubmitApplication = (application: Omit<JobApplication, 'id' | 'appliedAt'>) => {
    const newApplication: JobApplication = {
      ...application,
      id: `app-${Date.now()}`,
      appliedAt: new Date().toISOString()
    };

    setApplications((current) => [...(current || []), newApplication]);

    // Update job applicant count
    setJobPostings((current) =>
      (current || []).map(job =>
        job.id === application.jobId
          ? { ...job, applicants: job.applicants + 1 }
          : job
      )
    );
  };

  const handleUpdateApplicationStatus = (applicationId: string, status: JobApplication['status']) => {
    setApplications((current) =>
      (current || []).map(app =>
        app.id === applicationId
          ? { ...app, status }
          : app
      )
    );
    toast.success(`Application ${status}`);
  };

  const handleCreatePosting = () => {
    const newPosting: JobPosting = {
      id: `job-${Date.now()}`,
      venueId: venueId || 'venue-1',
      venueName: MOCK_VENUES.find(v => v.id === venueId)?.name || 'Your Venue',
      title: 'Bartender Position',
      description: 'Seeking experienced bartender for busy establishment',
      requirements: ['2+ years experience', 'Knowledge of classic cocktails', 'Strong communication skills'],
      schedule: 'Flexible shifts, evenings and weekends',
      payRange: '$15-25/hour + tips',
      benefits: ['Health insurance', 'Flexible scheduling', 'Employee discounts'],
      postedAt: new Date().toISOString(),
      status: 'open',
      applicants: 0
    };

    setJobPostings((current) => [...(current || []), newPosting]);
    toast.success('Job posting created!');
  };

  const groupScheduleByDay = () => {
    const grouped: Record<DayOfWeek, BartenderSchedule[]> = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    };

    mySchedule.forEach(schedule => {
      grouped[schedule.dayOfWeek].push(schedule);
    });

    return grouped;
  };

  const groupedSchedule = groupScheduleByDay();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Briefcase weight="fill" className="text-accent" />
            {userRole === 'the-venue' ? 'Venue Dashboard' : 'Bartender Hub'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="schedule">
              <CalendarBlank className="w-4 h-4 mr-2" weight="fill" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <Briefcase className="w-4 h-4 mr-2" weight="fill" />
              {userRole === 'the-venue' ? 'Applicants' : 'Job Board'}
            </TabsTrigger>
            <TabsTrigger value="postings">
              <Users className="w-4 h-4 mr-2" weight="fill" />
              {userRole === 'the-venue' ? 'My Postings' : 'Applications'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="mt-6">
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                <div className="glass-card p-6 rounded-3xl">
                  <h3 className="text-lg font-bold mb-4">Weekly Schedule</h3>
                  <div className="space-y-3">
                    {DAYS.map((day) => {
                      const daySchedules = groupedSchedule[day];
                      return (
                        <motion.div
                          key={day}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="glass-morphic p-4 rounded-2xl"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-24">
                                <span className="font-bold capitalize">{day}</span>
                              </div>
                              {daySchedules.length === 0 ? (
                                <span className="text-sm text-muted-foreground">No shifts scheduled</span>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  {daySchedules.map((schedule) => {
                                    const venue = MOCK_VENUES.find(v => v.id === schedule.venueId);
                                    return (
                                      <Badge 
                                        key={schedule.id}
                                        className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
                                      >
                                        <Clock className="w-3 h-3 mr-1" weight="fill" />
                                        {schedule.startTime} - {schedule.endTime}
                                        {venue && ` @ ${venue.name}`}
                                      </Badge>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {mySchedule.length === 0 && (
                  <div className="text-center py-12 glass-card rounded-3xl">
                    <div className="text-6xl mb-4">📅</div>
                    <h3 className="text-xl font-bold mb-2">No shifts scheduled</h3>
                    <p className="text-muted-foreground mb-4">
                      {userRole === 'the-pourer' 
                        ? 'Check the job board to find opportunities!' 
                        : 'Create job postings to hire bartenders'}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="jobs" className="mt-6">
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {userRole === 'the-pourer' && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">Available Positions</h3>
                      <Badge variant="secondary">{availableJobs.length} jobs</Badge>
                    </div>

                    {availableJobs.length === 0 ? (
                      <div className="text-center py-12 glass-card rounded-3xl">
                        <div className="text-6xl mb-4">💼</div>
                        <h3 className="text-xl font-bold mb-2">No open positions</h3>
                        <p className="text-muted-foreground">
                          Check back later for new opportunities
                        </p>
                      </div>
                    ) : (
                      availableJobs.map((job, index) => (
                        <motion.div
                          key={job.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="glass-card p-6 rounded-3xl"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-xl font-bold mb-2">{job.title}</h4>
                              <div className="flex items-center gap-2 mb-3">
                                <Badge className="bg-gradient-to-r from-primary to-accent">
                                  <MapPin className="w-3 h-3 mr-1" weight="fill" />
                                  {job.venueName}
                                </Badge>
                                <Badge variant="outline">
                                  <CurrencyDollar className="w-3 h-3 mr-1" weight="fill" />
                                  {job.payRange}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              className="bg-gradient-to-r from-accent to-secondary"
                              onClick={() => handleApplyJob(job)}
                            >
                              Apply Now
                            </Button>
                          </div>

                          <p className="text-muted-foreground mb-4">{job.description}</p>

                          <div className="space-y-3">
                            <div>
                              <h5 className="font-semibold text-sm mb-2">Requirements</h5>
                              <ul className="space-y-1">
                                {job.requirements.map((req, i) => (
                                  <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Check className="w-4 h-4 text-accent" weight="bold" />
                                    {req}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {job.benefits.length > 0 && (
                              <div>
                                <h5 className="font-semibold text-sm mb-2">Benefits</h5>
                                <div className="flex flex-wrap gap-2">
                                  {job.benefits.map((benefit, i) => (
                                    <Badge key={i} variant="secondary">{benefit}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground">
                            <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                            <span>{job.applicants} applicants</span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </>
                )}

                {userRole === 'the-venue' && (
                  <div className="text-center py-12 glass-card rounded-3xl">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-xl font-bold mb-2">Applicant Management</h3>
                    <p className="text-muted-foreground">
                      View and manage applications for your job postings
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="postings" className="mt-6">
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {userRole === 'the-venue' ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">Your Job Postings</h3>
                      <Button
                        onClick={handleCreatePosting}
                        className="bg-gradient-to-r from-accent to-secondary"
                      >
                        Create New Posting
                      </Button>
                    </div>

                    {myPostings.length === 0 ? (
                      <div className="text-center py-12 glass-card rounded-3xl">
                        <div className="text-6xl mb-4">📢</div>
                        <h3 className="text-xl font-bold mb-2">No active postings</h3>
                        <p className="text-muted-foreground mb-4">
                          Create your first job posting to start hiring
                        </p>
                        <Button
                          onClick={handleCreatePosting}
                          className="bg-gradient-to-r from-accent to-secondary"
                        >
                          Create Posting
                        </Button>
                      </div>
                    ) : (
                      myPostings.map((posting, index) => (
                        <motion.div
                          key={posting.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="glass-card p-6 rounded-3xl"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-xl font-bold">{posting.title}</h4>
                            <Badge
                              className={
                                posting.status === 'open'
                                  ? 'bg-green-500'
                                  : posting.status === 'filled'
                                  ? 'bg-blue-500'
                                  : 'bg-gray-500'
                              }
                            >
                              {posting.status}
                            </Badge>
                          </div>

                          <p className="text-muted-foreground mb-4">{posting.description}</p>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Posted {new Date(posting.postedAt).toLocaleDateString()}
                            </span>
                            <span className="font-medium">
                              {posting.applicants} applicant{posting.applicants !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-bold mb-4">Your Applications</h3>
                    {myApplications.length === 0 ? (
                      <div className="text-center py-12 glass-card rounded-3xl">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-bold mb-2">No applications yet</h3>
                        <p className="text-muted-foreground">
                          Check the job board to find opportunities
                        </p>
                      </div>
                    ) : (
                      myApplications.map((app, index) => (
                        <motion.div
                          key={app.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="glass-card p-6 rounded-3xl mb-4"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="text-xl font-bold mb-2">{app.jobTitle}</h4>
                              <Badge className="bg-gradient-to-r from-primary to-accent mb-3">
                                <MapPin className="w-3 h-3 mr-1" weight="fill" />
                                {app.venueName}
                              </Badge>
                            </div>
                            <Badge
                              className={
                                app.status === 'accepted' ? 'bg-green-500' :
                                app.status === 'rejected' ? 'bg-red-500' :
                                app.status === 'interviewing' ? 'bg-blue-500' :
                                app.status === 'reviewed' ? 'bg-yellow-500' :
                                'bg-gray-500'
                              }
                            >
                              {app.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Applied {new Date(app.appliedAt).toLocaleDateString()}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <JobApplicationModal
          job={selectedJob}
          open={showApplicationModal}
          onOpenChange={setShowApplicationModal}
          onSubmit={handleSubmitApplication}
          applicantId={currentUserId}
          applicantName={currentUserName}
          applicantAvatar={currentUserAvatar}
        />
      </DialogContent>
    </Dialog>
  );
}
