Agent Wallboard Desktop — UI/UX Redesign Summary

ภายใต้โฟลเดอร์นี้คือโค้ดของแอป Agent Desktop (Electron + React) ที่ถูกปรับหน้าใช้งานตามบรีฟลูกค้า/โจทย์ที่ส่งมา เพื่อให้ใช้งานจริงได้ลื่นไหลขึ้นและลด Pain Points หลัก (สถานะใช้งาน, ข้อความ, และข้อมูลส่วนตัวของเอเจนต์)

ลูกค้า/ผู้ขอปรับ: ตามบรีฟลูกค้าที่แนบมา (ไม่มีชื่อระบุในเอกสาร)

เนื้อหานี้สรุป 1) เปลี่ยนอะไรจากของเดิมบ้าง 2) วิธีใช้งาน 3) การตั้งค่า/สั่งรัน และ 4) Known notes สำหรับทีม

**สิ่งที่เปลี่ยนจากเวอร์ชันเดิม (Highlights)**
- Quick Status Control (แทน 4 ปุ่มใหญ่เดิม)
  - เพิ่ม `Status Dropdown` ใน Header (เห็นได้ตลอดเวลา) เปลี่ยนสถานะได้คลิกเดียว
  - รองรับคีย์ลัด: F2=Available, F3=Busy, F4=Break, Ctrl+M เปิด Message Center
  - แสดง Toast แจ้งเตือนทันที และมี Floating Status มุมขวาล่างเป็นตัวคอนเฟิร์มแบบ real‑time
  - ใช้ WebSocket (`update_status`) และ fallback เป็น HTTP API หาก socket ไม่พร้อม

- Smart Message Center (แถบขวา)
  - รายการข้อความมี Preview, แยกสถานะ `UNREAD` ชัดเจน (ขอบ/พื้นหลังสี) + ป้าย UNREAD
  - ตัวกรอง: All / Unread / Urgent และ Badge ระดับความสำคัญ 🔴/🔵/⚪
  - ปุ่ม `Mark as Read` บนรายการ (อัปเดตแบบ Optimistic + เรียก API `/messages/:id/read`)
  - `Quick Compose` พร้อมเทมเพลตข้อความ ส่งข้อความได้จริงผ่าน WebSocket (`send_message`) และ fallback HTTP (`POST /api/messages/send`)
  - Label “From: You” เมื่อเป็นข้อความที่เราส่งเองเพื่ออ่านง่ายขึ้น

- Personal Stats Widget (การ์ดสีน้ำเงิน)
  - แสดง Calls/Target + แถบ Progress, Avg Handle Time, CSAT (ค่าตัวอย่างพร้อมจุดเชื่อมต่อกับแบ็กเอนด์)

- Supporting Components
  - Quick Actions (4 ปุ่มลัด), Upcoming Schedule (timeline), Tips Widget, Right Sidebar Layout
  - เพิ่ม Design Tokens (`styles/tokens.css`) เพื่อปรับธีม/สี/ตัวอักษรให้สอดคล้องทั้งแอป

- Login Page (ปรับโทน/ธีม)
  - โทนสดใสขึ้น (gradient + glow) แต่ยังคงอ่านง่าย และมี `Remember me`

ไฟล์/คอมโพเนนต์หลักที่เพิ่ม/แก้ไข (Agent Desktop)
- ใหม่: `src/components/StatusDropdown.js`, `FloatingStatus.js`, `StatsWidget.js`, `QuickActions.js`, `ScheduleWidget.js`, `TipsWidget.js`, `MessageCenter.js`
- ปรับ: `src/App.js` (วางเลย์เอาต์ใหม่, เชื่อมคีย์ลัด, Toast, ส่งข้อความจริง), `src/components/MessagePanel.js` (UNREAD, Preview, Mark as Read), `src/components/AgentInfo.js` (ผูกสีจาก tokens)
- Service: `src/services/socket.js` (เพิ่ม `sendMessage`), `src/services/api.js` (เพิ่ม `sendMessageApi`)
- สไตล์: `src/styles/tokens.css`, `src/styles/components.css`, `src/styles/App.css`

หมายเหตุ: ฝั่ง Supervisor Dashboard ก็มีการย่อการ์ด, Metrics Dashboard, Alert Panel, Agent Detail Modal และ Advanced Filtering (ดูสรุปใน README ของโปรเจกต์นั้นหรือหัวข้อ “Supervisor (สรุป)” ด้านล่าง)

**วิธีใช้งาน (Agent Desktop)**
- ติดตั้งและตั้งค่า
  - คัดลอก `.env.example` เป็น `.env` แล้วตรวจค่า:
    - `REACT_APP_API_URL` ค่าเริ่มต้น `http://localhost:3001/api`
    - `REACT_APP_SOCKET_URL` ค่าเริ่มต้น `http://localhost:3001`
  - ต้องรันแบ็กเอนด์ก่อน (โฟลเดอร์ `backend-server`)
    - เปิดเทอร์มินัลอีกหน้าที่โฟลเดอร์ backend แล้วรัน `npm start`

