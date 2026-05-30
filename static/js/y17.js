        new Vue({
            el: '#app',
            data() {
                return {tabIndex: 0,
                    sealName: '认证章',
                    dataURL: '', // 图片地址
                    color: 'rgb(255, 0, 0)', // 印章颜色
                    predefineColors: [
                      '#f00',
                      'rgba(0, 0, 255, 1)',
                      '#ffd700',
                      '#90ee90',
                      '#00ced1',
                      '#1e90ff',
                      '#c71585',
                      'rgba(255, 69, 0, 0.68)',
                      'rgb(255, 120, 0)',
                      'hsv(51, 100, 98)',
                      'hsva(120, 40, 94, 0.5)',
                      'hsl(181, 100%, 37%)',
                      'hsla(209, 100%, 56%, 0.73)',
                      '#c7158577'
                    ],
                    userVipOverplus: '', // 剩余点数
                    noisy: 95, // 噪点
                    noisyRadio: false, // 是否选择了噪点
                    useKtnum: 1, // 扣费点数
                    
                    activeName: 'first',
                    options01: [
                        {value: '/common/images/renzhengSeal01.png',label: 'CMA计量认证'},
                        {value: '/common/images/renzhengSeal02.png',label: 'CAL资质认证'},
                        {value: '/common/images/renzhengSeal03.png',label: 'QS质量安全'},
                        {value: '/common/images/renzhengSeal04.png',label: 'HF保健食品'}
                    ],
                    selectSeal: 'CMA计量认证',
                    selectSealUrl: '/common/images/renzhengSeal01.png',
                    // 印章大小
                    sealSize: [
                        {size: 80},
                        {size: 100},
                        {size: 160},
                        {size: 240},
                        {size: 320},
                        {size: 400},
                    ],
                    sealSize04: 240,
                    sealScale04: 1.5,
                };
            },
            methods: {
				onTab(index){
					console.log(index) 
					this.tabIndex = index 
					},
                yuebuzhu(status) {
                    if (status == 'noLogin') {
                        this.$notify.warning({
                            title: '消息提示',
                            message: '请登录后操作'
                        });
                        return
                    }
                    this.$notify.warning({
                        title: '消息提示',
                        message: '余额不足请充值'
                    });
                },
                // 设置参数时，更新canvas内容
                setChange(value) {
                    let that = this
                    that.createSealEx2()
                },
                // 设置尺寸大小时，计算出相应的倍数
                sizeChange() {
                    this.sealScale04 = this.sealSize04 / 160
                    this.setChange()
                },
                colorPicker(e){
                    // console.log('确认后的颜色',e)
                    // 如果选择颜色时选择了清空，color=null，会导致报错
                    // 并且canvas改变图片颜色会导致有锯齿，所以在清空时直接重新绘制图片
                    if(e == null){
                        this.color = "rgb(255, 0, 0)"
                        this.createSealEx2()
                        return
                    }
                    var canvas = document.getElementById('canvas');
                    var context = canvas.getContext('2d');
                    
                    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    var data = imageData.data;
                    // console.log('像素数据',data)
                    for (var i = 0; i < data.length; i += 4) {
                        var r = data[i];
                        var g = data[i + 1];
                        var b = data[i + 2];
                        var a = data[i + 3];
                        // 提取印章颜色R,G,B值
                        var rgb = this.extractRGBValues(this.color)
                        // 匹配当前canvas上存在的颜色，再进行修改
                        // 根据需要的老化效果修改像素值
                        if(data[i + 3] != 0){ // 匹配所有有颜色的像素点
                            data[i] = rgb[0];
                            data[i + 1] = rgb[1];
                            data[i + 2] = rgb[2];
                            data[i + 3] = 255; // 修改透明度通道
                        }
                    }
                    // 将处理过后的数据再返回到画布上
                    context.putImageData(imageData, 0, 0);
                    this.dataURL = canvas.toDataURL('image/png');
                },
                changeSeal(e) {
                    // console.log('绘制的图片地址',e)
                    const eve = e.match(/\d+/g); // 使用正则表达式获取到地址里的数字，进行判断
                    // 给每张图分配到自己本身的颜色，用于添加噪点时使用
                    if(eve[0] == '01' || eve[0] == '02'){
                        this.color = 'rgb(255, 0, 0)'
                    }else if(eve[0] == '03'){
                        this.color = 'rgb(51,51,153)'
                    }else{
                        this.color = 'rgb(0,102,204)'
                    }
                    this.selectSealUrl = e
                    this.createSealEx2()
                },
                // 绘制中文印章
                createSealEx2() {
                    var sealdiv = document.getElementById("sealdiv"); // 预览
                    sealdiv.innerHTML = `<div class="relative">
                            <canvas id='canvas' class='cSeal' width='${this.sealSize04}' height='${this.sealSize04}'></canvas>
                            <div class="absolute flex flex-wrap" style="user-select: none;pointer-events: none;width: 100%;height: 100%;top: 0;z-index: 999;color: rgba(127,127,127,.4);font-size: ${16*this.sealScale04}px;">
                                <p class="whitespace-nowrap flex justify-center items-center" style="width: 50%;height: 50%;transform: rotate(45deg);">
                                    下载透明无水印
                                </p>
                                <p class="whitespace-nowrap flex justify-center items-center" style="width: 50%;height: 50%;transform: rotate(45deg);">
                                    下载透明无水印
                                </p>
                                <p class="whitespace-nowrap flex justify-center items-center" style="width: 50%;height: 50%;transform: rotate(45deg);">
                                    下载透明无水印
                                </p>
                                <p class="whitespace-nowrap flex justify-center items-center" style="width: 50%;height: 50%;transform: rotate(45deg);">
                                    下载透明无水印
                                </p>
                            </div>
                        </div>`;
                    this.createSealCN('canvas', this.selectSealUrl);
                },
                // 是否选择了噪点
                isnoisyRadio() {
                    this.createSealEx2()
                },
                // 提取印章颜色R,G,B值
                extractRGBValues(rgbString) {
                    const values = rgbString.match(/\d+/g); // 使用正则表达式匹配所有的数字
                    return values;
                },
                // 绘制噪点
                drawNoisy(ctx,canvas) {
                    // 选择了噪点才绘制
                    if(this.noisyRadio){
                        // 优化后的噪点算法，仅在有颜色的部分绘制噪点。
                        // 获取canvas上的像素点颜色数据
                        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        var data = imageData.data;
                        for (var i = 0; i < data.length; i += parseInt(Math.random()*(4 + this.noisy/10*this.sealScale04))) {
                            var r = data[i];
                            var g = data[i + 1];
                            var b = data[i + 2];
                            var a = data[i + 3];
                            // 提取印章颜色R,G,B值
                            var rgb = this.extractRGBValues(this.color)
                            // 匹配当前canvas上存在的颜色，再进行修改
                            // 根据需要的老化效果修改像素值
                            if(r==rgb[0] && g==rgb[1] && b==rgb[2]){
                                data[i] = rgb[0];
                                data[i + 1] = rgb[1];
                                data[i + 2] = rgb[2];
                                data[i + 3] = parseInt(Math.random()*255); // 修改透明度通道
                            }
                        }
                        // 将处理过后的数据再返回到画布上
                        ctx.putImageData(imageData, 0, 0);
                    }
                },
                // 中文印章
                createSealCN(id,url){
                    var canvas = document.getElementById(id);
                    var context = canvas.getContext('2d');
                    let that = this
                    const img = new Image();
                    img.onload = function() {
                        context.drawImage(img, 0, 0, canvas.width, canvas.height);
                        that.drawNoisy(context,canvas);
                        that.dataURL = canvas.toDataURL('image/png');
                    };
                    img.src = url;
                },
                // 下载印章
                downSeal() {
                    if (this.dataURL) {
                        var a = document.createElement('a');
                        a.href = this.dataURL;
                        a.download = '印章.png';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    } else {
                        this.$message.error('请先生成印章！');
                    }
                },
            },
            mounted() {
                let that = this
                that.createSealEx2()
            }
        })