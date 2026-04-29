from django.urls import path
from . import views

urlpatterns = [
    path('', views.home),
    # path('api/save/', views.save_all_data),
    # path('api/webhook/', views.kobo_webhook),
    path('api/details/', views.show_details),
    path('api/create/', views.create_data),
    # path('api/details/<int:id>/', views.delete_details),
    path("api/details/<int:id>/", views.update_details),

    path('api/fee_details/', views.show_fee_details),                     # this is actually create fee details, but named show_fee_details for consistency with student details
    path('api/fee_details/display/', views.display_fee_details),           # this actually show details, but named create_fee_details for consistency with student details

    path('api/student_details/', views.show_student_details),
    path('api/student_details/display/', views.display_student_details),

    path('api/student_details/search/<str:student_id>/', views.search_student_by_id, name='search_student_by_id'),
]
