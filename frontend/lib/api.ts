// 🔴 ให้มันอ่านค่าจาก Netlify Environment ก่อน ถ้าไม่มีค่อยใช้ localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    // 🛡️ ดักจับกรณี API พัง หรือ URL ผิด แล้วส่งหน้าเว็บ HTML (404) กลับมา
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error('❌ API ไม่ได้ตอบกลับเป็น JSON! Endpoint:', endpoint);
      return { success: false, message: 'การเชื่อมต่อ API ผิดพลาด (Server อาจจะหลับ หรือ URL ผิด)' };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' };
  }
}