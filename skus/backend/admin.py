from django.contrib import admin
from .models import SKU, Note, SalesActivity, ReturnActivity, ContentScoreActivity

admin.site.register(SKU)
admin.site.register(Note)
admin.site.register(SalesActivity)
admin.site.register(ReturnActivity)
admin.site.register(ContentScoreActivity)