/* ============================================================
   TEMPLATE KOMPONEN — definisi setiap komponen wireframe.
   Setiap komponen: cat, label, icon, w, h, style default,
   content default, dan flag acceptsChildren.
   ============================================================ */

export const COMPONENTS = {
  /* ---------------- LAYOUT ---------------- */
  container: { cat:'Layout', label:'Container', icon:'▭', w:280, h:180, acceptsChildren:true,
    style:{ fill:'#ffffff', borderColor:'#d1d5db', borderWidth:1, radius:8 }, content:{} },

  section: { cat:'Layout', label:'Section', icon:'▤', w:300, h:120, acceptsChildren:true,
    style:{ fill:'#f8fafc', borderColor:'#e2e8f0', borderWidth:1, radius:8 }, content:{} },

  divider: { cat:'Layout', label:'Divider', icon:'—', w:240, h:2,
    style:{ fill:'#d1d5db', borderWidth:0, radius:0 }, content:{} },

  spacer: { cat:'Layout', label:'Spacer', icon:'␣', w:160, h:48,
    style:{ fill:'#eff6ff', borderColor:'#93c5fd', borderWidth:1, radius:4 }, content:{} },

  /* ---------------- NAVIGATION ---------------- */
  navbar: { cat:'Navigation', label:'Navbar', icon:'☰', w:360, h:56,
    style:{ fill:'#ffffff', borderColor:'#e5e7eb', borderWidth:1, radius:0 },
    content:{ text:'Brand' } },

  sidebar: { cat:'Navigation', label:'Sidebar', icon:'▥', w:200, h:320,
    style:{ fill:'#ffffff', borderColor:'#e5e7eb', borderWidth:1, radius:8 }, content:{} },

  tabs: { cat:'Navigation', label:'Tabs', icon:'⬓', w:300, h:44,
    style:{ fill:'#ffffff', borderColor:'#e5e7eb', borderWidth:1, radius:8 }, content:{} },

  breadcrumb: { cat:'Navigation', label:'Breadcrumb', icon:'›', w:260, h:24,
    style:{ fill:'none', borderWidth:0, radius:0, fontSize:12, color:'#6b7280' }, content:{} },

  /* ---------------- FORM ---------------- */
  input: { cat:'Form', label:'Input', icon:'▭', w:260, h:66,
    style:{ fill:'none', borderWidth:0, radius:0 },
    content:{ label:'Email', placeholder:'you@example.com', helper:'' } },

  textarea: { cat:'Form', label:'Textarea', icon:'▤', w:260, h:112,
    style:{ fill:'none', borderWidth:0, radius:0 },
    content:{ label:'Message', placeholder:'Write something…' } },

  select: { cat:'Form', label:'Select', icon:'⌄', w:260, h:66,
    style:{ fill:'none', borderWidth:0, radius:0 },
    content:{ label:'Country', placeholder:'Select an option' } },

  checkbox: { cat:'Form', label:'Checkbox', icon:'☑', w:190, h:24,
    style:{ fill:'none', borderWidth:0, radius:0, fontSize:13 },
    content:{ text:'Checkbox label', checked:true } },

  radio: { cat:'Form', label:'Radio', icon:'◉', w:190, h:24,
    style:{ fill:'none', borderWidth:0, radius:0, fontSize:13 },
    content:{ text:'Radio option', checked:true } },

  button: { cat:'Form', label:'Button', icon:'▬', w:132, h:40,
    style:{ fill:'#3b82f6', borderWidth:0, radius:8, color:'#ffffff', fontSize:13,
            fontWeight:'600', textAlign:'center' },
    content:{ text:'Button' } },

  toggle: { cat:'Form', label:'Toggle', icon:'⏻', w:170, h:24,
    style:{ fill:'none', borderWidth:0, radius:0, fontSize:13 },
    content:{ text:'Toggle', checked:true } },

  /* ---------------- DISPLAY ---------------- */
  card: { cat:'Display', label:'Card', icon:'▢', w:240, h:200,
    style:{ fill:'#ffffff', borderColor:'#e5e7eb', borderWidth:1, radius:10, shadow:'sm' },
    content:{ title:'Card title', desc:'Short description of the card content goes here.' } },

  avatar: { cat:'Display', label:'Avatar', icon:'◯', w:48, h:48,
    style:{ fill:'#dbeafe', borderWidth:0, radius:999, textAlign:'center' },
    content:{ text:'AB' } },

  badge: { cat:'Display', label:'Badge', icon:'●', w:60, h:20,
    style:{ fill:'#dbeafe', color:'#1d4ed8', borderWidth:0, radius:999, fontSize:11,
            fontWeight:'700', textAlign:'center' },
    content:{ text:'Badge' } },

  chip: { cat:'Display', label:'Chip', icon:'◖', w:92, h:28,
    style:{ fill:'#f1f5f9', borderColor:'#e2e8f0', borderWidth:1, radius:999,
            fontSize:12, textAlign:'center' },
    content:{ text:'Chip' } },

  image: { cat:'Display', label:'Image', icon:'🖼', w:200, h:140,
    style:{ fill:'#f1f5f9', borderColor:'#e2e8f0', borderWidth:1, radius:8 }, content:{} },

  icon: { cat:'Display', label:'Icon', icon:'★', w:34, h:34,
    style:{ fill:'none', borderWidth:0, radius:0, color:'#3b82f6', textAlign:'center' },
    content:{ text:'★' } },

  /* ---------------- TYPOGRAPHY ---------------- */
  h1: { cat:'Typography', label:'Heading H1', icon:'H1', w:320, h:46,
    style:{ fill:'none', borderWidth:0, radius:0, fontSize:32, fontWeight:'700', color:'#0f172a' },
    content:{ text:'Heading 1' } },

  h2: { cat:'Typography', label:'Heading H2', icon:'H2', w:300, h:38,
    style:{ fill:'none', borderWidth:0, radius:0, fontSize:24, fontWeight:'700', color:'#0f172a' },
    content:{ text:'Heading 2' } },

  h3: { cat:'Typography', label:'Heading H3', icon:'H3', w:280, h:32,
    style:{ fill:'none', borderWidth:0, radius:0, fontSize:19, fontWeight:'600', color:'#0f172a' },
    content:{ text:'Heading 3' } },

  paragraph: { cat:'Typography', label:'Paragraph', icon:'¶', w:320, h:64,
    style:{ fill:'none', borderWidth:0, radius:0, fontSize:14, color:'#475569' },
    content:{ text:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.' } },

  label: { cat:'Typography', label:'Label', icon:'A', w:120, h:20,
    style:{ fill:'none', borderWidth:0, radius:0, fontSize:13, fontWeight:'600', color:'#111827' },
    content:{ text:'Label' } },

  caption: { cat:'Typography', label:'Caption', icon:'a', w:160, h:18,
    style:{ fill:'none', borderWidth:0, radius:0, fontSize:11, color:'#94a3b8' },
    content:{ text:'Caption text' } },

  /* ---------------- FEEDBACK ---------------- */
  alert: { cat:'Feedback', label:'Alert', icon:'!', w:300, h:74,
    style:{ fill:'#fffbeb', borderColor:'#fde68a', borderWidth:1, radius:8 },
    content:{ title:'Heads up', text:'This is an informational alert message.' } },

  toast: { cat:'Feedback', label:'Toast', icon:'▬', w:230, h:44,
    style:{ fill:'#111827', color:'#ffffff', borderWidth:0, radius:10, shadow:'lg' },
    content:{ text:'Saved successfully' } },

  modal: { cat:'Feedback', label:'Modal', icon:'▣', w:320, h:220,
    style:{ fill:'#ffffff', borderColor:'#e5e7eb', borderWidth:1, radius:12, shadow:'lg' },
    content:{ title:'Modal title', text:'Modal body content goes here. Ask the user something.' } }
};

/** Field konten contextual per tipe komponen */
export const CONTENT_FIELDS = {
  navbar:   [{ key:'text', label:'Brand text' }],
  button:   [{ key:'text', label:'Label' }],
  input:    [{ key:'label', label:'Label' }, { key:'placeholder', label:'Placeholder' }, { key:'helper', label:'Helper text' }],
  textarea: [{ key:'label', label:'Label' }, { key:'placeholder', label:'Placeholder' }],
  select:   [{ key:'label', label:'Label' }, { key:'placeholder', label:'Placeholder' }],
  checkbox: [{ key:'text', label:'Label' }, { key:'checked', label:'Checked', type:'bool' }],
  radio:    [{ key:'text', label:'Label' }, { key:'checked', label:'Checked', type:'bool' }],
  toggle:   [{ key:'text', label:'Label' }, { key:'checked', label:'Checked', type:'bool' }],
  card:     [{ key:'title', label:'Title' }, { key:'desc', label:'Description', type:'area' }],
  avatar:   [{ key:'text', label:'Initials' }],
  badge:    [{ key:'text', label:'Text' }],
  chip:     [{ key:'text', label:'Text' }],
  icon:     [{ key:'text', label:'Glyph' }],
  h1:       [{ key:'text', label:'Text', type:'area' }],
  h2:       [{ key:'text', label:'Text', type:'area' }],
  h3:       [{ key:'text', label:'Text', type:'area' }],
  paragraph:[{ key:'text', label:'Text', type:'area' }],
  label:    [{ key:'text', label:'Text' }],
  caption:  [{ key:'text', label:'Text' }],
  alert:    [{ key:'title', label:'Title' }, { key:'text', label:'Message', type:'area' }],
  toast:    [{ key:'text', label:'Message' }],
  modal:    [{ key:'title', label:'Title' }, { key:'text', label:'Body', type:'area' }]
};
