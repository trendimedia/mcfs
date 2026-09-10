'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { submitApplication } from '@/app/dashboard/applications/action';

// Step 1: Personal Information
const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  mobileNumber: z.string().min(10, 'Please enter a valid mobile number'),
});

// Step 2: Location & Position
const positionSchema = z.object({
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  location: z.string().min(2, 'Location is required'),
  position: z.string().min(2, 'Position/role is required'),
});

// Step 3: Next of Kin
const nextOfKinSchema = z.object({
  nextOfKinName: z.string().min(2, "Next of kin's name is required"),
  nextOfKinPhone: z.string().min(10, 'Please enter a valid phone number'),
});

// Combine all schemas for the final form data
const formSchema = z.object({
  ...personalInfoSchema.shape,
  ...positionSchema.shape,
  ...nextOfKinSchema.shape,
});

type FormData = z.infer<typeof formSchema>;

interface JobApplicationFormProps {
  className?: string;
  onSubmit?: (data: FormData) => void;
}

export default function JobApplicationForm({
  className,
  onSubmit,
}: JobApplicationFormProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Tell us about yourself',
      schema: personalInfoSchema,
      fields: [
        { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'John' },
        { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe' },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'john.doe@example.com' },
        { name: 'mobileNumber', label: 'Mobile Number', type: 'tel', placeholder: '+256 700 123456' },
      ],
    },
    {
      id: 'position',
      title: 'Location & Position',
      description: 'Where you are and what you\'re applying for',
      schema: positionSchema,
      fields: [
        { name: 'address', label: 'Address', type: 'text', placeholder: '123 Main St' },
        { name: 'city', label: 'City', type: 'text', placeholder: 'Kampala' },
        { name: 'location', label: 'Location', type: 'text', placeholder: 'Central Region' },
        { name: 'position', label: 'Position Applying For', type: 'text', placeholder: 'Software Developer' },
      ],
    },
    {
      id: 'nextOfKin',
      title: 'Next of Kin',
      description: 'Emergency contact details',
      schema: nextOfKinSchema,
      fields: [
        { name: 'nextOfKinName', label: 'Next of Kin Name', type: 'text', placeholder: 'Jane Doe' },
        { name: 'nextOfKinPhone', label: 'Next of Kin Phone', type: 'tel', placeholder: '+256 700 654321' },
      ],
    },
  ];

  const currentStepSchema = steps[step].schema as z.ZodType<any, any, any>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: zodResolver(currentStepSchema),
    defaultValues: formData,
  });

  const progress = ((step + 1) / steps.length) * 100;

  const handleNextStep = async (data: any) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);

    if (step < steps.length - 1) {
      setStep(step + 1);
      reset(updatedData);
    } else {
      setIsSubmitting(true);
      try {
        if (onSubmit) {
          await onSubmit(updatedData as FormData);
        } else {
          await submitApplication(updatedData as any);
        }
        setIsComplete(true);
      } catch (err) {
        console.error('Failed to submit application:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className={cn('bg-card/40 mx-auto w-full max-w-md rounded-lg p-6 shadow-lg', className)}>
      {!isComplete ? (
        <>
          <div className="mb-8">
            <div className="mb-2 flex justify-between">
              <span className="text-sm font-medium">Step {step + 1} of {steps.length}</span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="mb-8 flex justify-between">
            {steps.map((s, i) => (
              <div key={s.id} className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold',
                    i < step
                      ? 'bg-primary text-primary-foreground'
                      : i === step
                        ? 'bg-primary text-primary-foreground ring-primary/30 ring-2'
                        : 'bg-secondary text-secondary-foreground',
                  )}
                >
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <span className="mt-1 hidden text-xs sm:block">{s.title}</span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial="hidden" animate="visible" exit="exit" variants={variants} transition={{ duration: 0.3 }}>
              <div className="mb-6">
                <h2 className="text-xl font-bold">{steps[step].title}</h2>
                <p className="text-muted-foreground text-sm">{steps[step].description}</p>
              </div>

              <form onSubmit={handleSubmit(handleNextStep)} className="space-y-4">
                {steps[step].fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Input
                      id={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      {...register(field.name as any)}
                      className={cn(errors[field.name as string] && 'border-destructive')}
                    />
                    {errors[field.name as string] && (
                      <p className="text-destructive text-sm">{errors[field.name as string]?.message as string}</p>
                    )}
                  </div>
                ))}

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={step === 0}
                    className={cn(step === 0 && 'invisible')}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {step === steps.length - 1 ? (isSubmitting ? 'Submitting...' : 'Submit Application') : (<>Next <ArrowRight className="ml-2 h-4 w-4" /></>)}
                  </Button>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="py-10 text-center">
          <div className="bg-primary/10 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
            <CheckCircle2 className="text-primary h-8 w-8" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">Application Submitted!</h2>
          <p className="text-muted-foreground mb-6">Thank you for applying. We&apos;ll be in touch soon.</p>
          <Button
            onClick={() => {
              setStep(0);
              setFormData({});
              setIsComplete(false);
              reset({});
            }}
          >
            Submit Another Application
          </Button>
        </motion.div>
      )}
    </div>
  );
}