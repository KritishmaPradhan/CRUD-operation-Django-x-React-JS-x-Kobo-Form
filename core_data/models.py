from django.db import models


class User_Details(models.Model):
    family_no = models.IntegerField()
    name = models.CharField(max_length=200)
    contact_number = models.CharField(max_length=20)
    gender = models.CharField(max_length=20)
    age = models.IntegerField()

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'user_details'
        verbose_name = 'User Detail'
        verbose_name_plural = 'User Details'
        ordering = ['-id']

# saves the data form the kobo toolbox
class Response_table(models.Model):
    metadata = models.JSONField()

    # def __str__(self):
    #     return self.metadata

    class Meta:
        db_table = 'response_table'
        verbose_name = 'Response Table'
        verbose_name_plural = 'Response Tables'
        ordering = ['-id']

class Student_details(models.Model):
    Student_id = models.IntegerField(default=0, unique=True)
    Name = models.CharField(max_length=200)
    Contact = models.IntegerField()
    Date_of_Birth = models.DateField()
    Faculty = models.CharField(max_length=200)
    Address = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.Student_id} - {self.Name}"

    class Meta:
        db_table = 'student_details'
        verbose_name = 'Student Detail'
        verbose_name_plural = 'Student Details'
        ordering = ['-id']

class Fee_details(models.Model):
    student = models.ForeignKey(Student_details, on_delete=models.CASCADE, null=True, blank=True,to_field='Student_id' )
    Semester = models.CharField(max_length=20)
    Fee_amount = models.IntegerField()
    Paid_amount = models.IntegerField()

    def __str__(self):
        student_name = self.student.Name if self.student_id else "No Student"
        return f"{student_name} - {self.Semester}"

    class Meta:
        db_table = 'fee_details'
        verbose_name = 'Fee Detail'
        verbose_name_plural = 'Fee Details'
        ordering = ['-id']