- รันแอป Agent Desktop (Electron)
  - ที่โฟลเดอร์นี้: `npm run electron-dev`
  - จะเปิด React dev server แล้วเด้ง Electron app ขึ้นมาอัตโนมัติ

- การเข้าสู่ระบบ
  - กรอก Agent Code เช่น `AG001` แล้วกด Sign In (มี `Remember me`)
  - มุมซ้ายบนจะแสดงแถบสถานะการเชื่อมต่อ “Connected/Disconnected/Error”

- การเปลี่ยนสถานะ
  - ใช้ปุ่มสถานะด้านขวาของ Header (Dropdown) หรือคีย์ลัด F2/F3/F4
  - มี Toast แจ้งเตือน และ Floating Status มุมขวาล่างเปลี่ยนสีตามสถานะ
  - ถ้า WebSocket พร้อม จะส่งผ่าน event `update_status`; ถ้าไม่พร้อมจะ fallback ไป HTTP API `/agents/:code/status`

- ข้อความ (Message Center)
  - ตัวกรอง All/Unread/Urgent ที่หัวกล่อง
  - กด ✓ ที่รายการเพื่อ `Mark as Read` (อัปเดตทันที + เรียก API)
  - `Quick Compose` เลือกผู้รับ (เช่น `SP001`) กรอกข้อความ แล้วกด Send → จะลองส่งผ่าน Socket `send_message`, ถ้าไม่ได้จะ fallback ไป HTTP `/messages/send`
  - เมื่อมีข้อความเข้าแบบ real‑time จะขึ้นที่รายการและสามารถเห็น “From: …”, `📢 Broadcast` หรือ `💬 Direct`, เวลาล่าสุด และ Badge ความสำคัญ

- คีย์ลัดที่รองรับ
  - `F2` Available, `F3` Busy, `F4` Break
  - `Ctrl+M` โฟกัส Message Center

**Troubleshooting**
- กดปุ่มสถานะแล้วเมนูไม่ขึ้น:
  - แก้แล้วโดยกันคลิกนอกเมนูด้วย `stopPropagation()` และไม่ปิดเมนูถ้าคลิกภายใน `.status-dropdown`
  - ถ้ายังไม่ขึ้น ให้เช็คว่าแอปรันด้วยสิทธิ์ปกติ ไม่มี overlay UI อื่นบัง และ Console ไม่มี error
- ส่งข้อความไม่ไป:
  - ตรวจให้แน่ใจว่า backend รันและ `REACT_APP_API_URL/REACT_APP_SOCKET_URL` ถูกต้อง
  - ถ้า Socket ไม่ต่อ ระบบยังส่งผ่าน HTTP ได้ (fallback)

**Supervisor (สรุปสิ่งที่เพิ่มในโปรเจกต์ supervisor-dashboard)**
- Metrics Dashboard (5 การ์ด) + Real‑time SLA bar
- Compact Agent Cards 280×180 px (แถบซ้ายสีสถานะ, Hover ยกสูง, ปุ่ม Message)
- Alert Panel (long call, break overtime, sla warning) พร้อมปุ่ม Send/View/Dismiss
- Agent Detail Modal (800×600): Tabs Overview/Performance/Activity + Timeline สถานะล่าสุด
- Advanced Filtering: ค้นหา/ซ่อน Offline/Sort/สลับ Grid/List

**การทดสอบแบบรวดเร็ว**
- Start backend, แล้วเปิด Agent Desktop ด้วย `npm run electron-dev`
- Login → เปลี่ยนสถานะด้วย F2/F3/F4 → เห็น Toast + Floating Status
- ลองส่ง Quick Compose ไปยัง `SP001` → เห็น “Message sent” และรายการเพิ่มทันที

**ข้อควรทราบ/ยังไม่ได้เชื่อมข้อมูลจริง**
- ค่าบางส่วนใน Stats Widget (จำนวนสาย, AHT, CSAT) เป็น placeholder เพื่อโชว์หน้าตาและตำแหน่งแสดงผล สามารถผูกค่า real‑time จาก API/Socket ได้ทันทีเมื่อมีเอ็นด์พอยต์
- รายการผู้รับใน Quick Compose เป็นตัวอย่าง (`SP001`, `AG002`) หากต้องการดึงรายชื่อจริง ให้ชี้ API ที่ต้องการมา (เช่น `/supervisors` หรือ `/agents`)

**โครงสร้างไฟล์ที่เกี่ยวข้อง (Agent Desktop)**
- คอมโพเนนต์หลัก: `src/components/*` (StatusDropdown, MessageCenter, MessagePanel, StatsWidget, FloatingStatus, …)
- บริการเชื่อมต่อ: `src/services/socket.js`, `src/services/api.js`
- สไตล์: `src/styles/tokens.css`, `src/styles/App.css`, `src/styles/components.css`

หากต้องการให้สรุปเป็น PDF/ภาพประกอบ หรือเพิ่ม GIF การใช้งานจริง แจ้งได้ครับ

