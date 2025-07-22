from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import Album, AlbumPage, MediaItem, AlbumShare
from .serializers import (
    AlbumSerializer, AlbumCreateSerializer, AlbumPageSerializer, 
    AlbumPageCreateSerializer, MediaItemSerializer, MediaItemCreateSerializer,
    AlbumShareSerializer
)
from .services import UploadThingService
import uuid

class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    permission_classes = [permissions.AllowAny]  # Change as needed
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AlbumCreateSerializer
        return AlbumSerializer
    
    def perform_create(self, serializer):
        # For now, create albums without authentication
        # In production, use: serializer.save(created_by=self.request.user)
        user, created = User.objects.get_or_create(username='anonymous')
        serializer.save(created_by=user)
    
    @action(detail=True, methods=['get'])
    def pages(self, request, pk=None):
        """Get all pages for an album"""
        album = self.get_object()
        pages = album.pages.all()
        serializer = AlbumPageSerializer(pages, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_page(self, request, pk=None):
        """Add a new page to an album"""
        album = self.get_object()
        serializer = AlbumPageCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            # Auto-increment page number if not provided
            if 'page_number' not in request.data:
                last_page = album.pages.order_by('-page_number').first()
                page_number = (last_page.page_number + 1) if last_page else 1
                serializer.validated_data['page_number'] = page_number
            
            serializer.save(album=album)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def shared_link(self, request, pk=None):
        """Get or create a shared link for the album"""
        album = self.get_object()
        share, created = AlbumShare.objects.get_or_create(
            album=album,
            defaults={'share_token': str(uuid.uuid4())}
        )
        serializer = AlbumShareSerializer(share)
        return Response(serializer.data)

class AlbumPageViewSet(viewsets.ModelViewSet):
    queryset = AlbumPage.objects.all()
    serializer_class = AlbumPageSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AlbumPageCreateSerializer
        return AlbumPageSerializer
    
    @action(detail=True, methods=['get'])
    def media(self, request, pk=None):
        """Get all media items for a page"""
        page = self.get_object()
        media_items = page.media_items.all()
        serializer = MediaItemSerializer(media_items, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_media(self, request, pk=None):
        """Add media item to a page"""
        page = self.get_object()
        serializer = MediaItemCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            # Auto-increment position if not provided
            if 'position' not in request.data:
                last_media = page.media_items.order_by('-position').first()
                position = (last_media.position + 1) if last_media else 0
                serializer.validated_data['position'] = position
            
            serializer.save(page=page)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def reorder_media(self, request, pk=None):
        """Reorder media items on a page"""
        page = self.get_object()
        media_order = request.data.get('media_order', [])
        
        for index, media_id in enumerate(media_order):
            try:
                media_item = page.media_items.get(id=media_id)
                media_item.position = index
                media_item.save()
            except MediaItem.DoesNotExist:
                continue
        
        return Response({'status': 'success'})

class MediaItemViewSet(viewsets.ModelViewSet):
    queryset = MediaItem.objects.all()
    serializer_class = MediaItemSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return MediaItemCreateSerializer
        return MediaItemSerializer
    
    @action(detail=True, methods=['delete'])
    def delete_from_uploadthing(self, request, pk=None):
        """Delete file from UploadThing and database"""
        media_item = self.get_object()
        try:
            upload_service = UploadThingService()
            upload_service.delete_file(media_item.file_key)
            media_item.delete()
            return Response({'status': 'deleted'})
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class SharedAlbumViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for accessing shared albums via token"""
    serializer_class = AlbumSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'share_token'
    
    def get_queryset(self):
        return Album.objects.filter(
            shares__is_active=True,
            shares__share_token=self.kwargs.get('share_token')
        )
    
    def get_object(self):
        share_token = self.kwargs.get('share_token')
        share = get_object_or_404(AlbumShare, share_token=share_token, is_active=True)
        return share.album
