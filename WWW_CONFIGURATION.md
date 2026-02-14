# WWW 子域名配置说明

## ✅ 已完成的更改

### 所有URL已更新为 www 版本

**之前**: `https://characteraibots.com/`
**现在**: `https://www.characteraibots.com/`

---

## 📝 修改的文件

### 1. Sitemap (sitemap.xml)
- ✅ 所有URL改为 `https://www.characteraibots.com/`
- ✅ 共更新 51 个URL

### 2. Robots.txt
- ✅ Sitemap URL: `https://www.characteraibots.com/sitemap.xml`

### 3. HTML文件
- ✅ index.html - canonical和所有meta标签
- ✅ search.html - canonical和所有meta标签
- ✅ 49个角色页面 - 所有canonical URLs

### 4. Vercel配置 (vercel.json)
- ✅ 添加301重定向：非www → www
- ✅ 所有访问 `characteraibots.com` 自动重定向到 `www.characteraibots.com`

---

## 🔄 重定向规则

### 自动重定向示例

```
http://characteraibots.com/
  → 301 → https://www.characteraibots.com/

https://characteraibots.com/search
  → 301 → https://www.characteraibots.com/search

http://characteraibots.com/characters/yandere-librarian
  → 301 → https://www.characteraibots.com/characters/yandere-librarian
```

### Vercel配置

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [
        {
          "type": "host",
          "value": "characteraibots.com"
        }
      ],
      "destination": "https://www.characteraibots.com/:path*",
      "permanent": true
    }
  ]
}
```

---

## 🚀 部署步骤

### 1. 推送到GitHub

```bash
git push
```

### 2. Vercel自动部署

- Vercel会自动检测更改
- 大约5-10分钟完成部署

### 3. DNS配置（如果需要）

确保DNS记录正确：

```
A记录:
www.characteraibots.com → Vercel IP

CNAME记录（推荐）:
www.characteraibots.com → cname.vercel-dns.com
```

在Vercel Dashboard中：
1. 进入项目设置
2. Domains → Add Domain
3. 添加 `www.characteraibots.com`
4. 按照提示配置DNS

---

## ✅ 验证清单

部署完成后，验证以下内容：

### A. 重定向测试

```bash
# 测试非www重定向到www
curl -I http://characteraibots.com/
# 应该返回: 301 Moved Permanently
# Location: https://www.characteraibots.com/

curl -I https://characteraibots.com/
# 应该返回: 301 Moved Permanently
# Location: https://www.characteraibots.com/

# 测试www版本正常访问
curl -I https://www.characteraibots.com/
# 应该返回: 200 OK
```

### B. Sitemap验证

```bash
# 访问sitemap
curl https://www.characteraibots.com/sitemap.xml | grep -o "https://[^<]*" | head -5

# 应该显示:
# https://www.characteraibots.com/
# https://www.characteraibots.com/search
# https://www.characteraibots.com/characters/yandere-librarian
# ...
```

### C. Robots.txt验证

```bash
curl https://www.characteraibots.com/robots.txt

# 应该包含:
# Sitemap: https://www.characteraibots.com/sitemap.xml
```

### D. Canonical URL验证

访问任意页面，查看源代码：

```html
<link rel="canonical" href="https://www.characteraibots.com/">
```

---

## 🔧 Google Search Console更新

### 1. 添加www版本为新属性

1. 登录 [Google Search Console](https://search.google.com/search-console)
2. 添加新属性: `https://www.characteraibots.com`
3. 验证所有权（使用HTML标签或DNS验证）

### 2. 提交新的Sitemap

1. 在www版本的属性中
2. Sitemaps → Add new sitemap
3. 输入: `sitemap.xml`
4. Submit

### 3. 设置首选域（可选）

虽然有301重定向，但建议在Search Console中明确设置：
- 选择 `www.characteraibots.com` 作为首选域

### 4. 请求重新索引

对于重要页面：
1. URL Inspection
2. 输入www版本的URL
3. Request Indexing

优先索引：
- https://www.characteraibots.com/
- https://www.characteraibots.com/search
- https://www.characteraibots.com/characters/yandere-librarian
- https://www.characteraibots.com/characters/vampire-teacher

