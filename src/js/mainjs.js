
        // เพิ่มเอฟเฟกต์ในการโหลดหน้า
        document.addEventListener('DOMContentLoaded', function() {
            const featureCards = document.querySelectorAll('.feature-card');
            
            featureCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 300 + (index * 150));
            });

            // เปลี่ยนพื้นหลัง header เมื่อเลื่อนลง
            window.addEventListener('scroll', function() {
                const header = document.getElementById('header');
                if (window.scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        });

        // เพิ่มฟังก์ชันสำหรับปุ่มล็อกอิน
        document.querySelector('.login-button').addEventListener('click', function() {
            alert('กำลังนำทางไปยังหน้าเข้าสู่ระบบ');
            // ในสถานการณ์จริง จะใช้: window.location.href = 'login.html';
        });
   