import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { JobPosting, JobApplication } from '@/lib/types';
import { Briefcase, Clock, MapPin } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface JobApplicationModalProps {
  job: JobPosting | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (application: Omit<JobApplication, 'id' | 'appliedAt'>) => void;
  applicantId: string;
  applicantName: string;
  applicantAvatar: string;
}

const AVAILABILITY_OPTIONS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function JobApplicationModal({
  job,
  open,
  onOpenChange,
  onSubmit,
  applicantId,
  applicantName,
  applicantAvatar
}: JobApplicationModalProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const [experience, setExperience] = useState('');
  const [availability, setAvailability] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!job) return;

    if (coverLetter.trim().length < 50) {
      toast.error('Please write a longer cover letter (min 50 characters)');
      return;
    }

    if (experience.trim().length < 20) {
      toast.error('Please describe your experience (min 20 characters)');
      return;
    }

    if (availability.length === 0) {
      toast.error('Please select at least one day of availability');
      return;
    }

    const application: Omit<JobApplication, 'id' | 'appliedAt'> = {
      jobId: job.id,
      jobTitle: job.title,
      venueName: job.venueName,
      applicantId,
      applicantName,
      applicantAvatar,
      coverLetter: coverLetter.trim(),
      experience: experience.trim(),
      availability,
      status: 'pending'
    };

    onSubmit(application);

    // Reset form
    setCoverLetter('');
    setExperience('');
    setAvailability([]);
    onOpenChange(false);

    toast.success('Application submitted!', {
      description: 'The venue will review your application soon.'
    });
  };

  const toggleAvailability = (day: string) => {
    setAvailability(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Briefcase weight="fill" className="text-accent" />
            Apply for Position
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Job Info */}
          <div className="glass-card p-6 rounded-3xl">
            <h3 className="text-xl font-bold mb-3">{job.title}</h3>
            <div className="flex items-center gap-3 mb-3">
              <Badge className="bg-gradient-to-r from-primary to-accent">
                <MapPin className="w-3 h-3 mr-1" weight="fill" />
                {job.venueName}
              </Badge>
              <Badge variant="outline">
                {job.payRange}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{job.description}</p>
          </div>

          {/* Cover Letter */}
          <div>
            <Label className="text-sm font-bold mb-2 block">
              Cover Letter *
              <span className="text-muted-foreground font-normal ml-2">(minimum 50 characters)</span>
            </Label>
            <Textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell the venue why you're a great fit for this position. Highlight your relevant skills and experience..."
              className="min-h-[150px] glass-card resize-none"
              maxLength={1000}
            />
            <div className="text-xs text-muted-foreground mt-2 text-right">
              {coverLetter.length} / 1000 characters
            </div>
          </div>

          {/* Experience */}
          <div>
            <Label className="text-sm font-bold mb-2 block">
              Relevant Experience *
              <span className="text-muted-foreground font-normal ml-2">(minimum 20 characters)</span>
            </Label>
            <Textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Describe your bartending experience, skills, and certifications..."
              className="min-h-[120px] glass-card resize-none"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground mt-2 text-right">
              {experience.length} / 500 characters
            </div>
          </div>

          {/* Availability */}
          <div>
            <Label className="text-sm font-bold mb-3 block flex items-center gap-2">
              <Clock weight="fill" className="text-accent" />
              Availability *
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {AVAILABILITY_OPTIONS.map((day) => {
                const isSelected = availability.includes(day);
                return (
                  <motion.button
                    key={day}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleAvailability(day)}
                    className={`glass-morphic p-3 rounded-2xl text-sm font-semibold transition-all ${
                      isSelected
                        ? 'ring-2 ring-accent bg-accent/10'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox checked={isSelected} />
                      {day}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              Submit Application
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
