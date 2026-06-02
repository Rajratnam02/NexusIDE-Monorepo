# Fix: Source of Truth for Unsaved Collaborative Edits

## The Problem

Right now there are **two independent sources of truth** that can get out of sync:

| Source | When it's used |
|---|---|
| **Yjs in-memory doc** (via y-socket.io) | While users are actively connected and editing |
| **MongoDB `File.content`** | When a user reloads the page |

```
User A types → Yjs doc (RAM) ──── only on "Save" ──→ MongoDB
                                                          ↑
                              User B reloads → reads from MongoDB ← STALE ❌
```

If User A has unsaved edits, User B reloads and gets the **old** MongoDB version — losing all in-flight collaborative changes.

---

## The Solution: Make Yjs the Single Source of Truth

Use **`y-mongodb-provider`** to automatically and continuously persist every Yjs CRDT update to MongoDB. The DB is always in sync with the live Yjs state — no manual save needed.

```
User A types → Yjs doc (RAM) → y-mongodb-provider → MongoDB (always current)
                                                          ↑
                              User B reloads → Yjs rehydrates from MongoDB ✅
```

---

## Proposed Changes

### 1. Server — Install dependency

```bash
cd Server
npm install y-mongodb-provider
```

---

### 2. [MODIFY] `Server/realtime/socket.js`

- Import `MongodbPersistence` from `y-mongodb-provider` and `Y` from `yjs`
- Call `new MongodbPersistence(MONGO_URI, { collectionName: "yjs_documents" })` on server init
- Wire it up before `ysocketio.initialize()` so every Yjs update is persisted automatically
- Export `getPersistedYDoc(roomName)` helper — used to seed a Yjs doc from MongoDB when a client connects

---

### 3. [NO CHANGE NEEDED] Frontend

The frontend already uses `y-socket.io` on the client. Because the server now rehydrates the Yjs doc from MongoDB on room join, **the client automatically receives the full latest state** when it connects — no frontend changes required.

---

### 4. [OPTIONAL but Recommended] Explicit "Save" still syncs `File.content`

Keep your existing explicit save flow (`Ctrl+S` → PUT `/api/files/:id`) as a fallback. This keeps `File.content` in MongoDB readable even outside of the Yjs context (e.g. for API consumers, search, etc).

The two are not in conflict:
- **Yjs doc in `yjs_documents` collection** = live collaborative truth (always current)
- **`File.content` in `files` collection** = last explicitly saved snapshot (for non-Yjs use)

---

## How it Works After the Fix

```
1. User A opens file → Yjs doc loads from MongoDB (yjs_documents collection)
2. User A types → every keystroke updates Yjs → y-mongodb-provider persists update
3. User B reloads → Yjs doc rehydrates from MongoDB → sees all of User A's edits ✅
4. User A hits Save → File.content also updated in files collection ✅
```

---

## Verification Plan

1. Open a file, type something — **don't save**
2. Open the same file in another browser tab (second user)
3. Reload tab 1
4. Both tabs should show the same latest content ✅
5. Check MongoDB — `yjs_documents` collection should have a document for the file's room ID

