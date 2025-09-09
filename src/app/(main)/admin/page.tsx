
'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-provider";
import { activities as initialActivities, registrations as initialRegistrations } from "@/lib/data";
import type { Activity, Registration } from "@/lib/types";
import { Users, BarChart2, DollarSign, PlusCircle, Edit, Trash2, Mail, Send, UserCog } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ActivityForm } from "@/components/activity-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// NOTE: In a real application, this state would be managed in a database.
// For this prototype, we're managing it in component state.
export default function AdminDashboardPage() {
  const { t, language } = useLanguage();
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const stats = [
    { title: t('Total Activities', 'إجمالي الأنشطة'), value: activities.length, icon: PlusCircle, color: 'text-blue-500' },
    { title: t('Total Registrations', 'إجمالي التسجيلات'), value: registrations.length, icon: Users, color: 'text-green-500' },
    { title: t('Events Hosted', 'الفعاليات المستضافة'), value: activities.filter(a => a.category === 'Event').length, icon: BarChart2, color: 'text-purple-500' },
    { title: t('Total Revenue', 'إجمالي الإيرادات'), value: `$${activities.reduce((sum, a) => sum + (a.cost || 0) * registrations.filter(r => r.activityId === a.id).length, 0)}`, icon: DollarSign, color: 'text-yellow-500' },
  ];

  const handleAddNew = () => {
    setSelectedActivity(null);
    setIsFormOpen(true);
  };
  
  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    // In a real app, you'd call an API to delete the activity.
    setActivities(activities.filter(a => a.id !== id));
  };
  
  const handleFormSubmit = (values: Omit<Activity, 'id'>) => {
     if (selectedActivity) {
      // Update existing activity
      setActivities(activities.map(a => a.id === selectedActivity.id ? { ...a, ...values } : a));
    } else {
      // Add new activity
      const newActivity: Activity = {
        id: (activities.length + 1).toString(), // simple id generation
        ...values,
      };
      setActivities([...activities, newActivity]);
    }
    setIsFormOpen(false);
  };
  
  const findActivityTitle = (id: string) => {
    const activity = activities.find(a => a.id === id);
    if (!activity) return 'Unknown Activity';
    return language === 'en' ? activity.title : activity.titleAr;
  };
  
  const handleEmailAll = () => {
    const allEmails = registrations.map(r => r.email).join(',');
    window.location.href = `mailto:?bcc=${allEmails}`;
  };


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {t('Admin Dashboard', 'لوحة تحكم المسؤول')}
        </h1>
        <p className="text-muted-foreground">
          {t('Welcome back, Admin!', '!مرحبا بعودتك يا مسؤول')}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>{t('Manage Activities', 'إدارة الأنشطة')}</CardTitle>
                        <CardDescription>{t('Add, edit, or remove school activities.', 'إضافة أو تعديل أو حذف أنشطة المدرسة.')}</CardDescription>
                    </div>
                    <Button onClick={handleAddNew}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t('Add New Activity', 'إضافة نشاط جديد')}
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>{t('Activity', 'النشاط')}</TableHead>
                        <TableHead>{t('Category', 'الفئة')}</TableHead>
                        <TableHead>{t('Date', 'التاريخ')}</TableHead>
                        <TableHead>{t('Cost', 'التكلفة')}</TableHead>
                        <TableHead className="text-right">{t('Actions', 'الإجراءات')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activities.map((activity) => (
                        <TableRow key={activity.id}>
                            <TableCell className="font-medium">
                            {language === 'en' ? activity.title : activity.titleAr}
                            </TableCell>
                            <TableCell>
                            <Badge variant="outline">{activity.category}</Badge>
                            </TableCell>
                            <TableCell>{activity.date}</TableCell>
                            <TableCell>
                            {activity.cost ? `$${activity.cost}` : 'Free'}
                            </TableCell>
                            <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(activity)}>
                                    <Edit className="h-4 w-4" />
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>{t('Are you sure?', 'هل أنت متأكد؟')}</AlertDialogTitle>
                                        <AlertDialogDescription>
                                        {t('This action cannot be undone. This will permanently delete the activity.', 'لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف النشاط نهائيًا.')}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>{t('Cancel', 'إلغاء')}</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(activity.id)} className="bg-destructive hover:bg-destructive/90">
                                        {t('Delete', 'حذف')}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
                </Card>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">
                        {selectedActivity ? t('Edit Activity', 'تعديل النشاط') : t('Add New Activity', 'إضافة نشاط جديد')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('Fill in the details below. Click save when you are done.', 'املأ التفاصيل أدناه. انقر على "حفظ" عند الانتهاء.')}
                    </DialogDescription>
                    </DialogHeader>
                    <ActivityForm
                    activity={selectedActivity}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setIsFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
        <div className="space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>{t('Recent Registrations', 'التسجيلات الأخيرة')}</CardTitle>
                        <CardDescription>{t('A list of recent student registrations for activities.', 'قائمة بآخر تسجيلات الطلاب في الأنشطة.')}</CardDescription>
                    </div>
                     <Button variant="outline" size="sm" onClick={handleEmailAll}>
                        <Send className="mr-2 h-4 w-4" />
                        {t('Email All', 'إرسال للكل')}
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {registrations.slice(0, 5).map((registration) => (
                        <div key={registration.id} className="flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={`https://i.pravatar.cc/150?u=${registration.email}`} data-ai-hint="user avatar" />
                                <AvatarFallback>{registration.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-medium text-sm">{registration.name}</p>
                                <p className="text-xs text-muted-foreground">{findActivityTitle(registration.activityId)}</p>
                            </div>
                            <Button variant="ghost" size="icon" asChild>
                                <a href={`mailto:${registration.email}`}>
                                    <Mail className="h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>{t('Admin Management', 'إدارة المسؤولين')}</CardTitle>
                        <CardDescription>{t('Add or remove administrators.', 'إضافة أو إزالة المسؤولين.')}</CardDescription>
                    </div>
                    <Button>
                        <UserCog className="mr-2 h-4 w-4" />
                        {t('Add Admin', 'إضافة مسؤول')}
                    </Button>
                </CardHeader>
                <CardContent>
                   <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>{t('Name', 'الاسم')}</TableHead>
                            <TableHead>{t('Email', 'البريد الإلكتروني')}</TableHead>
                            <TableHead className="text-right">{t('Actions', 'الإجراءات')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             <TableRow>
                                <TableCell>Admin</TableCell>
                                <TableCell>admin@ags.edu</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" disabled>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

    