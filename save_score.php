<?php
// تنظیمات هدر برای دریافت درخواست های AJAX
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// دریافت داده های ارسال شده
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    // اگر داده ای دریافت نشد
    echo json_encode([
        "status" => "error",
        "message" => "No data received"
    ]);
    exit;
}

// مسیر فایل ذخیره سازی
$file_path = "scores.txt";

// اطلاعات دریافتی
$name = isset($data['name']) ? $data['name'] : "بدون نام";
$school = isset($data['school']) ? $data['school'] : "بدون مدرسه";
$class = isset($data['class']) ? $data['class'] : "بدون کلاس";
$score = isset($data['score']) ? intval($data['score']) : 0;
$difficulty = isset($data['difficulty']) ? $data['difficulty'] : "آسان";
$date = isset($data['date']) ? $data['date'] : date("Y-m-d H:i:s");

// ساخت خط جدید برای افزودن به فایل
$new_score_line = "$name|$school|$class|$score|$difficulty|$date\n";

// خواندن داده های موجود
$current_scores = file_exists($file_path) ? file_get_contents($file_path) : "";

// افزودن امتیاز جدید
$current_scores .= $new_score_line;

// تبدیل به آرایه برای مرتب سازی
$scores_array = explode("\n", trim($current_scores));
$parsed_scores = [];

foreach ($scores_array as $line) {
    if (empty($line)) continue;
    $parts = explode("|", $line);
    if (count($parts) >= 4) {
        $parsed_scores[] = [
            'line' => $line,
            'score' => intval($parts[3])
        ];
    }
}

// مرتب سازی بر اساس امتیاز
usort($parsed_scores, function($a, $b) {
    return $b['score'] - $a['score'];
});

// تبدیل مجدد به متن
$sorted_scores = "";
foreach ($parsed_scores as $item) {
    $sorted_scores .= $item['line'] . "\n";
}

// ذخیره فایل
if (file_put_contents($file_path, $sorted_scores)) {
    echo json_encode([
        "status" => "success",
        "message" => "Score saved successfully"
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Failed to save score"
    ]);
}
?> 