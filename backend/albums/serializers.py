from rest_framework import serializers
from .models import Album, AlbumPage, MediaItem, AlbumShare

class MediaItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaItem
        fields = [
            'id', 'media_type', 'file_url', 'file_key', 'caption', 
            'duration', 'position', 'width', 'height', 'file_size',
            'created_at', 'updated_at'
        ]

class AlbumPageSerializer(serializers.ModelSerializer):
    media_items = MediaItemSerializer(many=True, read_only=True)
    items = serializers.SerializerMethodField()  # For frontend compatibility
    
    class Meta:
        model = AlbumPage
        fields = [
            'id', 'title', 'page_number', 'media_items', 'items',
            'created_at', 'updated_at'
        ]
    
    def get_items(self, obj):
        """Transform media_items to match frontend format"""
        items = []
        for media in obj.media_items.all():
            item = {
                'type': media.media_type,
                'src': media.file_url,
                'caption': media.caption,
            }
            if media.duration:
                item['duration'] = media.duration
            items.append(item)
        return items

class AlbumSerializer(serializers.ModelSerializer):
    pages = AlbumPageSerializer(many=True, read_only=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Album
        fields = [
            'id', 'title', 'subtitle', 'description', 'cover_image_url', 
            'cover_image_key', 'pages', 'created_by', 'created_by_username',
            'created_at', 'updated_at', 'is_public'
        ]
        read_only_fields = ['created_by']

class AlbumCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = [
            'title', 'subtitle', 'description', 'cover_image_url', 
            'cover_image_key', 'is_public'
        ]

class AlbumPageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlbumPage
        fields = ['title', 'page_number']

class MediaItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaItem
        fields = [
            'media_type', 'file_url', 'file_key', 'caption', 
            'duration', 'position', 'width', 'height', 'file_size'
        ]

class AlbumShareSerializer(serializers.ModelSerializer):
    album_title = serializers.CharField(source='album.title', read_only=True)
    
    class Meta:
        model = AlbumShare
        fields = [
            'id', 'album', 'album_title', 'share_token', 
            'is_active', 'expires_at', 'created_at'
        ]
        read_only_fields = ['share_token']