---

## 📊 SEO影响

### 正面影响

✅ **URL一致性**
- 所有页面使用统一的www格式
- 避免重复内容问题

✅ **品牌一致性**
- www更专业
- 更容易记忆

✅ **301重定向**
- 保留SEO权重
- 搜索引擎会更新索引

✅ **Canonical标签**
- 明确告诉搜索引擎首选版本
- 防止内容重复惩罚

### 预期时间线

- **1-3天**: 301重定向生效
- **1-2周**: 搜索引擎更新索引
- **2-4周**: 完全切换到www版本

---

## ⚠️ 注意事项

### 1. 外部链接

如果有外部网站链接到你的网站：
- 301重定向会自动处理
- 不需要联系他们更新链接
- SEO权重会通过301传递

### 2. 社交媒体

建议更新：
- Twitter/X 个人资料
- Facebook 页面
- LinkedIn 公司页面
- 其他社交媒体资料

### 3. 广告和营销材料

更新所有营销材料中的URL：
- Google Ads
- 名片
- 宣传册
- Email签名

### 4. Analytics

确保Google Analytics追踪www版本：
- 检查GA配置
- 确认数据正常收集

---

## 🐛 故障排查

### 问题1: 重定向不工作

**症状**: 访问非www版本没有重定向

**检查**:
```bash
curl -I http://characteraibots.com/
```

**解决**:
1. 检查vercel.json是否正确部署
2. 查看Vercel部署日志
3. 清除浏览器缓存
4. 等待DNS传播（最多48小时）

### 问题2: www版本无法访问

**症状**: www.characteraibots.com 返回404

**解决**:
1. 在Vercel Dashboard添加www域名
2. 配置DNS CNAME记录
3. 等待DNS传播

### 问题3: 重复索引

**症状**: Google同时索引www和非www版本

**解决**:
1. 确认301重定向正常工作
2. 在Search Console请求重新索引
3. 等待Google更新（2-4周）
4. 使用Canonical标签（已配置）

---

## 📈 监控

### 每周检查

1. **Search Console**
   - 检查索引页面数量
   - 查看是否有404错误
   - 监控搜索流量

2. **重定向状态**
   ```bash
   curl -I http://characteraibots.com/
   curl -I https://characteraibots.com/
   ```

3. **Sitemap状态**
   - 确认所有URL可访问
   - 检查是否有错误

---

## 💡 最佳实践

### 为什么选择www？

1. **技术灵活性**
   - 更容易配置CDN
   - Cookie隔离更好
   - 子域名管理更灵活

2. **品牌认知**
   - 更传统、更专业
   - 用户更熟悉

3. **SEO中立**
   - www vs 非www对SEO影响相同
   - 关键是保持一致性

### 替代方案

如果将来想改回非www：
1. 反转vercel.json中的重定向
2. 更新所有URL
3. 重新提交sitemap
4. 等待搜索引擎更新

---

## 📞 需要帮助？

如果遇到问题：
1. 检查Vercel部署日志
2. 使用上面的验证命令
3. 查看Google Search Console错误
4. 等待24-48小时让更改生效

---

**配置完成日期**: 2026-02-14
**预计生效时间**: 1-3天
**完全切换时间**: 2-4周

---

## ✅ 快速验证脚本

```bash
#!/bin/bash
echo "=== WWW配置验证 ==="
echo ""

echo "1. 测试非www重定向..."
curl -I http://characteraibots.com/ 2>&1 | grep -E "HTTP|Location"
echo ""

echo "2. 测试www版本访问..."
curl -I https://www.characteraibots.com/ 2>&1 | grep "HTTP"
echo ""

echo "3. 检查sitemap..."
curl -s https://www.characteraibots.com/sitemap.xml | grep -o "https://[^<]*" | head -3
echo ""

echo "4. 检查robots.txt..."
curl -s https://www.characteraibots.com/robots.txt | grep "Sitemap"
echo ""

echo "=== 验证完成 ==="
```

保存为 `verify-www.sh`，运行：
```bash
chmod +x verify-www.sh
./verify-www.sh
```

---

**记住**: 所有URL现在都应该使用 `https://www.characteraibots.com/` 格式！
