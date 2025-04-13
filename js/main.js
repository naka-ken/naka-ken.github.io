document.addEventListener('DOMContentLoaded', function() {
    // 既存のモーダル関連のコード
    const imageModal = document.getElementById('image-modal');
    const videoModal = document.getElementById('video-modal');
    const modalImage = document.getElementById('modal-image');
    const modalVideo = document.getElementById('modal-video');
    const closeBtns = document.querySelectorAll('.close');

    // ギャラリーアイテムのクリックイベント
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            imageModal.style.display = 'block';
        });
    });

    // デモボタンのクリックイベント
    document.querySelectorAll('.view-demo').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const demoSrc = this.getAttribute('data-demo');
            modalImage.src = demoSrc;
            modalImage.alt = '動作デモ';
            imageModal.style.display = 'block';
        });
    });

    // モーダルを閉じる
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            imageModal.style.display = 'none';
        });
    });

    // モーダル外クリックで閉じる
    window.addEventListener('click', function(e) {
        if (e.target === imageModal) {
            imageModal.style.display = 'none';
        }
    });

    // ギャラリードットのクリックイベント
    document.querySelectorAll('.gallery-dots').forEach(dots => {
        const galleryItems = dots.previousElementSibling.querySelectorAll('.gallery-item');
        const dotElements = dots.querySelectorAll('.gallery-dot');
        
        dotElements.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                // アクティブなドットを更新
                dotElements.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');

                // 対応する画像までスクロール
                galleryItems[index].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'start'
                });
            });
        });
    });

    // ギャラリーのスクロールイベント
    document.querySelectorAll('.image-gallery').forEach(gallery => {
        const dots = gallery.nextElementSibling.querySelectorAll('.gallery-dot');
        const items = gallery.querySelectorAll('.gallery-item');
        
        gallery.addEventListener('scroll', () => {
            const scrollPosition = gallery.scrollLeft;
            const itemWidth = items[0].offsetWidth;
            const currentIndex = Math.round(scrollPosition / itemWidth);

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        });
    });

    // ギャラリーのドラッグスクロール機能
    document.querySelectorAll('.image-gallery').forEach(gallery => {
        let isDragging = false;
        let startX;
        let startScrollLeft;
        let maxScroll;

        const startDragging = (e) => {
            isDragging = true;
            gallery.classList.add('grabbing');
            startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
            startScrollLeft = gallery.scrollLeft;
            // スクロール可能な最大値を計算
            maxScroll = gallery.scrollWidth - gallery.clientWidth;
        };

        const stopDragging = () => {
            if (!isDragging) return;
            isDragging = false;
            gallery.classList.remove('grabbing');

            // スクロール位置を最も近い画像にスナップ
            const itemWidth = gallery.querySelector('.gallery-item').offsetWidth;
            const targetScroll = Math.round(gallery.scrollLeft / itemWidth) * itemWidth;
            gallery.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        };

        const doDrag = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const x = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
            const diff = startX - x;
            
            // スクロール位置を計算
            let newScrollLeft = startScrollLeft + diff;
            
            // スクロール範囲を制限
            newScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScroll));
            
            // スクロールイベントを発火させてスクロールバーを動かす
            gallery.scrollTo({
                left: newScrollLeft,
                behavior: 'auto' // 'smooth'ではなく'auto'を使用してリアルタイムな動きを実現
            });
        };

        // マウスイベント
        gallery.addEventListener('mousedown', startDragging);
        gallery.addEventListener('mousemove', doDrag);
        gallery.addEventListener('mouseup', stopDragging);
        gallery.addEventListener('mouseleave', stopDragging);

        // タッチイベント
        gallery.addEventListener('touchstart', startDragging);
        gallery.addEventListener('touchmove', doDrag);
        gallery.addEventListener('touchend', stopDragging);
    });
});

// Works slider functionality
document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.works-slider');
    
    sliders.forEach(slider => {
        const track = slider.querySelector('.works-track');
        const items = track.querySelectorAll('.work-item');
        const prev = slider.querySelector('.prev');
        const next = slider.querySelector('.next');
        
        let currentIndex = 0;
        let itemsPerView = 3; // デフォルトはデスクトップ表示
        
        // ビューポートの幅に応じてitemsPerViewを更新
        const updateItemsPerView = () => {
            if (window.innerWidth <= 768) {
                itemsPerView = 1; // スマホ表示
            } else if (window.innerWidth <= 1024) {
                itemsPerView = 2; // タブレット表示
            } else {
                itemsPerView = 3; // デスクトップ表示
            }
        };
        
        // スライダーの状態を更新
        const updateSlider = () => {
            const itemWidth = items[0].offsetWidth;
            const gap = 32; // gap between items
            const offset = -currentIndex * (itemWidth + gap);
            
            // 最大インデックスを計算（表示数に応じて調整）
            const maxIndex = Math.max(0, items.length - itemsPerView);
            
            // スライダーを移動
            track.style.transform = `translateX(${offset}px)`;
            
            // ボタンの状態を更新
            if (prev) {
                prev.style.opacity = currentIndex === 0 ? '0.5' : '1';
                prev.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
            }
            if (next) {
                next.style.opacity = currentIndex === maxIndex ? '0.5' : '1';
                next.style.pointerEvents = currentIndex === maxIndex ? 'none' : 'auto';
            }
        };
        
        // 初期化
        updateItemsPerView();
        updateSlider();
        
        // クリックハンドラー
        if (prev) {
            prev.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSlider();
                }
            });
        }
        
        if (next) {
            next.addEventListener('click', () => {
                const maxIndex = Math.max(0, items.length - itemsPerView);
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateSlider();
                }
            });
        }
        
        // タッチスワイプ対応
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });
        
        track.addEventListener('touchmove', (e) => {
            touchEndX = e.touches[0].clientX;
        });
        
        track.addEventListener('touchend', () => {
            const swipeDistance = touchEndX - touchStartX;
            const threshold = 50; // スワイプを検知する最小距離
            
            if (Math.abs(swipeDistance) > threshold) {
                if (swipeDistance > 0 && currentIndex > 0) {
                    // 右スワイプ
                    currentIndex--;
                } else if (swipeDistance < 0 && currentIndex < items.length - itemsPerView) {
                    // 左スワイプ
                    currentIndex++;
                }
                updateSlider();
            }
        });
        
        // リサイズ対応
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const oldItemsPerView = itemsPerView;
                updateItemsPerView();
                
                // 表示数が変更された場合、currentIndexを調整
                if (oldItemsPerView !== itemsPerView) {
                    currentIndex = Math.min(currentIndex, items.length - itemsPerView);
                    updateSlider();
                }
            }, 250); // デバウンス処理
        });
    });
}); 