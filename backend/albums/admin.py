from django.contrib import admin
from .models import Album, AlbumPage, MediaItem, AlbumShare

@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ['title', 'subtitle', 'created_by', 'is_public', 'created_at']
    list_filter = ['is_public', 'created_at']
    search_fields = ['title', 'subtitle', 'description']
    readonly_fields = ['id', 'created_at', 'updated_at']

@admin.register(AlbumPage)
class AlbumPageAdmin(admin.ModelAdmin):
    list_display = ['title', 'album', 'page_number', 'created_at']
    list_filter = ['album', 'created_at']
    search_fields = ['title', 'album__title']
    readonly_fields = ['id', 'created_at', 'updated_at']

@admin.register(MediaItem)
class MediaItemAdmin(admin.ModelAdmin):
    list_display = ['caption', 'page', 'media_type', 'position', 'created_at']
    list_filter = ['media_type', 'created_at']
    search_fields = ['caption', 'page__title']
    readonly_fields = ['id', 'created_at', 'updated_at']

@admin.register(AlbumShare)
class AlbumShareAdmin(admin.ModelAdmin):
    list_display = ['album', 'share_token', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    readonly_fields = ['id', 'share_token', 'created_at']
