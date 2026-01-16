import requests
import sys
import json
from datetime import datetime

class ContentAITester:
    def __init__(self, base_url="https://ai-content-creator-44.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=30):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=timeout)

            success = response.status_code == expected_status
            
            if success:
                self.log_test(name, True)
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_detail = response.json()
                    error_msg += f" - {error_detail}"
                except:
                    error_msg += f" - {response.text}"
                self.log_test(name, False, error_msg)
                return False, {}

        except requests.exceptions.Timeout:
            self.log_test(name, False, f"Request timeout after {timeout}s")
            return False, {}
        except Exception as e:
            self.log_test(name, False, f"Request error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        return self.run_test("Health Check", "GET", "health", 200)

    def test_signup(self):
        """Test user signup"""
        test_user_data = {
            "name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "email": f"test_{datetime.now().strftime('%H%M%S')}@example.com",
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "User Signup",
            "POST",
            "auth/signup",
            200,
            data=test_user_data
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            print(f"   Token obtained: {self.token[:20]}...")
            return True, response
        return False, {}

    def test_login(self):
        """Test user login with existing credentials"""
        # First create a user
        test_user_data = {
            "name": f"Login Test User {datetime.now().strftime('%H%M%S')}",
            "email": f"login_test_{datetime.now().strftime('%H%M%S')}@example.com",
            "password": "LoginTest123!"
        }
        
        # Create user
        signup_success, signup_response = self.run_test(
            "Create User for Login Test",
            "POST",
            "auth/signup",
            200,
            data=test_user_data
        )
        
        if not signup_success:
            return False, {}
        
        # Now test login
        login_data = {
            "email": test_user_data["email"],
            "password": test_user_data["password"]
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and 'access_token' in response:
            # Update token for subsequent tests
            self.token = response['access_token']
            self.user_id = response['user']['id']
            return True, response
        return False, {}

    def test_get_me(self):
        """Test get current user info"""
        return self.run_test("Get Current User", "GET", "auth/me", 200)

    def test_text_generation(self):
        """Test text generation with different styles"""
        styles = ["blog", "article", "social"]
        
        for style in styles:
            test_data = {
                "prompt": f"Write a short {style} about artificial intelligence",
                "content_style": style
            }
            
            success, response = self.run_test(
                f"Text Generation ({style})",
                "POST",
                "generate/text",
                200,
                data=test_data,
                timeout=60  # Longer timeout for AI generation
            )
            
            if success and 'content' in response:
                print(f"   Generated content length: {len(response['content'])} chars")
            
            if not success:
                return False, {}
        
        return True, {}

    def test_image_generation(self):
        """Test image generation"""
        test_data = {
            "prompt": "A simple red circle on white background"
        }
        
        success, response = self.run_test(
            "Image Generation",
            "POST",
            "generate/image",
            200,
            data=test_data,
            timeout=90  # Longer timeout for image generation (30-60 seconds)
        )
        
        if success and 'image_base64' in response:
            print(f"   Generated image size: {len(response['image_base64'])} chars (base64)")
            return True, response
        return False, {}

    def test_content_history(self):
        """Test content history endpoints"""
        # Get all contents
        success, response = self.run_test("Get All Contents", "GET", "contents", 200)
        if not success:
            return False, {}
        
        contents = response
        print(f"   Found {len(contents)} content items")
        
        # Test filtering by content type
        success, response = self.run_test("Get Text Contents", "GET", "contents?content_type=text", 200)
        if not success:
            return False, {}
        
        success, response = self.run_test("Get Image Contents", "GET", "contents?content_type=image", 200)
        if not success:
            return False, {}
        
        # Test getting specific content if any exists
        if contents and len(contents) > 0:
            content_id = contents[0]['id']
            success, response = self.run_test(
                f"Get Specific Content ({content_id[:8]}...)",
                "GET",
                f"contents/{content_id}",
                200
            )
            if not success:
                return False, {}
        
        return True, {}

    def test_content_deletion(self):
        """Test content deletion"""
        # First generate some content to delete
        test_data = {
            "prompt": "Test content for deletion",
            "content_style": "blog"
        }
        
        success, response = self.run_test(
            "Generate Content for Deletion Test",
            "POST",
            "generate/text",
            200,
            data=test_data,
            timeout=60
        )
        
        if not success:
            return False, {}
        
        content_id = response['id']
        
        # Now delete it
        success, response = self.run_test(
            f"Delete Content ({content_id[:8]}...)",
            "DELETE",
            f"contents/{content_id}",
            200
        )
        
        return success, response

    def test_invalid_endpoints(self):
        """Test error handling"""
        # Test invalid login
        invalid_login = {
            "email": "nonexistent@example.com",
            "password": "wrongpassword"
        }
        
        success, response = self.run_test(
            "Invalid Login (should fail)",
            "POST",
            "auth/login",
            401,
            data=invalid_login
        )
        
        # Test accessing protected endpoint without token
        old_token = self.token
        self.token = None
        
        success, response = self.run_test(
            "Protected Endpoint Without Token (should fail)",
            "GET",
            "auth/me",
            401
        )
        
        # Restore token
        self.token = old_token
        
        return True, {}

    def run_all_tests(self):
        """Run comprehensive test suite"""
        print("🚀 Starting ContentAI Backend API Tests")
        print(f"   Base URL: {self.base_url}")
        print("=" * 60)
        
        # Test sequence
        test_sequence = [
            self.test_health_check,
            self.test_signup,
            self.test_login,
            self.test_get_me,
            self.test_text_generation,
            self.test_image_generation,
            self.test_content_history,
            self.test_content_deletion,
            self.test_invalid_endpoints
        ]
        
        for test_func in test_sequence:
            try:
                test_func()
            except Exception as e:
                self.log_test(test_func.__name__, False, f"Test exception: {str(e)}")
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Summary:")
        print(f"   Tests Run: {self.tests_run}")
        print(f"   Tests Passed: {self.tests_passed}")
        print(f"   Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"   Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        # Return results
        return {
            "total_tests": self.tests_run,
            "passed_tests": self.tests_passed,
            "failed_tests": self.tests_run - self.tests_passed,
            "success_rate": self.tests_passed/self.tests_run*100 if self.tests_run > 0 else 0,
            "test_details": self.test_results
        }

def main():
    tester = ContentAITester()
    results = tester.run_all_tests()
    
    # Save results to file
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/backend_test_results.json")
    
    # Return appropriate exit code
    return 0 if results["success_rate"] >= 80 else 1

if __name__ == "__main__":
    sys.exit(main())