        new Vue({
            el: '#app',
            data() {
                return {tabIndex: 0,
                    sealName: '香港章',
                    fontList: [
                        {name: '宋体'},
                        {name: '仿宋'},
                        {name: '楷体'},
                        {name: '黑体'},                    ],
                    // 公司
                    input01: 'YinGood Seal Online Making Platform',
                    fontFamily01: '宋体',
                    fontSize01: 20,
                    fontWeight01: 'normal',
                    fontGap01: 0,
                    fontRotate01: 0,
                    fontBorder01: 0,
                    // 中心内容
                    input02_1: '香港',
                    input02_2: '某某印章',
                    input02_3: '有限公司',
                    input02_4: '样式章',
                    fontFamily02: '宋体',
                    fontSize02: 18,
                    fontWeight02: 'bold',
                    fontTop02: 0,
                    fontLeft02: 0,
                    // 章名
                    input03: '*',
                    fontFamily03: '宋体',
                    fontSize03: 28,
                    fontWeight03: 'normal',
                    fontTop03: 0,
                    fontLeft03: 0,
                    // 外边线
                    border04: 4,
                    // 次边线
                    border05: 2,
                    // 内边线
                    border06: 2,
                    // 印章颜色
                    color07: 'rgb(51, 51, 102)',
                    // 印章大小
                    sealSize: [
                        {size: 100},
                        {size: 160},
                        {size: 240},
                        {size: 320},
                        {size: 400},
                        {size: 480},
                        {size: 560},
                        {size: 640},
                    ],
                    sealSize08: 240,
                    sealScale08: 1.5,
                    // 印章老化
                    noisy09: 90,
                    checked09: false,
                    
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
                    this.sealScale08 = this.sealSize08 / 160
                    this.setChange()
                },
                // 绘制中文印章
                createSealEx2() {
                    var sealdiv = document.getElementById("sealdiv"); // 预览
                    sealdiv.innerHTML = `<div class="relative">
                            <canvas id='canvas' class='cSeal' width='${this.sealSize08}' height='${this.sealSize08}'></canvas>
                            <div class="absolute flex flex-wrap" style="user-select: none;pointer-events: none;width: 100%;height: 100%;top: 0;z-index: 999;color: rgba(127,127,127,.4);font-size: ${16*this.sealScale08}px;">
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
                    if(this.checked09){
                        // 优化后的噪点算法，仅在有颜色的部分绘制噪点。
                        // 获取canvas上的像素点颜色数据
                        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        var data = imageData.data;
                        for (var i = 0; i < data.length; i += parseInt(Math.random()*(4 + this.noisy09/10*this.sealScale08))) {
                            var r = data[i];
                            var g = data[i + 1];
                            var b = data[i + 2];
                            var a = data[i + 3];
                            // 提取印章颜色R,G,B值
                            var rgb = this.extractRGBValues(this.color07)
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
                    // 外边线
                    var width = canvas.width / 2;
                    var height = canvas.height / 2;
                    context.lineWidth = this.border04*this.sealScale08;
                    context.strokeStyle = this.color07;
                    context.beginPath();
                    context.arc(width, height, 78*this.sealScale08, 0, Math.PI * 2);
                    context.stroke();
                    context.save();
                    // 次边线
                    context.lineWidth = this.border05*this.sealScale08;
                    context.beginPath();
                    context.arc(width, height, 73*this.sealScale08, 0, Math.PI * 2);
                    context.stroke();
                    context.save();
                    // 内边线
                    context.lineWidth = this.border06*this.sealScale08;
                    context.beginPath();
                    context.arc(width, height, 46*this.sealScale08, 0, Math.PI * 2);
                    context.stroke();
                    context.save();
                    
                    // 中心文字1
                    context.font = this.fontWeight02 + ' ' + this.fontSize02*this.sealScale08 + 'px ' + this.fontFamily02
                        context.fillStyle = this.color07;
                    context.fillText(this.input02_1, width - 20*this.sealScale08 + this.fontLeft02, height - 24*this.sealScale08 + this.fontTop02);
                    // 中心文字2
                    context.font = this.fontWeight02 + ' ' + this.fontSize02*this.sealScale08 + 'px ' + this.fontFamily02
                    context.fillText(this.input02_2, width - 36*this.sealScale08 + this.fontLeft02, height - 4*this.sealScale08 + this.fontTop02);
                    // 中心文字3
                    context.font = this.fontWeight02 + ' ' + this.fontSize02*this.sealScale08 + 'px ' + this.fontFamily02
                    context.fillText(this.input02_3, width - 36*this.sealScale08 + this.fontLeft02, height + 15*this.sealScale08 + this.fontTop02);
                    // 中心文字4
                    context.font = this.fontWeight02 + ' ' + this.fontSize02*this.sealScale08 + 'px ' + this.fontFamily02
                    context.fillText(this.input02_4, width - 26*this.sealScale08 + this.fontLeft02, height + 34*this.sealScale08 + this.fontTop02);
                    
                    // 绘制★
                    context.font = this.fontWeight03 + ' ' + this.fontSize03*this.sealScale08 + 'px ' + this.fontFamily03
                    context.textBaseline = 'middle'; //设置文本的垂直对齐方式
                    context.textAlign = 'center'; //设置文本的水平对对齐方式
                    context.fillText(this.input03, width + this.fontLeft03, height + 59*this.sealScale08 + this.fontTop03);
                    // 绘制印章单位   
                    context.translate(width, height); // 平移到此位置,
                    context.font = this.fontWeight01 + ' ' + this.fontSize01*this.sealScale08 + 'px ' + this.fontFamily01
                    var count = this.input01.length; // 字数
                    var angle = 4 * Math.PI / (3 * count - 10 - this.fontGap01);
                    var chars = this.input01.split("");
                    var c;
                    for (var i = 0; i < count; i++) {
                        c = chars[i]; // 需要绘制的字符   
                        if (i == 0) {
                            context.rotate(-2 * Math.PI * (count - 1) / (3 * count - 10 - this.fontGap01) + 2 * Math.PI * (count - 1) / (3 * count - 10)); // centering
                            context.rotate((4.8 - 0.05*this.fontRotate01) * Math.PI / 6);
                        } else
                            context.rotate(angle);
                        context.save();
                        context.translate(64*this.sealScale08 + this.fontBorder01, 0); // 平移到此位置,此时字和x轴垂直   
                        context.rotate(Math.PI / 2); // 旋转90度,让字平行于x轴   
                        context.fillText(c, 0, 5); // 此点为字的中心点   
                        context.restore();
                    }
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