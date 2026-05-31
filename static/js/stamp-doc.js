/**
 * 盖章功能 - 上传文档/图片，叠加印章，导出
 * 用于印章生成器所有36个页面
 */
(function(window, $) {
  'use strict';

  // ============ DOM 结构 ============
  var STAMP_MODAL_HTML = [
    '<div id="stampModal" class="stamp-modal" style="display:none;">',
      '<div class="stamp-modal-backdrop" onclick="closeStampModal()"></div>',
      '<div class="stamp-modal-content">',
        // 顶部栏
        '<div class="stamp-topbar">',
          '<span class="stamp-topbar-title">盖章</span>',
          '<button class="stamp-btn-close" onclick="closeStampModal()">&times;</button>',
        '</div>',
        // 工作区
        '<div class="stamp-workspace" id="stampWorkspace">',
          // 上传区域（初始显示）
          '<div class="stamp-upload-area" id="stampUploadArea">',
            '<div class="stamp-upload-zone" id="stampUploadZone">',
              '<div class="stamp-upload-icon">',
                '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#86868B" stroke-width="1.5" stroke-linecap="round">',
                  '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>',
                  '<polyline points="17 8 12 3 7 8"/>',
                  '<line x1="12" y1="3" x2="12" y2="15"/>',
                '</svg>',
              '</div>',
              '<div class="stamp-upload-text">拖拽文件到此处，或<span class="stamp-upload-link" id="stampUploadLink">点击上传</span></div>',
              '<div class="stamp-upload-hint">支持 JPG、PNG、WebP 图片</div>',
              '<input type="file" id="stampFileInput" accept="image/*" style="display:none;">',
            '</div>',
          '</div>',
          // 文档+印章显示区（上传后显示）
          '<div class="stamp-doc-viewer" id="stampDocViewer" style="display:none;">',
            '<img id="stampDocImage" class="stamp-doc-image" src="" alt="文档">',
            '<div class="stamp-overlay" id="stampOverlay">',
              '<img id="stampSealImage" class="stamp-seal" src="" alt="印章" draggable="false">',
              // 变换控制手柄
              '<div class="stamp-handle stamp-handle-tl" data-dir="nw"></div>',
              '<div class="stamp-handle stamp-handle-tr" data-dir="ne"></div>',
              '<div class="stamp-handle stamp-handle-bl" data-dir="sw"></div>',
              '<div class="stamp-handle stamp-handle-br" data-dir="se"></div>',
              '<div class="stamp-handle stamp-handle-rotate" data-dir="rotate"></div>',
            '</div>',
          '</div>',
        '</div>',
        // 底部控制栏
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

  var STAMP_MODAL_CSS = [
    '<style id="stampModalCSS">',
    '.stamp-modal{position:fixed;top:0;left:0;width:100%;height:100%;z-index:10000;display:flex;align-items:center;justify-content:center;}',
    '.stamp-modal-backdrop{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);}',
    '.stamp-modal-content{position:relative;width:92vw;height:90vh;max-width:1200px;background:#fff;border-radius:16px;box-shadow:0 25px 80px rgba(0,0,0,.25);display:flex;flex-direction:column;overflow:hidden;}',
    '.stamp-topbar{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid #E5E5EA;flex-shrink:0;}',
    '.stamp-topbar-title{font-size:16px;font-weight:600;color:#1D1D1F;}',
    '.stamp-btn-close{background:none;border:none;font-size:24px;color:#86868B;cursor:pointer;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:8px;transition:.15s;}',
    '.stamp-btn-close:hover{background:#F0F0F5;color:#1D1D1F;}',
    '.stamp-workspace{flex:1;min-height:0;position:relative;background:#F2F2F7;display:flex;align-items:center;justify-content:center;overflow:hidden;}',
    '.stamp-upload-area{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;}',
    '.stamp-upload-zone{width:420px;padding:48px 32px;border:2px dashed #D2D2D7;border-radius:16px;text-align:center;cursor:pointer;transition:.2s;background:#fff;}',
    '.stamp-upload-zone:hover,.stamp-upload-zone.drag-over{border-color:#0071E3;background:#F5F9FF;}',
    '.stamp-upload-icon{margin-bottom:16px;}',
    '.stamp-upload-text{font-size:15px;color:#1D1D1F;margin-bottom:8px;}',
    '.stamp-upload-link{color:#0071E3;cursor:pointer;text-decoration:underline;}',
    '.stamp-upload-hint{font-size:12px;color:#AEAEB2;}',
    '.stamp-doc-viewer{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;overflow:hidden;}',
    '.stamp-doc-image{max-width:90%;max-height:90%;object-fit:contain;box-shadow:0 4px 20px rgba(0,0,0,.12);border-radius:4px;user-select:none;-webkit-user-drag:none;}',
    '.stamp-overlay{position:absolute;cursor:move;user-select:none;}',
    '.stamp-seal{width:100%;height:100%;display:block;pointer-events:none;mix-blend-mode:multiply;opacity:.85;}',
    '.stamp-handle{position:absolute;width:12px;height:12px;background:#fff;border:2px solid #0071E3;border-radius:3px;z-index:10;}',
    '.stamp-handle:hover{background:#0071E3;}',
    '.stamp-handle-tl{top:-6px;left:-6px;cursor:nw-resize;}',
    '.stamp-handle-tr{top:-6px;right:-6px;cursor:ne-resize;}',
    '.stamp-handle-bl{bottom:-6px;left:-6px;cursor:sw-resize;}',
    '.stamp-handle-br{bottom:-6px;right:-6px;cursor:se-resize;}',
    '.stamp-handle-rotate{top:-28px;left:50%;transform:translateX(-50%);width:16px;height:16px;border-radius:50%;cursor:grab;background:#0071E3;border:none;}',
    '.stamp-handle-rotate:after{content:"";position:absolute;top:100%;left:50%;transform:translateX(-50%);width:2px;height:12px;background:#0071E3;}',
    '.stamp-bottombar{display:flex;align-items:center;justify-content:space-between;padding:10px 20px;border-top:1px solid #E5E5EA;flex-shrink:0;flex-wrap:wrap;gap:8px;}',
    '.stamp-bottombar-left{flex:1;min-width:0;}',
    '.stamp-hint{font-size:11px;color:#AEAEB2;}',
    '.stamp-bottombar-right{display:flex;gap:8px;}',
    '.stamp-btn{padding:8px 18px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;border:none;font-family:inherit;transition:.15s;}',
    '.stamp-btn-export{background:#0071E3;color:#fff;}',
    '.stamp-btn-export:hover{background:#0066CC;}',
    '.stamp-btn-export:disabled{background:#AEAEB2;cursor:not-allowed;}',
    '.stamp-btn-cancel{background:#F0F0F5;color:#6E6E73;}',
    '.stamp-btn-cancel:hover{background:#E5E5EA;}',
    '.stamp-btn-reset{background:#F0F0F5;color:#6E6E73;}',
    '.stamp-btn-reset:hover{background:#E5E5EA;}',
    '@media(max-width:768px){',
      '.stamp-modal-content{width:96vw;height:85vh;border-radius:12px;}',
      '.stamp-upload-zone{width:90%;padding:32px 16px;}',
      '.stamp-bottombar{flex-direction:column;align-items:stretch;}',
      '.stamp-bottombar-right{justify-content:flex-end;}',
    '}',
    '</style>'
  ].join('');

  // ============ 初始化 DOM ============
  function initDOM() {
    if (document.getElementById('stampModal')) return;
    // 注入CSS
    document.head.insertAdjacentHTML('beforeend', STAMP_MODAL_CSS);
    // 注入HTML
    document.body.insertAdjacentHTML('beforeend', STAMP_MODAL_HTML);

    // 绑定事件
    var uploadZone = document.getElementById('stampUploadZone');
    var fileInput = document.getElementById('stampFileInput');
    var uploadLink = document.getElementById('stampUploadLink');

    uploadZone.addEventListener('click', function() { fileInput.click(); });
    if (uploadLink) uploadLink.addEventListener('click', function(e) { e.stopPropagation(); fileInput.click(); });
    fileInput.addEventListener('change', function(e) { handleFiles(e.target.files); });

    // 拖拽事件
    uploadZone.addEventListener('dragover', function(e) { e.preventDefault(); this.classList.add('drag-over'); });
    uploadZone.addEventListener('dragleave', function() { this.classList.remove('drag-over'); });
    uploadZone.addEventListener('drop', function(e) { e.preventDefault(); this.classList.remove('drag-over'); handleFiles(e.dataTransfer.files); });

    // 导出按钮
    document.getElementById('stampBtnExport').addEventListener('click', exportResult);

    // 重置按钮
    document.getElementById('stampBtnReset').addEventListener('click', resetStampPosition);

    // 初始化印章拖拽
    initStampDragging();

    // 全局拖拽支持（拖到浏览器窗口也能触发上传）
    document.addEventListener('dragover', function(e) { e.preventDefault(); });
    document.addEventListener('drop', function(e) { e.preventDefault(); });
  }

  // ============ 文件处理 ============
  var uploadedFile = null;

  function handleFiles(files) {
    if (!files || files.length === 0) return;
    var file = files[0];
    // 只支持图片
    if (!file.type.match(/^image\//)) {
      alert('目前仅支持图片格式（JPG、PNG、WebP）');
      return;
    }
    uploadedFile = file;
    var reader = new FileReader();
    reader.onload = function(e) {
      var docImage = document.getElementById('stampDocImage');
      docImage.src = e.target.result;
      docImage.onload = function() {
        // 显示文档查看器
        document.getElementById('stampUploadArea').style.display = 'none';
        document.getElementById('stampDocViewer').style.display = 'flex';
        document.getElementById('stampBtnExport').style.display = '';
        document.getElementById('stampBtnReset').style.display = '';
        // 放置印章
        placeStampOnDoc();
      };
    };
    reader.readAsDataURL(file);
  }

  // ============ 印章放置 ============
  function placeStampOnDoc() {
    var canvas = document.querySelector('#canvas');
    if (!canvas) return;

    // 获取印章图片
    var sealDataUrl = canvas.toDataURL('image/png');
    var sealImg = document.getElementById('stampSealImage');
    sealImg.src = sealDataUrl;

    var overlay = document.getElementById('stampOverlay');
    var docImg = document.getElementById('stampDocImage');
    var viewer = document.getElementById('stampDocViewer');

    // 计算印章默认大小和位置（约为文档区域的 25%）
    var docRect = docImg.getBoundingClientRect();
    var viewerRect = viewer.getBoundingClientRect();
    var sealSize = Math.min(docRect.width, docRect.height) * 0.25;
    sealSize = Math.max(sealSize, 80);
    sealSize = Math.min(sealSize, 250);

    // 将印章放在文档右下角
    var left = (docRect.left - viewerRect.left) + docRect.width * 0.65;
    var top = (docRect.top - viewerRect.top) + docRect.height * 0.55;

    overlay.style.width = sealSize + 'px';
    overlay.style.height = sealSize + 'px';
    overlay.style.left = left + 'px';
    overlay.style.top = top + 'px';

    // 存储初始状态
    stampState = {
      x: left,
      y: top,
      w: sealSize,
      h: sealSize,
      rotation: -15,
      scale: 1
    };
    applyStampTransform();

    // 标记已放置
    overlay.setAttribute('data-placed', 'true');
  }

  // ============ 印章变换状态 ============
  var stampState = { x: 0, y: 0, w: 150, h: 150, rotation: -15, scale: 1 };
  var isDragging = false;
  var isResizing = false;
  var isRotating = false;
  var dragStartX, dragStartY, dragInitX, dragInitY, dragInitW, dragInitH, dragInitRot;
  var resizeDir = '';

  function applyStampTransform() {
    var overlay = document.getElementById('stampOverlay');
    if (!overlay) return;
    overlay.style.left = stampState.x + 'px';
    overlay.style.top = stampState.y + 'px';
    overlay.style.width = stampState.w + 'px';
    overlay.style.height = stampState.h + 'px';
    overlay.style.transform = 'rotate(' + stampState.rotation + 'deg)';
    overlay.style.transformOrigin = 'center center';
  }

  function resetStampPosition() {
    placeStampOnDoc();
  }

  function initStampDragging() {
    var overlay = document.getElementById('stampOverlay');
    if (!overlay) return;

    // 主体拖拽
    overlay.addEventListener('mousedown', function(e) {
      if (e.target.classList.contains('stamp-handle')) return; // 手柄不参与拖拽
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragInitX = stampState.x;
      dragInitY = stampState.y;
      e.preventDefault();
    });

    // 手柄事件
    document.querySelectorAll('.stamp-handle').forEach(function(handle) {
      handle.addEventListener('mousedown', function(e) {
        var dir = this.getAttribute('data-dir');
        if (dir === 'rotate') {
          isRotating = true;
          dragStartX = e.clientX;
          dragStartY = e.clientY;
          dragInitRot = stampState.rotation;
        } else {
          isResizing = true;
          resizeDir = dir;
          dragStartX = e.clientX;
          dragStartY = e.clientY;
          dragInitX = stampState.x;
          dragInitY = stampState.y;
          dragInitW = stampState.w;
          dragInitH = stampState.h;
        }
        e.preventDefault();
        e.stopPropagation();
      });
    });

    // 全局鼠标移动
    document.addEventListener('mousemove', function(e) {
      if (isDragging) {
        var dx = e.clientX - dragStartX;
        var dy = e.clientY - dragStartY;
        stampState.x = dragInitX + dx;
        stampState.y = dragInitY + dy;
        applyStampTransform();
      } else if (isResizing) {
        var dx = e.clientX - dragStartX;
        var dy = e.clientY - dragStartY;
        var ratio = dragInitW / dragInitH;
        var signW = resizeDir.indexOf('e') >= 0 ? 1 : -1;
        var signH = resizeDir.indexOf('s') >= 0 ? 1 : -1;
        var newW = Math.max(40, dragInitW + dx * signW);
        var newH = newW / ratio;
        if (resizeDir.indexOf('w') >= 0) stampState.x = dragInitX - (newW - dragInitW);
        if (resizeDir.indexOf('n') >= 0) stampState.y = dragInitY - (newH - dragInitH);
        stampState.w = newW;
        stampState.h = newH;
        applyStampTransform();
      } else if (isRotating) {
        var cx = stampState.x + stampState.w / 2;
        var cy = stampState.y + stampState.h / 2;
        var a1 = Math.atan2(dragStartY - cy, dragStartX - cx);
        var a2 = Math.atan2(e.clientY - cy, e.clientX - cx);
        stampState.rotation = dragInitRot + (a2 - a1) * 180 / Math.PI;
        applyStampTransform();
      }
    });

    document.addEventListener('mouseup', function() {
      isDragging = false;
      isResizing = false;
      isRotating = false;
    });

    // 滚轮缩放和旋转
    document.getElementById('stampDocViewer').addEventListener('wheel', function(e) {
      if (!overlay.getAttribute('data-placed')) return;
      e.preventDefault();
      if (e.shiftKey) {
        // Shift + 滚轮 = 旋转
        stampState.rotation += e.deltaY > 0 ? -5 : 5;
      } else {
        // 滚轮 = 缩放
        var factor = e.deltaY > 0 ? 0.95 : 1.05;
        var newW = Math.max(40, Math.min(500, stampState.w * factor));
        var newH = stampState.h * (newW / stampState.w);
        stampState.x -= (newW - stampState.w) / 2;
        stampState.y -= (newH - stampState.h) / 2;
        stampState.w = newW;
        stampState.h = newH;
      }
      applyStampTransform();
    }, { passive: false });
  }

  // ============ 导出 ============
  function exportResult() {
    var docImg = document.getElementById('stampDocImage');
    var sealImg = document.getElementById('stampSealImage');
    var overlay = document.getElementById('stampOverlay');
    var viewer = document.getElementById('stampDocViewer');

    if (!docImg.complete || !sealImg.complete) {
      alert('图片还在加载中，请稍候...');
      return;
    }

    var exportBtn = document.getElementById('stampBtnExport');
    exportBtn.disabled = true;
    exportBtn.textContent = '正在生成...';

    // 使用临时 canvas 合成
    var canvas = document.createElement('canvas');
    var docNaturalW = docImg.naturalWidth;
    var docNaturalH = docImg.naturalHeight;

    canvas.width = docNaturalW;
    canvas.height = docNaturalH;
    var ctx = canvas.getContext('2d');

    // 绘制文档背景
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制文档图片
    ctx.drawImage(docImg, 0, 0, docNaturalW, docNaturalH);

    // 计算印章在文档原始坐标中的位置和大小
    var docRect = docImg.getBoundingClientRect();
    var viewerRect = viewer.getBoundingClientRect();
    var scaleX = docNaturalW / docRect.width;
    var scaleY = docNaturalH / docRect.height;

    var sealX = (stampState.x - (docRect.left - viewerRect.left)) * scaleX;
    var sealY = (stampState.y - (docRect.top - viewerRect.top)) * scaleY;
    var sealW = stampState.w * scaleX;
    var sealH = stampState.h * scaleY;

    // 绘制印章（带旋转和透明度）
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.translate(sealX + sealW / 2, sealY + sealH / 2);
    ctx.rotate(stampState.rotation * Math.PI / 180);
    ctx.drawImage(sealImg, -sealW / 2, -sealH / 2, sealW, sealH);
    ctx.restore();

    // 下载
    var url = canvas.toDataURL('image/png');
    var a = document.createElement('a');
    a.href = url;
    a.download = '盖章文件_' + new Date().toISOString().slice(0, 10) + '.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    exportBtn.disabled = false;
    exportBtn.textContent = '导出图片';
  }

  // ============ 公共接口 ============
  window.openStampModal = function() {
    var canvas = document.querySelector('#canvas');
    if (!canvas) {
      if (typeof layer !== 'undefined') layer.msg('请先生成印章!');
      else alert('请先生成印章!');
      return;
    }
    // 检查 canvas 是否有内容
    var ctx = canvas.getContext('2d');
    var pixelData = ctx.getImageData(0, 0, 1, 1).data;
    if (pixelData[3] === 0) {
      var hasContent = false;
      var fullData = ctx.getImageData(0, 0, Math.min(canvas.width, 200), Math.min(canvas.height, 200)).data;
      for (var i = 3; i < fullData.length; i += 4) {
        if (fullData[i] > 0) { hasContent = true; break; }
      }
      if (!hasContent) {
        if (typeof layer !== 'undefined') layer.msg('请先生成印章!');
        else alert('请先生成印章!');
        return;
      }
    }
    initDOM();
    document.getElementById('stampModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  window.closeStampModal = function() {
    var modal = document.getElementById('stampModal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
    // 重置状态
    var overlay = document.getElementById('stampOverlay');
    if (overlay) overlay.removeAttribute('data-placed');
    document.getElementById('stampUploadArea').style.display = 'flex';
    document.getElementById('stampDocViewer').style.display = 'none';
    document.getElementById('stampBtnExport').style.display = 'none';
    document.getElementById('stampBtnReset').style.display = 'none';
    uploadedFile = null;
  };

  // 绑定 ESC 关闭
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeStampModal();
  });

})(window, jQuery);
