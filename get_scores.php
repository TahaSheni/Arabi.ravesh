<?php
// تنظیمات هدر برای دریافت درخواست های AJAX
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// مسیر فایل امتیازات
$file_path = "scores.txt";

// دریافت فیلتر سختی (اگر ارسال شده باشد)
$difficulty_filter = isset($_GET['difficulty']) ? $_GET['difficulty'] : null;

// بررسی وجود فایل
if (!file_exists($file_path)) {
    echo json_encode([
        "status" => "error",
        "message" => "No scores found",
        "data" => []
    ]);
    exit;
}

// خواندن محتوای فایل
$file_content = file_get_contents($file_path);
$lines = explode("\n", trim($file_content));
$scores = [];

// پردازش هر خط
foreach ($lines as $line) {
    if (empty($line)) continue;
    
    $parts = explode("|", $line);
    if (count($parts) >= 6) {
        $scoreItem = [
            "name" => $parts[0],
            "school" => $parts[1],
            "class" => $parts[2],
            "score" => intval($parts[3]),
            "difficulty" => $parts[4],
            "date" => $parts[5]
        ];
        
        // اعمال فیلتر سختی (اگر مشخص شده باشد)
        if ($difficulty_filter === null || $scoreItem["difficulty"] === $difficulty_filter) {
            $scores[] = $scoreItem;
        }
    }
}

// مرتب سازی بر اساس امتیاز (اگرچه فایل از قبل مرتب شده است، اما برای اطمینان)
usort($scores, function($a, $b) {
    return $b["score"] - $a["score"];
});

// برگرداندن نتیجه
echo json_encode([
    "status" => "success",
    "message" => "Scores retrieved successfully",
    "data" => $scores
]);
?> 