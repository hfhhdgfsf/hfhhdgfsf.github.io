 new Vue({
            el: '#app',
            data() {
                return {tabIndex: 0,
                    sealName: '条形章',
                    fontList: [
                        {name: '宋体'},
                        {name: '仿宋'},
                        {name: '楷体'},
                        {name: '黑体'},                    ],
                    // 主文字
                    input01: '艾你图条形印章在线制作',
                    fontFamily01: '宋体',
                    fontSize01: 24,
                    fontWeight01: 'bold',
                    fontTop01: 0,
                    fontLeft01: 0,
                    // 副文字
                    input02: 'YinGood Seal Online Making',
                    fontFamily02: '宋体',
                    fontSize02: 17,
                    fontWeight02: 'bold',
                    fontTop02: 0,
                    fontLeft02: 0,
                    // 外边线
                    borderWidth03: 0,
                    borderHeight03: 0,
                    border03: 4,
                    // 印章颜色
                    color04: 'rgb(0, 102, 204)',
                    // 印章大小
                    sealSize: [
                        {size: 150},
                        {size: 200},
                        {size: 300},
                        {size: 400},
                        {size: 500},
                        {size: 600},
                        {size: 700},
                    ],
                    sealSize05: 300,
                    sealScale05: 1,
                    // 印章老化
                    noisy06: 90,
                    checked06: false,
                    
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
                    this.sealScale05 = this.sealSize05 / 300
                    this.setChange()
                },
                // 绘制中文印章
                createSealEx2() {
                    var sealdiv = document.getElementById("sealdiv"); // 预览
                    sealdiv.innerHTML = `<div class="relative">
                            <canvas id='canvas' class='cSeal' width='${this.sealSize05}' height='${this.sealSize05}'></canvas>
                            <div class="absolute flex flex-wrap" style="user-select: none;pointer-events: none;width: 100%;height: 40%;top: 30%;z-index: 999;color: rgba(127,127,127,.4);font-size: ${16*this.sealScale05}px;">
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
                    if(this.checked06){
                        // 优化后的噪点算法，仅在有颜色的部分绘制噪点。
                        // 获取canvas上的像素点颜色数据
                        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        var data = imageData.data;
                        for (var i = 0; i < data.length; i += parseInt(Math.random()*(4 + this.noisy06/10*this.sealScale05))) {
                            var r = data[i];
                            var g = data[i + 1];
                            var b = data[i + 2];
                            var a = data[i + 3];
                            // 提取印章颜色R,G,B值
                            var rgb = this.extractRGBValues(this.color04)
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
                    var canvas = document.getElementById(id);
                    var context = canvas.getContext('2d');
                    
                    // 绘制印章边框
                    // 外边线
                    var width = canvas.width / 2;
                    var height = canvas.height / 2;
                    context.lineWidth = this.border03*this.sealScale05;
                    context.strokeStyle = this.color04;
                    context.beginPath();
                    context.rect(5*this.sealScale05,115*this.sealScale05,290*this.sealScale05+this.borderWidth03,70*this.sealScale05+this.borderHeight03);  // 定义矩形（x, y, 宽度, 高度）
                    context.stroke();
                    context.save();
                    // 绘制文字
                    context.font = this.fontWeight01 + ' ' + this.fontSize01*this.sealScale05 + 'px ' + this.fontFamily01
                    context.fillStyle = this.color04;
                    context.fillText(this.input01,14*this.sealScale05+this.fontLeft01,146*this.sealScale05+this.fontTop01);
                    
                    // 绘制文字
                    context.font = this.fontWeight02 + ' ' + this.fontSize02*this.sealScale05 + 'px ' + this.fontFamily02
                    context.fillText(this.input02,29*this.sealScale05+this.fontLeft02,174*this.sealScale05+this.fontTop02);
                    
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