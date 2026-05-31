/**
 * 盖章功能 v2 - 支持图片/PDF/Word，叠加印章导出
 */
(function(window, $) {
  'use strict';

  // ===== DOM =====
  var HTML = [
    '<div id="stampModal" class="stamp-modal" style="display:none;">',
      '<div class="stamp-modal-backdrop" onclick="closeStampModal()"></div>',
      '<div class="stamp-modal-content">',
        '<div class="stamp-topbar">',
          '<span class="stamp-topbar-title">盖章</span>',
          '<button class="stamp-btn-close" onclick="closeStampModal()">&times;</button>',
        '</div>',
        '<div class="stamp-workspace" id="stampWorkspace">',
          '<div class="stamp-upload-area" id="stampUploadArea">',
            '<div class="stamp-upload-zone" id="stampUploadZone">',
              '<div class="stamp-upload-icon">',
                '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#86868B" stroke-width="1.5" stroke-linecap="round">',
                  '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
                '</svg>',
              '</div>',
              '<div class="stamp-upload-text">拖拽文件到此处，或<span class="stamp-upload-link" id="stampUploadLink">点击上传</span></div>',
              '<div class="stamp-upload-hint" id="stampUploadHint">支持 JPG / PNG / WebP / PDF / Word(.docx)</div>',
              '<input type="file" id="stampFileInput" accept="image/*,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" style="display:none;">',
            '</div>',
          '</div>',
          '<div class="stamp-doc-viewer" id="stampDocViewer" style="display:none;">',
            '<div class="stamp-doc-wrapper" id="stampDocWrapper">',
              '<img id="stampDocImage" class="stamp-doc-image" src="" alt="" style="display:none;">',
              '<canvas id="stampPdfCanvas" class="stamp-doc-canvas" style="display:none;"></canvas>',
              '<div id="stampDocxContent" class="stamp-docx-content" style="display:none;"></div>',
              '<div class="stamp-pdf-nav" id="stampPdfNav" style="display:none;">',
                '<button id="stampPdfPrev" class="stamp-pdf-btn">&lt;</button>',
                '<span id="stampPdfPage">1 / 1</span>',
                '<button id="stampPdfNext" class="stamp-pdf-btn">&gt;</button>',
              '</div>',
            '</div>',
            '<div class="stamp-overlay" id="stampOverlay">',
              '<img id="stampSealImage" class="stamp-seal" src="" alt="" draggable="false">',
              '<div class="stamp-handle stamp-handle-tl" data-dir="nw"></div>',
              '<div class="stamp-handle stamp-handle-tr" data-dir="ne"></div>',
              '<div class="stamp-handle stamp-handle-bl" data-dir="sw"></div>',
              '<div class="stamp-handle stamp-handle-br" data-dir="se"></div>',
              '<div class="stamp-handle stamp-handle-rotate" data-dir="rotate"></div>',
            '</div>',
          '</div>',
        '</div>',
        '<div class="stamp-bottombar">',
          '<div class="stamp-bottombar-left">',
            '<span class="stamp-hint">拖拽移动 | 滚轮缩放 | Shift+滚轮旋转 | 手柄精确调整</span>',
          '</div>',
          '<div class="stamp-bottombar-right">',
            '<button class="stamp-btn stamp-btn-reset" id="stampBtnReset" style="display:none;">重置位置</button>',
            '<button class="stamp-btn stamp-btn-export" id="stampBtnExport" style="display:none;">导出图片</button>',
            '<button class="stamp-btn stamp-btn-cancel" onclick="closeStampModal()">关闭</button>',
          '</div>',
        '</div>',
      '</div>',
    '</div>'
  ].join('');

  var CSS = [
    '<style id="stampModalCSS">',
    '.stamp-modal{position:fixed;top:0;left:0;width:100%;height:100%;z-index:10000;display:flex;align-items:center;justify-content:center}',
    '.stamp-modal-backdrop{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);backdrop-filter:blur(4px)}',
    '.stamp-modal-content{position:relative;width:92vw;height:90vh;max-width:1200px;background:#fff;border-radius:16px;box-shadow:0 25px 80px rgba(0,0,0,.25);display:flex;flex-direction:column;overflow:hidden}',
    '.stamp-topbar{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid #E5E5EA;flex-shrink:0}',
    '.stamp-topbar-title{font-size:16px;font-weight:600;color:#1D1D1F}',
    '.stamp-btn-close{background:none;border:none;font-size:24px;color:#86868B;cursor:pointer;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:8px;transition:.15s}',
    '.stamp-btn-close:hover{background:#F0F0F5;color:#1D1D1F}',
    '.stamp-workspace{flex:1;min-height:0;position:relative;background:#F2F2F7;display:flex;align-items:center;justify-content:center;overflow:hidden}',
    '.stamp-upload-area{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center}',
    '.stamp-upload-zone{width:460px;padding:48px 32px;border:2px dashed #D2D2D7;border-radius:16px;text-align:center;cursor:pointer;transition:.2s;background:#fff}',
    '.stamp-upload-zone:hover,.stamp-upload-zone.drag-over{border-color:#0071E3;background:#F5F9FF}',
    '.stamp-upload-icon{margin-bottom:16px}',
    '.stamp-upload-text{font-size:15px;color:#1D1D1F;margin-bottom:8px}',
    '.stamp-upload-link{color:#0071E3;cursor:pointer;text-decoration:underline}',
    '.stamp-upload-hint{font-size:12px;color:#AEAEB2}',
    '.stamp-doc-viewer{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;overflow:auto}',
    '.stamp-doc-wrapper{position:relative;display:flex;flex-direction:column;align-items:center}',
    '.stamp-doc-image{max-width:90vw;max-height:70vh;object-fit:contain;box-shadow:0 4px 20px rgba(0,0,0,.12);border-radius:4px;user-select:none;-webkit-user-drag:none}',
    '.stamp-doc-canvas{max-width:90vw;max-height:70vh;box-shadow:0 4px 20px rgba(0,0,0,.12);border-radius:4px}',
    '.stamp-docx-content{width:210mm;min-height:297mm;padding:25mm 20mm;background:#fff;box-shadow:0 4px 20px rgba(0,0,0,.12);border-radius:4px;font-size:14px;line-height:1.8;color:#1D1D1F;overflow:auto;max-width:90vw;max-height:70vh}',
    '.stamp-docx-content h1,.stamp-docx-content h2,.stamp-docx-content h3{margin:12px 0 6px}',
    '.stamp-docx-content p{margin:6px 0}',
    '.stamp-docx-content table{border-collapse:collapse;width:100%;margin:8px 0}',
    '.stamp-docx-content td,.stamp-docx-content th{border:1px solid #D2D2D7;padding:4px 8px}',
    '.stamp-pdf-nav{display:flex;align-items:center;gap:12px;margin-top:8px}',
    '.stamp-pdf-btn{background:#fff;border:1px solid #D2D2D7;border-radius:6px;padding:4px 12px;cursor:pointer;font-size:13px;color:#1D1D1F}',
    '.stamp-pdf-btn:hover{background:#F0F0F5}',
    '.stamp-pdf-btn:disabled{opacity:.4;cursor:default}',
    '.stamp-overlay{position:fixed;cursor:move;user-select:none;z-index:10}',
    '.stamp-seal{width:100%;height:100%;display:block;pointer-events:none;mix-blend-mode:multiply;opacity:.85}',
    '.stamp-handle{position:absolute;width:12px;height:12px;background:#fff;border:2px solid #0071E3;border-radius:3px;z-index:10}',
    '.stamp-handle:hover{background:#0071E3}',
    '.stamp-handle-tl{top:-6px;left:-6px;cursor:nw-resize}',
    '.stamp-handle-tr{top:-6px;right:-6px;cursor:ne-resize}',
    '.stamp-handle-bl{bottom:-6px;left:-6px;cursor:sw-resize}',
    '.stamp-handle-br{bottom:-6px;right:-6px;cursor:se-resize}',
    '.stamp-handle-rotate{top:-28px;left:50%;transform:translateX(-50%);width:16px;height:16px;border-radius:50%;cursor:grab;background:#0071E3;border:none}',
    '.stamp-handle-rotate:after{content:"";position:absolute;top:100%;left:50%;transform:translateX(-50%);width:2px;height:12px;background:#0071E3}',
    '.stamp-bottombar{display:flex;align-items:center;justify-content:space-between;padding:10px 20px;border-top:1px solid #E5E5EA;flex-shrink:0;flex-wrap:wrap;gap:8px}',
    '.stamp-bottombar-left{flex:1;min-width:0}',
    '.stamp-hint{font-size:11px;color:#AEAEB2}',
    '.stamp-bottombar-right{display:flex;gap:8px}',
    '.stamp-btn{padding:8px 18px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;border:none;font-family:inherit;transition:.15s}',
    '.stamp-btn-export{background:#0071E3;color:#fff}',
    '.stamp-btn-export:hover{background:#0066CC}',
    '.stamp-btn-export:disabled{background:#AEAEB2;cursor:not-allowed}',
    '.stamp-btn-cancel{background:#F0F0F5;color:#6E6E73}',
    '.stamp-btn-cancel:hover{background:#E5E5EA}',
    '.stamp-btn-reset{background:#F0F0F5;color:#6E6E73}',
    '.stamp-btn-reset:hover{background:#E5E5EA}',
    '@media(max-width:768px){.stamp-modal-content{width:96vw;height:85vh;border-radius:12px}.stamp-upload-zone{width:90%;padding:32px 16px}.stamp-bottombar{flex-direction:column;align-items:stretch}.stamp-bottombar-right{justify-content:flex-end}.stamp-docx-content{width:100%;padding:16px;font-size:12px}.stamp-handle{width:20px;height:20px;border-width:3px}.stamp-handle-tl{top:-10px;left:-10px}.stamp-handle-tr{top:-10px;right:-10px}.stamp-handle-bl{bottom:-10px;left:-10px}.stamp-handle-br{bottom:-10px;right:-10px}.stamp-handle-rotate{top:-36px;width:24px;height:24px}.stamp-handle-rotate:after{height:16px}}',
    '</style>'
  ].join('');

  // ===== Globals =====
  var docType = ''; // 'image', 'pdf', 'docx'
  var pdfDoc = null, pdfPageNum = 1, pdfPageCount = 0;
  var stampState = { x: 0, y: 0, w: 150, h: 150, rotation: -15 };
  var isDragging = false, isResizing = false, isRotating = false;
  var dragStartX, dragStartY, dragInitX, dragInitY, dragInitW, dragInitH, dragInitRot, resizeDir = '';

  // ===== Init =====
  function initDOM() {
    if (document.getElementById('stampModal')) return;
    document.head.insertAdjacentHTML('beforeend', CSS);
    document.body.insertAdjacentHTML('beforeend', HTML);

    var uz = document.getElementById('stampUploadZone');
    var fi = document.getElementById('stampFileInput');
    uz.addEventListener('click', function(){ fi.click(); });
    document.getElementById('stampUploadLink').addEventListener('click', function(e){ e.stopPropagation(); fi.click(); });
    fi.addEventListener('change', function(e){ handleFiles(e.target.files); });
    uz.addEventListener('dragover', function(e){ e.preventDefault(); this.classList.add('drag-over'); });
    uz.addEventListener('dragleave', function(){ this.classList.remove('drag-over'); });
    uz.addEventListener('drop', function(e){ e.preventDefault(); this.classList.remove('drag-over'); handleFiles(e.dataTransfer.files); });
    document.getElementById('stampBtnExport').addEventListener('click', exportResult);
    document.getElementById('stampBtnReset').addEventListener('click', resetStamp);
    document.getElementById('stampPdfPrev').addEventListener('click', function(){ if(pdfPageNum>1) renderPdfPage(pdfPageNum-1); });
    document.getElementById('stampPdfNext').addEventListener('click', function(){ if(pdfPageNum<pdfPageCount) renderPdfPage(pdfPageNum+1); });
    initStampDragging();
    document.addEventListener('dragover', function(e){ e.preventDefault(); });
    document.addEventListener('drop', function(e){ e.preventDefault(); });
  }

  // ===== File Handling =====
  function handleFiles(files) {
    if (!files || !files.length) return;
    var f = files[0];
    var name = f.name.toLowerCase();
    var isPdf = f.type === 'application/pdf' || name.endsWith('.pdf');
    var isDocx = f.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || name.endsWith('.docx');
    var isImg = f.type.match(/^image\//);

    if (!isImg && !isPdf && !isDocx) {
      alert('不支持的文件格式。请上传 JPG/PNG/WebP/PDF/DOCX 文件。');
      return;
    }

    showViewer();
    hideAllDocElements();

    if (isImg) {
      docType = 'image';
      loadImage(f);
    } else if (isPdf) {
      docType = 'pdf';
      loadPdf(f);
    } else if (isDocx) {
      docType = 'docx';
      loadDocx(f);
    }
  }

  function hideAllDocElements() {
    document.getElementById('stampDocImage').style.display = 'none';
    document.getElementById('stampPdfCanvas').style.display = 'none';
    document.getElementById('stampDocxContent').style.display = 'none';
    document.getElementById('stampPdfNav').style.display = 'none';
  }

  function showViewer() {
    document.getElementById('stampUploadArea').style.display = 'none';
    document.getElementById('stampDocViewer').style.display = 'flex';
    document.getElementById('stampBtnExport').style.display = '';
    document.getElementById('stampBtnReset').style.display = '';
  }

  // ---- Image ----
  function loadImage(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var img = document.getElementById('stampDocImage');
      img.src = e.target.result;
      img.style.display = '';
      img.onload = function(){ placeStamp(); };
    };
    reader.readAsDataURL(file);
  }

  // ---- PDF ----
  function loadPdfLib(cb) {
    if (window.pdfjsLib) { cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.min.js';
    s.onload = function() {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
      cb();
    };
    document.head.appendChild(s);
  }

  function loadPdf(file) {
    document.getElementById('stampUploadHint').textContent = '正在解析 PDF...';
    loadPdfLib(function() {
      var reader = new FileReader();
      reader.onload = function(e) {
        pdfjsLib.getDocument({ data: e.target.result }).promise.then(function(pdf) {
          pdfDoc = pdf;
          pdfPageCount = pdf.numPages;
          pdfPageNum = 1;
          document.getElementById('stampUploadHint').textContent = '支持 JPG / PNG / WebP / PDF / Word(.docx)';
          renderPdfPage(1);
        }).catch(function(err) {
          alert('PDF 解析失败: ' + err.message);
          document.getElementById('stampUploadHint').textContent = '支持 JPG / PNG / WebP / PDF / Word(.docx)';
        });
      };
      reader.readAsArrayBuffer(file);
    });
  }

  function renderPdfPage(num) {
    pdfPageNum = num;
    pdfDoc.getPage(num).then(function(page) {
      var scale = 1.5;
      var viewport = page.getViewport({ scale: scale });
      var canvas = document.getElementById('stampPdfCanvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.display = '';
      var ctx = canvas.getContext('2d');
      page.render({ canvasContext: ctx, viewport: viewport }).promise.then(function() {
        document.getElementById('stampPdfNav').style.display = '';
        document.getElementById('stampPdfPage').textContent = num + ' / ' + pdfPageCount;
        document.getElementById('stampPdfPrev').disabled = num <= 1;
        document.getElementById('stampPdfNext').disabled = num >= pdfPageCount;
        placeStamp();
      });
    });
  }

  // ---- DOCX ----
  function loadMammoth(cb) {
    if (window.mammoth) { cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://unpkg.com/mammoth@1.6.0/mammoth.browser.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  // ---- html2canvas ----
  function loadHtml2canvas(cb) {
    if (window.html2canvas) { cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  function loadDocx(file) {
    document.getElementById('stampUploadHint').textContent = '正在解析 Word 文档...';
    loadMammoth(function() {
      var reader = new FileReader();
      reader.onload = function(e) {
        mammoth.convertToHtml({ arrayBuffer: e.target.result }).then(function(result) {
          var div = document.getElementById('stampDocxContent');
          div.innerHTML = result.value;
          div.style.display = '';
          document.getElementById('stampUploadHint').textContent = '支持 JPG / PNG / WebP / PDF / Word(.docx)';
          setTimeout(placeStamp, 200);
        }).catch(function(err) {
          alert('Word 解析失败: ' + err.message);
          document.getElementById('stampUploadHint').textContent = '支持 JPG / PNG / WebP / PDF / Word(.docx)';
        });
      };
      reader.readAsArrayBuffer(file);
    });
  }

  // ===== Stamp Placement =====
  function placeStamp() {
    var sealCanvas = document.querySelector('#canvas');
    if (!sealCanvas) return;
    var sealImg = document.getElementById('stampSealImage');
    sealImg.src = sealCanvas.toDataURL('image/png');

    setTimeout(function() {
      var overlay = document.getElementById('stampOverlay');
      var viewer = document.getElementById('stampDocViewer');
      var viewerRect = viewer.getBoundingClientRect();

      // Get the doc element based on type
      var docEl;
      if (docType === 'image') docEl = document.getElementById('stampDocImage');
      else if (docType === 'pdf') docEl = document.getElementById('stampPdfCanvas');
      else docEl = document.getElementById('stampDocxContent');

      if (!docEl) return;
      var docRect = docEl.getBoundingClientRect();

      var sealSize = Math.min(docRect.width, docRect.height) * 0.25;
      sealSize = Math.max(sealSize, 80);
      sealSize = Math.min(sealSize, 250);

      var left = docRect.left + docRect.width * 0.65;
      var top = docRect.top + docRect.height * 0.55;

      overlay.style.width = sealSize + 'px';
      overlay.style.height = sealSize + 'px';
      overlay.style.left = left + 'px';
      overlay.style.top = top + 'px';

      stampState = { x: left, y: top, w: sealSize, h: sealSize, rotation: -15 };
      applyTransform();
      overlay.setAttribute('data-placed', 'true');
    }, 150);
  }

  function applyTransform() {
    var o = document.getElementById('stampOverlay');
    if (!o) return;
    o.style.left = stampState.x + 'px';
    o.style.top = stampState.y + 'px';
    o.style.width = stampState.w + 'px';
    o.style.height = stampState.h + 'px';
    o.style.transform = 'rotate(' + stampState.rotation + 'deg)';
    o.style.transformOrigin = 'center center';
  }

  function resetStamp() { placeStamp(); }

  // ===== Dragging (Desktop + Mobile Touch) =====
  var pinchDist0 = 0, pinchW0 = 0, pinchH0 = 0, pinchAngle0 = 0, pinchRot0 = 0;
  var pinchCenterX = 0, pinchCenterY = 0;

  function getXY(e) {
    // Get clientX/Y from mouse or touch event
    if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    if (e.changedTouches) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }

  function getDist(t1, t2) {
    var dx = t1.clientX - t2.clientX;
    var dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx*dx + dy*dy);
  }

  function getAngle(t1, t2) {
    return Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX) * 180 / Math.PI;
  }

  function getMidpoint(t1, t2) {
    return { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
  }

  function initStampDragging() {
    var overlay = document.getElementById('stampOverlay');
    var viewer = document.getElementById('stampDocViewer');
    var isTouchDevice = 'ontouchstart' in window;

    // --- Mouse & Single-Touch: move stamp ---
    function onDragStart(e) {
      if (e.target.classList.contains('stamp-handle')) return;
      if (e.touches && e.touches.length > 1) return; // multi-touch handled separately
      var p = getXY(e);
      isDragging = true;
      dragStartX = p.x; dragStartY = p.y;
      dragInitX = stampState.x; dragInitY = stampState.y;
      e.preventDefault();
    }

    overlay.addEventListener('mousedown', onDragStart);
    overlay.addEventListener('touchstart', onDragStart, { passive: false });

    // --- Handle: resize & rotate ---
    document.querySelectorAll('.stamp-handle').forEach(function(h) {
      function onHandleStart(e) {
        if (e.touches && e.touches.length > 1) return;
        var p = getXY(e);
        var d = h.getAttribute('data-dir');
        if (d === 'rotate') {
          isRotating = true;
          dragStartX = p.x; dragStartY = p.y;
          dragInitRot = stampState.rotation;
        } else {
          isResizing = true; resizeDir = d;
          dragStartX = p.x; dragStartY = p.y;
          dragInitX = stampState.x; dragInitY = stampState.y;
          dragInitW = stampState.w; dragInitH = stampState.h;
        }
        e.preventDefault(); e.stopPropagation();
      }
      h.addEventListener('mousedown', onHandleStart);
      h.addEventListener('touchstart', onHandleStart, { passive: false });
    });

    // --- Document-level move (mouse & single touch) ---
    function onMove(e) {
      if (!isDragging && !isResizing && !isRotating) return;
      var p = getXY(e);
      if (isDragging) {
        stampState.x = dragInitX + p.x - dragStartX;
        stampState.y = dragInitY + p.y - dragStartY;
        applyTransform();
      } else if (isResizing) {
        var dx = p.x - dragStartX, dy = p.y - dragStartY;
        var ratio = dragInitW / dragInitH;
        var sw = resizeDir.indexOf('e') >= 0 ? 1 : -1;
        var nw = Math.max(30, dragInitW + dx * sw), nh = nw / ratio;
        if (resizeDir.indexOf('w') >= 0) stampState.x = dragInitX - (nw - dragInitW);
        if (resizeDir.indexOf('n') >= 0) stampState.y = dragInitY - (nh - dragInitH);
        stampState.w = nw; stampState.h = nh;
        applyTransform();
      } else if (isRotating) {
        var cx = stampState.x + stampState.w/2, cy = stampState.y + stampState.h/2;
        var a1 = Math.atan2(dragStartY - cy, dragStartX - cx);
        var a2 = Math.atan2(p.y - cy, p.x - cx);
        stampState.rotation = dragInitRot + (a2 - a1) * 180 / Math.PI;
        applyTransform();
      }
    }

    function onEnd() { isDragging = isResizing = isRotating = false; }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);

    // --- Pinch-to-Zoom & Two-Finger Rotate (Mobile) ---
    viewer.addEventListener('touchstart', function(e) {
      if (!overlay.getAttribute('data-placed')) return;
      if (e.touches.length === 2) {
        var t1 = e.touches[0], t2 = e.touches[1];
        pinchDist0 = getDist(t1, t2);
        pinchW0 = stampState.w; pinchH0 = stampState.h;
        pinchAngle0 = getAngle(t1, t2);
        pinchRot0 = stampState.rotation;
        // Lock the anchor: record pinch center relative to stamp (0-1 ratios)
        var mid = getMidpoint(t1, t2);
        pinchCenterX = (mid.x - stampState.x) / stampState.w;
        pinchCenterY = (mid.y - stampState.y) / stampState.h;
        isDragging = isResizing = isRotating = false;
      }
    }, { passive: false });

    viewer.addEventListener('touchmove', function(e) {
      if (!overlay.getAttribute('data-placed')) return;
      if (e.touches.length === 2 && pinchDist0 > 0) {
        e.preventDefault();
        var t1 = e.touches[0], t2 = e.touches[1];
        var newDist = getDist(t1, t2);
        var scale = newDist / pinchDist0;
        var nw = Math.max(30, Math.min(500, pinchW0 * scale));
        var nh = pinchH0 * (nw / pinchW0);
        // Scale around the locked anchor point
        var mid = getMidpoint(t1, t2);
        stampState.x = mid.x - nw * pinchCenterX;
        stampState.y = mid.y - nh * pinchCenterY;
        stampState.w = nw; stampState.h = nh;
        // Rotation
        var newAngle = getAngle(t1, t2);
        stampState.rotation = pinchRot0 + (newAngle - pinchAngle0);
        applyTransform();
      }
    }, { passive: false });

    viewer.addEventListener('touchend', function(e) {
      if (e.touches.length < 2) { pinchDist0 = 0; }
    });

    // --- Desktop Wheel ---
    viewer.addEventListener('wheel', function(e) {
      if (!overlay.getAttribute('data-placed')) return;
      e.preventDefault();
      if (e.shiftKey) {
        stampState.rotation += e.deltaY > 0 ? -5 : 5;
      } else {
        var f = e.deltaY > 0 ? 0.95 : 1.05;
        var nw = Math.max(30, Math.min(500, stampState.w * f));
        var nh = stampState.h * (nw / stampState.w);
        stampState.x -= (nw - stampState.w) / 2;
        stampState.y -= (nh - stampState.h) / 2;
        stampState.w = nw; stampState.h = nh;
      }
      applyTransform();
    }, { passive: false });
  }

  // ===== Export =====
  function exportResult() {
    var sealImg = document.getElementById('stampSealImage');
    var overlay = document.getElementById('stampOverlay');
    var expBtn = document.getElementById('stampBtnExport');
    expBtn.disabled = true; expBtn.textContent = '正在生成...';

    var srcCanvas, srcW, srcH, srcEl;

    if (docType === 'image') {
      srcEl = document.getElementById('stampDocImage');
      srcW = srcEl.naturalWidth; srcH = srcEl.naturalHeight;
    } else if (docType === 'pdf') {
      srcEl = document.getElementById('stampPdfCanvas');
      srcW = srcEl.width; srcH = srcEl.height;
    } else {
      // DOCX: render the content div to canvas
      srcEl = document.getElementById('stampDocxContent');
      var rect = srcEl.getBoundingClientRect();
      srcW = rect.width; srcH = rect.height;
    }

    var canvas = document.createElement('canvas');
    canvas.width = srcW; canvas.height = srcH;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, srcW, srcH);

    if (docType === 'docx') {
      // Use html2canvas to render DOCX content
      loadHtml2canvas(function() {
        html2canvas(srcEl, { backgroundColor: '#FFFFFF', scale: 2, useCORS: true, logging: false }).then(function(docCanvas) {
          canvas.width = docCanvas.width;
          canvas.height = docCanvas.height;
          ctx.drawImage(docCanvas, 0, 0);
          // Update srcDims for stamp positioning
          srcW = docCanvas.width; srcH = docCanvas.height;
          drawSealAndDownload(ctx, canvas, sealImg, srcEl, srcW, srcH);
        }).catch(function() {
          alert('Word内容渲染失败，请尝试上传PDF或图片格式');
          expBtn.disabled = false; expBtn.textContent = '导出图片';
        });
      });
      return;
    } else {
      // Draw image/PDF content onto canvas
      ctx.drawImage(srcEl, 0, 0, srcW, srcH);
    }

    drawSealAndDownload(ctx, canvas, sealImg, srcEl, srcW, srcH);
  }

  function drawSealAndDownload(ctx, canvas, sealImg, srcEl, srcW, srcH) {
    var srcRect = srcEl.getBoundingClientRect();
    var scaleX = srcW / srcRect.width;
    var scaleY = srcH / srcRect.height;
    var sx = (stampState.x - srcRect.left) * scaleX;
    var sy = (stampState.y - srcRect.top) * scaleY;
    var sw = stampState.w * scaleX;
    var sh = stampState.h * scaleY;

    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.translate(sx + sw/2, sy + sh/2);
    ctx.rotate(stampState.rotation * Math.PI / 180);
    ctx.drawImage(sealImg, -sw/2, -sh/2, sw, sh);
    ctx.restore();

    var a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = '盖章文件_' + new Date().toISOString().slice(0,10) + '.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    var expBtn = document.getElementById('stampBtnExport');
    expBtn.disabled = false; expBtn.textContent = '导出图片';
  }

  // ===== Public API =====
  window.openStampModal = function() {
    var c = document.querySelector('#canvas');
    if (!c) { alert('请先生成印章!'); return; }
    var ctx = c.getContext('2d');
    var hasContent = false;
    try {
      var d = ctx.getImageData(0, 0, Math.min(c.width,200), Math.min(c.height,200)).data;
      for (var i = 3; i < d.length; i += 4) { if (d[i] > 0) { hasContent = true; break; } }
    } catch(e) { hasContent = true; }
    if (!hasContent) { alert('请先生成印章!'); return; }
    initDOM();
    document.getElementById('stampModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  window.closeStampModal = function() {
    var m = document.getElementById('stampModal');
    if (m) m.style.display = 'none';
    document.body.style.overflow = '';
    var ov = document.getElementById('stampOverlay');
    if (ov) ov.removeAttribute('data-placed');
    document.getElementById('stampUploadArea').style.display = 'flex';
    document.getElementById('stampDocViewer').style.display = 'none';
    hideAllDocElements();
    document.getElementById('stampBtnExport').style.display = 'none';
    document.getElementById('stampBtnReset').style.display = 'none';
    pdfDoc = null; pdfPageNum = 1; pdfPageCount = 0; docType = '';
  };

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeStampModal();
  });

})(window, jQuery);
