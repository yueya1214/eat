document.addEventListener('DOMContentLoaded', function() {
    // --- 一键决策功能 ---
    const decisionButton = document.getElementById('mainDecisionButton');
    const recommendationResult = document.getElementById('recommendation-result');
    const foodOptions = [
        "麻辣香锅", "饺子", "披萨", "寿司", "拉面", "牛排", "沙拉", "炒饭", 
        "火锅", "烤肉", "意大利面", "汉堡", "海鲜大餐", "家常菜（小炒黄牛肉）",
        "轻食简餐", "酸菜鱼", "部队锅", "烧烤"
    ];

    decisionButton.addEventListener('click', function() {
        recommendationResult.textContent = '思考中... 🤔';
        // Add wiggle effect
        if (!decisionButton.classList.contains('wiggle-effect')) {
            decisionButton.classList.add('wiggle-effect');
            setTimeout(() => {
                decisionButton.classList.remove('wiggle-effect'); // Remove after animation
            }, 300); // Match animation duration (must be same as CSS)
        }

        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * foodOptions.length);
            recommendationResult.textContent = `要不...今天就吃 ${foodOptions[randomIndex]}！`;
        }, 1000);
    });

    // --- 冰箱余料模式 ---
    const findRecipesButton = document.getElementById('findRecipesButton');
    const ingredientsInput = document.getElementById('ingredients');
    const recipeSuggestion = document.getElementById('recipe-suggestion');

    const mockRecipes = {
        "鸡蛋番茄": "<p>推荐食谱：<strong>番茄炒蛋</strong></p><p>做法：鸡蛋打散，番茄切块。先炒鸡蛋，盛出。再炒番茄，加鸡蛋，调味即可。</p>",
        "鸡肉": "<p>推荐食谱：<strong>宫保鸡丁</strong> 或 <strong>香煎鸡胸肉</strong></p><p>做法：鸡肉切丁腌制，搭配花生、辣椒等炒制宫保鸡丁。或将鸡胸肉腌制后香煎。</p>",
        "豆腐青菜": "<p>推荐食谱：<strong>青菜豆腐汤</strong></p><p>做法：豆腐切块，青菜洗净。水中加姜片煮沸，放入豆腐，再加入青菜，调味即可。</p>",
        "牛肉洋葱": "<p>推荐食谱：<strong>洋葱炒牛肉</strong></p><p>做法：牛肉切片腌制，洋葱切块。热锅凉油，滑炒牛肉至变色盛出。再炒洋葱，加入牛肉，快速翻炒调味。</p>",
        "土豆": "<p>推荐食谱：<strong>酸辣土豆丝</strong> 或 <strong>干锅土豆片</strong></p><p>做法：土豆切丝泡水去淀粉，搭配辣椒、醋等炒制。或切片油炸/煎制后与其他辅料制作干锅。</p>",
        "虾仁西兰花": "<p>推荐食谱：<strong>西兰花炒虾仁</strong></p><p>做法：虾仁处理干净，西兰花焯水。热锅炒香蒜末，加入虾仁炒至变色，再加入西兰花翻炒，调味即可。</p>",
        "五花肉豆角": "<p>推荐食谱：<strong>五花肉炖豆角</strong></p><p>做法：五花肉煸炒出油，加入葱姜蒜、香料炒香，放入豆角，加水/高汤炖煮入味。</p>"
    };

    findRecipesButton.addEventListener('click', function() {
        const ingredientsText = ingredientsInput.value.trim().toLowerCase();
        if (ingredientsText === "") {
            recipeSuggestion.innerHTML = "<p style='color:red; font-weight:bold;'>请输入您拥有的食材哦！让我看看您的冰箱里有啥宝贝？</p>";
            return;
        }
        // Split by comma or space, and filter out empty strings
        const currentIngredients = ingredientsText.split(/[,\s]+/).filter(ing => ing.length > 0);
        
        recipeSuggestion.innerHTML = `<p>正在根据"<strong>${currentIngredients.join(', ')}</strong>"为您寻找灵感...</p>`;
        
        setTimeout(() => {
            let foundRecipeHTML = "";
            if (currentIngredients.includes("鸡蛋") && (currentIngredients.includes("番茄") || currentIngredients.includes("西红柿"))) {
                foundRecipeHTML = mockRecipes["鸡蛋番茄"];
            } else if (currentIngredients.includes("鸡肉")) { // Simplified, can be more specific
                foundRecipeHTML = mockRecipes["鸡肉"];
            } else if (currentIngredients.includes("豆腐") && (currentIngredients.includes("青菜") || currentIngredients.includes("白菜") || currentIngredients.includes("小青菜"))) {
                foundRecipeHTML = mockRecipes["豆腐青菜"];
            } else if (currentIngredients.includes("牛肉") && currentIngredients.includes("洋葱")) {
                foundRecipeHTML = mockRecipes["牛肉洋葱"];
            } else if (currentIngredients.includes("土豆")) {
                foundRecipeHTML = mockRecipes["土豆"];
            } else if ((currentIngredients.includes("虾") || currentIngredients.includes("虾仁")) && (currentIngredients.includes("西兰花") || currentIngredients.includes("西蓝花"))) {
                foundRecipeHTML = mockRecipes["虾仁西兰花"];
            } else if ((currentIngredients.includes("五花肉") || currentIngredients.includes("猪肉")) && (currentIngredients.includes("豆角") || currentIngredients.includes("四季豆"))) {
                foundRecipeHTML = mockRecipes["五花肉豆角"];
            }

            if (foundRecipeHTML) {
                recipeSuggestion.innerHTML = foundRecipeHTML;
            } else {
                recipeSuggestion.innerHTML = `<p>哎呀，对于"<strong>${currentIngredients.join(', ')}</strong>"这个组合，我暂时还没想到特别棒的点子... 要不换换食材或者试试"一键决策"？</p>`;
            }
        }, 1500);
    });

    // --- 美食轮盘 ---
    const spinRouletteButton = document.getElementById('spinRouletteButton');
    const rouletteDisplay = document.getElementById('rouletteDisplay');
    const rouletteResult = document.getElementById('roulette-result');
    const rouletteCategories = [
        "中式", "西式", "日韩", "东南亚", "快餐", "健康轻食", "面点", "辛辣"
    ];
    let spinning = false;

    spinRouletteButton.addEventListener('click', function() {
        if (spinning) return;
        spinning = true;
        
        rouletteResult.textContent = "转动中...";
        rouletteDisplay.style.transform = 'rotate(0deg)'; // Reset rotation
        
        const randomSpins = Math.floor(Math.random() * 5) + 3; // 3 to 7 full spins
        const stopAngle = Math.floor(Math.random() * 360); // Random stop angle
        const totalRotation = (randomSpins * 360) + stopAngle;

        rouletteDisplay.style.transition = 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)';
        rouletteDisplay.style.transform = `rotate(${totalRotation}deg)`;

        setTimeout(() => {
            spinning = false;
            // 确定结果基于停止角度
            // 假设有8个区域，每个区域45度 (360/8 = 45)
            const actualAngle = totalRotation % 360;
            const categoryIndex = Math.floor(actualAngle / (360 / rouletteCategories.length));
            const selectedCategory = rouletteCategories[categoryIndex % rouletteCategories.length];
            
            rouletteResult.textContent = `轮盘指向：${selectedCategory}！`;
        }, 4100); // 略长于CSS动画时间
    });

    // --- 简单图片轮播 ---
    const slidesContainer = document.querySelector(".carousel-slide");
    const items = document.querySelectorAll(".carousel-item");
    const dotsContainer = document.querySelector(".carousel-dots");
    let currentIndex = 0;
    let slideInterval;

    if (items.length > 0) {
        // 创建小圆点
        items.forEach((_, index) => {
            const dot = document.createElement("span");
            dot.classList.add("dot");
            if (index === 0) dot.classList.add("active");
            dot.addEventListener("click", () => {
                goToSlide(index);
                resetInterval();
            });
            dotsContainer.appendChild(dot);
        });
        const dots = document.querySelectorAll(".dot");

        function updateDots() {
            dots.forEach(dot => dot.classList.remove("active"));
            dots[currentIndex].classList.add("active");
        }

        function goToSlide(index) {
            if (index < 0) index = items.length - 1;
            if (index >= items.length) index = 0;
            slidesContainer.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
            updateDots();
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 4000); // 每4秒切换
        }
        
        // 初始启动轮播
        resetInterval();
    }

    // --- Filter Tag Interaction ---
    const filterTags = document.querySelectorAll('.filter-tag');
    const filteredRecommendationsContainer = document.getElementById('filtered-recommendations-container');

    // Sample recipe data with tags
    const allSampleRecipes = [
        { name: "清炒时蔬", tags: ["vegetarian", "quick", "low-calorie"], description: "简单又健康的素食选择，快速完成。" },
        { name: "麻婆豆腐", tags: ["vegetarian", "spicy"], description: "经典的川菜，麻辣鲜香，非常下饭。" },
        { name: "香煎鸡胸肉沙拉", tags: ["low-calorie", "quick"], description: "低卡高蛋白，健身人士的好伙伴。" },
        { name: "辣子鸡丁", tags: ["spicy", "comfort"], description: "香辣过瘾，抚慰心灵的美味。" },
        { name: "番茄金针菇肥牛", tags: ["comfort"], description: "酸甜开胃，暖心暖胃的家常菜。" },
        { name: "素炒三丝", tags: ["vegetarian"], description: "色彩丰富，口感清爽的素菜。" },
        { name: "快手葱油拌面", tags: ["quick", "comfort"], description: "几分钟搞定，简单又美味。" },
        { name: "水煮三国（素版）", tags: ["vegetarian", "spicy", "comfort"], description: "多种蔬菜的麻辣盛宴。" },
        { name: "低卡鸡肉丸", tags: ["low-calorie"], description: "自制鸡肉丸，健康少负担。" },
        { name: "红油抄手", tags: ["spicy"], description: "四川名小吃，鲜香麻辣。" }
    ];

    function updateFilteredRecommendations() {
        const activeFilterElements = document.querySelectorAll('.filter-tag.active');
        const activeFilters = Array.from(activeFilterElements).map(tagEl => tagEl.dataset.filter);

        filteredRecommendationsContainer.innerHTML = ''; // Clear previous results

        if (activeFilters.length === 0) {
            filteredRecommendationsContainer.innerHTML = "<p class='no-results'>请选择您感兴趣的标签，我会为您推荐好吃的！</p>";
            return;
        }

        const recommendedRecipes = allSampleRecipes.filter(recipe => {
            return activeFilters.every(filter => recipe.tags.includes(filter));
        });

        if (recommendedRecipes.length > 0) {
            let content = '<h4>为您找到以下推荐：</h4><ul>';
            recommendedRecipes.forEach(recipe => {
                content += `<li><strong>${recipe.name}</strong> <small>(${recipe.tags.join(', ')})</small><br><span style="font-size:0.9em; color:#555;">${recipe.description}</span></li>`;
            });
            content += '</ul>';
            filteredRecommendationsContainer.innerHTML = content;
        } else {
            filteredRecommendationsContainer.innerHTML = "<p class='no-results'>哎呀，暂时没有完全匹配所有选中标签的食谱... 试试减少一些筛选条件？</p>";
        }
    }

    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            this.classList.toggle('active');
            updateFilteredRecommendations(); // Update recommendations when a tag is clicked
        });
    });

    // Initial call to display a message if no tags are selected
    updateFilteredRecommendations();
}); 