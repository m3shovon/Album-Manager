import requests
from django.conf import settings
from typing import Dict, Any, Optional

class UploadThingService:
    """Service for handling UploadThing API interactions"""
    
    def __init__(self):
        self.secret = settings.UPLOADTHING_SECRET
        self.app_id = settings.UPLOADTHING_APP_ID
        self.base_url = "https://api.uploadthing.com"
    
    def get_headers(self) -> Dict[str, str]:
        """Get headers for UploadThing API requests"""
        return {
            "Authorization": f"Bearer {self.secret}",
            "Content-Type": "application/json",
        }
    
    def delete_file(self, file_key: str) -> Dict[str, Any]:
        """Delete file from UploadThing"""
        url = f"{self.base_url}/api/deleteFile"
        payload = {
            "fileKeys": [file_key]
        }
        
        try:
            response = requests.post(url, json=payload, headers=self.get_headers())
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            raise Exception(f"Failed to delete file: {str(e)}")
    
    def get_file_info(self, file_key: str) -> Optional[Dict[str, Any]]:
        """Get file information from UploadThing"""
        url = f"{self.base_url}/api/getFileInfo"
        params = {"fileKey": file_key}
        
        try:
            response = requests.get(url, params=params, headers=self.get_headers())
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            raise Exception(f"Failed to get file info: {str(e)}")
    
    def list_files(self) -> Dict[str, Any]:
        """List all files in UploadThing"""
        url = f"{self.base_url}/api/listFiles"
        
        try:
            response = requests.get(url, headers=self.get_headers())
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            raise Exception(f"Failed to list files: {str(e)}")



# import requests
# from django.conf import settings
# from typing import Dict, Any, Optional

# class UploadThingService:
#     """Service for handling UploadThing API interactions"""
    
#     def __init__(self):
#         self.secret = settings.UPLOADTHING_SECRET
#         self.app_id = settings.UPLOADTHING_APP_ID
#         self.base_url = "https://api.uploadthing.com"
    
#     def get_headers(self) -> Dict[str, str]:
#         """Get headers for UploadThing API requests"""
#         return {
#             "Authorization": f"Bearer {self.secret}",
#             "Content-Type": "application/json",
#         }
    
#     def upload_file(self, file) -> Dict[str, Any]:
#         """
#         Upload file to UploadThing
#         Note: This is a simplified version. In practice, you'd use UploadThing's
#         client-side upload and then verify/store the result server-side.
#         """
#         if not file:
#             raise ValueError("No file provided")
        
#         # In a real implementation, you would:
#         # 1. Generate a presigned URL from UploadThing
#         # 2. Upload the file directly from the client
#         # 3. Receive the file info via webhook or callback
#         # 4. Store the file info in your database
        
#         # For now, return a mock response
#         return {
#             "success": True,
#             "file_url": f"https://utfs.io/f/mock-file-key-{file.name}",
#             "file_key": f"mock-file-key-{file.name}",
#             "file_size": file.size,
#             "file_name": file.name,
#         }
    
#     def delete_file(self, file_key: str) -> Dict[str, Any]:
#         """Delete file from UploadThing"""
#         url = f"{self.base_url}/api/deleteFile"
#         payload = {
#             "fileKeys": [file_key]
#         }
        
#         try:
#             response = requests.post(url, json=payload, headers=self.get_headers())
#             response.raise_for_status()
#             return response.json()
#         except requests.RequestException as e:
#             raise Exception(f"Failed to delete file: {str(e)}")
    
#     def get_file_info(self, file_key: str) -> Optional[Dict[str, Any]]:
#         """Get file information from UploadThing"""
#         url = f"{self.base_url}/api/getFileInfo"
#         params = {"fileKey": file_key}
        
#         try:
#             response = requests.get(url, params=params, headers=self.get_headers())
#             response.raise_for_status()
#             return response.json()
#         except requests.RequestException as e:
#             raise Exception(f"Failed to get file info: {str(e)}")
    
#     def generate_presigned_url(self, file_name: str, file_type: str) -> Dict[str, Any]:
#         """Generate presigned URL for client-side upload"""
#         url = f"{self.base_url}/api/requestFileUpload"
#         payload = {
#             "files": [{
#                 "name": file_name,
#                 "type": file_type,
#             }]
#         }
        
#         try:
#             response = requests.post(url, json=payload, headers=self.get_headers())
#             response.raise_for_status()
#             return response.json()
#         except requests.RequestException as e:
#             raise Exception(f"Failed to generate presigned URL: {str(e)}")
