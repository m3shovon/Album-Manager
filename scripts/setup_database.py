#!/usr/bin/env python
"""
Script to set up the database with initial data
Run with: python manage.py shell < scripts/setup_database.py
"""

from django.contrib.auth.models import User
from albums.models import Album, AlbumPage, MediaItem

# Create a test user
user, created = User.objects.get_or_create(
    username='testuser',
    defaults={
        'email': 'test@example.com',
        'first_name': 'Test',
        'last_name': 'User'
    }
)

if created:
    user.set_password('testpass123')
    user.save()
    print(f"Created user: {user.username}")

# Create a sample album
album, created = Album.objects.get_or_create(
    title='Summer Memories 2024',
    defaults={
        'subtitle': 'Family Adventures',
        'description': 'Our amazing summer vacation memories',
        'cover_image_url': 'https://utfs.io/f/sample-cover-image.jpg',
        'created_by': user,
        'is_public': True
    }
)

if created:
    print(f"Created album: {album.title}")
    
    # Create sample pages
    pages_data = [
        {'title': 'Beach Day', 'page_number': 1},
        {'title': 'Mountain Adventure', 'page_number': 2},
        {'title': 'City Exploration', 'page_number': 3},
    ]
    
    for page_data in pages_data:
        page, page_created = AlbumPage.objects.get_or_create(
            album=album,
            page_number=page_data['page_number'],
            defaults={'title': page_data['title']}
        )
        
        if page_created:
            print(f"Created page: {page.title}")
            
            # Add sample media items
            media_items = [
                {
                    'media_type': 'image',
                    'file_url': f'https://utfs.io/f/sample-image-{page.page_number}-1.jpg',
                    'file_key': f'sample-key-{page.page_number}-1',
                    'caption': f'Beautiful moment from {page.title}',
                    'position': 0
                },
                {
                    'media_type': 'image',
                    'file_url': f'https://utfs.io/f/sample-image-{page.page_number}-2.jpg',
                    'file_key': f'sample-key-{page.page_number}-2',
                    'caption': f'Another great shot from {page.title}',
                    'position': 1
                }
            ]
            
            for media_data in media_items:
                MediaItem.objects.create(page=page, **media_data)
            
            print(f"Added media items to {page.title}")

print("Database setup complete!")
