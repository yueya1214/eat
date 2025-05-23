document.addEventListener('DOMContentLoaded', function() {
    // --- 一键决策功能 ---
    const decisionButton = document.getElementById('mainDecisionButton');
    const recommendationResult = document.getElementById('recommendation-result');
    const foodOptions = [
        "麻辣香锅", "饺子", "披萨", "寿司", "拉面", "牛排", "沙拉", "炒饭", 
        "火锅", "烤肉", "意大利面", "汉堡", "海鲜大餐", "家常菜（小炒黄牛肉）",
        "轻食简餐", "酸菜鱼", "部队锅", "烧烤", "麻辣烫", "小龙虾", "煲仔饭"
    ];

    // 全局变量存储当前漂浮的食物元素
    let floatingFoodElements = [];
    
    // 添加食物漂浮动画函数
    function createFloatingFood() {
        // 清除可能已存在的漂浮食物
        stopFloatingFood();
        
        // 创建20个漂浮的食物名称
        for(let i = 0; i < 20; i++) {
            setTimeout(() => {
                const food = document.createElement('div');
                const randomFood = foodOptions[Math.floor(Math.random() * foodOptions.length)];
                food.textContent = randomFood;
                food.className = 'floating-food';
                food.style.left = Math.random() * 100 + 'vw';
                food.style.top = Math.random() * 100 + 'vh';
                food.style.animationDuration = (Math.random() * 6 + 3) + 's'; // 3-9秒
                food.style.animationDelay = (Math.random() * 2) + 's';
                food.style.opacity = Math.random() * 0.7 + 0.3; // 透明度0.3-1
                food.style.fontSize = (Math.random() * 24 + 16) + 'px'; // 字体大小16-40px
                
                // 随机颜色 - 暖色调
                const hue = Math.floor(Math.random() * 60) + 0; // 红色到橙黄色
                const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
                const lightness = Math.floor(Math.random() * 20) + 40; // 40-60%
                food.style.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                
                document.body.appendChild(food);
                // 将元素添加到数组中以便后续移除
                floatingFoodElements.push(food);
            }, i * 100); // 错开创建时间
        }
    }
    
    // 停止所有漂浮食物的函数
    function stopFloatingFood() {
        // 移除所有当前漂浮的食物元素
        floatingFoodElements.forEach(element => {
            if (document.body.contains(element)) {
                document.body.removeChild(element);
            }
        });
        // 清空数组
        floatingFoodElements = [];
    }

    decisionButton.addEventListener('click', function() {
        recommendationResult.textContent = '思考中... 🤔';
        // Add wiggle effect
        if (!decisionButton.classList.contains('wiggle-effect')) {
            decisionButton.classList.add('wiggle-effect');
            setTimeout(() => {
                decisionButton.classList.remove('wiggle-effect'); // Remove after animation
            }, 300); // Match animation duration (must be same as CSS)
        }
        
        // 触发食物漂浮效果
        createFloatingFood();
        
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * foodOptions.length);
            recommendationResult.textContent = `要不...今天就吃 ${foodOptions[randomIndex]}！`;
            
            // 添加淡入效果
            recommendationResult.style.opacity = '0';
            recommendationResult.style.transform = 'translateY(10px)';
            setTimeout(() => {
                recommendationResult.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                recommendationResult.style.opacity = '1';
                recommendationResult.style.transform = 'translateY(0)';
                
                // 结果显示1秒后停止漂浮效果
                setTimeout(() => {
                    stopFloatingFood();
                }, 1000);
            }, 50);
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
        "五花肉豆角": "<p>推荐食谱：<strong>五花肉炖豆角</strong></p><p>做法：五花肉煸炒出油，加入葱姜蒜、香料炒香，放入豆角，加水/高汤炖煮入味。</p>",
        "青椒土豆": "<p>推荐食谱：<strong>青椒土豆丝</strong></p><p>做法：土豆切丝泡水去淀粉，青椒切丝。热锅爆香蒜末，放入土豆丝翻炒至半熟，加入青椒丝翻炒，加盐和少许醋即可。</p>",
        "茄子": "<p>推荐食谱：<strong>鱼香茄子</strong></p><p>做法：茄子切条，过油炸至外焦里嫩。另起锅爆香蒜末、姜末，加入豆瓣酱炒出红油，加入糖、醋、生抽调味，勾芡后倒入炸好的茄子翻炒均匀。</p>",
        "香菇青菜": "<p>推荐食谱：<strong>香菇青菜汤</strong></p><p>做法：香菇泡发切片，青菜洗净切段。锅中放油爆香姜片，加入清水煮沸，放入香菇煮5分钟，加入青菜煮熟，调味即可。</p>",
        "排骨": "<p>推荐食谱：<strong>红烧排骨</strong></p><p>做法：排骨斩小块，焯水去血水。锅中放油，加入葱姜蒜、八角、桂皮爆香，放入排骨翻炒上色，加入料酒、生抽、老抽调色，加水没过排骨，焖煮40分钟左右。</p>",
        "鸡蛋青椒": "<p>推荐食谱：<strong>青椒炒蛋</strong></p><p>做法：鸡蛋打散，青椒切丝。先炒鸡蛋至松软，盛出。再炒青椒至断生，放回鸡蛋一起翻炒均匀，加盐调味即可。</p>",
        "肉末茄子": "<p>推荐食谱：<strong>肉末茄子</strong></p><p>做法：茄子切条，过油炸至软。肉末爆香，加入豆瓣酱炒香，加入适量清水煮沸，放入炸好的茄子，小火煮至入味，勾芡即可。</p>",
        "鸡蛋米饭": "<p>推荐食谱：<strong>蛋炒饭</strong></p><p>做法：米饭提前蒸好并冷却。鸡蛋打散，热锅凉油，将鸡蛋倒入摊成蛋皮，切碎。大火将米饭炒散，加入蛋碎，加入葱花、盐翻炒均匀。</p>",
        "豆腐肉末": "<p>推荐食谱：<strong>麻婆豆腐</strong></p><p>做法：豆腐切块焯水。锅中放油，爆香姜末、蒜末，加入肉末炒散，加入豆瓣酱、辣豆瓣炒出红油，加入清水或高汤，放入豆腐块，小火煮入味，勾芡即可。</p>",
        "青菜": "<p>推荐食谱：<strong>蒜蓉炒青菜</strong></p><p>做法：青菜洗净，切段。锅中放油，爆香蒜末，放入青菜快速翻炒至断生，加盐调味即可。</p>",
        "面条": "<p>推荐食谱：<strong>葱油拌面</strong></p><p>做法：面条煮熟沥干。热锅中放油，爆香葱花，加少许生抽酱油，将热油淋在面条上拌匀，可加入少许香醋提味。</p>"
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
            
            // 检查各种食材组合
            if (currentIngredients.includes("鸡蛋") && (currentIngredients.includes("番茄") || currentIngredients.includes("西红柿"))) {
                foundRecipeHTML = mockRecipes["鸡蛋番茄"];
            } else if (currentIngredients.includes("鸡蛋") && currentIngredients.includes("青椒")) {
                foundRecipeHTML = mockRecipes["鸡蛋青椒"];
            } else if (currentIngredients.includes("鸡蛋") && currentIngredients.includes("米饭")) {
                foundRecipeHTML = mockRecipes["鸡蛋米饭"];
            } else if (currentIngredients.includes("青椒") && currentIngredients.includes("土豆")) {
                foundRecipeHTML = mockRecipes["青椒土豆"];
            } else if (currentIngredients.includes("茄子") && currentIngredients.includes("肉末")) {
                foundRecipeHTML = mockRecipes["肉末茄子"];
            } else if (currentIngredients.includes("豆腐") && currentIngredients.includes("肉末")) {
                foundRecipeHTML = mockRecipes["豆腐肉末"];
            } else if (currentIngredients.includes("豆腐") && (currentIngredients.includes("青菜") || currentIngredients.includes("白菜") || currentIngredients.includes("小青菜"))) {
                foundRecipeHTML = mockRecipes["豆腐青菜"];
            } else if (currentIngredients.includes("香菇") && (currentIngredients.includes("青菜") || currentIngredients.includes("白菜") || currentIngredients.includes("小青菜"))) {
                foundRecipeHTML = mockRecipes["香菇青菜"];
            } else if (currentIngredients.includes("牛肉") && currentIngredients.includes("洋葱")) {
                foundRecipeHTML = mockRecipes["牛肉洋葱"];
            } else if ((currentIngredients.includes("虾") || currentIngredients.includes("虾仁")) && (currentIngredients.includes("西兰花") || currentIngredients.includes("西蓝花"))) {
                foundRecipeHTML = mockRecipes["虾仁西兰花"];
            } else if ((currentIngredients.includes("五花肉") || currentIngredients.includes("猪肉")) && (currentIngredients.includes("豆角") || currentIngredients.includes("四季豆"))) {
                foundRecipeHTML = mockRecipes["五花肉豆角"];
            } 
            // 单一食材检查
            else if (currentIngredients.includes("鸡肉")) {
                foundRecipeHTML = mockRecipes["鸡肉"];
            } else if (currentIngredients.includes("土豆")) {
                foundRecipeHTML = mockRecipes["土豆"];
            } else if (currentIngredients.includes("茄子")) {
                foundRecipeHTML = mockRecipes["茄子"];
            } else if (currentIngredients.includes("排骨")) {
                foundRecipeHTML = mockRecipes["排骨"];
            } else if (currentIngredients.includes("青菜") || currentIngredients.includes("白菜") || currentIngredients.includes("小青菜")) {
                foundRecipeHTML = mockRecipes["青菜"];
            } else if (currentIngredients.includes("面条") || currentIngredients.includes("挂面")) {
                foundRecipeHTML = mockRecipes["面条"];
            }

            if (foundRecipeHTML) {
                recipeSuggestion.innerHTML = foundRecipeHTML;
            } else {
                // 为没有匹配到的常见食材提供通用建议
                if (currentIngredients.includes("鱼") || currentIngredients.includes("鱼片") || currentIngredients.includes("鱼肉")) {
                    recipeSuggestion.innerHTML = "<p>推荐做法：<strong>清蒸鱼</strong></p><p>鱼洗净，在鱼身两面划几刀，撒盐腌制10分钟。锅中水烧开，放入葱段和姜片，放入鱼蒸8-10分钟。出锅淋上酱油、热油和香菜即可。</p>";
                } else if (currentIngredients.includes("南瓜") || currentIngredients.includes("倭瓜")) {
                    recipeSuggestion.innerHTML = "<p>推荐做法：<strong>蒸南瓜</strong> 或 <strong>南瓜粥</strong></p><p>南瓜切块，上锅蒸15分钟，撒些白糖即可。或者可以和大米一起煮粥。</p>";
                } else if (currentIngredients.includes("黄瓜")) {
                    recipeSuggestion.innerHTML = "<p>推荐做法：<strong>凉拌黄瓜</strong></p><p>黄瓜洗净，拍碎切段，加入蒜末、盐、醋、香油拌匀，简单又爽口。</p>";
                } else {
                    recipeSuggestion.innerHTML = `<p>根据您提供的食材"<strong>${currentIngredients.join(', ')}</strong>"，建议您尝试以下做法：</p>
                    <p>1. <strong>简易炒菜</strong>：将食材切好，热锅爆香蒜末，将食材翻炒至熟，加入盐和少许生抽调味。</p>
                    <p>2. <strong>蒸/煮</strong>：如果您有肉类和蔬菜，可以尝试将它们一起蒸煮，保留食材原汁原味。</p>
                    <p>您也可以在搜索引擎中搜索这些食材的具体做法，获取更多灵感！</p>`;
                }
            }
            
            // 添加滑入效果
            recipeSuggestion.style.opacity = '0';
            recipeSuggestion.style.transform = 'translateX(-10px)';
            setTimeout(() => {
                recipeSuggestion.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                recipeSuggestion.style.opacity = '1';
                recipeSuggestion.style.transform = 'translateX(0)';
            }, 50);
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
        
        // 添加旋转类
        const rouletteWheel = document.querySelector('.roulette-wheel');
        rouletteWheel.classList.add('spinning');
        
        const randomSpins = Math.floor(Math.random() * 5) + 5; // 5 to 9 full spins for more drama
        const stopAngle = Math.floor(Math.random() * 360); // Random stop angle
        const totalRotation = (randomSpins * 360) + stopAngle;
        
        // 设置旋转角度
        setTimeout(() => {
            rouletteWheel.style.transform = `rotate(${totalRotation}deg)`;
        }, 10);

        // 触发食物漂浮效果
        createFloatingFood();
        
        // 添加音效模拟（仅视觉反馈）
        rouletteWheel.classList.add('spinning');
        
        setTimeout(() => {
            spinning = false;
            rouletteWheel.classList.remove('spinning');
            
            // 确定结果基于停止角度
            // 假设有8个区域，每个区域45度 (360/8 = 45)
            const actualAngle = totalRotation % 360;
            const categoryIndex = Math.floor(actualAngle / (360 / rouletteCategories.length));
            const selectedCategory = rouletteCategories[categoryIndex % rouletteCategories.length];
            
            rouletteResult.textContent = `轮盘指向：${selectedCategory}！`;
            
            // 添加结果显示动画
            rouletteResult.style.opacity = '0';
            rouletteResult.style.transform = 'scale(0.9)';
            setTimeout(() => {
                rouletteResult.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                rouletteResult.style.opacity = '1';
                rouletteResult.style.transform = 'scale(1)';
                
                // 结果显示1秒后停止漂浮效果
                setTimeout(() => {
                    stopFloatingFood();
                }, 1000);
            }, 50);

            // 根据类别推荐一个随机食物
            let categoryFoods = {
                "中式": ["回锅肉", "宫保鸡丁", "水煮鱼", "红烧排骨", "麻婆豆腐"],
                "西式": ["牛排", "汉堡", "意大利面", "披萨", "三明治"],
                "日韩": ["寿司", "拉面", "烤肉", "部队锅", "天妇罗"],
                "东南亚": ["冬阴功", "咖喱", "沙嗲", "椰浆饭", "越南河粉"],
                "快餐": ["炸鸡", "汉堡", "炒面", "炒饭", "煎饼果子"],
                "健康轻食": ["沙拉", "藜麦饭", "酸奶燕麦", "蒸鱼", "蔬菜汤"],
                "面点": ["包子", "馒头", "煎饼", "饺子", "春卷"],
                "辛辣": ["麻辣香锅", "水煮肉片", "麻辣烫", "辣子鸡", "重庆火锅"]
            };
            
            let foods = categoryFoods[selectedCategory];
            if (foods && foods.length > 0) {
                let randomFood = foods[Math.floor(Math.random() * foods.length)];
                setTimeout(() => {
                    rouletteResult.textContent += ` 推荐: ${randomFood}`;
                }, 1000);
            }
        }, 4200); // 略长于CSS动画时间
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
        { name: "红油抄手", tags: ["spicy"], description: "四川名小吃，鲜香麻辣。" },
        { name: "蒸南瓜", tags: ["vegetarian", "low-calorie"], description: "简单健康，甜而不腻。" },
        { name: "牛油果鸡蛋吐司", tags: ["quick", "low-calorie"], description: "营养丰富的快手早餐选择。" },
        { name: "萝卜排骨汤", tags: ["comfort"], description: "暖胃又滋补的家常汤品。" },
        { name: "干煸四季豆", tags: ["vegetarian", "spicy"], description: "下饭神器，香辣可口。" },
        { name: "西红柿鸡蛋面", tags: ["quick", "comfort"], description: "家常经典，简单美味。" }
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
                // 标签名称中文化
                const tagNameMap = {
                    'vegetarian': '素食',
                    'low-calorie': '低卡',
                    'spicy': '辣味',
                    'quick': '快手',
                    'comfort': '治愈系'
                };
                
                const localizedTags = recipe.tags.map(tag => tagNameMap[tag] || tag).join('、');
                
                content += `<li><strong>${recipe.name}</strong> <small>(${localizedTags})</small><br><span>${recipe.description}</span></li>`;
            });
            content += '</ul>';
            filteredRecommendationsContainer.innerHTML = content;
        } else {
            filteredRecommendationsContainer.innerHTML = "<p class='no-results'>哎呀，暂时没有完全匹配所有选中标签的食谱... 试试减少一些筛选条件？</p>";
        }
        
        // 添加淡入效果
        const recommendations = filteredRecommendationsContainer.querySelectorAll('li');
        if (recommendations.length > 0) {
            recommendations.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50 * (index + 1));
            });
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
    
    // 添加平滑滚动效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}); 