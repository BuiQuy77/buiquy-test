/**
 * cloudSyncService.js
 * Dịch vụ Quản lý Đồng bộ Đám mây Tập trung (Centralized Cloud Sync Service)
 * Giúp biến MathMate từ lưu trữ cục bộ (Offline LocalStorage) thành Web Động Đa Thiết Bị:
 * - Thay đổi slide HTML, video, hồ sơ giáo viên, tài khoản học sinh, cấu hình web
 *   trên một máy tính bất kỳ sẽ tự động lưu lên đám mây và đồng bộ sang tất cả các máy tính khác.
 * - Hỗ trợ đa tầng:
 *   1. Google Firebase Realtime Database (Khuyên dùng: Miễn phí vĩnh viễn, cực nhanh, chuẩn Google)
 *   2. Link Đồng Bộ 1-Chạm (URL Hash Sync - Sao chép link chuyển ngay toàn bộ slide sang máy khác)
 *   3. Xuất / Nạp file sao lưu toàn hệ thống (.json)
 *   4. Cơ chế Offline-First: Lưu cục bộ trước, tự động tải/đẩy dữ liệu đám mây khi có kết nối
 */

export const SYNC_STORAGE_KEYS = {
  SLIDES: 'mathverse_custom_slides_v1',
  VIDEOS: 'mathverse_custom_videos_v1',
  TEACHER: 'mathmate_teacher_profile_v1',
  STUDENTS: 'mathmate_students_db_v1',
  CONFIG: 'mathmate_system_config_v1',
  EXAMS: 'mathmate_custom_exams_v1',
  ASSIGNMENTS: 'mathmate_assignments_v1',
  SUBMISSIONS: 'mathmate_submissions_v1',
  SYNC_CONFIG: 'mathmate_cloud_sync_config_v2',
  LAST_SYNC: 'mathmate_cloud_last_sync_v2'
};

// Cấu hình mặc định cho đồng bộ đám mây
export const DEFAULT_CLOUD_CONFIG = {
  enabled: true,
  provider: 'firebase', // 'firebase' | 'custom_rest'
  // Mặc định để trống để web chạy mượt 100% bằng dữ liệu tĩnh đã tích hợp sẵn trong mã nguồn.
  // Khi thầy cô muốn đồng bộ trực tiếp giữa nhiều máy, chỉ cần dán URL Firebase của thầy cô vào đây.
  endpointUrl: '',
  databaseNode: 'mathmate_central_db',
  autoSyncOnLoad: true,
  autoSyncOnChange: true,
  pollIntervalSeconds: 30
};

// Trạng thái đồng bộ trong bộ nhớ (In-memory state)
let syncStatus = {
  state: 'local', // 'local' | 'idle' | 'syncing' | 'synced' | 'error' | 'offline'
  lastSyncTime: null,
  lastError: null,
  message: 'Chế độ dữ liệu gốc (100% Slide & Cài đặt tích hợp sẵn trong mã nguồn web)'
};

const listeners = new Set();
let debounceTimer = null;
let pollIntervalId = null;

export function subscribeSyncStatus(callback) {
  listeners.add(callback);
  callback(syncStatus);
  return () => listeners.delete(callback);
}

function updateStatus(newStatus) {
  syncStatus = { ...syncStatus, ...newStatus };
  listeners.forEach((cb) => {
    try {
      cb(syncStatus);
    } catch (e) {
      console.warn('Sync status listener error:', e);
    }
  });
}

// 1. Đọc và lưu cấu hình đồng bộ
export function getCloudSyncConfig() {
  try {
    const raw = localStorage.getItem(SYNC_STORAGE_KEYS.SYNC_CONFIG);
    if (!raw) {
      return DEFAULT_CLOUD_CONFIG;
    }
    const parsed = JSON.parse(raw);
    // Nếu trong bộ nhớ từng lưu URL thử nghiệm cũ không tồn tại, tự động dọn sạch
    if (parsed.endpointUrl && parsed.endpointUrl.includes('buiquy-test-default-rtdb')) {
      parsed.endpointUrl = '';
    }
    return { ...DEFAULT_CLOUD_CONFIG, ...parsed };
  } catch (e) {
    return DEFAULT_CLOUD_CONFIG;
  }
}

export function saveCloudSyncConfig(newConfig) {
  try {
    const merged = { ...getCloudSyncConfig(), ...newConfig };
    localStorage.setItem(SYNC_STORAGE_KEYS.SYNC_CONFIG, JSON.stringify(merged));
    updateStatus({ message: 'Đã lưu cấu hình kết nối đám mây.' });
    return merged;
  } catch (e) {
    console.error('Lỗi lưu cấu hình đồng bộ:', e);
    return getCloudSyncConfig();
  }
}

