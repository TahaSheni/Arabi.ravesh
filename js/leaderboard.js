// تابع دریافت امتیازات از سرور
function getScores() {
    // ابتدا سعی می‌کنیم از سرور دریافت کنیم
    return new Promise((resolve, reject) => {
        const difficultyFilter = document.getElementById('difficultyFilter');
        const selectedDifficulty = difficultyFilter.value;
        
        // ساخت URL با فیلتر سختی
        const url = `/get_scores.php${selectedDifficulty !== 'all' ? `?difficulty=${selectedDifficulty}` : ''}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    resolve(data.data);
                } else {
                    console.warn('خطا در دریافت داده از سرور:', data.message);
                    // اگر خطایی رخ داد، از localStorage استفاده می‌کنیم به عنوان بک‌آپ
                    resolve(getLocalStorageScores(selectedDifficulty));
                }
            })
            .catch(error => {
                console.warn('خطا در ارتباط با سرور:', error);
                // در صورت خطا در ارتباط، از localStorage استفاده می‌کنیم
                resolve(getLocalStorageScores(selectedDifficulty));
            });
    });
}

// تابع دریافت امتیازات از localStorage به عنوان پشتیبان
function getLocalScores() {
    return JSON.parse(localStorage.getItem("players") || "[]");
}

// رمز عبور برای پاک کردن داده‌ها
const ADMIN_PASSWORD = "arabi404"; // رمز عبور را اینجا تعیین کنید

// تابع نمایش مودال
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// تابع مخفی کردن مودال
function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// تابع پاک کردن داده‌های لیدربورد
function clearLeaderboard() {
    // نمایش مودال رمز عبور
    showModal('passwordModal');
    
    // تنظیم فوکوس روی فیلد رمز عبور
    setTimeout(() => {
        document.getElementById('passwordInput').focus();
    }, 100);
}

// تابع پاک کردن امتیازات در سرور
function clearServerScores() {
    fetch('clear_scores.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: ADMIN_PASSWORD })
    })
    .then(response => response.json())
    .then(data => {
        console.log('نتیجه پاک کردن امتیازات:', data);
        
        // نمایش پیام موفقیت
        document.getElementById('messageTitle').textContent = 'عملیات موفق';
        document.getElementById('messageText').textContent = 'تمام امتیازات با موفقیت پاک شدند.';
        showModal('messageModal');
        
        // به‌روزرسانی لیدربورد
        displayLeaderboard();
    })
    .catch(error => {
        console.error('خطا در پاک کردن امتیازات:', error);
        
        // نمایش پیام خطا
        document.getElementById('messageTitle').textContent = 'خطا';
        document.getElementById('messageText').textContent = 'خطا در پاک کردن امتیازات. لطفاً مجدداً تلاش کنید.';
        showModal('messageModal');
    });
}

// تأیید رمز عبور
document.getElementById('submitPassword').addEventListener('click', function() {
    const password = document.getElementById('passwordInput').value;
    
    if (password === ADMIN_PASSWORD) {
        // مخفی کردن مودال رمز عبور
        hideModal('passwordModal');
        // پاک کردن فیلد رمز عبور
        document.getElementById('passwordInput').value = '';
        // نمایش مودال تأیید
        showModal('confirmModal');
    } else {
        // پاک کردن فیلد رمز عبور
        document.getElementById('passwordInput').value = '';
        // فوکوس مجدد روی فیلد رمز عبور
        document.getElementById('passwordInput').focus();
        console.log("رمز عبور اشتباه است!");
    }
});

// اضافه کردن گوش‌دهنده رویداد برای کلید Enter در فیلد رمز عبور
document.getElementById('passwordInput').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('submitPassword').click();
    }
});

// لغو ورود رمز عبور
document.getElementById('cancelPassword').addEventListener('click', function() {
    hideModal('passwordModal');
    document.getElementById('passwordInput').value = '';
});

// تأیید پاک کردن امتیازات
document.getElementById('confirmYes').addEventListener('click', function() {
    // پاک کردن امتیازات از localStorage
    localStorage.removeItem("players");
    
    // پاک کردن امتیازات از سرور
    clearServerScores();
    
    hideModal('confirmModal');
});

// لغو پاک کردن امتیازات
document.getElementById('confirmNo').addEventListener('click', function() {
    hideModal('confirmModal');
});

// بستن پیام
document.getElementById('messageOk').addEventListener('click', function() {
    hideModal('messageModal');
});

// نمایش جدول امتیازات
function displayLeaderboard() {
    const tbody = document.getElementById('leaderboardBody');
    const noScores = document.querySelector('.no-scores');
    
    // نمایش وضعیت بارگذاری
    tbody.innerHTML = '<tr><td colspan="4" class="loading">در حال بارگذاری امتیازات...</td></tr>';
    
    // دریافت امتیازات از سرور
    getScores().then(scores => {
        tbody.innerHTML = '';
        
        if (scores.length === 0) {
            tbody.style.display = 'none';
            noScores.style.display = 'block';
            return;
        }

        tbody.style.display = '';
        noScores.style.display = 'none';

        scores.forEach((score, index) => {
            const row = document.createElement('tr');
            const rankClass = index < 3 ? `top-${index + 1}` : '';
            row.className = rankClass;
            
            row.innerHTML = `
                <td class="rank">${index + 1}</td>
                <td>${score.name || 'بدون نام'}</td>
                <td>${score.school || '---'}</td>
                <td>${score.score}</td>
            `;
            
            tbody.appendChild(row);
        });
    });
}

// اضافه کردن گوش‌دهنده رویداد برای فیلتر سختی
document.getElementById('difficultyFilter').addEventListener('change', displayLeaderboard);

// اضافه کردن گوش‌دهنده رویداد برای دکمه پاک کردن
document.getElementById('clearLeaderboard').addEventListener('click', clearLeaderboard);

// نمایش اولیه جدول امتیازات
displayLeaderboard();

// تابع حذف تمام امتیازات
function clearAllScores(password) {
    return new Promise((resolve, reject) => {
        fetch('/clear_scores.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                resolve(true);
            } else {
                reject(data.message || 'خطا در پاک کردن امتیازات');
            }
        })
        .catch(error => {
            reject('خطا در ارتباط با سرور');
        });
    });
} 