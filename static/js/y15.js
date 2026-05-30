        new Vue({
            el: '#app',
            data() {
                return {tabIndex: 0,
                    sealName: '执业章',
                    fontList: [
                        {name: '宋体'},
                        {name: '仿宋'},
                        {name: '楷体'},
                        {name: '黑体'},                    ],
                    // 公司
                    input01: '中华人民共和国一级注册建造师执业印章',
                    fontFamily01: '黑体',
                    fontSize01: 12,
                    fontWeight01: 0,
                    fontGap01: 0,
                    fontRotate01: 0,
                    // 中心内容
                    input02: '姓名字川556666688888(00)建筑',
                    fontFamily02: '黑体',
                    fontSize02: 10,
                    fontWeight02: 'normal',
                    // 日期
                    input03: '2029.07.30',
                    fontFamily03: '宋体',
                    fontSize03: 12,
                    fontWeight03: 'bold',
                    fontGap03: 0,
                    fontRotate03: 0,
                    // 公司
                    input04: '艾你图成都建筑工程有限公司',
                    fontFamily04: '仿宋',
                    fontSize04: 13,
                    fontWeight04: 'bold',
                    fontGap04: 0,
                    fontRotate04: 0,
                    // 外边线
                    border05: 4,
                    // 内边线
                    border06: 2,
                    // 印章颜色
                    color07: 'rgb(255,0,0)',
                    // 印章大小
                    sealSize: [
                        {size: 100},
                        {size: 150},
                        {size: 200},
                        {size: 300},
                        {size: 400},
                        {size: 500},
                        {size: 600},
                        {size: 700},
                    ],
                    sealSize08: 200,
                    sealScale08: 1,
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
                    this.sealScale08 = this.sealSize08 / 200
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
                    this.createSealCN('canvas', this.input01,this.input02,this.input03,this.input04);
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
                createSealCN(id,input01,input02,input03,input04){
                    var canvas = document.getElementById("canvas");
                    var context = canvas.getContext("2d");
                    context.strokeStyle=this.color07;//设置边框颜色
                    context.textBaseline = 'middle';//设置文本的垂直对齐方式
                    context.textAlign = 'center'; //设置文本的水平对对齐方式
                    
                    context.lineWidth = this.border05*this.sealScale08;//椭圆1宽度
                    //3个参数： 左边距 上边据 宽度 椭圆扁度
                    this.BezierEllipse4(context, 100*this.sealScale08, 100*this.sealScale08, 95*this.sealScale08, 68*this.sealScale08); // 外边线
                    context.lineWidth = this.border06*this.sealScale08;
                    this.BezierEllipse4(context, 100*this.sealScale08, 100*this.sealScale08, 70*this.sealScale08, 43*this.sealScale08); // 内边线
                    context.save(); //保存上述操作
                      
                    // 绘制日期
                    context.save();
                    context.translate(100*this.sealScale08,47*this.sealScale08)
                    context.fillStyle = this.color07;//设置字体颜色
                    context.font = this.fontWeight03 + ' ' + this.fontSize03*this.sealScale08 + 'px ' + this.fontFamily03;//设置字体大小 样式
                    // context.fillText(input03,0,36);
                    var counts = input03.length; // 字数   
                    var angles = -3 * Math.PI / ((17-this.fontGap03*0.5) * (counts - 1)); // 控制字间角度 
                    var charss = input03.split("");
                    var cs;
                    for (var i = 0; i < counts; i++) {
                        cs = charss[i]; // 需要绘制的字符
                        if (i == 0) {
                            context.rotate(3 * Math.PI / (2 * (17 - this.fontGap03 * 0.5)) - 3 * Math.PI / 34); // centering
                            context.rotate((0.5 - this.fontRotate03*0.02) * Math.PI / 6); // 控制左右
                        } else {
                            context.rotate(angles);
                        }
                        context.save();
                        context.translate(0, 82*this.sealScale08); // 平移到此位置,此时字和x轴垂直   
                        context.rotate(Math.PI / 180); // 旋转90度,让字平行于x轴  
                        context.fillText(cs, 0, 5); // 此点为字的中心点  
                        context.restore();
                    }
                    context.restore();
                    
                    // 绘制公司
                    context.save();
                    context.translate(100*this.sealScale08,47*this.sealScale08)
                    context.fillStyle = this.color07;//设置字体颜色
                    context.font = this.fontWeight03 + ' ' + this.fontSize03*this.sealScale08 + 'px ' + this.fontFamily03;//设置字体大小 样式
                    // context.fillText(input04,this.fontLeft03,50+this.fontTop03);  
                    var counts = input04.length; // 字数   
                    var angles = -3 * Math.PI / ((8-this.fontGap03*0.2) * (counts - 1)); // 控制字间角度 
                    var charss = input04.split("");
                    var cs;
                    for (var i = 0; i < counts; i++) {
                        cs = charss[i]; // 需要绘制的字符
                        if (i == 0) {
                            context.rotate(3 * Math.PI / (2 * (8 - this.fontGap03 * 0.2)) - 3 * Math.PI / 16); // centering
                            context.rotate((1.1 - this.fontRotate03*0.01) * Math.PI / 6); // 控制左右
                        } else {
                            context.rotate(angles);
                        }
                        context.save();
                        context.translate(0, 103*this.sealScale08); // 平移到此位置,此时字和x轴垂直   
                        context.rotate(Math.PI / 180); // 旋转90度,让字平行于x轴  
                        context.fillText(cs, 0, 5); // 此点为字的中心点  
                        context.restore();
                    }
                    context.restore();
                    
                    //绘制主文字
                    context.fillStyle = this.color07;//设置字体颜色
                    var circle={
                        x:canvas.width/2,
                        y:canvas.height/2,
                        radius:58
                    };
                    var startAngle = 196 + this.fontRotate01;//控制字符起始位置度数
                    var endAngle = -17 - this.fontGap01;//首位字符相隔度数
                    var radius=circle.radius*this.sealScale08 //圆的半径
                    var angleDecrement=(startAngle-endAngle)/(input01.length-1)//每个字母占的弧度
                    context.font = this.fontSize01*this.sealScale08 + 'px ' + this.fontFamily01;
                    context.lineWidth = 0.3+this.fontWeight01*0.1;//设置字体胖瘦
                    var ratioX = 81 / circle.radius; //横轴缩放比率
                    var ratioY = 57 / circle.radius; //纵轴缩放比率
                    //进行缩放（均匀压缩） 重点
                    context.scale(ratioX, ratioY);
                    var index=0;
                    for(var index=0;index<input01.length;index++){
                        //保存之前的设置开始绘画
                        context.save();
                        context.beginPath();
                        context.translate(circle.x+Math.cos((Math.PI/180)*startAngle)*radius-28*this.sealScale08,circle.y-Math.sin((Math.PI/180)*startAngle)*radius+2*this.sealScale08)//绘制点 +-微调
                        context.rotate((Math.PI/2)-(Math.PI/180)*startAngle);  //Math.PI/2为旋转90度  Math.PI/180*X为旋转多少度
                        context.fillText(input01.charAt(index),0,0);
                        context.strokeText(input01.charAt(index),0,0);
                        startAngle-=angleDecrement;
                        context.restore();
                    }
                    // 绘制中文字
                    context.font = this.fontWeight02 + ' ' + (13*this.sealScale08 + this.fontSize02) + 'px ' + this.fontFamily02;
                    context.fillText(input02.substring(0,3),canvas.width/2-28*this.sealScale08,canvas.height/2-24*this.sealScale08,46*this.sealScale08);    
                    context.font = this.fontWeight02 + ' ' + (5*this.sealScale08 + this.fontSize02) + 'px ' + this.fontFamily02;
                    context.fillText(input02.substring(3,input02.length-2),canvas.width/2-28*this.sealScale08,canvas.height/2-2*this.sealScale08,96*this.sealScale08);    
                    context.font = this.fontWeight02 + ' ' + (3*this.sealScale08 + this.fontSize02) + 'px ' + this.fontFamily02;
                    context.fillText(input02.substring(input02.length-2,input02.length),canvas.width/2-28*this.sealScale08,canvas.height/2+18*this.sealScale08,20*this.sealScale08);    
                    
                    context.save();
                    // 在绘制噪点之前，需要先恢复到之前保存的状态，否则噪点的原点将是canvas的中心点
                    context.restore();
                    this.drawNoisy(context,canvas)
                    this.dataURL = canvas.toDataURL('image/png');
                },
                BezierEllipse4(ctx, x, y, a, b){
                    var k = .5522848,
                    ox = a * k, // 水平控制点偏移量
                    oy = b * k; // 垂直控制点偏移量</p> <p> 
                    ctx.beginPath();
                    //从椭圆的左端点开始顺时针绘制四条三次贝塞尔曲线
                    ctx.moveTo(x - a, y);
                    ctx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
                    ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
                    ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
                    ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
                    ctx.closePath();
                    ctx.stroke();
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