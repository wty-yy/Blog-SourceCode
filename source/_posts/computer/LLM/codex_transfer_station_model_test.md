---
title: codex中转站模型测试
hide: false
math: true
category:
  - LLM
tags:
  - Codex
  - 模型测试
abbrlink: 54975
date: 2026-09-06 00:27:25
index_img:
banner_img:
---

# codex中转站模型测试

## 鹈鹕骑自行车

基本上第一次生成的结果就已经比较完整了，后续反复要求修改，提升幅度并不大。测试使用的 prompt 如下：

```bash
创建一个 HTML，内容是 SVG 绘制一个鹈鹕骑自行车的 2D 动画
```

下面的预览直接加载生成的 HTML 文件；如果浏览器限制了嵌入内容，也可以点击每个预览下方的链接在新窗口打开。

### 官方 API

> 测试时间：2026-09-05 22:00–24:00

#### GPT-6 Astra

<div class="codex-demo" style="margin:1.25rem 0 2rem;">
  <iframe src="/file/codex_model_tests/codex_bike_20260906/official/gpt6.0_astra/index.html" title="官方 API · GPT-6 Astra · 鹈鹕骑自行车" loading="lazy" style="display:block;width:100%;height:620px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;"></iframe>
  <p style="margin:0.55rem 0 0;font-size:0.9em;text-align:right;"><a href="/file/codex_model_tests/codex_bike_20260906/official/gpt6.0_astra/index.html" target="_blank" rel="noopener">在新窗口打开 HTML</a></p>
</div>

#### GPT-5.6 Sol

<div class="codex-demo" style="margin:1.25rem 0 2rem;">
  <iframe src="/file/codex_model_tests/codex_bike_20260906/official/gpt5.6_sol/index.html" title="官方 API · GPT-5.6 Sol · 鹈鹕骑自行车" loading="lazy" style="display:block;width:100%;height:620px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;"></iframe>
  <p style="margin:0.55rem 0 0;font-size:0.9em;text-align:right;"><a href="/file/codex_model_tests/codex_bike_20260906/official/gpt5.6_sol/index.html" target="_blank" rel="noopener">在新窗口打开 HTML</a></p>
</div>

#### GPT-5.6 Terra

<div class="codex-demo" style="margin:1.25rem 0 2rem;">
  <iframe src="/file/codex_model_tests/codex_bike_20260906/official/gpt5.6_terra/pelican-bicycle-animation.html" title="官方 API · GPT-5.6 Terra · 鹈鹕骑自行车" loading="lazy" style="display:block;width:100%;height:620px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;"></iframe>
  <p style="margin:0.55rem 0 0;font-size:0.9em;text-align:right;"><a href="/file/codex_model_tests/codex_bike_20260906/official/gpt5.6_terra/pelican-bicycle-animation.html" target="_blank" rel="noopener">在新窗口打开 HTML</a></p>
</div>

#### GPT-5.6 Luna

<div class="codex-demo" style="margin:1.25rem 0 2rem;">
  <iframe src="/file/codex_model_tests/codex_bike_20260906/official/gpt5.6_luna/index.html" title="官方 API · GPT-5.6 Luna · 鹈鹕骑自行车" loading="lazy" style="display:block;width:100%;height:620px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;"></iframe>
  <p style="margin:0.55rem 0 0;font-size:0.9em;text-align:right;"><a href="/file/codex_model_tests/codex_bike_20260906/official/gpt5.6_luna/index.html" target="_blank" rel="noopener">在新窗口打开 HTML</a></p>
</div>

### 中转站

#### portal

https://portal123.top/

> 测试时间：2026-09-05 22:00–24:00

#### GPT-6 Astra

<div class="codex-demo" style="margin:1.25rem 0 2rem;">
  <iframe src="/file/codex_model_tests/codex_bike_20260906/portal/gpt6.0_astra/pelican-bike.html" title="portal · GPT-6 Astra · 鹈鹕骑自行车" loading="lazy" style="display:block;width:100%;height:620px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;"></iframe>
  <p style="margin:0.55rem 0 0;font-size:0.9em;text-align:right;"><a href="/file/codex_model_tests/codex_bike_20260906/portal/gpt6.0_astra/pelican-bike.html" target="_blank" rel="noopener">在新窗口打开 HTML</a></p>
</div>

#### GPT-5.6 Sol