// 2. Thu thập toàn bộ dữ liệu hệ thống từ localStorage
export function getAllLocalData() {
  const readJson = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  return {
    version: '2.0',
    updatedAt: new Date().toISOString(),
    slides: readJson(SYNC_STORAGE_KEYS.SLIDES, {}),
    videos: readJson(SYNC_STORAGE_KEYS.VIDEOS, {}),
    teacher: readJson(SYNC_STORAGE_KEYS.TEACHER, null),
    students: readJson(SYNC_STORAGE_KEYS.STUDENTS, null),
    config: readJson(SYNC_STORAGE_KEYS.CONFIG, null),
    exams: readJson(SYNC_STORAGE_KEYS.EXAMS, []),
    assignments: readJson(SYNC_STORAGE_KEYS.ASSIGNMENTS, []),
    submissions: readJson(SYNC_STORAGE_KEYS.SUBMISSIONS, [])
  };
}

// 3. Áp dụng dữ liệu đám mây vào localStorage
export function applyRemoteData(remoteData, source = 'cloud') {
  if (!remoteData || typeof remoteData !== 'object') {
    return { success: false, message: 'Dữ liệu không hợp lệ!' };
  }

  let updatedCount = 0;
  const writeIfPresent = (key, data) => {
    if (data !== undefined && data !== null) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        updatedCount++;
      } catch (e) {
        console.error(`Lỗi ghi ${key}:`, e);
      }
    }
  };

  if (remoteData.slides) writeIfPresent(SYNC_STORAGE_KEYS.SLIDES, remoteData.slides);
  if (remoteData.videos) writeIfPresent(SYNC_STORAGE_KEYS.VIDEOS, remoteData.videos);
  if (remoteData.teacher) writeIfPresent(SYNC_STORAGE_KEYS.TEACHER, remoteData.teacher);
  if (remoteData.students) writeIfPresent(SYNC_STORAGE_KEYS.STUDENTS, remoteData.students);
  if (remoteData.config) writeIfPresent(SYNC_STORAGE_KEYS.CONFIG, remoteData.config);
  if (remoteData.exams) writeIfPresent(SYNC_STORAGE_KEYS.EXAMS, remoteData.exams);
  if (remoteData.assignments) writeIfPresent(SYNC_STORAGE_KEYS.ASSIGNMENTS, remoteData.assignments);
  if (remoteData.submissions) writeIfPresent(SYNC_STORAGE_KEYS.SUBMISSIONS, remoteData.submissions);

  const now = new Date().toISOString();
  localStorage.setItem(SYNC_STORAGE_KEYS.LAST_SYNC, now);

  updateStatus({
    state: 'synced',
    lastSyncTime: now,
    message: `Đồng bộ thành công (${source === 'url' ? 'từ Link đồng bộ' : 'từ Đám mây'})!`
  });

  // Bắn sự kiện ra toàn bộ ứng dụng để các Component React cập nhật lại giao diện
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('mathmate_cloud_synced', {
        detail: { source, updatedAt: now, data: remoteData }
      })
    );
  }

  return { success: true, updatedCount };
}

// Chuẩn hóa URL Firebase / REST
function buildEndpointUrl(config, isHealthCheck = false) {
  let base = (config.endpointUrl || '').trim();
  if (!base) return null;
  // Bỏ dấu gạch chéo cuối
  base = base.replace(/\/+$/, '');

  if (config.provider === 'firebase' || base.includes('firebaseio.com')) {
    // Đảm bảo có giao thức https://
    if (!base.startsWith('http://') && !base.startsWith('https://')) {
      base = `https://${base}`;
    }
    const node = isHealthCheck ? '_health' : (config.databaseNode || 'mathmate_central_db');
    return `${base}/${node}.json`;
  }

  return isHealthCheck ? `${base}/health` : base;
}

