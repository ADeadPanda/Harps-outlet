const STORAGE_KEY = "harps_outlet_appliances";

const safeJsonParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

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
  const items = readStorage();
  return items.find((item) => item.id === id) || null;
};

const createItem = async (data) => {
  const current = readStorage();
  const item = normalizeItem(data);
  current.unshift(item);
  writeStorage(current);
  return item;
};

const updateItem = async (id, payload) => {
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
