const STORAGE_KEY = "harps_outlet_appliances";
const API_URL = "/api.php";

const safeJsonParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// Fallback to localStorage if server is down
let useLocalStorage = false;

const readStorage = () => {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return safeJsonParse(raw, []);
};

const writeStorage = (items) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

// API call with fallback
const apiCall = async (action, method = 'GET', data = null, params = {}) => {
  try {
    const url = new URL(API_URL, window.location.origin);
    url.searchParams.append('action', action);
    
    // Add params to query string
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
    
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url.toString(), options);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    
    useLocalStorage = false; // Server is working
    return await response.json();
  } catch (error) {
    console.warn('Server API failed, falling back to localStorage:', error);
    useLocalStorage = true;
    return null;
  }
};


const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const normalizeItem = (payload) => ({
  ...payload,
  id: payload.id || generateId(),
  created_date: payload.created_date || Date.now(),
  updated_date: Date.now(),
});

const compareField = (a, b, field) => {
  const va = a[field];
  const vb = b[field];
  if (va === vb) return 0;
  if (va === undefined || va === null) return 1;
  if (vb === undefined || vb === null) return -1;
  if (typeof va === "string" && typeof vb === "string") return va.localeCompare(vb);
  return va < vb ? -1 : 1;
};

const listItems = async (sortBy = "", limit = null) => {
  if (!useLocalStorage) {
    const result = await apiCall('list', 'GET', null, { sortBy });
    if (result !== null) {
      let items = result;
      if (limit != null) {
        return items.slice(0, limit);
      }
      return items;
    }
  }
  
  // Fallback to localStorage
  const items = readStorage();

  let sorted = [...items];
  if (sortBy) {
    const direction = sortBy.startsWith("-") ? -1 : 1;
    const key = sortBy.replace(/^[-+]/, "");
    sorted.sort((a, b) => direction * compareField(a, b, key));
  }

  if (limit != null) {
    return sorted.slice(0, limit);
  }
  return sorted;
};

const filterItems = async (query = {}) => {
  if (!useLocalStorage) {
    const result = await apiCall('filter', 'GET', null, query);
    if (result !== null) {
      return result;
    }
  }
  
  // Fallback to localStorage
  const items = readStorage();
  const entries = Object.entries(query || {});
  if (!entries.length) return items;
  return items.filter((item) =>
    entries.every(([key, value]) => {
      if (value === undefined || value === null) return true;
      return String(item[key]) === String(value);
    })
  );
};

const getItem = async (id) => {
  if (!id) return null;
  
  if (!useLocalStorage) {
    const result = await apiCall('get', 'GET', null, { id });
    if (result !== null) {
      return result;
    }
  }
  
  // Fallback to localStorage
  const items = readStorage();
  return items.find((item) => item.id === id) || null;
};

const createItem = async (data) => {
  if (!useLocalStorage) {
    const result = await apiCall('create', 'POST', data);
    if (result !== null) {
      // Also sync to localStorage
      const current = readStorage();
      current.unshift(result);
      writeStorage(current);
      return result;
    }
  }
  
  // Fallback to localStorage only
  const current = readStorage();
  const item = normalizeItem(data);
  current.unshift(item);
  writeStorage(current);
  return item;
};

const updateItem = async (id, payload) => {
  if (!useLocalStorage) {
    const result = await apiCall('update', 'POST', payload, { id });
    if (result !== null) {
      // Also sync to localStorage
      const current = readStorage();
      const index = current.findIndex((item) => item.id === id);
      if (index !== -1) {
        current[index] = result;
        writeStorage(current);
      }
      return result;
    }
  }
  
  // Fallback to localStorage
  const current = readStorage();
  const index = current.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error(`Item ${id} not found`);
  }
  current[index] = { ...current[index], ...payload, id, updated_date: Date.now() };
  writeStorage(current);
  return current[index];
};

const deleteItem = async (id) => {
  if (!useLocalStorage) {
    const result = await apiCall('delete', 'DELETE', null, { id });
    if (result !== null) {
      // Also sync to localStorage
      const current = readStorage();
      const newItems = current.filter((item) => item.id !== id);
      writeStorage(newItems);
      return result;
    }
  }
  
  // Fallback to localStorage
  const current = readStorage();
  const newItems = current.filter((item) => item.id !== id);
  writeStorage(newItems);
  return { id };
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const uploadFile = async ({ file }) => {
  if (!file) return { file_url: "" };
  // Store as data URL in memory for now
  const file_url = await readFileAsDataUrl(file);
  return { file_url };
};

export const localDB = {
  entities: {
    Appliance: {
      list: listItems,
      filter: filterItems,
      get: getItem,
      create: createItem,
      update: updateItem,
      delete: deleteItem,
    },
  },
  integrations: {
    Core: {
      UploadFile: uploadFile,
    },
  },
};

// Ensure global fallback for legacy code paths
if (typeof window !== "undefined") {
  window['__B44_DB__'] = window['__B44_DB__'] || localDB;
}

export default localDB;
