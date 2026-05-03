# Convert Django views → API views after integration rest js as frontend and django as backend api

import json
import logging

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.views.decorators.http import require_http_methods

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import User_Details, Response_table, Fee_details, Student_details
from core_data import models

logger = logging.getLogger(__name__)

def home(request):
    return JsonResponse({
        "message": "Django API is running successfully 🚀"
    })

# @csrf_exempt
# @require_POST
# def save_all_data(request):
#     try:
#         data = json.loads(request.body)

#         Response_table.objects.create(metadata=data)

#         return JsonResponse({
#             "status": "success",
#             "message": "Data saved successfully"
#         }, status=201)

#     except json.JSONDecodeError:
#         return JsonResponse({
#             "status": "error",
#             "message": "Invalid JSON"
#         }, status=400)
# @csrf_exempt
# @require_POST
# def kobo_webhook(request):

#     try:
#         data = json.loads(request.body)
#     except json.JSONDecodeError:
#         return JsonResponse({
#             "status": "error",
#             "message": "Invalid JSON"
#         }, status=400)

#     logger.info(f"Kobo Webhook received: {json.dumps(data)}")

#     # Family count
#     family_no = data.get('How_many_members_are_there_in_your_family')

#     if not family_no:
#         return JsonResponse({
#             "status": "error",
#             "message": "Missing family number"
#         }, status=400)

#     try:
#         family_no = int(family_no)
#     except:
#         return JsonResponse({
#             "status": "error",
#             "message": "Invalid family number"
#         }, status=400)

#     # Group members
#     group_data = data.get('Group', [])
#     members_created = 0

#     for member in group_data:
#         name = member.get('Group/What_is_your_name', '')
#         contact = member.get('Group/Your_contact_number', '')
#         gender = member.get('Group/What_is_your_Gender', '')

#         try:
#             age = int(member.get('Group/Enter_your_age', 0))
#         except:
#             age = 0

#         User_Details.objects.create(
#             family_no=family_no,
#             name=name,
#             contact_number=contact,
#             gender=gender,
#             age=age,
#         )

#         members_created += 1

#     return JsonResponse({
#         "status": "success",
#         "family_no": family_no,
#         "members_created": members_created
#     }, status=201)


# CRUD Operation using django and rest js : API usage axiom

@csrf_exempt
@require_POST
def create_data(request):
    try:
        data = json.loads(request.body)
        Response_table.objects.create(metadata=data)

    except json.JSONDecodeError:
        return JsonResponse({
            "status": "error",
            "message": "Invalid JSON"
        }, status=400)

    name = data.get('name', '')
    contact = data.get('contact', '')
    gender = data.get('gender', '') 
    age = data.get('age', 0)
    family_no = data.get('family_no', 0)

    User_Details.objects.create(
        name=name,
        contact_number=contact,
        gender=gender,
        age=age,
        family_no=family_no
    )

    return JsonResponse({
        "status": "success",
        "message": "Data created successfully"
    }, status=201)

def show_details(request):
    responses = Response_table.objects.all()
    data = list(responses.values())

    return JsonResponse({
        "keys": ["name", "contact", "gender", "age", "_submitted_by", "family_no"],
        "responses": data
    })

@csrf_exempt
@require_http_methods(["PUT", "DELETE"])
def del_upd_details_by_id(request, id):
    try:
        response = Response_table.objects.get(id=id)

    except Response_table.DoesNotExist:
        return JsonResponse({
            "status": "error",
            "message": "Record not found"
        }, status=404)

    # UPDATE
    if request.method == "PUT":
        try:
            data = json.loads(request.body)

            response.metadata = data
            response.save()

            return JsonResponse({
                "status": "success",
                "message": "Updated successfully"
            })

        except json.JSONDecodeError:
            return JsonResponse({
                "status": "error",
                "message": "Invalid JSON"
            }, status=400)

    # DELETE
    elif request.method == "DELETE":
        response.delete()

        return JsonResponse({
            "status": "success",
            "message": "Deleted successfully"
        })

    return JsonResponse({
        "status": "error",
        "message": "Method not allowed"
    }, status=405)