// 4. Kiểm tra kết nối tới máy chủ đám mây
export async function testConnection(endpointUrl = null) {
  const curConfig = getCloudSyncConfig();
  const testConfig = { ...curConfig, endpointUrl: endpointUrl || curConfig.endpointUrl };
  const targetUrl = buildEndpointUrl(testConfig, true);

  if (!targetUrl) {
    return { success: false, message: 'Vui lòng nhập đường link kết nối cơ sở dữ liệu!' };
  }

  try {
    updateStatus({ state: 'syncing', message: 'Đang kiểm tra kết nối...' });
    const checkPayload = { checkTime: new Date().toISOString(), status: 'online' };

    // Thử ghi 1 bản ghi nhỏ vào _health.json
    const putRes = await fetch(targetUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkPayload)
    });

    if (!putRes.ok) {
      if (putRes.status === 401 || putRes.status === 403) {
        throw new Error(
          'Quyền truy cập bị từ chối (403/401)! Hãy vào Firebase Console > Realtime Database > Rules và đổi sang { ".read": true, ".write": true } để các máy tính có thể đọc/ghi dữ liệu.'
        );
      }
      if (putRes.status === 404) {
        throw new Error(
          'Không tìm thấy dự án Firebase (404)! Vui lòng kiểm tra lại tên miền URL cơ sở dữ liệu đã tạo trên Firebase.'
        );
      }
      throw new Error(`Máy chủ phản hồi mã lỗi HTTP ${putRes.status}`);
    }

    // Đọc lại để chắc chắn
    const getRes = await fetch(targetUrl);
    if (!getRes.ok) {
      throw new Error(`Kiểm tra đọc dữ liệu thất bại (HTTP ${getRes.status})`);
    }

    updateStatus({
      state: 'synced',
      message: 'Kết nối đám mây thành công! Đã sẵn sàng đồng bộ đa thiết bị.'
    });

    return {
      success: true,
      message: 'Kết nối thành công! Đám mây hoạt động bình thường.'
    };
  } catch (err) {
    updateStatus({
      state: 'error',
      lastError: err.message,
      message: `Lỗi kết nối: ${err.message}`
    });
    return { success: false, message: err.message };
  }
}

// 5. Đẩy dữ liệu lên Đám mây (Push to Cloud)
export async function pushToCloud() {
  const config = getCloudSyncConfig();
  if (!config.enabled) return { success: false, message: 'Đồng bộ đám mây đang tắt.' };

  const targetUrl = buildEndpointUrl(config);
  if (!targetUrl) {
    // Không có URL đám mây: web hoạt động chế độ dữ liệu file tĩnh/cục bộ, không báo lỗi
    return { success: true, localOnly: true, message: 'Dữ liệu được lưu an toàn trên trình duyệt này.' };
  }

  try {
    updateStatus({ state: 'syncing', message: 'Đang lưu dữ liệu lên đám mây...' });
    const localData = getAllLocalData();

    const res = await fetch(targetUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(localData)
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const now = new Date().toISOString();
    localStorage.setItem(SYNC_STORAGE_KEYS.LAST_SYNC, now);

    updateStatus({
      state: 'synced',
      lastSyncTime: now,
      lastError: null,
      message: 'Đã lưu và đồng bộ thành công lên đám mây!'
    });

    return { success: true };
  } catch (err) {
    console.warn('Lỗi đẩy dữ liệu lên cloud:', err.message);
    updateStatus({
      state: 'error',
      lastError: err.message,
      message: `Chưa thể lưu lên đám mây (${err.message}). Dữ liệu vẫn được lưu an toàn trong máy này.`
    });
    return { success: false, message: err.message };
  }
}

// 6. Kéo dữ liệu từ Đám mây về máy này (Pull from Cloud)
export async function pullFromCloud(silent = false) {
  const config = getCloudSyncConfig();
  if (!config.enabled) return { success: false, message: 'Đồng bộ đám mây đang tắt.' };

  const targetUrl = buildEndpointUrl(config);
  if (!targetUrl) return { success: true, localOnly: true, message: 'Chế độ dữ liệu file tĩnh.' };

  try {
    if (!silent) {
      updateStatus({ state: 'syncing', message: 'Đang tải dữ liệu mới nhất từ đám mây...' });
    }

    const res = await fetch(targetUrl, { cache: 'no-store' });
    if (!res.ok) {
      if (res.status === 404) {
        // Chưa có dữ liệu trên node này -> đẩy dữ liệu hiện tại lên lần đầu
        await pushToCloud();
        return { success: true, message: 'Đã khởi tạo dữ liệu đám mây ban đầu.' };
      }
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const remoteData = await res.json();
    if (!remoteData || typeof remoteData !== 'object') {
      return { success: true, message: 'Đám mây chưa có dữ liệu mới.' };
    }

    // Áp dụng dữ liệu vào localStorage
    const applyRes = applyRemoteData(remoteData, 'cloud');
    return applyRes;
  } catch (err) {
    if (!silent) {
      console.warn('Lỗi kéo dữ liệu từ cloud:', err.message);
      updateStatus({
        state: 'error',
        lastError: err.message,
        message: `Lỗi kết nối đám mây: ${err.message}`
      });
    }
    return { success: false, message: err.message };
  }
}

// 7. Tự động báo hiệu dữ liệu thay đổi để đẩy lên đám mây (Debounced)
export function notifyDataChanged(changeType = 'general') {
  const config = getCloudSyncConfig();
  if (!config.enabled || !config.autoSyncOnChange) return;

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    pushToCloud();
  }, 1200);
}

