#!/usr/bin/env node

// data.json をベースに、data/parts/*.json の人物データをマージして
// data.json を上書き生成する簡単なビルドスクリプトです。

const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const dataPath = path.join(rootDir, 'data.json');
const partsDir = path.join(rootDir, 'data', 'parts');

function loadJson(p) {
  const text = fs.readFileSync(p, 'utf8');
  return JSON.parse(text);
}

function ensureDir(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
}

function main() {
  if (!fs.existsSync(dataPath)) {
    console.error('data.json が見つかりません:', dataPath);
    process.exit(1);
  }

  ensureDir(partsDir);

  const base = loadJson(dataPath);
  if (!base.items || !Array.isArray(base.items)) {
    console.error('data.json の形式が想定外です（items 配列がありません）');
    process.exit(1);
  }

  const extraItems = [];
  const partFiles = fs
    .readdirSync(partsDir)
    .filter((f) => f.toLowerCase().endsWith('.json'))
    .sort();

  for (const file of partFiles) {
    const full = path.join(partsDir, file);
    try {
      const data = loadJson(full);
      const arr = Array.isArray(data) ? data : Array.isArray(data.items) ? data.items : null;
      if (!arr) {
        console.warn('スキップ（配列形式ではない）:', file);
        continue;
      }
      for (const p of arr) {
        if (!p || typeof p !== 'object') continue;
        // drafts 由来の mainwiki → main_wiki 変換
        if (p.mainwiki && !p.main_wiki) {
          p.main_wiki = p.mainwiki;
          delete p.mainwiki;
        }
        extraItems.push(p);
      }
    } catch (e) {
      console.warn('読み込み失敗:', file, e.message);
    }
  }

  const existingIds = new Set(base.items.map((p) => p.id));
  const addedIds = [];

  for (const p of extraItems) {
    if (!p || !p.id) continue;
    if (existingIds.has(p.id)) continue;
    base.items.push(p);
    existingIds.add(p.id);
    addedIds.push(p.id);
  }

  // items で使われているが categories に未定義の category があれば、簡易定義を追加
  if (!Array.isArray(base.categories)) {
    base.categories = [];
  }
  const existingCatIds = new Set(base.categories.map((c) => c.id));
  const usedCats = new Set(base.items.map((p) => p.category).filter(Boolean));

  for (const cid of usedCats) {
    if (existingCatIds.has(cid)) continue;
    base.categories.push({
      id: cid,
      label: {
        ja: cid,
        en: cid,
      },
      color: '#7f8c8d',
    });
    existingCatIds.add(cid);
  }

  fs.writeFileSync(dataPath, JSON.stringify(base, null, 2) + '\n', 'utf8');

  console.log('merge-data.cjs: 追加人数 =', addedIds.length);
  if (addedIds.length) {
    console.log('追加 ID:', addedIds.join(', '));
  }
  console.log('完了: data.json を更新しました。');
}

main();

