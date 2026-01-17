"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2, UserPlus, ShieldCheck } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).optional().or(z.literal("")),
  phone: z.string().optional(),
  passport_number: z.string().min(5, {
    message: "Passport number is required.",
  }),
  passport_expiry: z.date({
    required_error: "Passport expiry date is required.",
  }).optional(),
  nationality: z.string({
    required_error: "Please select a nationality.",
  }),
  position: z.string().optional(),
  department: z.string().optional(),
  employment_start_date: z.date().optional(),
})

interface AddEmployeeModalProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddEmployeeModal({ children, open, onOpenChange }: AddEmployeeModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const handleOpenChange = isControlled ? onOpenChange : setInternalOpen

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      passport_number: "",
      nationality: "",
      position: "",
      department: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create employee")
      }

      toast({
        title: "Personnel Registered",
        description: `${values.first_name} ${values.last_name} has been added to the registry.`,
      })

      form.reset()
      if (handleOpenChange) handleOpenChange(false)
      queryClient.invalidateQueries({ queryKey: ["employees"] })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: error.message,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[640px] p-0 overflow-hidden border-none rounded-[32px] shadow-2xl">
        <div className="bg-primary p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
            </div>
            <DialogTitle className="text-3xl font-display font-bold tracking-tight mb-2">Personnel Registration</DialogTitle>
            <DialogDescription className="text-white/60 font-medium">
              Initialize a new employee record within the Maltese TCN compliance framework.
            </DialogDescription>
          </div>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar bg-white">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Identity Section */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full" />
                  Identity Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Given name" className="h-12 rounded-xl bg-slate-50 border-none shadow-inner focus:ring-4 focus:ring-secondary/5 transition-all" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Family name" className="h-12 rounded-xl bg-slate-50 border-none shadow-inner focus:ring-4 focus:ring-secondary/5 transition-all" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Email</FormLabel>
                        <FormControl>
                          <Input placeholder="employee@org.mt" className="h-12 rounded-xl bg-slate-50 border-none shadow-inner focus:ring-4 focus:ring-secondary/5 transition-all" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+356 XXXX XXXX" className="h-12 rounded-xl bg-slate-50 border-none shadow-inner focus:ring-4 focus:ring-secondary/5 transition-all" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Compliance Section */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full" />
                  Compliance & Documentation
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="passport_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">Passport Identifier</FormLabel>
                        <FormControl>
                          <Input placeholder="A0000000" className="h-12 rounded-xl bg-slate-50 border-none shadow-inner focus:ring-4 focus:ring-secondary/5 transition-all" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nationality</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none shadow-inner focus:ring-4 focus:ring-secondary/5 transition-all">
                              <SelectValue placeholder="Select Origin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                            <SelectItem value="Philippines">Philippines</SelectItem>
                            <SelectItem value="India">India</SelectItem>
                            <SelectItem value="Pakistan">Pakistan</SelectItem>
                            <SelectItem value="Nepal">Nepal</SelectItem>
                            <SelectItem value="Serbia">Serbia</SelectItem>
                            <SelectItem value="Colombia">Colombia</SelectItem>
                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="passport_expiry"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">Passport Expiry</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "h-12 rounded-xl bg-slate-50 border-none shadow-inner text-left font-bold text-sm",
                                  !field.value && "text-slate-400"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 text-slate-300" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-2xl overflow-hidden" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="employment_start_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">Onboarding Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "h-12 rounded-xl bg-slate-50 border-none shadow-inner text-left font-bold text-sm",
                                  !field.value && "text-slate-400"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Select date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 text-slate-300" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-2xl overflow-hidden" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Organizational Section */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full" />
                  Organizational Placement
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</FormLabel>
                        <FormControl>
                          <Input placeholder="Operations / Tech" className="h-12 rounded-xl bg-slate-50 border-none shadow-inner focus:ring-4 focus:ring-secondary/5 transition-all" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">Formal Designation</FormLabel>
                        <FormControl>
                          <Input placeholder="Job Title" className="h-12 rounded-xl bg-slate-50 border-none shadow-inner focus:ring-4 focus:ring-secondary/5 transition-all" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-sm tracking-widest uppercase shadow-premium hover:shadow-premium-hover transition-all hover:-translate-y-0.5"
                >
                  {form.formState.isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Synchronizing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5" />
                      Commit Registration
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