// 8. Tạo Link Đồng Bộ 1-Chạm (URL Hash Sync)
// Mã hóa các slide tùy biến & hồ sơ thành đường link để mở trên máy khác là có ngay!
export function generateShareSyncUrl() {
  try {
    const local = getAllLocalData();
    // Gói dữ liệu nén gọn
    const payload = {
      slides: local.slides,
      videos: local.videos,
      teacher: local.teacher,
      config: local.config,
      time: Date.now()
    };
    const jsonStr = JSON.stringify(payload);
    // Base64 an toàn cho Unicode tiếng Việt
    const b64 = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode('0x' + p1);
    }));

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://buiquy-test.vercel.app';
    const path = typeof window !== 'undefined' ? window.location.pathname : '/';
    return `${origin}${path}#sync_data=${b64}`;
  } catch (e) {
    console.error('Lỗi tạo URL đồng bộ:', e);
    return null;
  }
}

// 9. Kiểm tra nếu URL hiện tại chứa mã đồng bộ #sync_data=
export function checkUrlSync() {
  if (typeof window === 'undefined') return false;

  try {
    const hash = window.location.hash || '';
    if (!hash.includes('sync_data=')) return false;

    const b64 = hash.split('sync_data=')[1]?.split('&')[0];
    if (!b64) return false;

    // Giải mã Base64 Unicode
    const jsonStr = decodeURIComponent(
      Array.prototype.map
        .call(atob(b64), (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonStr);

    if (parsed && typeof parsed === 'object') {
      applyRemoteData(parsed, 'url');
      // Xóa hash trên thanh địa chỉ để không bị nạp lặp lại
      window.history.replaceState({}, '', window.location.pathname);
      return true;
    }
  } catch (e) {
    console.warn('Lỗi đọc mã đồng bộ từ URL:', e);
  }
  return false;
}

// 10. Xuất toàn bộ dữ liệu ra file JSON
export function exportFullBackup() {
  const data = getAllLocalData();
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `MathMate_ToanBoDuLieu_DongBo_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 11. Nạp toàn bộ dữ liệu từ file JSON
export function importFullBackup(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, message: 'Định dạng file sao lưu không hợp lệ!' };
    }
    const res = applyRemoteData(parsed, 'file');
    // Đẩy luôn lên đám mây sau khi nạp file
    pushToCloud();
    return res;
  } catch (e) {
    return { success: false, message: `Lỗi đọc file: ${e.message}` };
  }
}

// 12. Khởi tạo dịch vụ đồng bộ khi nạp trang Web
export function initCloudSync() {
  if (typeof window === 'undefined') return;

  // 1. Kiểm tra nếu mở từ Link đồng bộ (#sync_data=)
  const syncedFromUrl = checkUrlSync();

  // 2. Kéo dữ liệu đám mây mới nhất trong nền (chỉ chạy khi đã cấu hình URL máy chủ)
  const config = getCloudSyncConfig();
  const hasEndpoint = Boolean(config.endpointUrl && config.endpointUrl.trim());

  if (config.enabled && hasEndpoint && !syncedFromUrl) {
    pullFromCloud(true);
  }

  // 3. Tự động kiểm tra đồng bộ khi người dùng quay lại tab (Window Focus)
  window.addEventListener('focus', () => {
    const curCfg = getCloudSyncConfig();
    if (curCfg.enabled && curCfg.endpointUrl && curCfg.endpointUrl.trim()) {
      pullFromCloud(true);
    }
  });

  // 4. Lập lịch đồng bộ định kỳ mỗi 30-60 giây (khi có máy chủ)
  if (pollIntervalId) clearInterval(pollIntervalId);
  if (config.enabled && hasEndpoint) {
    const intervalMs = Math.max(15, config.pollIntervalSeconds || 30) * 1000;
    pollIntervalId = setInterval(() => {
      const curCfg = getCloudSyncConfig();
      if (curCfg.enabled && curCfg.endpointUrl && curCfg.endpointUrl.trim()) {
        pullFromCloud(true);
      }
    }, intervalMs);
  }
}
