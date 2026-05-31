        new Vue({
            el: '#app',
            data() {
                return {tabIndex: 0,
                    sealName: '出货专用章',
                    fontList: [
                        {name: '宋体'},
                        {name: '仿宋'},
                        {name: '楷体'},
                        {name: '黑体'},                    ],
                    // 主文字
                    input01: 'XXXXXXXXXXXXX',
                    fontFamily01: '宋体',
                    fontSize01: 32,
                    fontWeight01: 'bold',
                    fontTop01: 0,
                    fontLeft01: 0,
                    // 中心文字
                    input02: '2024-01-01',
                    fontFamily02: '宋体',
                    fontSize02: 28,
                    fontWeight02: 'bold',
                    fontTop02: 0,
                    fontGap02: 0,
                    fontLeft02: 0,
                    // 底部文字
                    input03: '出货专用章',
                    fontFamily03: '宋体',
                    fontSize03: 32,
                    fontWeight03: 'bold',
                    fontTop03: 0,
                    fontLeft03: 0,
                    // 外边线
                    border04: 4,
                    // 印章颜色
                    color05: 'rgb(255, 0, 0)',
                    // 印章大小
                    sealSize: [
                        {size: 120},
                        {size: 180},
                        {size: 240},
                        {size: 360},
                        {size: 480},
                        {size: 600},
                    ],
                    sealSize06: 240,
                    sealScale06: 1,
                    // 印章老化
                    noisy07: 90,
                    checked07: false,
                    
                    userVipOverplus: '', // 剩余点数
                    useKtnum: 1, // 扣费点数

                    dataURL: '',
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
                    this.sealScale06 = this.sealSize06 / 240
                    this.setChange()
                },
                // 绘制中文印章
                createSealEx2() {
                    var sealdiv = document.getElementById("sealdiv"); // 预览
                    sealdiv.innerHTML = `<div class="relative">
                            <canvas id='canvas' class='cSeal' width='${this.sealSize06}' height='${this.sealSize06}'></canvas>
                            <div class="absolute flex flex-wrap" style="user-select: none;pointer-events: none;width: 100%;height: 100%;top: 0;z-index: 999;color: rgba(127,127,127,.4);font-size: ${16*this.sealScale06}px;">
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
                        this.createSealCN('canvas');
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
                    if(this.checked07){
                        // 优化后的噪点算法，仅在有颜色的部分绘制噪点。
                        // 获取canvas上的像素点颜色数据
                        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        var data = imageData.data;
                        for (var i = 0; i < data.length; i += parseInt(Math.random()*(4 + this.noisy07/10*this.sealScale06))) {
                            var r = data[i];
                            var g = data[i + 1];
                            var b = data[i + 2];
                            var a = data[i + 3];
                            // 提取印章颜色R,G,B值
                            var rgb = this.extractRGBValues(this.color05)
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
                createSealCN(id){
                    var canvas = document.getElementById('canvas');
                    var context = canvas.getContext('2d');

                    // 绘制印章边框
                    var width = canvas.width / 2;
                    var height = canvas.height / 2;
                    
                    // 外边线
                    context.lineWidth = this.border04*this.sealScale06;
                    context.strokeStyle = this.color05;
                    context.beginPath();
                    context.rect(5*this.sealScale06,50*this.sealScale06,230*this.sealScale06,140*this.sealScale06);  // 定义矩形（x, y, 宽度, 高度）
                    context.stroke();
                    context.save();
                    
                    // 横线
                    context.lineWidth = 2*this.sealScale06;
                    context.beginPath();
                    context.moveTo(5*this.sealScale06, 96*this.sealScale06);
                    context.lineTo(235*this.sealScale06, 96*this.sealScale06);
                    context.moveTo(5*this.sealScale06, 143*this.sealScale06);
                    context.lineTo(235*this.sealScale06, 143*this.sealScale06);
                    context.stroke();
                            
                    // 上文字
                    context.font = this.fontWeight01 + ' ' + this.fontSize01*this.sealScale06 + 'px ' + this.fontFamily01
                    context.fillStyle = this.color05;
                    context.fillText(this.input01, width - 108*this.sealScale06 + this.fontLeft01*this.sealScale06, height - 33*this.sealScale06 + this.fontTop01*this.sealScale06);
                    // 中心文字
                    context.font = this.fontWeight02 + ' ' + this.fontSize02*this.sealScale06 + 'px ' + this.fontFamily02
                    context.fillText(this.input02, width - 57*this.sealScale06 + this.fontLeft02*this.sealScale06, height + 11 *this.sealScale06 + this.fontTop02*this.sealScale06,117*this.sealScale06+this.fontGap02);
                    // 下文字
                    context.font = this.fontWeight03 + ' ' + this.fontSize03*this.sealScale06 + 'px ' + this.fontFamily03
                    context.fillText(this.input03, width - 84*this.sealScale06 + this.fontLeft03*this.sealScale06, height + 59*this.sealScale06 + this.fontTop03*this.sealScale06);
                    
                    // 在绘制噪点之前，需要先恢复到之前保存的状态，否则噪点的原点将是canvas的中心点
                    context.restore();
                    this.drawNoisy(context, canvas);
                    this.dataURL = canvas.toDataURL('image/png');
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