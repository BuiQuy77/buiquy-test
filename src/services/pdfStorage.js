/**
 * Dịch vụ lưu trữ và truy xuất file PDF đề thi offline (IndexedDB)
 * Cho phép giáo viên chọn file PDF từ máy tính mà không cần tải lên server ngoài.
 */

const DB_NAME = 'MathMate_Pdf_Database';
const DB_VERSION = 1;
const STORE_NAME = 'pdf_files';

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    request.onerror = (event) => {
      console.warn('Không thể mở IndexedDB cho PDF:', event.target.error);
      resolve(null);
    };
  });
}

/**
 * Lưu file PDF (Blob/File) vào IndexedDB
 * @param {string|number} examId
 * @param {'exam'|'solution'} type
 * @param {Blob|File} file
 */
export async function saveExamPdfFile(examId, type, file) {
  if (!file) return false;
  try {
    const db = await openDatabase();
    if (!db) return false;

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const key = `exam_${examId}_${type}`;
      const request = store.put(file, key);

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  } catch (err) {
    console.warn('Lỗi khi lưu PDF vào IndexedDB:', err);
    return false;
  }
}

/**
 * Lấy URL hiển thị file PDF (tạo blob URL nếu có trong IndexedDB, ngược lại dùng fallbackUrl)
 * @param {string|number} examId
 * @param {'exam'|'solution'} type
 * @param {string} fallbackUrl
 */
export async function getExamPdfBlobUrl(examId, type, fallbackUrl) {
  try {
    const db = await openDatabase();
    if (!db) return fallbackUrl;

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const key = `exam_${examId}_${type}`;
      const request = store.get(key);

      request.onsuccess = () => {
        const file = request.result;
        if (file && (file instanceof Blob || file instanceof File)) {
          const blobUrl = URL.createObjectURL(file);
          resolve(blobUrl);
        } else {
          resolve(fallbackUrl);
        }
      };
      request.onerror = () => resolve(fallbackUrl);
    });
  } catch (err) {
    console.warn('Lỗi khi đọc PDF từ IndexedDB:', err);
    return fallbackUrl;
  }
}

/**
 * Xóa các file PDF của một đề thi trong IndexedDB
 * @param {string|number} examId
 */
export async function removeExamPdfFiles(examId) {
  try {
    const db = await openDatabase();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(`exam_${examId}_exam`);
    store.delete(`exam_${examId}_solution`);
  } catch (err) {
    console.warn('Lỗi xóa PDF IndexedDB:', err);
  }
}
