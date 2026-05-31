        new Vue({
            el: '#app',
            data() {
                return {tabIndex: 0,
                    sealName: '试制文件章',
                    fontList: [
                        {name: '宋体'},
                        {name: '仿宋'},
                        {name: '楷体'},
                        {name: '黑体'},
                        {name: '汉仪长宋简'},
                    ],
                    // 主文字
                    input01: 'XXXXXXXXXXXX',
                    fontFamily01: '楷体',
                    fontSize01: 22,
                    fontWeight01: 'bold',
                    fontGap01: 0,
                    fontRotate01: 0,
                    fontBorder01: 0,
                    // 中心1
                    input02: '生产部',
                    fontFamily02: '仿宋',
                    fontSize02: 22,
                    fontWeight02: 'bold',
                    fontTop02: 0,
                    fontLeft02: 0,
                    // 中心2
                    input03: '2024-01-01',
                    fontFamily03: '汉仪长宋简',
                    fontSize03: 22,
                    fontWeight03: 'bold',
                    fontTop03: 0,
                    fontLeft03: 0,
                    // 中心3
                    input04: '试制文件',
                    fontFamily04: '仿宋',
                    fontSize04: 22,
                    fontWeight04: 'bold',
                    fontTop04: 0,
                    fontLeft04: 0,
                    // 底部文字
                    input05: 'Sichuan Good Seal Co.,Ltd.',
                    fontFamily05: '宋体',
                    fontSize05: 18,
                    fontWeight05: 'bold',
                    fontGap05: 0,
                    fontRotate05: 0,
                    fontBorder05: 0,
                    // 外边线
                    border06: 4,
                    // 内边线
                    border07: 1,
                    // 印章颜色
                    color08: 'rgb(255,0,0)',
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
                    sealSize09: 240,
                    sealScale09: 1.5,
                    // 印章老化
                    noisy10: 90,
                    checked10: false,
                    
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
                    console.log(value)
                    that.createSealEx2()
                },
                // 设置尺寸大小时，计算出相应的倍数
                sizeChange() {
                    this.sealScale09 = this.sealSize09 / 160
                    this.setChange()
                },
                // 绘制中文印章
                createSealEx2() {
                    var sealdiv = document.getElementById("sealdiv"); // 预览
                    sealdiv.innerHTML = `<div class="relative">
                            <canvas id='canvas' class='cSeal' width='${this.sealSize09}' height='${this.sealSize09}'></canvas>
                            <div class="absolute flex flex-wrap" style="user-select: none;pointer-events: none;width: 100%;height: 100%;top: 0;z-index: 999;color: rgba(127,127,127,.4);font-size: ${16*this.sealScale09}px;">
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
                    this.createSeal11('canvas');
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
                    if(this.checked10){
                        // 优化后的噪点算法，仅在有颜色的部分绘制噪点。
                        // 获取canvas上的像素点颜色数据
                        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        var data = imageData.data;
                        for (var i = 0; i < data.length; i += parseInt(Math.random()*(4 + this.noisy10/10*this.sealScale09))) {
                            var r = data[i];
                            var g = data[i + 1];
                            var b = data[i + 2];
                            var a = data[i + 3];
                            // 提取印章颜色R,G,B值
                            var rgb = this.extractRGBValues(this.color08)
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
                // 绘制中文印章
                createSeal11(id) {
                    var canvas = document.getElementById('canvas');
                    var context = canvas.getContext('2d');

                    // 绘制印章边框
                    // 外边线
                    var width = canvas.width / 2;
                    var height = canvas.height / 2;
                    context.lineWidth = this.border06*this.sealScale09;
                    context.strokeStyle = this.color08;
                    context.beginPath();
                    context.arc(width, height, 78*this.sealScale09, 0, Math.PI * 2);
                    context.stroke();
                    context.save();
                    // 内边线
                    context.lineWidth = this.border07*this.sealScale09;
                    context.beginPath();
                    context.arc(width, height, 52*this.sealScale09, 0, Math.PI * 2);
                    context.stroke();
                    context.save();
                    
                    // 绘制直线1
                    context.lineWidth = 2*this.sealScale09;
                    context.beginPath();
                    context.moveTo(width-49*this.sealScale09, height-18*this.sealScale09);
                    context.lineTo(width+49*this.sealScale09, height-18*this.sealScale09);
                    
                    context.moveTo(width-49.5*this.sealScale09, height+16*this.sealScale09);
                    context.lineTo(width+49.5*this.sealScale09, height+16*this.sealScale09);
                    context.stroke();
                    // 中心文字1
                    context.font = this.fontWeight02 + ' ' + this.fontSize02*this.sealScale09 + 'px ' + this.fontFamily02
                    context.fillStyle = this.color08;
                    context.fillText(this.input02, width - 34*this.sealScale09 + this.fontLeft02, height - 23*this.sealScale09 + this.fontTop02);
                    // 中心文字2
                    context.font = this.fontWeight03 + ' ' + this.fontSize03*this.sealScale09 + 'px ' + this.fontFamily03
                    context.fillText(this.input03, width - 39*this.sealScale09 + this.fontLeft03, height + 6*this.sealScale09 + this.fontTop03,80*this.sealScale09);
                    // 中心文字3
                    context.font = this.fontWeight04 + ' ' + this.fontSize04*this.sealScale09 + 'px ' + this.fontFamily04
                    context.fillText(this.input04, width - 34*this.sealScale09 + this.fontLeft04, height + 37*this.sealScale09 + this.fontTop04,72*this.sealScale09);
                    // 两边的符号
                    context.font = 'bold' + 30*this.sealScale09 + 'px 宋体';
                    context.fillText('*',8*this.sealScale09,90*this.sealScale09);
                    context.fillText('*',140*this.sealScale09,90*this.sealScale09);
                    
                    
                    // 绘制底部弧形文字
                    context.save();
                    context.translate(width, height); // 平移到此位置,
                    context.font = this.fontWeight05 + ' ' + this.fontSize05*this.sealScale09 + 'px ' + this.fontFamily05
                    var companys = this.input05
                    var counts = companys.length;// 字数   
                    var angles = -4 * Math.PI / ((5-this.fontGap05*0.4) * (counts - 1));// 字间角度
                    var baseAngles = -4 * Math.PI / (5 * (counts - 1));
                    var charss = companys.split("");
                    var cs;
                    for (var i = 0; i < counts; i++) {
                    	cs = charss[i];// 需要绘制的字符
                        if (i == 0){
                            context.rotate((5.4) * Math.PI / 6 - (count - 1) * angle / 2); // center fixed
                        }else{
                            context.rotate(angles);
                        }  
                        context.save();
                        context.translate(66*this.sealScale09 + this.fontBorder05, 0);// 平移到此位置,此时字和x轴垂直   
                        context.rotate(-90 * Math.PI / 180);// 旋转90度,让字平行于x轴  
                        context.fillText(cs, 0, 5);// 此点为字的中心点
                        context.restore();
                    }
                    context.restore();
                    
                    context.textBaseline = 'middle';//设置文本的垂直对齐方式
                    context.textAlign = 'center'; //设置文本的水平对对齐方式
                    // 绘制印章单位   
                    context.translate(width, height); // 平移到此位置,
                    context.font = this.fontWeight01 + ' ' + this.fontSize01*this.sealScale09 + 'px ' + this.fontFamily01
                    var count = this.input01.length; // 字数
                    var angle = 4 * Math.PI / (3 * count + 19 - this.fontGap01);
                    var chars = this.input01.split("");
                    var c;
                    for (var i = 0; i < count; i++) {
                        c = chars[i]; // 需要绘制的字符   
                        if (i == 0)
                            context.rotate((6.6) * Math.PI / 6 - (count - 1) * angle / 2); // center fixed
                        else
                            context.rotate(angle);
                        context.save();
                        context.translate(69*this.sealScale09 + this.fontBorder01, 0); // 平移到此位置,此时字和x轴垂直   
                        context.rotate(Math.PI / 2); // 旋转90度,让字平行于x轴   
                        context.fillText(c, 0, 5); // 此点为字的中心点   
                        context.restore();
                    }
                    // 在绘制噪点之前，需要先恢复到之前保存的状态，否则噪点的原点将是canvas的中心点
                    context.restore();
                    this.drawNoisy(context, canvas);
                    this.dataURL = canvas.toDataURL('image/png');
                },
                //绘制五角星  
                create5star(context, sx, sy, radius, color, rotato) {
                    context.save();
                    context.font = this.fontWeight04 + ' ' + this.fontSize04*this.sealScale09 + 'px ' + this.fontFamily04
                    context.fillStyle = this.color08;
                    context.fillText(this.input04, sx - 25*this.sealScale09 + this.fontLeft04,sy + 15*this.sealScale09 + this.fontTop04);
                    context.restore();
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
        // 全局重绘函数 - 供原生按钮调用
        window.regenerateSeal = function() {
            var el = document.getElementById('app');
            if (el && el.__vue__ && el.__vue__.createSealEx2) {
                el.__vue__.createSealEx2();
            }
        };
    