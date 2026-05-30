  new Vue({
            el: '#app',
            data() {
                return {tabIndex: 0,
                    sealName: '维文章',
                    fontList: [
                        {name: '宋体'},
                        {name: '仿宋'},
                        {name: '楷体'},
                        {name: '黑体'},                    ],
                    // 主文字 维文
                    input01: 'ئامىتابا تامغىسىنى ياساش سۇپىسى',
                    fontFamily01: '宋体',
                    fontSize01: 12,
                    fontWeight01: 'normal',
                    fontGap01: 0,
                    fontRotate01: 0,
                    fontBorder01: 0,
                    // 副文字 中文
                    input02: '艾你图圆形印章有限公司',
                    fontFamily02: '宋体',
                    fontSize02: 18,
                    fontWeight02: 'normal',
                    fontGap02: 0,
                    fontRotate02: 0,
                    fontBorder02: 0,
                    // 章名 维文
                    input03: 'مالىيە مەخسۇس تامغىسى',
                    fontFamily03: '宋体',
                    fontSize03: 20,
                    fontWeight03: 'normal',
                    fontTop03: 0,
                    fontLeft03: 0,
                    // 章名 中文
                    input04: '财务专用章',
                    fontFamily04: '宋体',
                    fontSize04: 17,
                    fontWeight04: 'normal',
                    fontTop04: 0,
                    fontLeft04: 0,
                    // 中心内容
                    input05: '★',
                    fontFamily05: '宋体',
                    fontSize05: 50,
                    fontWeight05: 'bold',
                    fontTop05: 0,
                    fontLeft05: 0,
                    // 防伪码
                    input06: '36655566555YINZHANG666',
                    fontFamily06: '楷体',
                    fontSize06: 10,
                    fontWeight06: 'normal',
                    fontGap06: 0,
                    fontRotate06: 0,
                    fontBorder06: 0,
                    // 外边线
                    border07: 4,
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
                    this.CNorEN = false
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
                    var canvas = document.getElementById(id);
                    var context = canvas.getContext('2d');
                    
                    // 绘制印章边框
                    // 外边线
                    var width = canvas.width / 2;
                    var height = canvas.height / 2;
                    context.lineWidth = this.border07*this.sealScale09;
                    context.strokeStyle = this.color08;
                    context.beginPath();
                    context.arc(width, height, 78*this.sealScale09, 0, Math.PI * 2);
                    context.stroke();
                    context.save();
                    
                    //画五角星
                    this.create5star(context, width, height, 25, this.color08, 0);
                    context.textBaseline = 'middle';//设置文本的垂直对齐方式
                    context.textAlign = 'center'; //设置文本的水平对对齐方式
                    context.lineWidth = 1;
                    context.fillStyle = this.color08;
                    // 章名 维  
                    context.font = this.fontWeight03+ ' ' + this.fontSize03*this.sealScale09 + 'px ' + this.fontFamily03
                    context.fillText(this.input03, width + 2 + this.fontLeft03, height + 30*this.sealScale09 + this.fontTop03,68*this.sealScale09);
                    // 章名 中 
                    context.font = this.fontWeight04 + ' ' + this.fontSize04*this.sealScale09 + 'px ' + this.fontFamily04
                    context.fillText(this.input04, width + 2 + this.fontLeft04, height + 48*this.sealScale09 + this.fontTop04,68*this.sealScale09);
                    
                    // 绘制维文  
                    context.translate(width, height);// 平移到此位置,
                    context.save();
                    context.font = this.fontWeight01 + ' ' + this.fontSize01*this.sealScale09 + 'px ' + this.fontFamily01
                    var count = this.input01.length;// 字数   
                    var angle = 4 * Math.PI / (3 * count + 105 - this.fontGap01);// 字间角度    0.75 <=> 5.1 调整字间距比例2.5:1
                    var chars = this.input01.split("");
                    var c;
                    for (var i = 0; i < count; i++) {
                        c = chars[i];// 需要绘制的字符   
                        if (i == 0) {
                            context.rotate(-2 * Math.PI * (count - 1) / (3 * count + 105 - this.fontGap01) + 2 * Math.PI * (count - 1) / (3 * count + 105)); // centering
                            context.rotate((4.9 - 0.02*this.fontRotate01) * Math.PI / 6);
                        } else
                            context.rotate(angle);
                        context.save();
                        context.translate(70*this.sealScale09 + this.fontBorder01, 0);// 平移到此位置,此时字和x轴垂直   
                        context.rotate(Math.PI / 2);// 旋转90度,让字平行于x轴   
                        context.fillText(c, 0, 5);// 此点为字的中心点   
                        context.restore();
                    }
                    context.restore();
                    
                    
                    context.save();
                    // 绘制中文  
                    context.font = this.fontWeight02 + ' ' + this.fontSize02*this.sealScale09 + 'px ' + this.fontFamily02
                    var count = this.input02.length;// 字数   
                    var angle = 4 * Math.PI / (3 * count + 24 - this.fontGap02);// 字间角度    0.75 <=> 5.1 调整字间距比例2.5:1
                    var chars = this.input02.split("");
                    var c;
                    for (var i = 0; i < count; i++) {
                        c = chars[i];// 需要绘制的字符   
                        if (i == 0) {
                            context.rotate(-2 * Math.PI * (count - 1) / (3 * count + 24 - this.fontGap02) + 2 * Math.PI * (count - 1) / (3 * count + 24)); // centering
                            context.rotate((-2.9 - 0.02*this.fontRotate02) * Math.PI / 6);
                        } else
                            context.rotate(angle);
                        context.save();
                        context.translate(64*this.sealScale09 + this.fontBorder02, 0);// 平移到此位置,此时字和x轴垂直   
                        context.rotate(Math.PI / 2);// 旋转90度,让字平行于x轴   
                        context.fillText(c, 0, 5);// 此点为字的中心点   
                        context.restore();
                    }
                    context.restore();
                    
                    // 绘制印章防伪编号
                    // context.translate(width, height);
                    context.font = this.fontWeight06 + ' ' + this.fontSize06*this.sealScale09 + 'px ' + this.fontFamily06
                    var companys = this.input06
                    var counts = companys.length;// 字数   
                    var angles = -4 * Math.PI / ((8-this.fontGap06*0.1) * (counts - 1));// 字间角度 ----------11  0.4:0.05 [10.6:3.15]
                    var charss = companys.split("");
                    var cs;
                    for (var i = 0; i < counts; i++) {
                    	cs = charss[i];// 需要绘制的字符
                        if (i == 0){
                          context.rotate(2 * Math.PI / (8 - this.fontGap06 * 0.1) - 2 * Math.PI / 8); // centering
                          context.rotate((4.5+this.fontRotate06*0.02) * Math.PI / 6); // -------------------------3.1  0.4:0.05
                        }else{
                        //   console.log('angles',angles)
                          context.rotate(angles);
                        }  
                        context.save();
                        context.translate(64*this.sealScale09 + this.fontBorder06, 0);// 平移到此位置,此时字和x轴垂直   
                        context.rotate(-90 * Math.PI / 180);// 旋转90度,让字平行于x轴  
                        context.fillText(cs, 0, 5);// 此点为字的中心点  
                        context.restore();
                    }
                    // 在绘制噪点之前，需要先恢复到之前保存的状态，否则噪点的原点将是canvas的中心点
                    context.restore();
                    this.drawNoisy(context,canvas)
                    this.dataURL = canvas.toDataURL('image/png');
                },
                //绘制五角星  
                create5star(context, sx, sy, radius, color, rotato) {
                    context.save();
                    context.font = this.fontWeight05 + ' ' + this.fontSize05*this.sealScale09 + 'px ' + this.fontFamily05
                    context.fillStyle = this.color08;
                    context.fillText(this.input05, sx - 25*this.sealScale09 + this.fontLeft05,sy + 15*this.sealScale09 + this.fontTop05);
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