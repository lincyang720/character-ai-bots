// update-trending.js - 更新trending数据的脚本
const fs = require('fs');
const path = require('path');

// 读取角色数据
const charactersPath = path.join(__dirname, 'data', 'characters.json');
const characters = JSON.parse(fs.readFileSync(charactersPath, 'utf8'));

// 模拟trending数据生成（实际项目中可以从Google Analytics或数据库获取）
function generateTrendingData(characters) {
    const today = new Date().toISOString().split('T')[0];

    // 为每个角色生成或更新trending数据
    characters.forEach((char, index) => {
        // 如果没有trending字段，初始化
        if (!char.trending) {
            char.trending = {
                rank: 0,
                weeklyChats: 0,
                weeklyGrowth: 0,
                lastUpdated: today
            };
        }

        // 如果没有stats字段，初始化
        if (!char.stats) {
            char.stats = {
                totalChats: Math.floor(Math.random() * 20000) + 5000,
                lastWeekChats: Math.floor(Math.random() * 3000) + 1000,
                monthlyViews: Math.floor(Math.random() * 10000) + 3000
            };
        }

        // 模拟本周数据（实际应该从真实数据源获取）
        // 这里使用随机数模拟，你可以替换为真实的Google Analytics API调用
        const baseChats = char.stats.lastWeekChats;
        const variation = Math.random() * 0.5 - 0.1; // -10% to +40% 变化
        const weeklyChats = Math.floor(baseChats * (1 + variation));

        // 计算增长率
        const growth = Math.floor(((weeklyChats - baseChats) / baseChats) * 100);

        // 更新trending数据
        char.trending.weeklyChats = weeklyChats;
        char.trending.weeklyGrowth = growth;
        char.trending.lastUpdated = today;

        // 更新stats（为下周计算做准备）
        char.stats.lastWeekChats = weeklyChats;
        char.stats.totalChats += weeklyChats;
    });

    // 根据weeklyChats排序并分配排名
    const sortedByChats = [...characters].sort((a, b) =>
        b.trending.weeklyChats - a.trending.weeklyChats
    );

    sortedByChats.forEach((char, index) => {
        const originalChar = characters.find(c => c.id === char.id);
        originalChar.trending.rank = index + 1;
    });

    return characters;
}

// 从Google Analytics获取真实数据的函数（可选）
async function fetchRealAnalyticsData() {
    // 这里可以集成Google Analytics API
    // 示例代码：
    /*
    const { BetaAnalyticsDataClient } = require('@google-analytics/data');
    const analyticsDataClient = new BetaAnalyticsDataClient();

    const [response] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
    });

    // 处理响应数据...
    return processedData;
    */

    // 暂时返回null，使用模拟数据
    return null;
}

// 主函数
async function updateTrending() {
    console.log('🔄 开始更新trending数据...');

    try {
        // 尝试获取真实数据（如果配置了GA）
        const realData = await fetchRealAnalyticsData();

        // 生成或更新trending数据
        const updatedCharacters = generateTrendingData(characters);

        // 保存更新后的数据
        fs.writeFileSync(
            charactersPath,
            JSON.stringify(updatedCharacters, null, 2),
            'utf8'
        );

        console.log('✅ Trending数据更新成功！');
        console.log(`📊 更新了 ${updatedCharacters.length} 个角色的数据`);

        // 显示Top 5
        const top5 = updatedCharacters
            .sort((a, b) => a.trending.rank - b.trending.rank)
            .slice(0, 5);

        console.log('\n🔥 本周Top 5:');
        top5.forEach(char => {
            console.log(`  ${char.trending.rank}. ${char.name} - ${char.trending.weeklyChats} chats (${char.trending.weeklyGrowth > 0 ? '+' : ''}${char.trending.weeklyGrowth}%)`);
        });

        return updatedCharacters;
    } catch (error) {
        console.error('❌ 更新失败:', error);
        throw error;
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    updateTrending()
        .then(() => {
            console.log('\n✨ 现在可以运行 build-index.js 重新生成HTML');
            process.exit(0);
        })
        .catch(error => {
            console.error('Error:', error);
            process.exit(1);
        });
}

module.exports = { updateTrending, generateTrendingData };
