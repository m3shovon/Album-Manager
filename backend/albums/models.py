from django.db import models
from django.contrib.auth.models import User
import uuid

class Album(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    cover_image_url = models.URLField(blank=True, null=True)
    cover_image_key = models.CharField(max_length=500, blank=True)  # UploadThing file key
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='albums')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class AlbumPage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='pages')
    title = models.CharField(max_length=200)
    page_number = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['page_number']
        unique_together = ['album', 'page_number']
    
    def __str__(self):
        return f"{self.album.title} - Page {self.page_number}: {self.title}"

class MediaItem(models.Model):
    MEDIA_TYPES = [
        ('image', 'Image'),
        ('video', 'Video'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    page = models.ForeignKey(AlbumPage, on_delete=models.CASCADE, related_name='media_items')
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPES)
    file_url = models.URLField()
    file_key = models.CharField(max_length=500)  # UploadThing file key
    caption = models.TextField(blank=True)
    duration = models.CharField(max_length=10, blank=True)  # For videos (e.g., "3:45")
    position = models.PositiveIntegerField(default=0)  # Position within the page
    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)
    file_size = models.PositiveIntegerField(null=True, blank=True)  # In bytes
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['position', 'created_at']
    
    def __str__(self):
        return f"{self.page.title} - {self.media_type}: {self.caption[:50]}"

class AlbumShare(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='shares')
    share_token = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Share: {self.album.title}"