<div class="codex-demo" style="margin:1.25rem 0 2rem;">
  <iframe src="/file/codex_model_tests/codex_bike_20260906/portal/gpt5.6_sol/index.html" title="portal · GPT-5.6 Sol · 鹈鹕骑自行车" loading="lazy" style="display:block;width:100%;height:620px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;"></iframe>
  <p style="margin:0.55rem 0 0;font-size:0.9em;text-align:right;"><a href="/file/codex_model_tests/codex_bike_20260906/portal/gpt5.6_sol/index.html" target="_blank" rel="noopener">在新窗口打开 HTML</a></p>
</div>

#### GPT-5.6 Terra

<div class="codex-demo" style="margin:1.25rem 0 2rem;">
  <iframe src="/file/codex_model_tests/codex_bike_20260906/portal/gpt5.6_terra/index.html" title="portal · GPT-5.6 Terra · 鹈鹕骑自行车" loading="lazy" style="display:block;width:100%;height:620px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;"></iframe>
  <p style="margin:0.55rem 0 0;font-size:0.9em;text-align:right;"><a href="/file/codex_model_tests/codex_bike_20260906/portal/gpt5.6_terra/index.html" target="_blank" rel="noopener">在新窗口打开 HTML</a></p>
</div>

#### GPT-5.6 Luna

<div class="codex-demo" style="margin:1.25rem 0 2rem;">
  <iframe src="/file/codex_model_tests/codex_bike_20260906/portal/gpt5.6_luna/pelican-bike.html" title="portal · GPT-5.6 Luna · 鹈鹕骑自行车" loading="lazy" style="display:block;width:100%;height:620px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;"></iframe>
  <p style="margin:0.55rem 0 0;font-size:0.9em;text-align:right;"><a href="/file/codex_model_tests/codex_bike_20260906/portal/gpt5.6_luna/pelican-bike.html" target="_blank" rel="noopener">在新窗口打开 HTML</a></p>
</div>

#### Modelflare – openai-premium 路由

https://modelflare.dev/

> 测试时间：2026-09-05 22:00–24:00

#### GPT-6 Astra

<div class="codex-demo" style="margin:1.25rem 0 2rem;">
  <iframe src="/file/codex_model_tests/codex_bike_20260906/modelflare_openai_premium/gpt6.0_astra/index.html" title="Modelflare · GPT-6 Astra · 鹈鹕骑自行车" loading="lazy" style="display:block;width:100%;height:620px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;"></iframe>
  <p style="margin:0.55rem 0 0;font-size:0.9em;text-align:right;"><a href="/file/codex_model_tests/codex_bike_20260906/modelflare_openai_premium/gpt6.0_astra/index.html" target="_blank" rel="noopener">在新窗口打开 HTML</a></p>
</div>

#### GPT-5.6 Sol

<div class="codex-demo" style="margin:1.25rem 0 2rem;">
  <iframe src="/file/codex_model_tests/codex_bike_20260906/modelflare_openai_premium/gpt5.6_sol/index.html" title="Modelflare · GPT-5.6 Sol · 鹈鹕骑自行车" loading="lazy" style="display:block;width:100%;height:620px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;"></iframe>
  <p style="margin:0.55rem 0 0;font-size:0.9em;text-align:right;"><a href="/file/codex_model_tests/codex_bike_20260906/modelflare_openai_premium/gpt5.6_sol/index.html" target="_blank" rel="noopener">在新窗口打开 HTML</a></p>
</div>

#### GPT-5.6 Terra

<div class="codex-demo" style="margin:1.25rem 0 2rem;">
  <iframe src="/file/codex_model_tests/codex_bike_20260906/modelflare_openai_premium/gpt5.6_terra/index.html" title="Modelflare · GPT-5.6 Terra · 鹈鹕骑自行车" loading="lazy" style="display:block;width:100%;height:620px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;"></iframe>
  <p style="margin:0.55rem 0 0;font-size:0.9em;text-align:right;"><a href="/file/codex_model_tests/codex_bike_20260906/modelflare_openai_premium/gpt5.6_terra/index.html" target="_blank" rel="noopener">在新窗口打开 HTML</a></p>
</div>

#### GPT-5.6 Luna

<div class="codex-demo" style="margin:1.25rem 0 2rem;">
  <iframe src="/file/codex_model_tests/codex_bike_20260906/modelflare_openai_premium/gpt5.6_luna/index.html" title="Modelflare · GPT-5.6 Luna · 鹈鹕骑自行车" loading="lazy" style="display:block;width:100%;height:620px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;"></iframe>
  <p style="margin:0.55rem 0 0;font-size:0.9em;text-align:right;"><a href="/file/codex_model_tests/codex_bike_20260906/modelflare_openai_premium/gpt5.6_luna/index.html" target="_blank" rel="noopener">在新窗口打开 HTML</a></p>
</div>
