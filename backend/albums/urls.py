from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlbumViewSet, AlbumPageViewSet, MediaItemViewSet, SharedAlbumViewSet

router = DefaultRouter()
router.register(r'albums', AlbumViewSet)
router.register(r'pages', AlbumPageViewSet)
router.register(r'media', MediaItemViewSet)
router.register(r'shared', SharedAlbumViewSet, basename='shared-album')

urlpatterns = [
    path('', include(router.urls)),
]
