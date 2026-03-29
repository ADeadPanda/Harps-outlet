<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

// Data file path
$dataFile = __DIR__ . '/products.json';

// Initialize products file if it doesn't exist
if (!file_exists($dataFile)) {
  file_put_contents($dataFile, json_encode([]));
}

// Helper function to read products
function getProducts() {
  global $dataFile;
  $data = file_get_contents($dataFile);
  return json_decode($data, true) ?: [];
}

// Helper function to save products
function saveProducts($products) {
  global $dataFile;
  return file_put_contents($dataFile, json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

// Parse request
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$pathParts = array_filter(explode('/', $path));
$endpoint = end($pathParts);

// Handle different actions
$action = $_GET['action'] ?? '';

if ($method === 'GET' && $action === 'list') {
  $products = getProducts();
  $sortBy = $_GET['sortBy'] ?? '';
  
  if ($sortBy) {
    $direction = (strpos($sortBy, '-') === 0) ? -1 : 1;
    $key = ltrim($sortBy, '-+');
    
    usort($products, function($a, $b) use ($key, $direction) {
      $va = $a[$key] ?? null;
      $vb = $b[$key] ?? null;
      
      if ($va == $vb) return 0;
      if ($va === null) return 1;
      if ($vb === null) return -1;
      
      $cmp = ($va < $vb) ? -1 : 1;
      return $direction * $cmp;
    });
  }
  
  echo json_encode($products);
}

elseif ($method === 'GET' && $action === 'filter') {
  $products = getProducts();
  $query = $_GET;
  unset($query['action']);
  
  $filtered = array_filter($products, function($item) use ($query) {
    foreach ($query as $key => $value) {
      if (!isset($item[$key]) || (string)$item[$key] !== (string)$value) {
        return false;
      }
    }
    return true;
  });
  
  echo json_encode(array_values($filtered));
}

elseif ($method === 'GET' && $action === 'get') {
  $id = $_GET['id'] ?? null;
  $products = getProducts();
  $item = null;
  
  foreach ($products as $product) {
    if ($product['id'] === $id) {
      $item = $product;
      break;
    }
  }
  
  echo json_encode($item);
}

elseif ($method === 'POST' && $action === 'create') {
  $data = json_decode(file_get_contents('php://input'), true);
  $products = getProducts();
  
  $item = [
    'id' => $data['id'] ?? (time() . '-' . substr(md5(rand()), 0, 8)),
    'name' => $data['name'] ?? '',
    'category' => $data['category'] ?? '',
    'description' => $data['description'] ?? '',
    'price' => $data['price'] ?? 0,
    'images' => $data['images'] ?? [],
    'created_date' => $data['created_date'] ?? time() * 1000,
    'updated_date' => time() * 1000,
  ];
  
  array_unshift($products, $item);
  saveProducts($products);
  
  echo json_encode($item);
}

elseif ($method === 'POST' && $action === 'update') {
  $id = $_GET['id'] ?? null;
  $data = json_decode(file_get_contents('php://input'), true);
  $products = getProducts();
  
  $updated = null;
  foreach ($products as &$product) {
    if ($product['id'] === $id) {
      $product = array_merge($product, $data);
      $product['updated_date'] = time() * 1000;
      $updated = $product;
      break;
    }
  }
  
  if ($updated) {
    saveProducts($products);
    echo json_encode($updated);
  } else {
    http_response_code(404);
    echo json_encode(['error' => 'Item not found']);
  }
}

elseif ($method === 'DELETE' && $action === 'delete') {
  $id = $_GET['id'] ?? null;
  $products = getProducts();
  
  $products = array_filter($products, function($product) use ($id) {
    return $product['id'] !== $id;
  });
  
  saveProducts(array_values($products));
  echo json_encode(['id' => $id]);
}

else {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid request']);
}
?>
