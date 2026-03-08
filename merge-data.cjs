#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const basePath = path.join(rootDir, 'data.base.json');
const partsDir = path.join(rootDir, 'data', 'parts');
const outDir = path.join(rootDir, 'public');
const outPath = path.join(outDir, 'data.json');

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function ensureDir(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
}

function normalizePerson(p) {
  if (!p || typeof p !== 'object') return null;
  const person = { ...p };
  if (person.mainwiki && !person.main_wiki) {
    person.main_wiki = person.mainwiki;
    delete person.mainwiki;
  }
  return person;
}

function main() {
  if (!fs.existsSync(basePath)) {
    console.error('data.base.json が見つかりません:', basePath);
    process.exit(1);
  }

  ensureDir(partsDir);
  ensureDir(outDir);

  const base = loadJson(basePath);

  if (!Array.isArray(base.items)) {
    base.items = [];
  }
  if (!Array.isArray(base.categories)) {
    base.categories = [];
  }

  const partFiles = fs
    .readdirSync(partsDir)
    .filter((f) => f.toLowerCase().endsWith('.json'))
    .sort();

  if (partFiles.length === 0) {
    console.error('data/parts/*.json が見つかりません');
    process.exit(1);
  }

  const existingIds = new Set(base.items.map((p) => p && p.id).filter(Boolean));
  const addedIds = [];

  for (const file of partFiles) {
    const full = path.join(partsDir, file);
    try {
      const data = loadJson(full);
      const arr = Array.isArray(data) ? data : Array.isArray(data.items) ? data.items : null;

      if (!arr) {
        console.warn('スキップ（配列形式ではない）:', file);
        continue;
      }

      for (const raw of arr) {
        const p = normalizePerson(raw);
        if (!p || !p.id) continue;
        if (existingIds.has(p.id)) continue;

        base.items.push(p);
        existingIds.add(p.id);
        addedIds.push(p.id);
      }
    } catch (e) {
      console.warn('読み込み失敗:', file, e.message);
    }
  }

  const existingCatIds = new Set(base.categories.map((c) => c && c.id).filter(Boolean));
  const usedCats = new Set(base.items.map((p) => p && p.category).filter(Boolean));

  for (const cid of usedCats) {
    if (existingCatIds.has(cid)) continue;
    base.categories.push({
      id: cid,
      label: { ja: cid, en: cid },
      color: '#7f8c8d'
    });
    existingCatIds.add(cid);
  }

  fs.writeFileSync(outPath, JSON.stringify(base, null, 2) + '\n', 'utf8');

  console.log('merge-data.cjs: part files =', partFiles.length);
  console.log('merge-data.cjs: total items =', base.items.length);
  console.log('merge-data.cjs: added items =', addedIds.length);
  console.log('完了:', outPath);
}

main();
