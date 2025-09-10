
'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-provider";
import type { Activity, TalentedStudent } from "@/lib/types";
import { Users, PlusCircle, Edit, Trash2, Mail, Star, CheckSquare, XSquare, UserPlus } from "lucide-react";
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
import { useAuth } from "@/contexts/auth-provider";
import { EmailTemplates } from "@/lib/email-service";


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
  const { getAllUsers } = useAuth();
  
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isActivityFormOpen, setIsActivityFormOpen] = useState(false);
  
  const [selectedTalentedStudent, setSelectedTalentedStudent] = useState<TalentedStudent | null>(null);
  const [isTalentedStudentFormOpen, setIsTalentedStudentFormOpen] = useState(false);
  
  const allUsers = getAllUsers();

  const stats = [
    { title: t('Total Activities', 'إجمالي الأنشطة'), value: activities.length, icon: PlusCircle, color: 'text-blue-500' },
    { title: t('Total Registrations', 'إجمالي التسجيلات'), value: registrations.length, icon: Users, color: 'text-green-500' },
    { title: t('Site Members', 'أعضاء الموقع'), value: allUsers.length, icon: UserPlus, color: 'text-indigo-500' },
    { title: t('Talented Students', 'الطلاب الموهوبون'), value: talentedStudents.length, icon: Star, color: 'text-yellow-500' },
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
  
  const generateMailtoLink = (to: string, subject: string, body: string) => {
    return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  
  const handleWelcomeEmail = (user: { displayName: string | null; email: string | null; }) => {
    if (!user.email || !user.displayName) return;
    const template = EmailTemplates.welcome({ userName: user.displayName });
    window.location.href = generateMailtoLink(user.email, template.subject, template.body);
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

      {/* Activities and Talented Students */}
       <div className="grid gap-8 lg:grid-cols-2">
        <div>
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
         <div>
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
      </div>
      
      {/* Site Members and Registrations */}
       <div className="grid gap-8 lg:grid-cols-1">
            <Card>
                <CardHeader>
                    <CardTitle>{t('Site Members', 'أعضاء الموقع')}</CardTitle>
                    <CardDescription>{t('Users who have created an account on the platform.', 'المستخدمون الذين أنشأوا حسابًا على المنصة.')}</CardDescription>
                </CardHeader>
                <CardContent>
                   <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('User', 'المستخدم')}</TableHead>
                                <TableHead>{t('Email', 'البريد الإلكتروني')}</TableHead>
                                <TableHead className="text-right">{t('Actions', 'الإجراءات')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allUsers.map((user) => (
                                <TableRow key={user.uid}>
                                    <TableCell className="font-medium flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
                                            <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {user.displayName}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" onClick={() => handleWelcomeEmail(user)}>
                                            <Mail className="mr-2 h-4 w-4" />
                                            {t('Welcome Email', 'ترحيب')}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                   </Table>
                </CardContent>
            </Card>
       </div>

    </div>
  );
}
