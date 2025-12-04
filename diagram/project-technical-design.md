# Technical Design Document: API Testing Automation Workflow

## 1. Tổng quan hệ thống (System Overview)
Hệ thống **API Testing Automation Workflow** là nền tảng hỗ trợ tự động hóa quy trình kiểm thử API, sử dụng AI để phân tích đặc tả và sinh kịch bản kiểm thử (Test Scripts). Hệ thống tập trung vào việc giảm thiểu thao tác thủ công từ khâu định nghĩa yêu cầu đến khi có được bộ test case hoàn chỉnh.

## 2. Kiến trúc Component (Component Architecture)
Dựa trên `ascii-diagram.txt`, hệ thống Frontend được chia thành các module chính sau:

### 2.1. Authentication Module
*   **Components**: `LoginPage`, `RegisterPage`
*   **Chức năng**: Quản lý phiên làm việc người dùng.
*   **Features**: Đăng nhập, Đăng ký, Quên mật khẩu.

### 2.2. Project Management Module
*   **Components**: `ProjectDashboard` (List), `CreateProjectModal`, `EditProjectModal`, `DeleteProjectDialog`.
*   **Chức năng**: CRUD dự án, quản lý thành viên (TeamManagementTab).
*   **Features**: Tạo dự án mới, xem danh sách, chỉnh sửa thông tin, xóa dự án.

### 2.3. Feature & Detail Module
*   **Components**: `ProjectDetail`, `FeatureForm`.
*   **Chức năng**: Quản lý các tính năng (Features) trong một dự án.
*   **Features**: Thêm mới Feature (Input description/files), xem danh sách Feature, chuyển hướng sang quy trình AI.

### 2.4. AI Generation Module (Core)
*   **Components**: `TestGenerationPage`, `TestRequirementsList`, `TestScriptsView`.
*   **Chức năng**: Quy trình 3 bước sinh test tự động.
    1.  **Input**: Nhập mô tả/upload file (`TestGenerationPage`).
    2.  **Requirements**: Review & Edit yêu cầu kiểm thử do AI sinh ra (`TestRequirementsList`).
    3.  **Scripts**: Review code & Export Postman (`TestScriptsView`).

## 3. Thiết kế API & Data Mapping (API Design & Schema)
Dưới đây là chi tiết các API cần thiết kế để phục vụ các components trên, ánh xạ trực tiếp vào ERD.

### 3.1. Authentication APIs
| API Endpoint | Method | Description | Request Body | ERD Tables Impacted |
| :--- | :--- | :--- | :--- | :--- |
| `/auth/register` | POST | Đăng ký user mới | `{ email, password, name }` | **Insert** `User` |
| `/auth/login` | POST | Đăng nhập | `{ email, password }` | **Read** `User`, **Update** `User.last_login` |
| `/auth/me` | GET | Lấy thông tin user hiện tại | - | **Read** `User` |

### 3.2. Project APIs
| API Endpoint | Method | Description | Request Body | ERD Tables Impacted |
| :--- | :--- | :--- | :--- | :--- |
| `/projects` | GET | Lấy danh sách dự án của user | - | **Read** `Project`, `ProjectMember` |
| `/projects` | POST | Tạo dự án mới | `{ name, description }` | **Insert** `Project`, **Insert** `ProjectMember` (Owner) |
| `/projects/:id` | PUT | Cập nhật dự án | `{ name, description, status }` | **Update** `Project` |
| `/projects/:id` | DELETE | Xóa dự án (Soft delete) | - | **Update** `Project.status` = 'ARCHIVED' |

### 3.3. Feature APIs (Input Layer)
| API Endpoint | Method | Description | Request Body | ERD Tables Impacted |
| :--- | :--- | :--- | :--- | :--- |
| `/projects/:id/features` | GET | Lấy danh sách features | - | **Read** `Feature` |
| `/features` | POST | Tạo feature mới (User Input) | `{ projectId, name, description, attachments[] }` | **Insert** `Feature` |
| `/features/:id` | PUT | Cập nhật input đầu vào | `{ description, attachments[] }` | **Update** `Feature` |

### 3.4. AI Generation APIs (Core Logic)
Đây là phần quan trọng nhất, xử lý luồng nghiệp vụ thông minh.

#### A. Generate API Specification & Requirements
*   **Trigger**: User click "Generate" tại `TestGenerationPage`.
*   **Endpoint**: `POST /features/:id/generate/requirements`
*   **Process**:
    1.  Đọc `Feature.description` & `Feature.attachments`.
    2.  Gọi AI Model (LLM) để phân tích.
    3.  Lưu kết quả phân tích vào DB.
*   **ERD Mapping**:
    *   **Read**: `Feature`
    *   **Insert**: `APISpecification` (Endpoint, Method, Schema).
    *   **Insert**: `TestRequirement` (List test cases).
    *   **Update**: `Feature.status` -> 'ANALYZING'.

#### B. Generate Test Scripts
*   **Trigger**: User click "Generate Scripts" tại `TestRequirementsList`.
*   **Endpoint**: `POST /features/:id/generate/scripts`
*   **Payload**: `{ requirementIds: string[] }` (Chỉ sinh script cho các req được chọn).
*   **Process**:
    1.  Đọc `TestRequirement` và `APISpecification`.
    2.  Gọi AI Model sinh code (JS/Python).
*   **ERD Mapping**:
    *   **Read**: `TestRequirement`, `APISpecification`.
    *   **Insert**: `TestScript` (Code, MockData).

#### C. Export Postman Collection
*   **Trigger**: User click "Export" tại `TestScriptsView`.
*   **Endpoint**: `POST /features/:id/export/postman`
*   **Process**:
    1.  Tổng hợp tất cả `TestScript` của feature.
    2.  Đóng gói thành JSON format của Postman.
*   **ERD Mapping**:
    *   **Read**: `TestScript`, `APISpecification`.
    *   **Insert**: `PostmanCollection` (Lưu lịch sử export).

## 4. Luồng dữ liệu (Data Flow Summary)

1.  **User Input**: Dữ liệu thô (Text/Image) được lưu vào bảng `Feature`.
2.  **AI Processing 1**: Từ `Feature`, hệ thống sinh ra dữ liệu có cấu trúc -> lưu vào `APISpecification` và `TestRequirement`.
3.  **User Review**: User có thể sửa `TestRequirement` (Update bảng `TestRequirement`).
4.  **AI Processing 2**: Từ `TestRequirement` đã duyệt, hệ thống sinh code -> lưu vào `TestScript`.
5.  **Final Output**: Từ `TestScript`, hệ thống đóng gói thành file -> lưu vào `PostmanCollection`.

## 5. Kết luận
Thiết kế này đảm bảo:
*   **Tính toàn vẹn dữ liệu**: Mọi bước trong quy trình AI đều được lưu vết (Persisted), cho phép user quay lại sửa đổi bất cứ lúc nào.
*   **Khả năng mở rộng**: Tách biệt rõ ràng giữa "Input thô" và "Dữ liệu sinh ra", giúp dễ dàng nâng cấp model AI mà không ảnh hưởng dữ liệu cũ.
*   **Traceability**: Dễ dàng truy vết từ một Test Script cụ thể quay ngược lại Test Requirement nào và từ Feature gốc nào.
