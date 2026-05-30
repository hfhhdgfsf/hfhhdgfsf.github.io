        new Vue({
            el: '#app',
            data() {
                return {tabIndex: 0,
                    sealName: '检验椭圆章',
                    fontList: [
                        {name: '宋体'},
                        {name: '仿宋'},
                        {name: '楷体'},
                        {name: '黑体'},                    ],
                    // 主文字
                    input01: 'XXXXXXXXXX',
                    fontFamily01: '楷体',
                    fontSize01: 20,
                    fontWeight01: 0,
                    fontGap01: 0,
                    fontTop01: 0,
                    fontLeft01: 0,
                    // 中心文字
                    input02: '2024-01-01',
                    fontFamily02: '仿宋',
                    fontSize02: 18,
                    fontWeight02: 'bold',
                    fontGap02: 0,
                    fontTop02: 0,
                    fontLeft02: 0,
                    // 底部文字
                    input03: '检验合格',
                    fontFamily03: '楷体',
                    fontSize03: 22,
                    fontWeight03: 'bold',
                    fontGap03: 0,
                    fontTop03: 0,
                    fontLeft03: 0,
                    // 外边线
                    border04: 4,
                    // 印章颜色
                    color05: 'rgb(255, 0, 0)',
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
                    sealSize06: 248,
                    sealScale06: 1.5,
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
                    this.sealScale06 = this.sealSize06 / 165
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
                    var canvas = document.getElementById("canvas");
                    var context = canvas.getContext("2d");
                    context.strokeStyle=this.color05;//设置文本颜色
                    context.textBaseline = 'middle';//设置文本的垂直对齐方式
                    context.textAlign = 'center'; //设置文本的水平对对齐方式
                    context.lineWidth = this.border04*this.sealScale06;//椭圆1宽度
                    //3个参数： 左边距 上边据 宽度 椭圆扁度
                    this.BezierEllipse4(context, 82.5*this.sealScale06, 79*this.sealScale06, 79*this.sealScale06, 55*this.sealScale06); //椭圆1
                    
                    // 绘制横线
                    context.lineWidth = 2*this.sealScale06;
                    context.beginPath();
                    context.moveTo(canvas.width/2-76*this.sealScale06, canvas.height/2-18*this.sealScale06);
                    context.lineTo(canvas.width/2+76*this.sealScale06, canvas.height/2-18*this.sealScale06);
                    
                    context.moveTo(canvas.width/2-76*this.sealScale06, canvas.height/2+14*this.sealScale06);
                    context.lineTo(canvas.width/2+76*this.sealScale06, canvas.height/2+14*this.sealScale06);
                    context.stroke();
                    
                    // 绘制竖线
                    context.beginPath();
                    context.moveTo(canvas.width/2-50*this.sealScale06, canvas.height/2-18*this.sealScale06);
                    context.lineTo(canvas.width/2-50*this.sealScale06, canvas.height/2+14*this.sealScale06);
                    
                    context.moveTo(canvas.width/2+50*this.sealScale06, canvas.height/2-18*this.sealScale06);
                    context.lineTo(canvas.width/2+50*this.sealScale06, canvas.height/2+14*this.sealScale06);
                    context.stroke();
                    
                    context.font = 'bold ' + 16*this.sealScale06 + 'px 仿宋'
                    context.fillStyle = this.color05;
                    context.fillText('检',18*this.sealScale06,73*this.sealScale06)
                    context.fillText('验',18*this.sealScale06,88*this.sealScale06)
                    context.fillText('日',146*this.sealScale06,73*this.sealScale06)
                    context.fillText('期',146*this.sealScale06,88*this.sealScale06)
                    
                    // 绘制印章类型
                    context.font = this.fontWeight03 + ' ' + this.fontSize03*this.sealScale06 + 'px ' + this.fontFamily03;
                    context.lineWidth = 1;
                    context.fillStyle = this.color05;
                    context.fillText(this.input03,canvas.width/2+3*this.sealScale06 + this.fontLeft03,canvas.height/2+30*this.sealScale06 + this.fontTop03,80*this.sealScale06+this.fontGap03);    
                    context.save(); 
                    // 绘制中心内容
                    context.restore()
                    canvas.style.letterSpacing = (this.fontGap02-18)*0.1*this.sealScale06 + 'px';
                    context.font = this.fontWeight02 + ' ' + this.fontSize02*this.sealScale06 + 'px ' + this.fontFamily02;
                    context.fillStyle = this.color05;
                    context.fillText(this.input02,canvas.width/2+2*this.sealScale06 + this.fontLeft02,canvas.height/2-3*this.sealScale06 + this.fontTop02);    
                    context.save(); 
                    //绘制中文
                    var ccircle={
                        x:canvas.width/2,
                        y:canvas.height/2,
                        radius:59
                    };
                    var cstartAngle=143+this.fontGap01;//控制字符起始位置度数
                    var cendAngle =37-this.fontGap01;//首位字符相隔度数
                    var cradius=ccircle.radius*this.sealScale06 //圆的半径
                    var cangleDecrement=(cstartAngle-cendAngle)/(this.input01.length-1)//每个字母占的弧度
                    context.font = this.fontSize01*this.sealScale06 + 'px ' + this.fontFamily01
                    context.lineWidth = (0.6+this.fontWeight01*0.2)*this.sealScale06;
                    var cratioX = 64.5 / ccircle.radius; //横轴缩放比率
                    var cratioY = 53 / ccircle.radius; //纵轴缩放比率
                    //进行缩放（均匀压缩）
                    context.scale(cratioX, cratioY);
                    var cindex=0;
                    for(var cindex=0;cindex<this.input01.length;cindex++){
                        context.save()
                        context.beginPath()
                        //绘制点
                        context.translate(ccircle.x+Math.cos((Math.PI/180)*cstartAngle)*cradius-6.5*this.sealScale06 + this.fontLeft01,ccircle.y-Math.sin((Math.PI/180)*cstartAngle)*cradius+16*this.sealScale06 + this.fontTop01)
                        context.rotate((Math.PI/2)-(Math.PI/180)*cstartAngle)   //Math.PI/2为旋转90度  Math.PI/180*X为旋转多少度
                        context.fillText(this.input01.charAt(cindex),0,0)
                        context.strokeText(this.input01.charAt(cindex),0,0)
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