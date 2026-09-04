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
import { CheckCircle2, ArrowRight, ArrowLeft, Calendar } from 'lucide-react';

// Step 1: Employee & Leave Type Selection
const leaveTypeSchema = z.object({
  employeeId: z.string().min(3, 'Employee ID is required'),
  department: z.string().min(2, 'Department is required'),
  leaveType: z.enum([
    'Annual Leave',
    'Sick Leave',
    'Casual Leave',
    'Maternity/Paternity Leave',
    'Unpaid Leave',
  ], {
    required_error: 'Please select a leave type',
  }),
});

// Step 2: Date Selection & Details
const datesSchema = z
  .object({
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    reason: z.string().min(10, 'Reason must be at least 10 characters long'),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: 'End date cannot be before start date',
    path: ['endDate'],
  });

// Step 3: Emergency Contact & Coverage
const contactSchema = z.object({
  coveringEmployee: z.string().min(2, 'Covering employee name is required'),
  emergencyContactName: z.string().min(2, 'Emergency contact name is required'),
  emergencyContactPhone: z
    .string()
    .min(10, 'Please enter a valid phone number'),
});

// Full combined schema
const formSchema = z.object({
  ...leaveTypeSchema.shape,
  ...datesSchema.shape,
  ...contactSchema.shape,
});

type FormData = z.infer<typeof formSchema>;

interface MultiStepLeaveFormProps {
  className?: string;
  onSubmit?: (data: FormData) => void;
}

export default function MultiStepLeaveForm({
  className,
  onSubmit,
}: MultiStepLeaveFormProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    {
      id: 'type',
      title: 'Leave Details',
      description: 'Specify your employee ID and leave type',
      schema: leaveTypeSchema,
      fields: [
        {
          name: 'employeeId',
          label: 'Employee ID',
          type: 'text',
          placeholder: 'EMP-1042',
        },
        {
          name: 'department',
          label: 'Department',
          type: 'select',
          options: ['Engineering', 'Human Resources', 'Marketing', 'Sales', 'Finance', 'Operations'],
        },
        {
          name: 'leaveType',
          label: 'Type of Leave',
          type: 'select',
          options: [
            'Annual Leave',
            'Sick Leave',
            'Casual Leave',
            'Maternity/Paternity Leave',
            'Unpaid Leave',
          ],
        },
      ],
    },
    {
      id: 'dates',
      title: 'Schedule & Reason',
      description: 'Select dates and give a brief reason for absence',
      schema: datesSchema,
      fields: [
        {
          name: 'startDate',
          label: 'Start Date',
          type: 'date',
        },
        {
          name: 'endDate',
          label: 'End Date',
          type: 'date',
        },
        {
          name: 'reason',
          label: 'Reason for Leave',
          type: 'textarea',
          placeholder: 'Brief explanation for management approval...',
        },
      ],
    },
    {
      id: 'coverage',
      title: 'Coverage & Emergency',
      description: 'Provide handoff coverage and emergency contact info',
      schema: contactSchema,
      fields: [
        {
          name: 'coveringEmployee',
          label: 'Covering Employee / Handover To',
          type: 'text',
          placeholder: 'Sarah Jenkins',
        },
        {
          name: 'emergencyContactName',
          label: 'Emergency Contact Name',
          type: 'text',
          placeholder: 'Jane Doe',
        },
        {
          name: 'emergencyContactPhone',
          label: 'Emergency Contact Phone',
          type: 'tel',
          placeholder: '+1 (555) 019-2834',
        },
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

  const handleNextStep = (data: any) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);

    if (step < steps.length - 1) {
      setStep(step + 1);
      reset(updatedData);
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        if (onSubmit) {
          onSubmit(updatedData as FormData);
        }
        setIsComplete(true);
        setIsSubmitting(false);
      }, 1500);
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
    <div
      className={cn(
        'bg-card/40 mt-8 mx-auto w-full max-w-md rounded-lg p-6 shadow-lg border border-border',
        className,
      )}
    >
      {!isComplete ? (
        <>
          {/* Progress bar */}
          <div className="mb-8">
            <div className="mb-2 flex justify-between">
              <span className="text-sm font-medium">
                Step {step + 1} of {steps.length}
              </span>
              <span className="text-sm font-medium">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step indicators */}
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

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold">{steps[step].title}</h2>
                <p className="text-muted-foreground text-sm">
                  {steps[step].description}
                </p>
              </div>

              <form
                onSubmit={handleSubmit(handleNextStep)}
                className="space-y-4"
              >
                {steps[step].fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>{field.label}</Label>

                    {/* Conditional rendering for inputs, dropdowns, and textareas */}
                    {field.type === 'select' ? (
                      <select
                        id={field.name}
                        {...register(field.name as any)}
                        className={cn(
                          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                          errors[field.name as string] && 'border-destructive',
                        )}
                      >
                        <option value="">Select an option</option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        id={field.name}
                        placeholder={field.placeholder}
                        rows={3}
                        {...register(field.name as any)}
                        className={cn(
                          'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                          errors[field.name as string] && 'border-destructive',
                        )}
                      />
                    ) : (
                      <Input
                        id={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        {...register(field.name as any)}
                        className={cn(
                          errors[field.name as string] && 'border-destructive',
                        )}
                      />
                    )}

                    {errors[field.name as string] && (
                      <p className="text-destructive text-sm">
                        {errors[field.name as string]?.message as string}
                      </p>
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
                    {step === steps.length - 1 ? (
                      isSubmitting ? (
                        'Submitting Request...'
                      ) : (
                        'Submit Leave Request'
                      )
                    ) : (
                      <>
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="py-10 text-center"
        >
          <div className="bg-primary/10 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
            <Calendar className="text-primary h-8 w-8" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">Leave Request Submitted!</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Your manager and HR have been notified. You can track your approval status in your employee dashboard.
          </p>
          <Button
            onClick={() => {
              setStep(0);
              setFormData({});
              setIsComplete(false);
              reset({});
            }}
          >
            Submit Another Request
          </Button>
        </motion.div>
      )}
    </div>
  );
}