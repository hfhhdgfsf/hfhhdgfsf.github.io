        new Vue({
            el: '#app',
            data() {
                return {tabIndex: 0,
                    sealName: '方形印章',
                    fontList: [
                        {name: '宋体'},
                        {name: '仿宋'},
                        {name: '楷体'},
                        {name: '黑体'},                    ],
                    // 第一个字
                    input01: '方',
                    fontFamily01: '宋体',
                    fontSize01: 60,
                    fontWeight01: 'bold',
                    fontTop01: 0,
                    fontLeft01: 0,
                    // 第二个字
                    input02: '形',
                    fontFamily02: '宋体',
                    fontSize02: 60,
                    fontWeight02: 'bold',
                    fontTop02: 0,
                    fontLeft02: 0,
                    // 第三个字
                    input03: '之',
                    fontFamily03: '宋体',
                    fontSize03: 60,
                    fontWeight03: 'bold',
                    fontTop03: 0,
                    fontLeft03: 0,
                    // 第四个字
                    input04: '印',
                    fontFamily04: '宋体',
                    fontSize04: 60,
                    fontWeight04: 'bold',
                    fontTop04: 0,
                    fontLeft04: 0,
                    // 外边线
                    border05: 6,
                    // 印章颜色
                    color06: 'rgb(255,0,0)',
                    // 印章大小
                    sealSize: [
                        {size: 80},
                        {size: 128},
                        {size: 160},
                        {size: 240},
                        {size: 256},
                        {size: 320},
                        {size: 480},
                        {size: 512},
                        {size: 640},
                    ],
                    sealSize07: 160,
                    sealScale07: 1,
                    // 印章老化
                    noisy08: 90,
                    checked08: false,
                    
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
                    this.sealScale07 = this.sealSize07 / 160
                    this.setChange()
                },
                // 绘制中文印章
                createSealEx2() {
                    var sealdiv = document.getElementById("sealdiv"); // 预览
                    sealdiv.innerHTML = `<div class="relative">
                            <canvas id='canvas' class='cSeal' width='${this.sealSize07}' height='${this.sealSize07}'></canvas>
                            <div class="absolute flex flex-wrap" style="user-select: none;pointer-events: none;width: 100%;height: 100%;top: 0;z-index: 999;color: rgba(127,127,127,.4);font-size: ${16*this.sealScale07}px;">
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
                        this.createSealCN('canvas', this.input01, this.input02, this.input03, this.input04);
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
                    if(this.checked08){
                        // 优化后的噪点算法，仅在有颜色的部分绘制噪点。
                        // 获取canvas上的像素点颜色数据
                        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        var data = imageData.data;
                        for (var i = 0; i < data.length; i += parseInt(Math.random()*(4 + this.noisy08/10*this.sealScale07))) {
                            var r = data[i];
                            var g = data[i + 1];
                            var b = data[i + 2];
                            var a = data[i + 3];
                            // 提取印章颜色R,G,B值
                            var rgb = this.extractRGBValues(this.color06)
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
                createSealCN(id,input01,input02,input03,input04){
                    var canvas = document.getElementById(id);
                        var context = canvas.getContext('2d');
                        
                        // 绘制印章边框
                        // 外边线
                        var width = canvas.width / 2;
                        var height = canvas.height / 2;
                        context.lineWidth = this.border05+this.sealScale07;
                        context.strokeStyle = this.color06;
                        context.beginPath();
                        context.rect(10*this.sealScale07,10*this.sealScale07,140*this.sealScale07,140*this.sealScale07);  // 定义矩形（x, y, 宽度, 高度）
                        context.stroke();
                        context.save();
                        // 绘制第一个字
                        context.font = this.fontWeight01 + ' ' + this.fontSize01*this.sealScale07 + 'px ' + this.fontFamily01
                        context.fillStyle = this.color06;
                        context.fillText(input01,20*this.sealScale07 + this.fontLeft01,70*this.sealScale07 + this.fontTop01);
                        // 绘制第二个字
                        context.font = this.fontWeight02 + ' ' + this.fontSize02*this.sealScale07 + 'px ' + this.fontFamily02
                        context.fillText(input02,20*this.sealScale07 + this.fontLeft02,134*this.sealScale07 + this.fontTop02);
                        // 绘制第三个字
                        context.font = this.fontWeight03 + ' ' + this.fontSize03*this.sealScale07 + 'px ' + this.fontFamily03
                        context.fillText(input03,84*this.sealScale07 + this.fontLeft03,70*this.sealScale07 + this.fontTop03);
                        // 绘制第四个字
                        context.font = this.fontWeight04 + ' ' + this.fontSize04*this.sealScale07 + 'px ' + this.fontFamily04
                        context.fillText(input04,84*this.sealScale07 + this.fontLeft04,134*this.sealScale07 + this.fontTop04);
                        
                        // 在绘制噪点之前，需要先恢复到之前保存的状态，否则噪点的原点将是canvas的中心点
                        context.restore();
                        this.drawNoisy(context,canvas)
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