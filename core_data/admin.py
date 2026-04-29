from django.contrib import admin
from .models import *


# Custom Admin Classes for better UI display
class Student_detailsAdmin(admin.ModelAdmin):
    list_display = ['Student_id', 'Name', 'Faculty', 'Contact']
    search_fields = ['Student_id', 'Name', 'Faculty']
    list_filter = ['Faculty']


class Fee_detailsAdmin(admin.ModelAdmin):
    list_display = ['student', 'Semester', 'Fee_amount', 'Paid_amount']
    search_fields = ['student__Name', 'student__Student_id', 'Semester']
    list_filter = ['Semester', 'student']
    raw_id_fields = ['student']  # Optional: use search lookup instead of dropdown for large datasets


# Register your models here.
admin.site.register(User_Details)
admin.site.register(Response_table)
admin.site.register(Fee_details, Fee_detailsAdmin)
admin.site.register(Student_details, Student_detailsAdmin)    