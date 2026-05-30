        new Vue({
            el: '#app',
            data() {
                return {tabIndex: 0,
                    sealName: '椭圆印章',
                    fontList: [
                        {name: '宋体'},
                        {name: '仿宋'},
                        {name: '楷体'},
                        {name: '黑体'},                    ],
                    // 公司
                    input01: '艾你图椭圆有限公司',
                    fontFamily01: '宋体',
                    fontSize01: 16,
                    fontWeight01: 0,
                    fontTop01: 0,
                    fontLeft01: 0,
                    fontGap01: 0,
                    // 中心内容
                    input02: '008652541263500',
                    fontFamily02: '楷体',
                    fontSize02: 13,
                    fontWeight02: 'normal',
                    fontTop02: 0,
                    fontLeft02: 0,
                    fontGap02: 0,
                    // 章名
                    input03: '发票专用章',
                    fontFamily03: '仿宋',
                    fontSize03: 16,
                    fontWeight03: 'bold',
                    fontTop03: 0,
                    fontLeft03: 0,
                    fontGap03: 0,
                    // 外边线
                    border04: 2,
                    // 内边线
                    border05: 1,
                    checked05: false,
                    // 矩形
                    checked06: false,
                    rectWidth06: 0,
                    rectHeight06: 0,
                    rectWide06: 1,
                    rectTop06: 0,
                    rectLeft06: 0,
                    // 印章颜色
                    color07: 'rgb(255,0,0)',
                    // 印章大小
                    sealSize: [
                        {size: 80},
                        {size: 128},
                        {size: 165},
                        {size: 248},
                        {size: 330},
                        {size: 396},
                        {size: 495},
                        {size: 660},
                    ],
                    sealSize08: 248,
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
                    this.sealScale08 = this.sealSize08 / 165
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
                    this.createSealCN('canvas', this.input01,this.input02,this.input03);
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
                createSealCN(id,input01,input02,input03){
                    var canvas = document.getElementById("canvas");
                    var context = canvas.getContext("2d");
                    context.strokeStyle=this.color07;//设置文本颜色
                    context.textBaseline = 'middle';//设置文本的垂直对齐方式
                    context.textAlign = 'center'; //设置文本的水平对对齐方式
                    context.lineWidth = this.border04*this.sealScale08;//椭圆1宽度
                    //3个参数： 左边距 上边据 宽度 椭圆扁度
                    this.BezierEllipse4(context, 82.5*this.sealScale08, 79*this.sealScale08, 79*this.sealScale08, 55*this.sealScale08); //椭圆1
                    if(this.checked05){
                        context.lineWidth = this.border05*this.sealScale08;
                        this.BezierEllipse4(context, 82.5*this.sealScale08, 79*this.sealScale08, 76*this.sealScale08, 52*this.sealScale08); //椭圆2
                    }
                    // 章名
                    context.font = this.fontWeight03 + ' ' + this.fontSize03*this.sealScale08 + 'px ' + this.fontFamily03;
                    context.lineWidth = 1;
                    context.fillStyle = this.color07;
                    context.fillText(input03,canvas.width/2+3*this.sealScale08 + this.fontLeft03,canvas.height/2+28*this.sealScale08 + this.fontTop03,80*this.sealScale08+this.fontGap03);    
                    context.save(); 
                    // 中心内容
                    context.restore()
                    canvas.style.letterSpacing = this.fontGap02*0.1 + 'px';
                    context.font = this.fontWeight02 + ' ' + this.fontSize02*this.sealScale08 + 'px ' + this.fontFamily02;
                    context.fillStyle = this.color07;
                    context.fillText(input02,canvas.width/2+3*this.sealScale08 + this.fontLeft02,canvas.height/2+13*this.sealScale08 + this.fontTop02);    
                    context.save(); 
                    // 矩形
                    if(this.checked06){
                        context.beginPath();
                        context.rect(canvas.width/2-(47-this.rectLeft06)*this.sealScale08,canvas.height/2-(-5-this.rectTop06)*this.sealScale08, (100+this.rectWidth06)*this.sealScale08, (15+this.rectHeight06)*this.sealScale08);  // 定义矩形（x, y, 宽度, 高度）
                        context.lineWidth = 1+this.rectWide06*this.sealScale08;          // 设置边框宽度
                        context.stroke();               // 绘制边框
                    }
                    //绘制中文
                    var ccircle={
                        x:canvas.width/2,
                        y:canvas.height/2,
                        radius:59
                    };
                    var cstartAngle=165+this.fontGap01;//控制字符起始位置度数
                    var cendAngle =15-this.fontGap01;//首位字符相隔度数
                    var cradius=ccircle.radius*this.sealScale08 //圆的半径
                    var cangleDecrement=(cstartAngle-cendAngle)/(input01.length-1)//每个字母占的弧度
                    context.font = this.fontSize01*this.sealScale08 + 'px ' + this.fontFamily01
                    context.lineWidth = (1+this.fontWeight01*0.2)*this.sealScale08;
                    var cratioX = 64.5 / ccircle.radius; //横轴缩放比率
                    var cratioY = 53 / ccircle.radius; //纵轴缩放比率
                    //进行缩放（均匀压缩）
                    context.scale(cratioX, cratioY);
                    var cindex=0;
                    for(var cindex=0;cindex<input01.length;cindex++){
                        context.save()
                        context.beginPath()
                        //绘制点
                        context.translate(ccircle.x+Math.cos((Math.PI/180)*cstartAngle)*cradius-6.5*this.sealScale08 + this.fontLeft01,ccircle.y-Math.sin((Math.PI/180)*cstartAngle)*cradius+18*this.sealScale08 + this.fontTop01)
                        context.rotate((Math.PI/2)-(Math.PI/180)*cstartAngle)   //Math.PI/2为旋转90度  Math.PI/180*X为旋转多少度
                        context.fillText(input01.charAt(cindex),0,0)
                        context.strokeText(input01.charAt(cindex),0,0)
                        cstartAngle-=cangleDecrement
                        context.restore()
                    }
                    // 在绘制噪点之前，需要先恢复到之前保存的状态，否则噪点的原点将是canvas的中心点
                    context.restore();
                    this.drawNoisy(context,canvas)
                    this.dataURL = canvas.toDataURL('image/png');
                },
                BezierEllipse4(ctx, x, y, a, b) {
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