
'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-provider";
import type { Activity, Registration, TalentedStudent } from "@/lib/types";
import { Users, BarChart2, DollarSign, PlusCircle, Edit, Trash2, Mail, Send, UserCog, Star, CheckSquare, XSquare } from "lucide-react";
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
} from "@/components/ui/dialog"
import { ActivityForm } from "@/components/activity-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TalentedStudentForm } from "@/components/talented-student-form";
import { useData } from "@/contexts/data-provider";

export default function AdminDashboardPage() {
  const { t, language } = useLanguage();
  const {
    activities,
    registrations,
    talentedStudents,
    addActivity,
    updateActivity,
    deleteActivity,
    addTalentedStudent,
    updateTalentedStudent,
    deleteTalentedStudent,
  } = useData();
  
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isActivityFormOpen, setIsActivityFormOpen] = useState(false);
  
  const [selectedTalentedStudent, setSelectedTalentedStudent] = useState<TalentedStudent | null>(null);
  const [isTalentedStudentFormOpen, setIsTalentedStudentFormOpen] = useState(false);

  const stats = [
    { title: t('Total Activities', 'إجمالي الأنشطة'), value: activities.length, icon: PlusCircle, color: 'text-blue-500' },
    { title: t('Total Registrations', 'إجمالي التسجيلات'), value: registrations.length, icon: Users, color: 'text-green-500' },
    { title: t('Talented Students', 'الطلاب الموهوبون'), value: talentedStudents.length, icon: Star, color: 'text-yellow-500' },
    { title: t('Total Revenue', 'إجمالي الإيرادات'), value: `${activities.reduce((sum, a) => sum + (a.cost || 0) * registrations.filter(r => r.activityId === a.id).length, 0)} ${t('SAR', 'ر.س')}`, icon: DollarSign, color: 'text-red-500' },
  ];
  
  // Activity Handlers
  const handleAddNewActivity = () => {
    setSelectedActivity(null);
    setIsActivityFormOpen(true);
  };
  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsActivityFormOpen(true);
  };
  const handleDeleteActivity = (id: string) => {
    deleteActivity(id);
  };
  const handleActivityFormSubmit = (values: Omit<Activity, 'id'>) => {
     if (selectedActivity) {
      updateActivity(selectedActivity.id, values);
    } else {
      addActivity(values);
    }
    setIsActivityFormOpen(false);
  };

  // Talented Student Handlers
  const handleAddNewTalentedStudent = () => {
    setSelectedTalentedStudent(null);
    setIsTalentedStudentFormOpen(true);
  }
  const handleEditTalentedStudent = (student: TalentedStudent) => {
    setSelectedTalentedStudent(student);
    setIsTalentedStudentFormOpen(true);
  };
  const handleDeleteTalentedStudent = (id: string) => {
    deleteTalentedStudent(id);
  };
  const handleTalentedStudentFormSubmit = (values: Omit<TalentedStudent, 'id'>) => {
    if (selectedTalentedStudent) {
      updateTalentedStudent(selectedTalentedStudent.id, values);
    } else {
      addTalentedStudent(values);
    }
    setIsTalentedStudentFormOpen(false);
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

      {/* Activities and Registrations Section */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Dialog open={isActivityFormOpen} onOpenChange={setIsActivityFormOpen}>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>{t('Manage Activities', 'إدارة الأنشطة')}</CardTitle>
                        <CardDescription>{t('Add, edit, or remove school activities.', 'إضافة أو تعديل أو حذف أنشطة المدرسة.')}</CardDescription>
                    </div>
                    <Button onClick={handleAddNewActivity}>
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
                        <TableHead>{t('In Slider?', 'في السلايدر؟')}</TableHead>
                        <TableHead className="text-right">{t('Actions', 'الإجراءات')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activities.map((activity) => (
                        <TableRow key={activity.id}>
                            <TableCell className="font-medium">
                            {language === 'en' ? activity.title : activity.titleAr}
                            </TableCell>
                            <TableCell><Badge variant="outline">{activity.category}</Badge></TableCell>
                            <TableCell>
                                {activity.showInSlider ? <CheckSquare className="h-5 w-5 text-green-500" /> : <XSquare className="h-5 w-5 text-muted-foreground" />}
                            </TableCell>
                            <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditActivity(activity)}>
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
                                        <AlertDialogDescription>{t('This action will permanently delete the activity.', 'سيؤدي هذا إلى حذف النشاط نهائيًا.')}</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>{t('Cancel', 'إلغاء')}</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteActivity(activity.id)} className="bg-destructive hover:bg-destructive/90">{t('Delete', 'حذف')}</AlertDialogAction>
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
                    <ActivityForm activity={selectedActivity} onSubmit={handleActivityFormSubmit} onCancel={() => setIsActivityFormOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
        <div className="space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>{t('Recent Registrations', 'التسجيلات الأخيرة')}</CardTitle>
                        <CardDescription>{t('A list of recent student registrations.', 'قائمة بآخر تسجيلات الطلاب.')}</CardDescription>
                    </div>
                     <Button variant="outline" size="sm" onClick={handleEmailAll}>
                        <Send className="mr-2 h-4 w-4" />
                        {t('Email All', 'إرسال للكل')}
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {registrations.slice(0, 5).map((registration) => (
                        <div key={registration.id} className="flex items-center gap-4">
                            <Avatar className="h-10 w-10"><AvatarImage src={`https://i.pravatar.cc/150?u=${registration.email}`} data-ai-hint="user avatar" /><AvatarFallback>{registration.name.charAt(0)}</AvatarFallback></Avatar>
                            <div className="flex-1">
                                <p className="font-medium text-sm">{registration.name}</p>
                                <p className="text-xs text-muted-foreground">{findActivityTitle(registration.activityId)}</p>
                            </div>
                            <Button variant="ghost" size="icon" asChild><a href={`mailto:${registration.email}`}><Mail className="h-4 w-4" /></a></Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
      
      {/* Talented Students Section */}
      <Dialog open={isTalentedStudentFormOpen} onOpenChange={setIsTalentedStudentFormOpen}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t('Manage Talented Students', 'إدارة الطلاب الموهوبين')}</CardTitle>
              <CardDescription>{t('Add, edit, or remove talented students.', 'إضافة أو تعديل أو حذف الطلاب الموهوبين.')}</CardDescription>
            </div>
            <Button onClick={handleAddNewTalentedStudent}>
              <Star className="mr-2 h-4 w-4" />
              {t('Add Talented Student', 'إضافة طالب موهوب')}
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('Student Name', 'اسم الطالب')}</TableHead>
                  <TableHead>{t('Grade', 'المرحلة')}</TableHead>
                  <TableHead>{t('Talent', 'الموهبة')}</TableHead>
                  <TableHead className="text-right">{t('Actions', 'الإجراءات')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {talentedStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium flex items-center gap-3">
                        <Avatar className="h-9 w-9"><AvatarImage src={student.imageUrl} data-ai-hint={student.imageHint}/><AvatarFallback>{language === 'en' ? student.name.charAt(0) : student.nameAr.charAt(0)}</AvatarFallback></Avatar>
                        {language === 'en' ? student.name : student.nameAr}
                    </TableCell>
                    <TableCell>{language === 'en' ? student.grade : student.gradeAr}</TableCell>
                    <TableCell><Badge variant="secondary">{language === 'en' ? student.talent : student.talentAr}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditTalentedStudent(student)}>
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
                              <AlertDialogDescription>{t('This will permanently remove the student from the talented list.', 'سيؤدي هذا إلى إزالة الطالب نهائيًا من قائمة الموهوبين.')}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('Cancel', 'إلغاء')}</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteTalentedStudent(student.id)} className="bg-destructive hover:bg-destructive/90">{t('Delete', 'حذف')}</AlertDialogAction>
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
              {selectedTalentedStudent ? t('Edit Talented Student', 'تعديل طالب موهوب') : t('Add New Talented Student', 'إضافة طالب موهوب جديد')}
            </DialogTitle>
            <DialogDescription>
              {t('Fill in the details for the talented student.', 'املأ التفاصيل الخاصة بالطالب الموهوب.')}
            </DialogDescription>
          </DialogHeader>
          <TalentedStudentForm 
            student={selectedTalentedStudent} 
            onSubmit={handleTalentedStudentFormSubmit} 
            onCancel={() => setIsTalentedStudentFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