# Student details and fee details views from KOBO data forms
@csrf_exempt
@require_POST   
def show_fee_details(request):
    try:
        fee_data = json.loads(request.body)
        
        Fee_details.objects.create(
            student=Student_details.objects.get(Student_id=fee_data['Student_id']),  # this Student_id is from KObo form column name
            Semester=fee_data['Semester'],
            Fee_amount=fee_data['Fee_amount'],
            Paid_amount=fee_data['Paid_amount']
        )

    except json.JSONDecodeError:
        return JsonResponse({
            "status": "error",
            "message": "Invalid JSON"
        }, status=400)
    except Student_details.DoesNotExist:
        return JsonResponse({
            "status": "error",
            "message": "Student not found"
        }, status=404)
    
    return JsonResponse({
        "status": "success",
        "message": "Fee details created successfully"
    }, status=201)
    
@csrf_exempt
@require_POST   
def show_student_details(request):
    try:
        student_data = json.loads(request.body)
        
        Student_details.objects.create(
            Student_id = student_data['Student_id'],
            Name = student_data['Name'],
            Contact = student_data['Contact'],
            Date_of_Birth = student_data['Date_of_Birth'],
            Faculty = student_data['Faculty'],
            Address = student_data['Address']
        )

    except json.JSONDecodeError:
        return JsonResponse({
            "status": "error",
            "message": "Invalid JSON"
        }, status=400)
    return JsonResponse({
        "status": "success",
        "message": "Student details created successfully"
    }, status=201)

def display_student_details(request):
    stud_info = Student_details.objects.all()
    datas = list(stud_info.values())

    return JsonResponse({
        "keyDisp": ["Student_id", "Name", "Faculty"],
        "keys": ["Student_id", "Name", "Contact", "Date_of_Birth", "Faculty", "Address"],
        "student_details": datas
    })

def display_fee_details(request):
    fee_info = Fee_details.objects.all()
    dataf = []
    
    for fee in fee_info:
        dataf.append({
            'id': fee.id,
            'student': fee.student.Student_id if fee.student else 'N/A',  # Get the student ID
            'Semester': fee.Semester,
            'Fee_amount': fee.Fee_amount,
            'Paid_amount': fee.Paid_amount
        })

    return JsonResponse({
        "keyDisp": ["student","Fee_amount", "Paid_amount"],
        "keys": ["student", "Semester", "Fee_amount", "Paid_amount"],
        "fee_details": dataf
    })

# NEW: Search view for getting specific student details by Student_id
@require_http_methods(["GET"])
def search_student_by_id(request, student_id):
    """
    Search for a specific student and their fee details by Student_id
    Endpoint: /api/student_details/search/<student_id>/
    """
    try:
        # Fetch student details
        student = Student_details.objects.get(Student_id=student_id)
        
        # Fetch fee details for this student (can be multiple semesters)
        fee_details_list = Fee_details.objects.filter(student=student)
        
        # Prepare student data
        student_data = {
            'Student_id': student.Student_id,
            'Name': student.Name,
            'Contact': student.Contact,
            'Date_of_Birth': str(student.Date_of_Birth),
            'Faculty': student.Faculty,
            'Address': student.Address
        }
        
        # Prepare fee data (can be multiple entries for different semesters)
        fee_data = []
        for fee in fee_details_list:
            fee_data.append({
                'id': fee.id,
                'Semester': fee.Semester,
                'Fee_amount': fee.Fee_amount,
                'Paid_amount': fee.Paid_amount
            })
        
        return JsonResponse({
            'student_details': student_data,
            'fee_details': fee_data,
            'status': 'success'
        }, status=200)
        
    except Student_details.DoesNotExist:
        return JsonResponse({
            'message': 'Student not found',
            'status': 'error'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'message': str(e),
            'status': 'error'
        }, status=500)